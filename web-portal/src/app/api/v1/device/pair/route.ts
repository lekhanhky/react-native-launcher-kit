import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pairing_code, device_name, device_model, fcm_token } = body;

    if (!pairing_code) {
      return NextResponse.json(
        { success: false, error: 'Thiếu mã ghép nối (pairing_code)' },
        { status: 400 }
      );
    }

    // Giả lập xác thực mã thành công và trả về access token
    return NextResponse.json({
      success: true,
      message: 'Ghép nối thiết bị thành công!',
      data: {
        device_id: 'dev_' + Date.now(),
        child_name: 'Bé Gia Bảo',
        child_age: 6,
        daily_limit_minutes: 120,
        bedtime_start: '21:00',
        bedtime_end: '06:30',
        is_locked_instant: false,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
