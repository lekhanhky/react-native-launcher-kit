/**
 * Nature Explorer Service
 * Quản lý cấu hình video tài liệu YouTube cho các sinh vật trong game Khám Phá Rừng Xanh
 */
import { storage, STORAGE_KEYS } from './storage';

export interface NatureVideoConfigItem {
  id: string;
  nameVi: string;
  scientificName: string;
  sceneNameVi: string;
  sceneId: 'rainforest_floor' | 'rainforest_canopy';
  badgeIcon: string;
  imageSource: any;
  defaultYoutubeId: string;
  defaultYoutubeTitle: string;
  youtubeVideoId: string;
  youtubeVideoTitleVi: string;
  funFactVi?: string;
}

export const DEFAULT_NATURE_VIDEOS: NatureVideoConfigItem[] = [
  {
    id: 'chameleon',
    nameVi: 'Tắc Kè Hoa Ngụy Trang',
    scientificName: 'Chamaeleonidae',
    sceneNameVi: 'Cảnh 1: Thảm Rừng Ẩm Ướt',
    sceneId: 'rainforest_floor',
    badgeIcon: '🦎',
    imageSource: require('../assets/images/chameleon_3d.jpg'),
    defaultYoutubeId: 'ioblgpA5eTo',
    defaultYoutubeTitle: 'Khoảnh Khắc Tắc Kè Hoa Đổi Màu Da Kỳ Ảo',
    youtubeVideoId: 'ioblgpA5eTo',
    youtubeVideoTitleVi: 'Khoảnh Khắc Tắc Kè Hoa Đổi Màu Da Kỳ Ảo',
    funFactVi: 'Làn da của tắc kè hoa có các tế bào tinh thể phản chiếu ánh sáng đặc biệt. Bạn ấy đổi màu áo trùng với màu cành lá để hòa mình vào thiên nhiên, tránh kẻ thù săn mồi!',
  },
  {
    id: 'elephant',
    nameVi: 'Chú Voi Con Bên Suối',
    scientificName: 'Elephas maximus',
    sceneNameVi: 'Cảnh 1: Thảm Rừng Ẩm Ướt',
    sceneId: 'rainforest_floor',
    badgeIcon: '🐘',
    imageSource: require('../assets/images/baby_elephant_3d.jpg'),
    defaultYoutubeId: 'dGgtu1i5tmg',
    defaultYoutubeTitle: 'Chú Voi Con Tắm Suối & Phun Mưa Cầu Vồng',
    youtubeVideoId: 'dGgtu1i5tmg',
    youtubeVideoTitleVi: 'Chú Voi Con Tắm Suối & Phun Mưa Cầu Vồng',
    funFactVi: 'Vòi voi có tới hơn 40.000 bó cơ linh hoạt! Voi dùng vòi để hút nước suối tắm mát, ngửi mùi từ xa hàng cây số, và cầm nắm từng cọng cỏ non như bàn tay con người.',
  },
  {
    id: 'pitcher_plant',
    nameVi: 'Cây Nắp Ấm Bắt Mồi',
    scientificName: 'Nepenthes',
    sceneNameVi: 'Cảnh 1: Thảm Rừng Ẩm Ướt',
    sceneId: 'rainforest_floor',
    badgeIcon: '🪴',
    imageSource: require('../assets/images/pitcher_plant_3d.jpg'),
    defaultYoutubeId: 'womW1y-b_1E',
    defaultYoutubeTitle: 'Cận Cảnh Cây Nắp Ấm Bắt Côn Trùng Bằng Mật Ngọt',
    youtubeVideoId: 'womW1y-b_1E',
    youtubeVideoTitleVi: 'Cận Cảnh Cây Nắp Ấm Bắt Côn Trùng Bằng Mật Ngọt',
    funFactVi: 'Vì đất rừng nhiệt đới nghèo chất dinh dưỡng, cây nắp ấm đã biến đổi lá thành chiếc bình trơn trượt có nắp đậy và hương thơm mật ngọt để bẫy côn trùng bổ sung chất đạm!',
  },
  {
    id: 'sensitive_plant',
    nameVi: 'Cây Xấu Hổ (Trinh Nữ)',
    scientificName: 'Mimosa pudica',
    sceneNameVi: 'Cảnh 2: Tán Cây & Suối Rừng',
    sceneId: 'rainforest_canopy',
    badgeIcon: '🌸',
    imageSource: require('../assets/images/mimosa_plant_3d.jpg'),
    defaultYoutubeId: 'g0LFBM3hOLs',
    defaultYoutubeTitle: 'Cây Xấu Hổ (Hoa Trinh Nữ) E Thẹn Khép Lá Khi Chạm',
    youtubeVideoId: 'g0LFBM3hOLs',
    youtubeVideoTitleVi: 'Cây Xấu Hổ (Hoa Trinh Nữ) E Thẹn Khép Lá Khi Chạm',
    funFactVi: 'Khi bị chạm vào hoặc có gió mạnh, các tế bào ở cuống lá cây xấu hổ lập tức xẹp nước, khiến toàn bộ cành lá khép chặt rủ xuống như e thẹn để tự vệ khỏi động vật ăn cỏ!',
  },
  {
    id: 'butterfly',
    nameVi: 'Vòng Đời Của Bướm',
    scientificName: 'Morpho peleides',
    sceneNameVi: 'Cảnh 2: Tán Cây & Suối Rừng',
    sceneId: 'rainforest_canopy',
    badgeIcon: '🦋',
    imageSource: require('../assets/images/butterfly_3d.jpg'),
    defaultYoutubeId: 'ocWgSgMGxOc',
    defaultYoutubeTitle: 'Thước Phim Quay Chậm: Bướm Rừng Hóa Hình Từ Kén',
    youtubeVideoId: 'ocWgSgMGxOc',
    youtubeVideoTitleVi: 'Thước Phim Quay Chậm: Bướm Rừng Hóa Hình Từ Kén',
    funFactVi: 'Bướm trải qua 4 giai đoạn biến thái hoàn toàn: Trứng bé xíu ➔ Sâu ăn lá rào rạo ➔ Kén tằm ngủ say ➔ Bướm ngũ sắc bung cánh bay lượn trên nền trời rừng mưa!',
  },
];

