/**
 * Kids Wallpaper System
 * Curated high-quality, child-friendly wallpapers with persistence
 */
import { storage, STORAGE_KEYS } from './storage';

export interface KidsWallpaper {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  imageUri: string; // If empty, defaults to solid theme color
  category: 'fantasy' | 'nature' | 'space' | 'cartoon' | 'default';
  overlayColor: string; // Subtle tint to ensure icon contrast
  overlayOpacity: number;
  previewThumbnail: string;
}

export const KIDS_WALLPAPERS: KidsWallpaper[] = [
  {
    id: 'default',
    name: 'Màu Trơn Theo Theme',
    subtitle: 'Nền trơn màu pastel thanh lịch & dễ thương',
    emoji: '🎨',
    imageUri: '',
    category: 'default',
    overlayColor: 'transparent',
    overlayOpacity: 0,
    previewThumbnail: '',
  },
  {
    id: 'candy_clouds',
    name: 'Cầu Vồng Kẹo Ngọt',
    subtitle: 'Mây hồng pastel bồng bềnh thần tiên',
    emoji: '🌈',
    imageUri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&q=80',
    category: 'fantasy',
    overlayColor: 'rgba(255, 255, 255, 0.22)',
    overlayOpacity: 0.22,
    previewThumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=240&q=70',
  },
  {
    id: 'cosmic_stars',
    name: 'Dải Ngân Hà Kỳ Thú',
    subtitle: 'Bầu trời sao lấp lánh và tinh vân tím',
    emoji: '🚀',
    imageUri: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1080&q=80',
    category: 'space',
    overlayColor: 'rgba(15, 23, 42, 0.25)',
    overlayOpacity: 0.25,
    previewThumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=240&q=70',
  },
  {
    id: 'enchanted_forest',
    name: 'Khu Rừng Cổ Tích',
    subtitle: 'Cây cối xanh mướt và ánh nắng ban mai',
    emoji: '🌿',
    imageUri: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1080&q=80',
    category: 'nature',
    overlayColor: 'rgba(255, 255, 255, 0.2)',
    overlayOpacity: 0.2,
    previewThumbnail: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=240&q=70',
  },
  {
    id: 'underwater_reef',
    name: 'Đại Dương Kỳ Thú',
    subtitle: 'Làn nước xanh biếc và thế giới san hô',
    emoji: '🌊',
    imageUri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1080&q=80',
    category: 'nature',
    overlayColor: 'rgba(255, 255, 255, 0.2)',
    overlayOpacity: 0.2,
    previewThumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=240&q=70',
  },
  {
    id: 'dreamy_sunset',
    name: 'Hoàng Hôn Kẹo Bông',
    subtitle: 'Bầu trời ráng chiều ấm áp & dịu dàng',
    emoji: '🌅',
    imageUri: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=1080&q=80',
    category: 'fantasy',
    overlayColor: 'rgba(255, 255, 255, 0.2)',
    overlayOpacity: 0.2,
    previewThumbnail: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=240&q=70',
  },
  {
    id: 'sunny_meadow',
    name: 'Đồi Cỏ Nắng Ấm',
    subtitle: 'Thảo nguyên xanh ngút ngàn của muông thú',
    emoji: '🌻',
    imageUri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1080&q=80',
    category: 'nature',
    overlayColor: 'rgba(255, 255, 255, 0.22)',
    overlayOpacity: 0.22,
    previewThumbnail: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=240&q=70',
  },
];

export const DEFAULT_WALLPAPER_ID = 'default';

export const wallpaperService = {
  getSavedWallpaper(): KidsWallpaper {
    try {
      const savedId = storage.getString(STORAGE_KEYS.CURRENT_WALLPAPER);
      if (savedId) {
        const found = KIDS_WALLPAPERS.find((w) => w.id === savedId);
        if (found) return found;
      }
    } catch (e) {
      console.warn('Error reading saved wallpaper:', e);
    }
    return KIDS_WALLPAPERS[0];
  },

  saveWallpaper(wallpaperId: string): KidsWallpaper {
    const selected = KIDS_WALLPAPERS.find((w) => w.id === wallpaperId) || KIDS_WALLPAPERS[0];
    try {
      storage.set(STORAGE_KEYS.CURRENT_WALLPAPER, selected.id);
    } catch (e) {
      console.warn('Error saving wallpaper:', e);
    }
    return selected;
  },

  getAllWallpapers(): KidsWallpaper[] {
    return KIDS_WALLPAPERS;
  },
};
