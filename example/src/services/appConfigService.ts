/**
 * App Configuration & Enable/Disable Service
 * Quản lý trạng thái Bật / Tắt (Enable / Disable) của cả Game nội bộ và App cài đặt ngoài trên /home
 * Hỗ trợ lưu trữ Offline-First (MMKV/Storage) và đồng bộ trực tuyến với Supabase app_catalog.
 */
import { storage, STORAGE_KEYS } from './storage';
import { supabaseClient } from './supabaseClient';
import { INTERNAL_GAMES_REGISTRY, LauncherGameItem } from '../data/launcherGamesRegistry';

export type AppConfigListener = () => void;

class AppConfigService {
  private listeners: Set<AppConfigListener> = new Set();
  private isSyncing = false;

  constructor() {
    this.init();
  }

  private init() {
    // Tự động đồng bộ Supabase khi khởi tạo service
    this.syncWithSupabase().catch((err) => {
      console.warn('[AppConfigService] Init sync warning:', err);
    });
  }

  /**
   * Lấy danh sách ID các game nội bộ đang bị TẠM KHÓA (disabled)
   */
  getDisabledInternalGameIds(): string[] {
    try {
      const raw = storage.getString(STORAGE_KEYS.DISABLED_INTERNAL_GAMES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[AppConfigService] Error reading disabled internal games:', e);
    }
    return [];
  }

  /**
   * Kiểm tra xem một game nội bộ có đang được phép hiển thị trên /home không
   */
  isInternalGameEnabled(gameId: string): boolean {
    const disabledList = this.getDisabledInternalGameIds();
    return !disabledList.includes(gameId);
  }

  /**
   * Bật hoặc Tắt một game nội bộ
   */
  async setInternalGameEnabled(gameId: string, enabled: boolean): Promise<void> {
    try {
      const currentDisabled = this.getDisabledInternalGameIds();
      let updatedDisabled: string[];

      if (enabled) {
        updatedDisabled = currentDisabled.filter((id) => id !== gameId);
      } else {
        if (!currentDisabled.includes(gameId)) {
          updatedDisabled = [...currentDisabled, gameId];
        } else {
          updatedDisabled = currentDisabled;
        }
      }

      storage.set(STORAGE_KEYS.DISABLED_INTERNAL_GAMES, JSON.stringify(updatedDisabled));
      this.notifyListeners();

      // Đồng bộ ngầm lên Supabase app_catalog nếu có mạng
      try {
        await supabaseClient.update('app_catalog', 'package_name', gameId, {
          is_enabled: enabled,
        });
      } catch (cloudErr) {
        console.log('[AppConfigService] Supabase update notice:', cloudErr);
      }
    } catch (err) {
      console.warn('[AppConfigService] setInternalGameEnabled error:', err);
    }
  }

  /**
   * Đảo trạng thái Bật / Tắt của game nội bộ
   */
  async toggleInternalGame(gameId: string): Promise<boolean> {
    const currentlyEnabled = this.isInternalGameEnabled(gameId);
    const nextState = !currentlyEnabled;
    await this.setInternalGameEnabled(gameId, nextState);
    return nextState;
  }

  /**
   * Lấy danh sách Package Name của ứng dụng ngoài đang bị khóa (từ STORAGE_KEYS.PACKAGE_LIST)
   */
  getDisabledExternalPackages(): string[] {
    try {
      const raw = storage.getString(STORAGE_KEYS.PACKAGE_LIST);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[AppConfigService] Error reading disabled external packages:', e);
    }
    return [];
  }

  /**
   * Bật hoặc Tắt ứng dụng bên ngoài
   */
  async setExternalAppEnabled(packageName: string, enabled: boolean): Promise<void> {
    try {
      const currentBlocked = this.getDisabledExternalPackages();
      let updatedBlocked: string[];

      if (enabled) {
        updatedBlocked = currentBlocked.filter((pkg) => pkg !== packageName);
      } else {
        if (!currentBlocked.includes(packageName)) {
          updatedBlocked = [...currentBlocked, packageName];
        } else {
          updatedBlocked = currentBlocked;
        }
      }

      storage.set(STORAGE_KEYS.PACKAGE_LIST, JSON.stringify(updatedBlocked));
      this.notifyListeners();

      // Đồng bộ ngầm lên Supabase app_catalog nếu có mạng
      try {
        await supabaseClient.update('app_catalog', 'package_name', packageName, {
          is_enabled: enabled,
        });
      } catch (cloudErr) {
        console.log('[AppConfigService] Supabase update notice:', cloudErr);
      }
    } catch (err) {
      console.warn('[AppConfigService] setExternalAppEnabled error:', err);
    }
  }

  /**
   * Kiểm tra tổng quát xem một item (nội bộ hoặc ứng dụng ngoài) có đang được BẬT không
   */
  isItemEnabled(idOrPackage: string): boolean {
    if (idOrPackage.startsWith('internal.')) {
      return this.isInternalGameEnabled(idOrPackage);
    }
    const blockedList = this.getDisabledExternalPackages();
    return !blockedList.includes(idOrPackage);
  }

  /**
   * Lấy toàn bộ danh sách Game nội bộ đã đăng ký
   */
  getAllInternalGames(): LauncherGameItem[] {
    return INTERNAL_GAMES_REGISTRY;
  }

  /**
   * Đồng bộ cấu hình app_catalog từ Supabase về thiết bị
   */
  async syncWithSupabase(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const res = await supabaseClient.from<{
        id: string;
        package_name: string;
        app_name: string;
        is_enabled: boolean;
      }>('app_catalog');

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const disabledInternal: string[] = [];
        const disabledExternal: string[] = [...this.getDisabledExternalPackages()];

        res.data.forEach((item) => {
          if (item.package_name) {
            const isEnabled = Boolean(item.is_enabled);
            if (item.package_name.startsWith('internal.')) {
              if (!isEnabled) {
                disabledInternal.push(item.package_name);
              }
            } else {
              // Ứng dụng ngoài: trong PACKAGE_LIST, phần tử xuất hiện nghĩa là BỊ KHÓA
              if (!isEnabled && !disabledExternal.includes(item.package_name)) {
                disabledExternal.push(item.package_name);
              } else if (isEnabled && disabledExternal.includes(item.package_name)) {
                const idx = disabledExternal.indexOf(item.package_name);
                if (idx > -1) disabledExternal.splice(idx, 1);
              }
            }
          }
        });

        storage.set(STORAGE_KEYS.DISABLED_INTERNAL_GAMES, JSON.stringify(disabledInternal));
        storage.set(STORAGE_KEYS.PACKAGE_LIST, JSON.stringify(disabledExternal));
        this.notifyListeners();
        console.log('[AppConfigService] Đã đồng bộ cấu hình app_catalog từ Supabase');
      }
    } catch (e) {
      console.warn('[AppConfigService] Supabase sync failed (offline fallback active):', e);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Đăng ký lắng nghe thay đổi cấu hình app
   */
  subscribe(listener: AppConfigListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.warn('[AppConfigService] Listener notification error:', err);
      }
    });
  }
}

export const appConfigService = new AppConfigService();
