import { NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { device_id, pairing_code, device_name, device_model } = body;

    const targetDeviceId = (device_id || (pairing_code ? `dev_${pairing_code}` : '')).trim();

    if (!targetDeviceId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin thiết bị (device_id hoặc pairing_code)' },
        { status: 400 }
      );
    }

    const resolvedDeviceName = device_name?.trim() || 'Máy tính bảng của Bé';
    const client = supabaseAdmin || supabase;
    const nowIso = new Date().toISOString();

    // 1. Ghi nhận / Upsert vào bảng devices
    const { error: deviceError } = await client.from('devices').upsert(
      {
        device_id: targetDeviceId,
        device_name: resolvedDeviceName,
        device_model: device_model || 'Android Tablet',
        is_paired: true,
        last_seen: nowIso,
      },
      { onConflict: 'device_id' }
    );

    if (deviceError) {
      console.warn('Lỗi upsert bảng devices:', deviceError);
    }

    // 2. Khởi tạo / Upsert vào bảng parental_policies
    const { error: policyError } = await client.from('parental_policies').upsert(
      {
        device_id: targetDeviceId,
        is_emergency_locked: false,
        parent_pin: '1234',
        updated_at: nowIso,
      },
      { onConflict: 'device_id' }
    );

    if (policyError) {
      console.warn('Lỗi upsert bảng parental_policies:', policyError);
    }

    // 3. Bắn sự kiện Broadcast Realtime vào kênh device_pairing:${targetDeviceId}
    try {
      const channel = client.channel(`device_pairing:${targetDeviceId}`);
      await new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, 2000);
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
          device_id: targetDeviceId,
          parent_name: 'Phụ huynh',
          license_key: 'ACT-QR-SUCCESS',
          timestamp: Date.now(),
        },
      });

      client.removeChannel(channel);
    } catch (broadcastErr) {
      console.warn('Realtime broadcast notification error:', broadcastErr);
    }

    // 4. Trả về JSON thành công
    return NextResponse.json({
      success: true,
      message: 'Ghép nối thiết bị thành công!',
      data: {
        device_id: targetDeviceId,
        device_name: resolvedDeviceName,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi xử lý ghép nối' },
      { status: 500 }
    );
  }
}
