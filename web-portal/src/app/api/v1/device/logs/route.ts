import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { device_id, logs } = body;

    // Nhận mảng logs thời lượng sử dụng từ React Native Launcher
    console.log(`[API Logs] Received ${logs?.length || 0} usage records from device ${device_id}`);

    return NextResponse.json({
      success: true,
      message: 'Nhận nhật ký sử dụng thành công!',
      processed_count: logs?.length || 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
