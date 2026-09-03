import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    data: {
      daily_limit_minutes: 120,
      bedtime_enabled: true,
      bedtime_start: '21:00',
      bedtime_end: '06:30',
      is_locked_instant: false,
      blocked_packages: [
        'com.zhiliaoapp.musically',
        'com.facebook.katana',
        'com.android.chrome',
      ],
      allowed_categories: ['Education', 'Entertainment', 'Creative', 'Games'],
    },
  });
}