export interface StoredNatureVideoConfig {
  [entityId: string]: {
    youtubeVideoId: string;
    youtubeVideoTitleVi: string;
  };
}

class NatureExplorerService {
  /**
   * Lấy danh sách cấu hình video của 5 loài sinh vật (ghép từ bộ nhớ lưu trữ với mặc định)
   */
  getNatureVideoConfigs(): NatureVideoConfigItem[] {
    try {
      const raw = storage.getString(STORAGE_KEYS.NATURE_YOUTUBE_CONFIG);
      if (!raw) {
        return DEFAULT_NATURE_VIDEOS.map((item) => ({ ...item }));
      }
      const parsed: StoredNatureVideoConfig = JSON.parse(raw);
      return DEFAULT_NATURE_VIDEOS.map((item) => {
        const custom = parsed[item.id];
        if (custom) {
          return {
            ...item,
            youtubeVideoId: custom.youtubeVideoId || item.defaultYoutubeId,
            youtubeVideoTitleVi:
              custom.youtubeVideoTitleVi || item.defaultYoutubeTitle,
          };
        }
        return { ...item };
      });
    } catch (e) {
      console.warn('[NatureExplorerService] Error parsing stored videos, fallback to defaults:', e);
      return DEFAULT_NATURE_VIDEOS.map((item) => ({ ...item }));
    }
  }

  /**
   * Lưu danh sách cấu hình video vào local storage
   */
  saveNatureVideoConfigs(items: NatureVideoConfigItem[]): void {
    const payload: StoredNatureVideoConfig = {};
    items.forEach((item) => {
      payload[item.id] = {
        youtubeVideoId: item.youtubeVideoId.trim(),
        youtubeVideoTitleVi: item.youtubeVideoTitleVi.trim(),
      };
    });
    storage.set(STORAGE_KEYS.NATURE_YOUTUBE_CONFIG, JSON.stringify(payload));
  }

  /**
   * Khôi phục toàn bộ 5 video về mặc định gốc
   */
  resetToDefault(): NatureVideoConfigItem[] {
    storage.removeItem(STORAGE_KEYS.NATURE_YOUTUBE_CONFIG);
    return DEFAULT_NATURE_VIDEOS.map((item) => ({ ...item }));
  }

  /**
   * Lấy cấu hình video cho 1 thực thể cụ thể
   */
  getVideoForEntity(entityId: string): { youtubeVideoId: string; youtubeVideoTitleVi: string } {
    const all = this.getNatureVideoConfigs();
    const match = all.find((item) => item.id === entityId);
    if (match) {
      return {
        youtubeVideoId: match.youtubeVideoId,
        youtubeVideoTitleVi: match.youtubeVideoTitleVi,
      };
    }
    const def = DEFAULT_NATURE_VIDEOS.find((item) => item.id === entityId);
    return {
      youtubeVideoId: def?.defaultYoutubeId || 'dQw4w9WgXcQ',
      youtubeVideoTitleVi: def?.defaultYoutubeTitle || 'Video Sinh Vật Rừng Xanh',
    };
  }
}

export const natureExplorerService = new NatureExplorerService();
