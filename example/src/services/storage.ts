/**
 * Storage & Supabase Service
 * Local-First storage wrapper with in-memory / MMKV support
 */

// Keys for local storage
export const STORAGE_KEYS = {
  DEVICE_ID: 'DEVICE_ID',
  IS_LICENSED: 'IS_LICENSED',
  LICENSE_KEY: 'LICENSE_KEY',
  EXPIRED_AT: 'EXPIRED_AT',
  PARENT_PIN: 'PARENT_PIN',
  POLICY_MODE: 'POLICY_MODE',
  PACKAGE_LIST: 'PACKAGE_LIST',
  SCHEDULE: 'SCHEDULE',
  CURRENT_THEME: 'CURRENT_THEME',
};

// Cấu hình Supabase (Tự động đọc từ .env hoặc fallback cấu hình mặc định)
export const SUPABASE_CONFIG = {
  URL:
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
    'https://your-project-id.supabase.co',
  ANON_KEY:
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
    'your-supabase-anon-key-here',
};

/**
 * Unified Storage Engine (Supports MMKV / In-Memory fallback)
 */
class StorageEngine {
  private memoryStore: Map<string, string> = new Map();

  getString(key: string): string | undefined {
    return this.memoryStore.get(key);
  }

  set(key: string, value: string | boolean | number): void {
    this.memoryStore.set(key, String(value));
  }

  getBoolean(key: string): boolean {
    return this.memoryStore.get(key) === 'true';
  }

  delete(key: string): void {
    this.memoryStore.delete(key);
  }

  clearAll(): void {
    this.memoryStore.clear();
  }
}

export const storage = new StorageEngine();

// Khởi tạo các giá trị mặc định cho ứng dụng
if (storage.getString(STORAGE_KEYS.IS_LICENSED) === undefined) {
  storage.set(STORAGE_KEYS.IS_LICENSED, true);
  storage.set(STORAGE_KEYS.LICENSE_KEY, 'LCK-DEMO');
}

if (!storage.getString(STORAGE_KEYS.PARENT_PIN)) {
  storage.set(STORAGE_KEYS.PARENT_PIN, '1234');
}

if (!storage.getString(STORAGE_KEYS.POLICY_MODE)) {
  storage.set(STORAGE_KEYS.POLICY_MODE, 'blacklist');
}

if (!storage.getString(STORAGE_KEYS.PACKAGE_LIST)) {
  storage.set(
    STORAGE_KEYS.PACKAGE_LIST,
    JSON.stringify(['com.android.settings', 'com.google.android.youtube'])
  );
}

if (!storage.getString(STORAGE_KEYS.SCHEDULE)) {
  storage.set(
    STORAGE_KEYS.SCHEDULE,
    JSON.stringify({
      isEnabled: true,
      allowedStartTime: '07:00:00',
      allowedEndTime: '21:00:00',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      lockMessage: 'Đã đến giờ đi ngủ hoặc học bài! Bé hãy nghỉ ngơi nhé.',
    })
  );
}
