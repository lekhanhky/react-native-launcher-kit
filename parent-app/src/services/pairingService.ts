import { supabase } from './supabase';
import { QrPairingPayload } from '../types';

export function parseQrCode(rawText: string): QrPairingPayload | null {
  if (!rawText || typeof rawText !== 'string') return null;
  const trimmed = rawText.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object') {
      const resolvedDeviceId = parsed.deviceId || parsed.device_id;
      const isActionValid =
        parsed.type === 'KIDS_LAUNCHER_PAIRING' ||
        parsed.action === 'KIDS_LAUNCHER_PAIR' ||
        Boolean(resolvedDeviceId);

      if (resolvedDeviceId && isActionValid) {
        return {
          type: 'KIDS_LAUNCHER_PAIRING',
          deviceId: String(resolvedDeviceId).trim(),
          deviceName: (parsed.deviceName || parsed.device_name)
            ? String(parsed.deviceName || parsed.device_name).trim()
            : 'Máy tính bảng của Bé',
          timestamp: parsed.timestamp || parsed.created_at || Date.now(),
        };
      }
    }
  } catch {
    // Không phải JSON, tiếp tục kiểm tra fallback chuỗi
  }

  // Fallback: nếu quét hoặc nhập trúng chuỗi plain deviceId / mã 6 số hợp lệ
  if (trimmed.length >= 4 && /^[a-zA-Z0-9_\-\.:]+$/.test(trimmed)) {
    return {
      type: 'KIDS_LAUNCHER_PAIRING',
      deviceId: trimmed,
      deviceName: 'Máy tính bảng của Bé',
      timestamp: Date.now(),
    };
  }

  return null;
}

export async function pairDevice(
  parentUserId: string,
  payload: QrPairingPayload,
  childName: string = 'Bé Yêu'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { deviceId, deviceName } = payload;
    const nowIso = new Date().toISOString();

    // 1. Upsert bảng devices
    await supabase.from('devices').upsert(
      {
        device_id: deviceId,
        device_name: deviceName || 'Máy tính bảng của Bé',
        is_paired: true,
        last_sync_at: nowIso,
      },
      { onConflict: 'device_id' }
    );

    // 2. Upsert bảng parental_policies
    await supabase.from('parental_policies').upsert(
      {
        device_id: deviceId,
        is_emergency_locked: false,
        parent_pin: '1234',
        updated_at: nowIso,
      },
      { onConflict: 'device_id' }
    );

    // 3. Ghi nhận liên kết vào parent_devices nếu có bảng (hoặc fallback lưu thông tin)
    try {
      await supabase.from('parent_devices').upsert(
        {
          parent_id: parentUserId,
          device_id: deviceId,
          child_name: childName,
          created_at: nowIso,
        },
        { onConflict: 'parent_id,device_id' }
      );
    } catch (e) {
      console.warn('[Pairing] Ghi parent_devices thất bại (nếu bảng chưa tạo):', e);
    }

    // 4. Phát Broadcast Realtime xác nhận tới tablet của bé
    const channel = supabase.channel(`device_pairing:${deviceId}`);
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, 1500);
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          clearTimeout(timer);
          resolve();
        }
      });
    });

    await channel.send({
      type: 'broadcast',
      event: 'DEVICE_PAIRED_SUCCESS',
      payload: {
        device_id: deviceId,
        parent_id: parentUserId,
        timestamp: Date.now(),
      },
    });

    supabase.removeChannel(channel);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi không xác định khi ghép nối thiết bị' };
  }
}
