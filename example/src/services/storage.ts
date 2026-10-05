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
  CURRENT_WALLPAPER: 'CURRENT_WALLPAPER',
  CUSTOM_VOCABULARY: 'CUSTOM_VOCABULARY',
  NATURE_YOUTUBE_CONFIG: 'NATURE_YOUTUBE_CONFIG',
  HAS_INITIALIZED_APP_BLOCK_ALL: 'HAS_INITIALIZED_APP_BLOCK_ALL',
  FLASHCARD_ALBUM: 'FLASHCARD_ALBUM',
  FLASHCARD_UNOPENED_PACKS: 'FLASHCARD_UNOPENED_PACKS',
  FLASHCARD_SRS_DATA: 'FLASHCARD_SRS_DATA',
  FLASHCARD_HIGH_SCORES: 'FLASHCARD_HIGH_SCORES',
  RIDDLE_GAME_PROGRESS: 'RIDDLE_GAME_PROGRESS',
  SHADOW_DETECTIVE_PROGRESS: 'SHADOW_DETECTIVE_PROGRESS',
  DISABLED_INTERNAL_GAMES: 'DISABLED_INTERNAL_GAMES',
  APP_CATALOG_CONFIG: 'APP_CATALOG_CONFIG',
  IS_EMERGENCY_LOCKED: 'IS_EMERGENCY_LOCKED',
  EMERGENCY_LOCK_MESSAGE: 'EMERGENCY_LOCK_MESSAGE',
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

  getItem(key: string): string | null {
    return this.memoryStore.get(key) ?? null;
  }

  setItem(key: string, value: string | boolean | number): void {
    this.memoryStore.set(key, String(value));
  }

  removeItem(key: string): void {
    this.memoryStore.delete(key);
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
  storage.set(STORAGE_KEYS.IS_LICENSED, false);
}

if (!storage.getString(STORAGE_KEYS.PARENT_PIN)) {
  storage.set(STORAGE_KEYS.PARENT_PIN, '1234');
}

if (!storage.getString(STORAGE_KEYS.POLICY_MODE)) {
  storage.set(STORAGE_KEYS.POLICY_MODE, 'blacklist');
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
