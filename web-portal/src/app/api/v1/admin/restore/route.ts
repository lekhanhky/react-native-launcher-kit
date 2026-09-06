import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Thứ tự nạp dữ liệu chuẩn để thỏa mãn Foreign Key Constraints
const RESTORE_ORDER = [
  // 1. Các bảng độc lập / bảng cha (Primary/Parent tables)
  'devices',
  'youtube_catalogs',
  'math_topics',
  'game_catalog',
  'kids_animals',
  'puzzle_scenes',
  'maze_scenes',
  'drawing_scenes',
  'memory_card_decks',
  'spelling_words',

  // 2. Các bảng phụ thuộc / bảng con (Dependent/Child tables)
  'parental_policies',
  'time_schedules',
  'device_youtube_settings',
  'youtube_videos',
  'math_questions',
];

// Thứ tự xóa sạch khi dùng chế độ Clean Restore (Xóa con trước rồi mới xóa cha)
const CLEAN_DELETE_ORDER = [...RESTORE_ORDER].reverse();

const BATCH_SIZE = 50;

async function chunkArray<T>(items: T[], size: number): Promise<T[][]> {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode = 'upsert', tables, selectedTables } = body;

    if (!tables || typeof tables !== 'object') {
      return NextResponse.json(
        { error: 'Dữ liệu khôi phục không hợp lệ: thiếu cấu trúc tables' },
        { status: 400 }
      );
    }

    const availableTableKeys = Object.keys(tables);
    const tablesToProcess = Array.isArray(selectedTables) && selectedTables.length > 0
      ? selectedTables.filter((t) => availableTableKeys.includes(t))
      : availableTableKeys;

    if (tablesToProcess.length === 0) {
      return NextResponse.json(
        { error: 'Không có bảng nào được chọn hoặc dữ liệu các bảng rỗng' },
        { status: 400 }
      );
    }

    const results: Record<string, { success: boolean; insertedCount: number; error?: string }> = {};

    // NẾU LÀ CHẾ ĐỘ CLEAN RESTORE: Xóa dữ liệu cũ theo thứ tự con -> cha trước
    if (mode === 'clean') {
      for (const table of CLEAN_DELETE_ORDER) {
        if (!tablesToProcess.includes(table)) continue;

        try {
          // Xóa tất cả các hàng trong bảng
          // Lưu ý: Trong Supabase/PostgREST cần một filter, ta dùng gte cho created_at hoặc neq cho id
          let deleteQuery = supabaseAdmin.from(table).delete();
          
          // Thử filter phổ thông
          const { error: delError } = await deleteQuery.neq('id', '00000000-0000-0000-0000-000000000000');
          if (delError) {
            console.warn(`[Clean Restore] Warning clearing ${table}:`, delError.message);
          }
        } catch (delErr: any) {
          console.warn(`[Clean Restore] Error clearing ${table}:`, delErr.message);
        }
      }
    }

    // TIẾN HÀNH RESTORE THEO THỨ TỰ CHA -> CON
    // Sắp xếp các bảng cần khôi phục theo RESTORE_ORDER
    const orderedTables = RESTORE_ORDER.filter((t) => tablesToProcess.includes(t));
    // Các bảng không nằm trong RESTORE_ORDER (nếu có) sẽ chạy sau
    for (const t of tablesToProcess) {
      if (!orderedTables.includes(t)) orderedTables.push(t);
    }

    for (const table of orderedTables) {
      const records = tables[table];
      if (!Array.isArray(records) || records.length === 0) {
        results[table] = { success: true, insertedCount: 0 };
        continue;
      }

      try {
        const batches = await chunkArray(records, BATCH_SIZE);
        let totalInserted = 0;
        let lastError: string | undefined;

        for (const batch of batches) {
          if (mode === 'clean') {
            const { error: insertErr } = await supabaseAdmin
              .from(table)
              .insert(batch);

            if (insertErr) {
              lastError = insertErr.message;
              console.error(`[Restore API] Insert error in ${table}:`, insertErr);
              break;
            } else {
              totalInserted += batch.length;
            }
          } else {
            // Chế độ Upsert
            const { error: upsertErr } = await supabaseAdmin
              .from(table)
              .upsert(batch);

            if (upsertErr) {
              lastError = upsertErr.message;
              console.error(`[Restore API] Upsert error in ${table}:`, upsertErr);
              break;
            } else {
              totalInserted += batch.length;
            }
          }
        }

        results[table] = {
          success: !lastError,
          insertedCount: totalInserted,
          error: lastError,
        };
      } catch (tableErr: any) {
        results[table] = {
          success: false,
          insertedCount: 0,
          error: tableErr.message,
        };
      }
    }

    const isAllSuccess = Object.values(results).every((r) => r.success);

    return NextResponse.json({
      success: isAllSuccess,
      message: isAllSuccess
        ? 'Khôi phục dữ liệu hoàn tất thành công!'
        : 'Khôi phục dữ liệu hoàn tất nhưng có một số bảng gặp cảnh báo/lỗi.',
      mode,
      results,
    });
  } catch (error: any) {
    console.error('[Restore API] Critical Error:', error);
    return NextResponse.json(
      { error: 'Lỗi nghiêm trọng trong quá trình khôi phục dữ liệu', details: error.message },
      { status: 500 }
    );
  }
}
