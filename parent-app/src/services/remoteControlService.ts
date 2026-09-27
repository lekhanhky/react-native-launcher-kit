import { supabase } from './supabase';
import { EmergencyLockPayload } from '../types';

export async function setEmergencyLock(
  deviceId: string,
  isLocked: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const nowIso = new Date().toISOString();

    // 1. Cập nhật cơ sở dữ liệu để duy trì trạng thái vĩnh viễn
    const { error: dbError } = await supabase
      .from('parental_policies')
      .update({
        is_emergency_locked: isLocked,
        updated_at: nowIso,
      })
      .eq('device_id', deviceId);

    if (dbError) {
      console.warn('[RemoteControl] Cảnh báo cập nhật DB:', dbError);
    }

    // 2. Bắn broadcast Realtime WebSocket với độ trễ < 1 giây
    const channel = supabase.channel(`parental_control:${deviceId}`);
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, 1200);
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          clearTimeout(timer);
          resolve();
        }
      });
    });

    const payload: EmergencyLockPayload = {
      type: 'EMERGENCY_LOCK',
      isLocked,
      reason: isLocked ? 'Phụ huynh kích hoạt khóa khẩn cấp' : 'Phụ huynh mở khóa thiết bị',
      timestamp: Date.now(),
    };

    await channel.send({
      type: 'broadcast',
      event: 'EMERGENCY_LOCK',
      payload,
    });

    supabase.removeChannel(channel);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi gửi lệnh khóa từ xa' };
  }
}
