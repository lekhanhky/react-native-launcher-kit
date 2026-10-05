/**
 * Parental Control Realtime Service
 * Kết nối Realtime WebSocket với Supabase để nhận lệnh khóa tức thì từ xa (< 1s)
 */
import { SUPABASE_URL, SUPABASE_ANON_KEY, supabaseClient } from './supabaseClient';
import { licenseService } from './licenseService';
import { storage, STORAGE_KEYS } from './storage';

export type LockListener = (isLocked: boolean, lockMessage?: string) => void;

class ParentalRealtimeService {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private listeners: Set<LockListener> = new Set();
  private currentDeviceId: string | null = null;
  private currentLockedState = storage.getBoolean(STORAGE_KEYS.IS_EMERGENCY_LOCKED) || false;
  private currentLockMessage =
    storage.getString(STORAGE_KEYS.EMERGENCY_LOCK_MESSAGE) ||
    'Ba mẹ đã tạm khóa thiết bị từ xa. Bé hãy nghỉ ngơi nhé!';
  private refCounter = 1;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      this.currentDeviceId = await licenseService.getDeviceUniqueId();
      // 1. Kiểm tra trạng thái ban đầu qua REST API
      await this.checkInitialPolicy();
      // 2. Mở kết nối Realtime WebSocket
      this.connectWebSocket();
    } catch (e) {
      console.warn('[RealtimeLock] Init error:', e);
    }
  }

  /**
   * Kiểm tra trạng thái khóa hiện tại qua REST
   */
  async checkInitialPolicy() {
    if (!this.currentDeviceId) return;

    try {
      const res = await supabaseClient.from('parental_policies', {
        filter: { device_id: this.currentDeviceId },
      });

      if (res.data && res.data.length > 0) {
        const policy = res.data[0];
        const locked = Boolean(policy.is_emergency_locked);
        const msg = policy.lock_message || this.currentLockMessage;
        this.updateLockState(locked, msg);
      } else if (!res.error && res.data && res.data.length === 0) {
        // Tự động tạo bản ghi ban đầu trên Supabase CHỈ KHI chắc chắn chưa có bản ghi
        await this.registerInitialDevice();
      }
    } catch (err) {
      console.warn('[RealtimeLock] Initial check error:', err);
    }
  }

  /**
   * Đăng ký thiết bị ban đầu trên cơ sở dữ liệu Supabase
   */
  private async registerInitialDevice() {
    if (!this.currentDeviceId) return;
    try {
      // Kiểm tra lại lần nữa để tuyệt đối không ghi đè nếu bản ghi đã tồn tại
      const checkRes = await supabaseClient.from('parental_policies', {
        filter: { device_id: this.currentDeviceId },
      });
      if (checkRes.data && checkRes.data.length > 0) {
        const policy = checkRes.data[0];
        this.updateLockState(Boolean(policy.is_emergency_locked), policy.lock_message);
        return;
      }

      await supabaseClient.upsert(
        'parental_policies',
        {
          device_id: this.currentDeviceId,
          is_emergency_locked: this.currentLockedState,
          lock_message: this.currentLockMessage,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'device_id' }
      );

      await supabaseClient.upsert(
        'devices',
        {
          device_id: this.currentDeviceId,
          device_name: 'Máy tính bảng của Bé',
          device_model: 'Android Tablet',
          license_status: 'active',
          last_sync_at: new Date().toISOString(),
        },
        { onConflict: 'device_id' }
      );
    } catch (e) {
      console.warn('[RealtimeLock] Register initial device error:', e);
    }
  }

  /**
   * Kết nối WebSocket vào Supabase Realtime
   */
  private connectWebSocket() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }

    const wsUrl = `${SUPABASE_URL.replace(/^http/, 'ws')}/realtime/v1/websocket?apikey=${SUPABASE_ANON_KEY}&vsn=1.0.0`;

    try {
      console.log('[RealtimeLock] Đang kết nối Supabase Realtime...');
      const socket = new WebSocket(wsUrl);
      this.ws = socket;

      socket.onopen = () => {
        console.log('[RealtimeLock] WebSocket đã kết nối thành công!');
        this.isConnected = true;
        this.startHeartbeat();
        this.joinParentalPoliciesChannel();
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleSocketMessage(data);
        } catch (err) {
          console.warn('[RealtimeLock] Parse message error:', err);
        }
      };

      socket.onerror = (error) => {
        console.warn('[RealtimeLock] WebSocket error:', error);
      };

      socket.onclose = () => {
        console.log('[RealtimeLock] WebSocket đóng kết nối, chuẩn bị kết nối lại...');
        this.isConnected = false;
        this.stopHeartbeat();
        this.scheduleReconnect();
      };
    } catch (e) {
      console.warn('[RealtimeLock] Không thể tạo WebSocket:', e);
      this.scheduleReconnect();
    }
  }

  /**
   * Tham gia kênh lắng nghe thay đổi của bảng parental_policies
   */
  private joinParentalPoliciesChannel() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const ref = (this.refCounter++).toString();
    const joinMsg = {
      topic: 'realtime:public:parental_policies',
      event: 'phx_join',
      payload: {
        config: {
          broadcast: { self: true },
          presence: { key: '' },
          postgres_changes: [
            {
              event: '*',
              schema: 'public',
              table: 'parental_policies',
            },
          ],
        },
      },
      ref,
    };

    this.ws.send(JSON.stringify(joinMsg));
  }

  /**
   * Xử lý gói tin nhận từ Supabase
   */
  private handleSocketMessage(data: any) {
    if (!data) return;

    // Phản hồi Postgres Changes khi có UPDATE trên bảng parental_policies
    if (data.event === 'postgres_changes' && data.payload) {
      const record = data.payload.data?.record || data.payload.record;
      if (record && record.device_id === this.currentDeviceId) {
        console.log('[RealtimeLock] Nhận tín hiệu Realtime từ phụ huynh:', record);
        const locked = Boolean(record.is_emergency_locked);
        const message = record.lock_message || 'Ba mẹ đã tạm khóa thiết bị từ xa. Bé hãy nghỉ ngơi nhé!';
        this.updateLockState(locked, message);
      }
    }
  }

  /**
   * Gửi heartbeat để giữ kết nối WebSocket không bị ngắt
   */
  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const ref = (this.refCounter++).toString();
        this.ws.send(
          JSON.stringify({
            topic: 'phoenix',
            event: 'heartbeat',
            payload: {},
            ref,
          })
        );
      }
    }, 25000);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connectWebSocket();
    }, 5000);
  }

  private updateLockState(isLocked: boolean, message?: string) {
    this.currentLockedState = isLocked;
    storage.set(STORAGE_KEYS.IS_EMERGENCY_LOCKED, isLocked);
    if (message !== undefined) {
      this.currentLockMessage = message;
      storage.set(STORAGE_KEYS.EMERGENCY_LOCK_MESSAGE, message);
    }
    this.listeners.forEach((listener) => {
      try {
        listener(isLocked, this.currentLockMessage);
      } catch (e) {
        console.warn('[RealtimeLock] Listener callback error:', e);
      }
    });
  }

  /**
   * Đăng ký nhận thông báo thay đổi trạng thái khóa Realtime
   */
  subscribeToRemoteLock(listener: LockListener): () => void {
    this.listeners.add(listener);
    // Gửi ngay trạng thái hiện tại
    listener(this.isEmergencyLocked(), this.getLockMessage());

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Giả lập hoặc kích hoạt lệnh khóa từ xa (dùng cho test hoặc gọi từ App Phụ Huynh)
   */
  async setRemoteLock(deviceId: string, isLocked: boolean, message?: string): Promise<boolean> {
    const lockMsg = message !== undefined ? message : 'Ba mẹ đã tạm khóa thiết bị từ xa. Bé hãy nghỉ ngơi nhé!';
    try {
      // 1. Cập nhật lên Supabase
      await supabaseClient.upsert(
        'parental_policies',
        {
          device_id: deviceId,
          is_emergency_locked: isLocked,
          lock_message: lockMsg,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'device_id',
        }
      );

      // Nếu đang test trên chính thiết bị này thì kích hoạt luôn
      if (deviceId === this.currentDeviceId) {
        this.updateLockState(isLocked, lockMsg);
      }
      return true;
    } catch (e) {
      console.warn('[RealtimeLock] setRemoteLock error:', e);
      return false;
    }
  }

  /**
   * Mở khóa trên thiết bị cục bộ (khi phụ huynh nhập mã PIN thành công trên máy bé)
   * và đồng bộ trạng thái mở khóa ngược lại Supabase Realtime cho Cổng Phụ Huynh.
   */
  async unlockLocally(): Promise<boolean> {
    this.updateLockState(false);
    if (this.currentDeviceId) {
      return this.setRemoteLock(this.currentDeviceId, false, '');
    }
    return true;
  }

  getDeviceId(): string | null {
    return this.currentDeviceId;
  }

  isEmergencyLocked(): boolean {
    return this.currentLockedState || storage.getBoolean(STORAGE_KEYS.IS_EMERGENCY_LOCKED);
  }

  getLockMessage(): string {
    return (
      this.currentLockMessage ||
      storage.getString(STORAGE_KEYS.EMERGENCY_LOCK_MESSAGE) ||
      'Ba mẹ đã tạm khóa thiết bị từ xa. Bé hãy nghỉ ngơi nhé!'
    );
  }
}

export const parentalRealtimeService = new ParentalRealtimeService();
