import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Danh sách tất cả các bảng dữ liệu được hỗ trợ sao lưu
const SUPPORTED_TABLES = [
  // 1. Phân hệ Game & Học tập
  'math_topics',
  'math_questions',
  'puzzle_scenes',
  'maze_scenes',
  'drawing_scenes',
  'memory_card_decks',
  'spelling_words',
  'game_catalog',
  'kids_animals',

  // 2. Phân hệ YouTube Kids
  'youtube_catalogs',
  'youtube_videos',

  // 3. Phân hệ Thiết bị & Phụ huynh
  'devices',
  'parental_policies',
  'time_schedules',
  'device_youtube_settings',
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tablesParam = searchParams.get('tables');
    const download = searchParams.get('download') === 'true';

    let requestedTables = SUPPORTED_TABLES;
    if (tablesParam) {
      const parsed = tablesParam.split(',').map((t) => t.trim()).filter(Boolean);
      if (parsed.length > 0) {
        requestedTables = parsed;
      }
    }

    const backupData: Record<string, any[]> = {};
    const tableCounts: Record<string, number> = {};
    let totalRecords = 0;

    for (const table of requestedTables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*');

        if (error) {
          console.warn(`[Backup API] Warning reading table ${table}:`, error.message);
          backupData[table] = [];
          tableCounts[table] = 0;
        } else {
          backupData[table] = data || [];
          tableCounts[table] = (data || []).length;
          totalRecords += (data || []).length;
        }
      } catch (err: any) {
        console.warn(`[Backup API] Error table ${table}:`, err.message);
        backupData[table] = [];
        tableCounts[table] = 0;
      }
    }

    const timestamp = new Date().toISOString();
    const payload = {
      system: 'KidsLauncher Cloud Portal',
      version: '1.0.0',
      exportedAt: timestamp,
      totalTables: Object.keys(backupData).length,
      totalRecords,
      tableCounts,
      tables: backupData,
    };

    if (download) {
      const fileName = `kidslauncher-backup-${new Date().toISOString().slice(0, 10)}.json`;
      return new NextResponse(JSON.stringify(payload, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error: any) {
    console.error('[Backup API] Error:', error);
    return NextResponse.json(
      { error: 'Lỗi trong quá trình tạo bản sao lưu', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const requestedTables = Array.isArray(body.tables) && body.tables.length > 0
      ? body.tables
      : SUPPORTED_TABLES;

    const backupData: Record<string, any[]> = {};
    const tableCounts: Record<string, number> = {};
    let totalRecords = 0;

    for (const table of requestedTables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*');

        if (error) {
          backupData[table] = [];
          tableCounts[table] = 0;
        } else {
          backupData[table] = data || [];
          tableCounts[table] = (data || []).length;
          totalRecords += (data || []).length;
        }
      } catch (err: any) {
        backupData[table] = [];
        tableCounts[table] = 0;
      }
    }

    const timestamp = new Date().toISOString();
    return NextResponse.json({
      system: 'KidsLauncher Cloud Portal',
      version: '1.0.0',
      exportedAt: timestamp,
      totalTables: Object.keys(backupData).length,
      totalRecords,
      tableCounts,
      tables: backupData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Lỗi sao lưu', details: error.message },
      { status: 500 }
    );
  }
}
