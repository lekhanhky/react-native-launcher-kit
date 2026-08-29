/**
 * Supabase REST Client for React Native
 * Fast, lightweight and zero native dependency footprint
 */

export const SUPABASE_URL = 'https://jlfemayqttjcfjualfsv.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZmVtYXlxdHRqY2ZqdWFsZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3Mzc0NzEsImV4cCI6MjEwMzMxMzQ3MX0.rUNun-PUw_e0Mg1WBUvMmoEJbG8GkagIn8QRP4ZGsRk';

export interface SupabaseResponse<T = any> {
  data: T | null;
  error: { message: string; details?: string; status?: number } | null;
}

export const supabaseClient = {
  /**
   * Truy vấn bảng với bộ lọc REST
   */
  async from<T = any>(
    tableName: string,
    options: {
      select?: string;
      filter?: Record<string, string | number | boolean>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    } = {}
  ): Promise<SupabaseResponse<T[]>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const params = new URLSearchParams();
      params.append('select', options.select || '*');

      if (options.filter) {
        Object.entries(options.filter).forEach(([key, val]) => {
          params.append(key, `eq.${val}`);
        });
      }

      if (options.order) {
        params.append(
          'order',
          `${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}`
        );
      }

      if (options.limit) {
        params.append('limit', String(options.limit));
      }

      const url = `${SUPABASE_URL}/rest/v1/${tableName}?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          data: null,
          error: {
            message: `Lỗi tải dữ liệu Supabase (${response.status})`,
            details: errorText,
            status: response.status,
          },
        };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (e: any) {
      return {
        data: null,
        error: {
          message: e.name === 'AbortError' ? 'Hết thời gian chờ kết nối Supabase' : e.message,
          details: String(e),
        },
      };
    }
  },

  /**
   * Thêm hoặc cập nhật (Upsert) dữ liệu vào bảng
   */
  async upsert<T = any>(
    tableName: string,
    records: Record<string, any> | Record<string, any>[],
    options: { onConflict?: string } = {}
  ): Promise<SupabaseResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const params = new URLSearchParams();
      if (options.onConflict) {
        params.append('on_conflict', options.onConflict);
      }

      const url = `${SUPABASE_URL}/rest/v1/${tableName}${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify(records),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          data: null,
          error: {
            message: `Lỗi ghi dữ liệu Supabase (${response.status})`,
            details: errorText,
            status: response.status,
          },
        };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (e: any) {
      return {
        data: null,
        error: {
          message: e.name === 'AbortError' ? 'Hết thời gian chờ kết nối Supabase' : e.message,
          details: String(e),
        },
      };
    }
  },

  /**
   * Cập nhật bản ghi theo ID
   */
  async update<T = any>(
    tableName: string,
    idColumn: string,
    idValue: string,
    updates: Record<string, any>
  ): Promise<SupabaseResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const url = `${SUPABASE_URL}/rest/v1/${tableName}?${idColumn}=eq.${encodeURIComponent(
        idValue
      )}`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(updates),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          data: null,
          error: {
            message: `Lỗi cập nhật Supabase (${response.status})`,
            details: errorText,
            status: response.status,
          },
        };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (e: any) {
      return {
        data: null,
        error: {
          message: e.name === 'AbortError' ? 'Hết thời gian chờ kết nối Supabase' : e.message,
          details: String(e),
        },
      };
    }
  },

  /**
   * Xóa bản ghi theo ID
   */
  async delete(
    tableName: string,
    idColumn: string,
    idValue: string
  ): Promise<SupabaseResponse<boolean>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const url = `${SUPABASE_URL}/rest/v1/${tableName}?${idColumn}=eq.${encodeURIComponent(
        idValue
      )}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          data: null,
          error: {
            message: `Lỗi xóa bản ghi Supabase (${response.status})`,
            details: errorText,
            status: response.status,
          },
        };
      }

      return { data: true, error: null };
    } catch (e: any) {
      return {
        data: null,
        error: {
          message: e.name === 'AbortError' ? 'Hết thời gian chờ kết nối Supabase' : e.message,
          details: String(e),
        },
      };
    }
  },
};
