/**
 * Safe Kids YouTube Service
 * Channel & Playlist whitelist management, Supabase cloud sync, online search, discovery catalog, custom channels & videos, and watch time limits
 */
import { storage } from './storage';
import { supabaseClient } from './supabaseClient';

export type YouTubeItemType = 'channel' | 'playlist';

export interface YouTubeChannel {
  id: string;
  name: string;
  avatar: string;
  emoji: string;
  color: string;
  category: string;
  description: string;
  subscribers: string;
  videoCount?: string;
  type?: YouTubeItemType;
  isAllowed?: boolean;
  isFeatured?: boolean;
  isCustom?: boolean;
  isOnline?: boolean;
  sampleVideoId?: string;
  videos?: YouTubeVideo[];
}

export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  channelId: string;
  channelName: string;
  channelAvatar: string;
  channelEmoji?: string;
  channelColor?: string;
  category: 'music' | 'english' | 'cartoon' | 'story';
  duration: string;
  thumbnail: string;
  views: string;
  publishedAt: string;
  isCustom?: boolean;
}

export const YOUTUBE_CATEGORIES = [
  { id: 'all', name: 'Tất cả', emoji: '🌟' },
  { id: 'music', name: 'Ca nhạc', emoji: '🎵' },
  { id: 'english', name: 'Tiếng Anh & Số', emoji: '📚' },
  { id: 'cartoon', name: 'Hoạt hình', emoji: '🎬' },
  { id: 'story', name: 'Cổ tích & Kể chuyện', emoji: '📖' },
];

export const PRESET_CHANNELS: YouTubeChannel[] = [
  {
    id: 'giai_dieu_chill',
    name: 'Giai Điệu Chill',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150',
    emoji: '🎧',
    color: '#1E1B4B',
    category: 'music',
    description: 'Giai điệu âm nhạc thư giãn, lofi chill nhẹ nhàng',
    subscribers: '1.2M người đăng ký',
    videoCount: '450 video',
  },
  {
    id: 'game_thu_vn',
    name: 'Game Thủ VN',
    avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150',
    emoji: '🎮',
    color: '#312E81',
    category: 'cartoon',
    description: 'Trò chơi giải trí vui nhộn và thử thách trí tuệ',
    subscribers: '850K người đăng ký',
    videoCount: '1.2K video',
  },
  {
    id: 'tech_review_vn',
    name: 'Tech Review VN',
    avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150',
    emoji: '📱',
    color: '#0F172A',
    category: 'english',
    description: 'Khám phá công nghệ số và khoa học tương lai',
    subscribers: '2.1M người đăng ký',
    videoCount: '800 video',
  },
  {
    id: 'goc_nho_cua_nhi',
    name: 'Góc Nhỏ Của Nhi',
    avatar: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=150',
    emoji: '☕',
    color: '#F59E0B',
    category: 'story',
    description: 'Kể chuyện đời sống, vlog ấm áp và bài học tích cực',
    subscribers: '340K người đăng ký',
    videoCount: '150 video',
  },
  {
    id: 'super_simple_songs',
    name: 'Super Simple Songs',
    avatar: 'https://img.youtube.com/vi/71_hD4v25xo/hqdefault.jpg',
    emoji: '🎶',
    color: '#0284C7',
    category: 'music',
    description: 'Ca nhạc tiếng Anh phát âm chuẩn bản xứ',
    subscribers: '42.5M người đăng ký',
    videoCount: '620 video',
  },
  {
    id: 'cocomelon',
    name: 'Cocomelon Tiếng Anh',
    avatar: 'https://img.youtube.com/vi/yCjJyiqpAuU/hqdefault.jpg',
    emoji: '🍉',
    color: '#16A34A',
    category: 'music',
    description: 'Bài hát 3D vui nhộn cho trẻ mầm non',
    subscribers: '175M người đăng ký',
    videoCount: '1.1K video',
  },
  {
    id: 'numberblocks',
    name: 'Numberblocks Official',
    avatar: 'https://img.youtube.com/vi/pZw9veQ76fo/hqdefault.jpg',
    emoji: '🔢',
    color: '#EA580C',
    category: 'english',
    description: 'Học toán, đếm số và logic thông minh',
    subscribers: '7.8M người đăng ký',
    videoCount: '340 video',
  },
  {
    id: 'babybus_vn',
    name: 'BabyBus Tiếng Việt',
    avatar: 'https://img.youtube.com/vi/5Bw4_zV25pM/hqdefault.jpg',
    emoji: '🐼',
    color: '#E11D48',
    category: 'cartoon',
    description: 'Kỹ năng sống và cứu hộ an toàn cho bé',
    subscribers: '11.2M người đăng ký',
    videoCount: '950 video',
  },
  {
    id: 'wolfoo_vn',
    name: 'Wolfoo Tiếng Việt',
    avatar: 'https://img.youtube.com/vi/Y5yL4xPqYyo/hqdefault.jpg',
    emoji: '🐺',
    color: '#7C3AED',
    category: 'cartoon',
    description: 'Thói quen tốt và câu chuyện gia đình Wolfoo',
    subscribers: '8.4M người đăng ký',
    videoCount: '820 video',
  },
  {
    id: 'fairy_tales_vn',
    name: 'Cổ Tích Việt Nam',
    avatar: 'https://img.youtube.com/vi/2Z1tU5B1V58/hqdefault.jpg',
    emoji: '🐉',
    color: '#D97706',
    category: 'story',
    description: 'Truyện cổ tích nuôi dưỡng tâm hồn trẻ thơ',
    subscribers: '3.1M người đăng ký',
    videoCount: '290 video',
  },
];

// Kho Kênh Khám Phá Phong Phú
export const DISCOVERY_CHANNELS_CATALOG: YouTubeChannel[] = [
  {
    id: 'peppa_pig_vn',
    name: 'Peppa Pig Tiếng Việt',
    avatar: 'https://img.youtube.com/vi/_9WwF750eT4/hqdefault.jpg',
    emoji: '🐷',
    color: '#EC4899',
    category: 'cartoon',
    description: 'Cuộc phiêu lưu đáng yêu của cô heo Peppa',
    subscribers: '6.5M người đăng ký',
    videoCount: '510 video',
    sampleVideoId: '_9WwF750eT4',
  },
  {
    id: 'vtv7_kids',
    name: 'VTV7 Kids - Bé Học Vui',
    avatar: 'https://img.youtube.com/vi/e-ORhEE9VVg/hqdefault.jpg',
    emoji: '📺',
    color: '#0284C7',
    category: 'english',
    description: 'Chương trình truyền hình giáo dục thiếu nhi VTV7',
    subscribers: '2.4M người đăng ký',
    videoCount: '430 video',
    sampleVideoId: 'e-ORhEE9VVg',
  },
  {
    id: 'paw_patrol_vn',
    name: 'PAW Patrol Cứu Hộ',
    avatar: 'https://img.youtube.com/vi/H6F-tZp6a3c/hqdefault.jpg',
    emoji: '🐶',
    color: '#E11D48',
    category: 'cartoon',
    description: 'Biệt đội những chú chó cứu hộ dũng cảm',
    subscribers: '9.8M người đăng ký',
    videoCount: '760 video',
    sampleVideoId: 'H6F-tZp6a3c',
  },
  {
    id: 'blippi_official',
    name: 'Blippi Khám Phá Thế Giới',
    avatar: 'https://img.youtube.com/vi/Wv-9rM9hHjg/hqdefault.jpg',
    emoji: '🚀',
    color: '#F59E0B',
    category: 'english',
    description: 'Khám phá thế giới thực tế và khoa học cho trẻ em',
    subscribers: '21.5M người đăng ký',
    videoCount: '980 video',
    sampleVideoId: 'Wv-9rM9hHjg',
  },
  {
    id: 'pinkfong_shark',
    name: 'Pinkfong Baby Shark',
    avatar: 'https://img.youtube.com/vi/XqZsoesa55w/hqdefault.jpg',
    emoji: '🎈',
    color: '#06B6D4',
    category: 'music',
    description: 'Bài hát Baby Shark và các điệu nhảy sôi động',
    subscribers: '75M người đăng ký',
    videoCount: '1.4K video',
    sampleVideoId: 'XqZsoesa55w',
  },
  {
    id: 'art_for_kids',
    name: 'Art for Kids Hub - Học Vẽ',
    avatar: 'https://img.youtube.com/vi/1k8yWn0jPzo/hqdefault.jpg',
    emoji: '🎨',
    color: '#8B5CF6',
    category: 'english',
    description: 'Hướng dẫn bé vẽ tranh sáng tạo từng bước đơn giản',
    subscribers: '8.1M người đăng ký',
    videoCount: '1.5K video',
    sampleVideoId: '1k8yWn0jPzo',
  },
  {
    id: 'masha_and_bear',
    name: 'Masha and The Bear',
    avatar: 'https://img.youtube.com/vi/KYniUCGPGLs/hqdefault.jpg',
    emoji: '🐻',
    color: '#F43F5E',
    category: 'cartoon',
    description: 'Cô bé Masha tinh nghịch và Chú Gấu hiền lành',
    subscribers: '45.2M người đăng ký',
    videoCount: '890 video',
    sampleVideoId: 'KYniUCGPGLs',
  },
  {
    id: 'chuchu_tv',
    name: 'ChuChu TV Nursery Rhymes',
    avatar: 'https://img.youtube.com/vi/2v8q4_XhM2I/hqdefault.jpg',
    emoji: '🌈',
    color: '#14B8A6',
    category: 'music',
    description: 'Tuyển tập đồng dao hoạt hình vui nhộn bổ ích',
    subscribers: '68M người đăng ký',
    videoCount: '1.2K video',
    sampleVideoId: '2v8q4_XhM2I',
  },
  {
    id: 'qua_tang_tam_hon',
    name: 'Quà Tặng Tâm Hồn Thiếu Nhi',
    avatar: 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg',
    emoji: '🎪',
    color: '#10B981',
    category: 'story',
    description: 'Những câu chuyện cảm động và bài học làm người tốt',
    subscribers: '1.8M người đăng ký',
    videoCount: '320 video',
    sampleVideoId: '9bZkp7q19f0',
  },
  {
    id: 'be_hoc_dong_vat',
    name: 'Bé Học Động Vật & Thiên Nhiên',
    avatar: 'https://img.youtube.com/vi/hq3yfQnllfQ/hqdefault.jpg',
    emoji: '🦁',
    color: '#D97706',
    category: 'english',
    description: 'Khám phá thế giới hoang dã và các loài động vật',
    subscribers: '3.6M người đăng ký',
    videoCount: '280 video',
    sampleVideoId: 'hq3yfQnllfQ',
  },
];

export const DEFAULT_CURATED_VIDEOS: YouTubeVideo[] = [
  {
    id: 'yt_1',
    videoId: '71_hD4v25xo',
    title: 'Twinkle Twinkle Little Star - Bài hát ru bé ngủ ngon hay nhất',
    channelId: 'super_simple_songs',
    channelName: 'Super Simple Songs',
    channelAvatar: 'https://img.youtube.com/vi/71_hD4v25xo/hqdefault.jpg',
    channelEmoji: '🎶',
    channelColor: '#0284C7',
    category: 'music',
    duration: '03:12',
    thumbnail: 'https://img.youtube.com/vi/71_hD4v25xo/hqdefault.jpg',
    views: '2.1 Tr lượt xem',
    publishedAt: '3 ngày trước',
  },
  {
    id: 'yt_2',
    videoId: 'yCjJyiqpAuU',
    title: 'The Wheels on the Bus Go Round and Round - Xe buýt trường học',
    channelId: 'cocomelon',
    channelName: 'Cocomelon Tiếng Anh',
    channelAvatar: 'https://img.youtube.com/vi/yCjJyiqpAuU/hqdefault.jpg',
    channelEmoji: '🍉',
    channelColor: '#16A34A',
    category: 'music',
    duration: '03:30',
    thumbnail: 'https://img.youtube.com/vi/yCjJyiqpAuU/hqdefault.jpg',
    views: '5.8 Tr lượt xem',
    publishedAt: '1 tuần trước',
  },
  {
    id: 'yt_3',
    videoId: 'hq3yfQnllfQ',
    title: 'ABC Song - Bài hát bảng chữ cái tiếng Anh phát âm chuẩn bản xứ',
    channelId: 'super_simple_songs',
    channelName: 'Super Simple Songs',
    channelAvatar: 'https://img.youtube.com/vi/71_hD4v25xo/hqdefault.jpg',
    channelEmoji: '🎶',
    channelColor: '#0284C7',
    category: 'english',
    duration: '04:05',
    thumbnail: 'https://img.youtube.com/vi/hq3yfQnllfQ/hqdefault.jpg',
    views: '1.4 Tr lượt xem',
    publishedAt: '5 ngày trước',
  },
  {
    id: 'yt_4',
    videoId: 'WRVsOCh907o',
    title: 'Bath Song - Bài Hát Giờ Đi Tắm Vui Nhộn Cho Bé',
    channelId: 'cocomelon',
    channelName: 'Cocomelon Tiếng Anh',
    channelAvatar: 'https://img.youtube.com/vi/yCjJyiqpAuU/hqdefault.jpg',
    channelEmoji: '🍉',
    channelColor: '#16A34A',
    category: 'music',
    duration: '02:50',
    thumbnail: 'https://img.youtube.com/vi/WRVsOCh907o/hqdefault.jpg',
    views: '6.2 Tr lượt xem',
    publishedAt: '2 tuần trước',
  },
  {
    id: 'yt_5',
    videoId: '_6HzoUcx3eo',
    title: 'Old MacDonald Had A Farm - Nông trại vui vẻ cùng các con vật',
    channelId: 'super_simple_songs',
    channelName: 'Super Simple Songs',
    channelAvatar: 'https://img.youtube.com/vi/71_hD4v25xo/hqdefault.jpg',
    channelEmoji: '🎶',
    channelColor: '#0284C7',
    category: 'english',
    duration: '03:40',
    thumbnail: 'https://img.youtube.com/vi/_6HzoUcx3eo/hqdefault.jpg',
    views: '3.6 Tr lượt xem',
    publishedAt: '1 ngày trước',
  },
  {
    id: 'yt_6',
    videoId: 'fF_l0C7u1tU',
    title: 'Wolfoo - Những Thói Quen Tốt Hàng Ngày & Phép Lịch Sự Của Bé',
    channelId: 'wolfoo_vn',
    channelName: 'Wolfoo Tiếng Việt',
    channelAvatar: 'https://img.youtube.com/vi/Y5yL4xPqYyo/hqdefault.jpg',
    channelEmoji: '🐺',
    channelColor: '#7C3AED',
    category: 'cartoon',
    duration: '10:15',
    thumbnail: 'https://img.youtube.com/vi/fF_l0C7u1tU/hqdefault.jpg',
    views: '4.2 Tr lượt xem',
    publishedAt: '4 ngày trước',
  },
  {
    id: 'yt_7',
    videoId: 'z0jQ9U_0NMo',
    title: 'Cổ Tích Việt Nam: Cậu Bé Thông Minh Và Bài Học Trí Tuệ',
    channelId: 'fairy_tales_vn',
    channelName: 'Cổ Tích Việt Nam',
    channelAvatar: 'https://img.youtube.com/vi/2Z1tU5B1V58/hqdefault.jpg',
    channelEmoji: '🐉',
    channelColor: '#D97706',
    category: 'story',
    duration: '08:30',
    thumbnail: 'https://img.youtube.com/vi/z0jQ9U_0NMo/hqdefault.jpg',
    views: '850 N lượt xem',
    publishedAt: '3 tuần trước',
  },
];

const YOUTUBE_STORAGE_KEYS = {
  ENABLED: 'YT_ENABLED',
  DAILY_LIMIT_MINUTES: 'YT_DAILY_LIMIT_MINUTES',
  WATCHED_TODAY_SECONDS: 'YT_WATCHED_TODAY_SECONDS',
  WATCHED_DATE: 'YT_WATCHED_DATE',
  ALLOWED_CHANNELS: 'YT_ALLOWED_CHANNELS',
  CUSTOM_CHANNELS: 'YT_CUSTOM_CHANNELS',
  CUSTOM_VIDEOS: 'YT_CUSTOM_VIDEOS',
};

export const youtubeService = {
  isYouTubeEnabled(): boolean {
    const raw = storage.getString(YOUTUBE_STORAGE_KEYS.ENABLED);
    return raw !== 'false';
  },

  setYouTubeEnabled(enabled: boolean): void {
    storage.set(YOUTUBE_STORAGE_KEYS.ENABLED, String(enabled));
  },

  getDailyLimitMinutes(): number {
    const raw = storage.getString(YOUTUBE_STORAGE_KEYS.DAILY_LIMIT_MINUTES);
    return raw ? parseInt(raw, 10) : 45;
  },

  setDailyLimitMinutes(minutes: number): void {
    storage.set(YOUTUBE_STORAGE_KEYS.DAILY_LIMIT_MINUTES, String(minutes));
  },

  getTodayWatchedMinutes(): number {
    const today = new Date().toISOString().split('T')[0];
    const savedDate = storage.getString(YOUTUBE_STORAGE_KEYS.WATCHED_DATE);
    if (savedDate !== today) {
      storage.set(YOUTUBE_STORAGE_KEYS.WATCHED_DATE, today);
      storage.set(YOUTUBE_STORAGE_KEYS.WATCHED_TODAY_SECONDS, '0');
      return 0;
    }
    const rawSec = storage.getString(YOUTUBE_STORAGE_KEYS.WATCHED_TODAY_SECONDS);
    return Math.floor((rawSec ? parseInt(rawSec, 10) : 0) / 60);
  },

  addWatchedSeconds(seconds: number): number {
    const today = new Date().toISOString().split('T')[0];
    const savedDate = storage.getString(YOUTUBE_STORAGE_KEYS.WATCHED_DATE);
    let currentSec = 0;
    if (savedDate === today) {
      const rawSec = storage.getString(YOUTUBE_STORAGE_KEYS.WATCHED_TODAY_SECONDS);
      currentSec = rawSec ? parseInt(rawSec, 10) : 0;
    }
    const updated = currentSec + seconds;
    storage.set(YOUTUBE_STORAGE_KEYS.WATCHED_DATE, today);
    storage.set(YOUTUBE_STORAGE_KEYS.WATCHED_TODAY_SECONDS, String(updated));
    return Math.floor(updated / 60);
  },

  // 1. Quản lý Danh sách Kênh
  getCustomChannels(): YouTubeChannel[] {
    try {
      const raw = storage.getString(YOUTUBE_STORAGE_KEYS.CUSTOM_CHANNELS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn(e);
    }
    return [];
  },

  getDeletedChannelIds(): string[] {
    try {
      const raw = storage.getString('YOUTUBE_DELETED_CHANNELS');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getAllChannels(): YouTubeChannel[] {
    const custom = this.getCustomChannels();
    const deleted = this.getDeletedChannelIds();
    const all = [...PRESET_CHANNELS, ...custom];
    return all.filter((c) => !deleted.includes(c.id));
  },

  deleteChannel(channelId: string): void {
    this.deleteCustomChannel(channelId);
    const deleted = this.getDeletedChannelIds();
    if (!deleted.includes(channelId)) {
      deleted.push(channelId);
      storage.set('YOUTUBE_DELETED_CHANNELS', JSON.stringify(deleted));
    }
    const allowed = this.getAllowedChannelIds().filter((id) => id !== channelId);
    storage.set(YOUTUBE_STORAGE_KEYS.ALLOWED_CHANNELS, JSON.stringify(allowed));
  },

  // Lấy toàn bộ các kênh gợi ý mặc định có sẵn trong app ('Nổi bật')
  getFeaturedChannels(): YouTubeChannel[] {
    const uniqueMap = new Map<string, YouTubeChannel>();
    // Ưu tiên PRESET_CHANNELS
    PRESET_CHANNELS.forEach((ch) => uniqueMap.set(ch.id, ch));
    // Thêm DISCOVERY_CHANNELS_CATALOG
    DISCOVERY_CHANNELS_CATALOG.forEach((ch) => {
      if (!uniqueMap.has(ch.id)) {
        uniqueMap.set(ch.id, ch);
      }
    });
    return Array.from(uniqueMap.values());
  },

  // Tìm kiếm trong Kho Kênh Khám Phá & Nổi Bật
  searchDiscoveryCatalog(query: string): YouTubeChannel[] {
    const allFeatured = this.getFeaturedChannels();
    if (!query.trim()) return allFeatured;
    const q = query.toLowerCase().trim();
    return allFeatured.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.subscribers && c.subscribers.toLowerCase().includes(q))
    );
  },

  // 2. TÌM KIẾM KÊNH TRỰC TUYẾN TỪ YOUTUBE (Live Real YouTube InnerTube Search)
  async searchOnlineChannels(query: string): Promise<YouTubeChannel[]> {
    const cleanQuery = query.trim();
    if (!cleanQuery) return this.getFeaturedChannels();

    try {
      // 1. YouTube InnerTube Search API (Trả về kết quả trực tiếp từ YouTube chính thức)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch('https://www.youtube.com/youtubei/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'WEB',
              clientVersion: '2.20240101.00.00',
              hl: 'vi',
              gl: 'VN',
            },
          },
          query: cleanQuery,
          params: 'EgIQAg%3D%3D', // Filter: Channels only
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const contents =
          data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
        const onlineChannels: YouTubeChannel[] = [];

        if (Array.isArray(contents)) {
          for (const section of contents) {
            const items = section.itemSectionRenderer?.contents;
            if (Array.isArray(items)) {
              for (const item of items) {
                if (item.channelRenderer) {
                  const ch = item.channelRenderer;
                  const channelId = ch.channelId || `yt_${Date.now()}_${onlineChannels.length}`;
                  const title =
                    ch.title?.simpleText ||
                    ch.title?.runs?.[0]?.text ||
                    cleanQuery;

                  // Avatars
                  let rawAvatar =
                    ch.thumbnail?.thumbnails?.[ch.thumbnail?.thumbnails?.length - 1]?.url ||
                    ch.thumbnail?.thumbnails?.[0]?.url ||
                    '';
                  if (rawAvatar.startsWith('//')) {
                    rawAvatar = 'https:' + rawAvatar;
                  }

                  // Subscribers & video count / handle
                  const subCountText =
                    ch.videoCountText?.simpleText ||
                    ch.subscriberCountText?.simpleText ||
                    'Kênh YouTube';
                  const handleOrVideos =
                    ch.videoCountText && ch.subscriberCountText
                      ? ch.subscriberCountText?.simpleText
                      : ch.videoCountText?.simpleText;

                  // Description
                  const description =
                    ch.descriptionSnippet?.runs?.map((r: any) => r.text).join('') ||
                    `Kênh YouTube: ${title}`;

                  onlineChannels.push({
                    id: channelId,
                    name: title,
                    avatar:
                      rawAvatar ||
                      `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150`,
                    emoji: '📺',
                    color: '#DC2626',
                    category: 'cartoon',
                    description: description,
                    subscribers: subCountText,
                    videoCount: handleOrVideos,
                    isOnline: true,
                    isCustom: true,
                  });
                }
              }
            }
          }
        }

        if (onlineChannels.length > 0) {
          return onlineChannels;
        }
      }
    } catch (e) {
      console.warn('InnerTube channel search error:', e);
    }

    // 2. Fallback sang Invidious / Piped mirror instances nếu gặp sự cố mạng
    try {
      const mirrors = [
        'https://invidious.jing.rocks',
        'https://vid.puffyan.us',
        'https://invidious.nerdvpn.de',
      ];
      for (const mirror of mirrors) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);
          const res = await fetch(
            `${mirror}/api/v1/search?q=${encodeURIComponent(cleanQuery)}&type=channel`,
            {
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              return data.slice(0, 15).map((item: any) => ({
                id: item.authorId || `yt_${Date.now()}`,
                name: item.author || cleanQuery,
                avatar:
                  item.authorThumbnails?.[item.authorThumbnails.length - 1]?.url ||
                  item.authorThumbnails?.[0]?.url ||
                  `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150`,
                emoji: '🌐',
                color: '#DC2626',
                category: 'cartoon',
                description: item.description || `Kênh YouTube: ${item.author}`,
                subscribers: item.subCount
                  ? `${(item.subCount / 1000000).toFixed(1)} Tr người đăng ký`
                  : 'Trực tuyến',
                videoCount: item.videoCount ? `${item.videoCount} video` : undefined,
                isOnline: true,
                isCustom: true,
              }));
            }
          }
        } catch {}
      }
    } catch (e) {
      console.warn('Mirror search error:', e);
    }

    // Fallback nếu không có kết quả: tìm kiếm trong Catalog mặc định
    const localMatches = this.searchDiscoveryCatalog(cleanQuery);
    return localMatches;
  },

  // 3. Tự động tải video thật từ YouTube khi phụ huynh thêm kênh
  async fetchAndSaveChannelVideos(channel: YouTubeChannel): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('https://www.youtube.com/youtubei/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'WEB',
              clientVersion: '2.20240101.00.00',
              hl: 'vi',
              gl: 'VN',
            },
          },
          query: channel.name,
          params: 'EgIQAQ%3D%3D', // Filter: Video
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const contents =
          data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
        if (Array.isArray(contents)) {
          const videosToAdd: YouTubeVideo[] = [];
          for (const section of contents) {
            const items = section.itemSectionRenderer?.contents;
            if (Array.isArray(items)) {
              for (const item of items) {
                if (item.videoRenderer) {
                  const v = item.videoRenderer;
                  const videoId = v.videoId;
                  if (videoId) {
                    const title =
                      v.title?.runs?.[0]?.text ||
                      v.title?.simpleText ||
                      'Video YouTube';
                    let thumb =
                      v.thumbnail?.thumbnails?.[v.thumbnail?.thumbnails?.length - 1]?.url ||
                      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    if (thumb.startsWith('//')) thumb = 'https:' + thumb;

                    videosToAdd.push({
                      id: `vid_${videoId}`,
                      videoId: videoId,
                      title: title,
                      channelId: channel.id,
                      channelName: channel.name,
                      channelAvatar: channel.avatar,
                      channelEmoji: channel.emoji || '📺',
                      channelColor: channel.color || '#DC2626',
                      category: (channel.category as any) || 'cartoon',
                      duration: v.lengthText?.simpleText || '4:00',
                      thumbnail: thumb,
                      views: v.viewCountText?.simpleText || 'Nhiều lượt xem',
                      publishedAt: 'Mới nhất',
                      isCustom: true,
                    });
                  }
                }
              }
            }
          }

          if (videosToAdd.length > 0) {
            const currentCustomVideos = this.getCustomVideos();
            const existingVideoIds = new Set(currentCustomVideos.map((v) => v.videoId));
            const newVideos = videosToAdd.filter((v) => !existingVideoIds.has(v.videoId));
            if (newVideos.length > 0) {
              const updated = [...currentCustomVideos, ...newVideos];
              storage.set(YOUTUBE_STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(updated));
            }
          }
        }
      }
    } catch (e) {
      console.warn('fetchAndSaveChannelVideos error:', e);
    }
  },

  getCustomVideos(): YouTubeVideo[] {
    try {
      const rawVids = storage.getString(YOUTUBE_STORAGE_KEYS.CUSTOM_VIDEOS);
      if (rawVids) {
        return JSON.parse(rawVids);
      }
    } catch (e) {
      console.warn(e);
    }
    return [];
  },

  // Lưu kênh tuỳ chỉnh và tự động đồng bộ lên Supabase
  saveCustomChannel(channel: YouTubeChannel): void {
    const existing = this.getCustomChannels();
    const idx = existing.findIndex(
      (c) => c.id === channel.id || c.name.toLowerCase() === channel.name.toLowerCase()
    );
    let updated: YouTubeChannel[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = { ...existing[idx], ...channel, isCustom: true };
    } else {
      updated = [...existing, { ...channel, isCustom: true }];
    }
    storage.set(YOUTUBE_STORAGE_KEYS.CUSTOM_CHANNELS, JSON.stringify(updated));

    // Đẩy lên Supabase ngầm
    this.pushChannelToSupabase(channel, true).catch(() => {});
  },

  // Đồng bộ hai chiều với Supabase
  async syncWithSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const response = await supabaseClient.from<any>('kids_youtube_channels', {
        order: { column: 'is_featured', ascending: false },
      });

      if (response.error || !response.data) {
        return { success: false, count: 0, error: response.error?.message };
      }

      const rows = response.data;
      const customChannelsFromCloud: YouTubeChannel[] = [];
      const allowedIdsFromCloud: string[] = [];
      const cloudVideos: YouTubeVideo[] = [];

      for (const row of rows) {
        if (row.is_allowed) {
          allowedIdsFromCloud.push(row.id);
        }

        const ch: YouTubeChannel = {
          id: row.id,
          type: (row.type as YouTubeItemType) || 'channel',
          name: row.name,
          avatar: row.avatar,
          emoji: row.emoji || '📺',
          color: row.color || '#DC2626',
          category: row.category || 'cartoon',
          description: row.description || '',
          subscribers: row.subscribers || '',
          videoCount: row.video_count || undefined,
          isAllowed: row.is_allowed ?? true,
          isFeatured: row.is_featured ?? false,
          isCustom: !row.is_featured,
        };

        if (!row.is_featured) {
          customChannelsFromCloud.push(ch);
        }

        // Nếu có video đính kèm
        if (Array.isArray(row.videos) && row.videos.length > 0) {
          cloudVideos.push(...row.videos);
        }
      }

      // 1. Cập nhật Allowed Channel IDs
      if (allowedIdsFromCloud.length > 0) {
        const currentAllowed = this.getAllowedChannelIds();
        const mergedAllowed = Array.from(new Set([...currentAllowed, ...allowedIdsFromCloud]));
        storage.set(YOUTUBE_STORAGE_KEYS.ALLOWED_CHANNELS, JSON.stringify(mergedAllowed));
      }

      // 2. Cập nhật Custom Channels
      if (customChannelsFromCloud.length > 0) {
        const currentCustom = this.getCustomChannels();
        const customMap = new Map<string, YouTubeChannel>();
        currentCustom.forEach((c) => customMap.set(c.id, c));
        customChannelsFromCloud.forEach((c) => customMap.set(c.id, c));
        storage.set(
          YOUTUBE_STORAGE_KEYS.CUSTOM_CHANNELS,
          JSON.stringify(Array.from(customMap.values()))
        );
      }

      // 3. Cập nhật Custom Videos
      if (cloudVideos.length > 0) {
        const currentVids = this.getCustomVideos();
        const vidMap = new Map<string, YouTubeVideo>();
        currentVids.forEach((v) => vidMap.set(v.videoId, v));
        cloudVideos.forEach((v) => vidMap.set(v.videoId, v));
        storage.set(
          YOUTUBE_STORAGE_KEYS.CUSTOM_VIDEOS,
          JSON.stringify(Array.from(vidMap.values()))
        );
      }

      return { success: true, count: rows.length };
    } catch (e: any) {
      console.warn('syncWithSupabase error:', e);
      return { success: false, count: 0, error: e.message };
    }
  },

  // Đẩy một kênh lên Supabase
  async pushChannelToSupabase(channel: YouTubeChannel, isAllowed: boolean = true): Promise<void> {
    try {
      await supabaseClient.upsert(
        'kids_youtube_channels',
        {
          id: channel.id,
          type: channel.type || 'channel',
          name: channel.name,
          avatar: channel.avatar || '',
          emoji: channel.emoji || '📺',
          color: channel.color || '#DC2626',
          category: channel.category || 'cartoon',
          description: channel.description || '',
          subscribers: channel.subscribers || '',
          video_count: channel.videoCount || '',
          is_allowed: isAllowed,
          is_featured: channel.isFeatured || false,
          videos: channel.videos || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('pushChannelToSupabase error:', e);
    }
  },

  // Cập nhật trạng thái cho phép trên Supabase
  async updateAllowedOnSupabase(channelId: string, isAllowed: boolean): Promise<void> {
    try {
      await supabaseClient.update('kids_youtube_channels', 'id', channelId, {
        is_allowed: isAllowed,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('updateAllowedOnSupabase error:', e);
    }
  },

  // Tìm kiếm Danh sách phát (Playlists) trực tuyến từ YouTube
  async searchOnlinePlaylists(query: string): Promise<YouTubeChannel[]> {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch('https://www.youtube.com/youtubei/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'WEB',
              clientVersion: '2.20240101.00.00',
              hl: 'vi',
              gl: 'VN',
            },
          },
          query: cleanQuery,
          params: 'EgIQAw%3D%3D', // Filter: Playlists only
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const contents =
          data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
        const onlinePlaylists: YouTubeChannel[] = [];

        if (Array.isArray(contents)) {
          for (const section of contents) {
            const items = section.itemSectionRenderer?.contents;
            if (Array.isArray(items)) {
              for (const item of items) {
                if (item.playlistRenderer) {
                  const pl = item.playlistRenderer;
                  const playlistId = pl.playlistId || `pl_${Date.now()}_${onlinePlaylists.length}`;
                  const title =
                    pl.title?.simpleText ||
                    pl.title?.runs?.[0]?.text ||
                    cleanQuery;

                  let rawAvatar =
                    pl.thumbnails?.[0]?.thumbnails?.[pl.thumbnails[0].thumbnails.length - 1]?.url ||
                    pl.thumbnails?.[0]?.thumbnails?.[0]?.url ||
                    '';
                  if (rawAvatar.startsWith('//')) rawAvatar = 'https:' + rawAvatar;

                  const vidCount = pl.videoCount || `${pl.videoCountText?.runs?.[0]?.text || ''} video`;
                  const author = pl.shortBylineText?.runs?.[0]?.text || 'Danh sách phát';

                  onlinePlaylists.push({
                    id: playlistId,
                    type: 'playlist',
                    name: title,
                    avatar: rawAvatar || `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150`,
                    emoji: '📑',
                    color: '#7C3AED',
                    category: 'music',
                    description: `Danh sách phát: ${author} (${vidCount})`,
                    subscribers: author,
                    videoCount: String(vidCount),
                    isOnline: true,
                    isCustom: true,
                  });
                }
              }
            }
          }
        }

        if (onlinePlaylists.length > 0) {
          return onlinePlaylists;
        }
      }
    } catch (e) {
      console.warn('InnerTube playlist search error:', e);
    }

    return [];
  },

  // 4. Tự động lấy siêu dữ liệu YouTube trực tuyến qua OEmbed / NoEmbed
  async fetchOnlineMetadata(
    urlOrVideoId: string
  ): Promise<{
    title: string;
    channelName: string;
    thumbnail: string;
    videoId: string;
  } | null> {
    let cleanVideoId = urlOrVideoId.trim();
    if (cleanVideoId.includes('youtube.com/watch?v=')) {
      cleanVideoId = cleanVideoId.split('v=')[1]?.split('&')[0] || cleanVideoId;
    } else if (cleanVideoId.includes('youtu.be/')) {
      cleanVideoId = cleanVideoId.split('youtu.be/')[1]?.split('?')[0] || cleanVideoId;
    }

    if (!cleanVideoId) return null;

    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${cleanVideoId}&format=json`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const json = await res.json();
        return {
          title: json.title || 'Video YouTube',
          channelName: json.author_name || 'Kênh YouTube',
          thumbnail: json.thumbnail_url || `https://img.youtube.com/vi/${cleanVideoId}/hqdefault.jpg`,
          videoId: cleanVideoId,
        };
      }
    } catch (e) {
      console.warn('OEmbed fetch failed, using fallback:', e);
    }

    // Fallback chuẩn
    return {
      title: 'Video YouTube Cho Bé',
      channelName: 'Kênh Phụ Huynh',
      thumbnail: `https://img.youtube.com/vi/${cleanVideoId}/hqdefault.jpg`,
      videoId: cleanVideoId,
    };
  },

  // Thêm kênh từ Kho Khám Phá
  addChannelFromCatalog(catalogChannel: YouTubeChannel): YouTubeChannel {
    const channelId = catalogChannel.id || `channel_${Date.now()}`;
    const newCh: YouTubeChannel = {
      ...catalogChannel,
      id: channelId,
      isCustom: true,
    };
    this.saveCustomChannel(newCh);
    this.toggleChannel(channelId, true);
    return newCh;
  },

  addCustomChannel(channel: {
    name: string;
    emoji: string;
    color: string;
    category: string;
    description: string;
    firstVideoIdOrUrl?: string;
  }): YouTubeChannel {
    const channelId = `channel_${Date.now()}`;
    const newCh: YouTubeChannel = {
      id: channelId,
      name: channel.name.trim(),
      avatar: `https://img.youtube.com/vi/placeholder/hqdefault.jpg`,
      emoji: channel.emoji || '📺',
      color: channel.color || '#2563EB',
      category: channel.category || 'cartoon',
      description: channel.description.trim() || 'Kênh do phụ huynh thêm',
      subscribers: 'Phụ huynh tạo',
      isCustom: true,
    };

    const existing = this.getCustomChannels();
    const updated = [...existing, newCh];
    storage.set(YOUTUBE_STORAGE_KEYS.CUSTOM_CHANNELS, JSON.stringify(updated));

    // Mặc định tự động bật kênh mới
    this.toggleChannel(channelId, true);

    // Nếu có video đính kèm thì thêm video vào kênh này luôn
    if (channel.firstVideoIdOrUrl && channel.firstVideoIdOrUrl.trim()) {
      this.addCustomVideo({
        videoIdOrUrl: channel.firstVideoIdOrUrl,
        title: `Video mở đầu - ${newCh.name}`,
        channelId: channelId,
        channelName: newCh.name,
        channelEmoji: newCh.emoji,
        channelColor: newCh.color,
        category: newCh.category as any,
      });
    }

    return newCh;
  },

  deleteCustomChannel(channelId: string): void {
    const existing = this.getCustomChannels();
    const updated = existing.filter((c) => c.id !== channelId);
    storage.set(YOUTUBE_STORAGE_KEYS.CUSTOM_CHANNELS, JSON.stringify(updated));

    // Xóa các video thuộc kênh này
    try {
      const rawVids = storage.getString(YOUTUBE_STORAGE_KEYS.CUSTOM_VIDEOS);
      if (rawVids) {
        const vids: YouTubeVideo[] = JSON.parse(rawVids);
        const filteredVids = vids.filter((v) => v.channelId !== channelId);
        storage.set(YOUTUBE_STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(filteredVids));
      }
    } catch (e) {
      console.warn(e);
    }
  },

  getAllowedChannelIds(): string[] {
    try {
      const raw = storage.getString(YOUTUBE_STORAGE_KEYS.ALLOWED_CHANNELS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn(e);
    }
    // Mặc định cho phép tất cả các kênh
    return this.getAllChannels().map((c) => c.id);
  },

  toggleChannel(channelId: string, allowed: boolean): string[] {
    const current = this.getAllowedChannelIds();
    let updated: string[];
    if (allowed) {
      updated = Array.from(new Set([...current, channelId]));
    } else {
      updated = current.filter((id) => id !== channelId);
    }
    storage.set(YOUTUBE_STORAGE_KEYS.ALLOWED_CHANNELS, JSON.stringify(updated));

    // Đồng bộ trạng thái lên Supabase
    this.updateAllowedOnSupabase(channelId, allowed).catch(() => {});

    return updated;
  },

  // 4. Lấy danh sách video (Có lọc theo kênh cho phép)
  getVideos(filterByAllowedChannels: boolean = true): YouTubeVideo[] {
    let list: YouTubeVideo[] = DEFAULT_CURATED_VIDEOS;
    try {
      const raw = storage.getString(YOUTUBE_STORAGE_KEYS.CUSTOM_VIDEOS);
      if (raw) {
        const custom: YouTubeVideo[] = JSON.parse(raw);
        list = [...custom, ...DEFAULT_CURATED_VIDEOS];
      }
    } catch (e) {
      console.warn(e);
    }

    if (!filterByAllowedChannels) {
      return list;
    }

    const allowedChannels = this.getAllowedChannelIds();
    return list.filter((v) => allowedChannels.includes(v.channelId));
  },

  // 4.1. Lấy danh sách video thuộc về một kênh cụ thể
  getVideosForChannel(channel: YouTubeChannel): YouTubeVideo[] {
    const all = this.getVideos(false);
    const q = channel.name.toLowerCase().trim();
    const chId = channel.id.toLowerCase().trim();

    // 1. Lọc theo channelId hoặc tên kênh
    let matched = all.filter(
      (v) =>
        (v.channelId && v.channelId.toLowerCase() === chId) ||
        (v.channelName && v.channelName.toLowerCase().includes(q)) ||
        (channel.sampleVideoId && v.videoId === channel.sampleVideoId)
    );

    // 2. Nếu có mảng videos gắn liền trong channel
    if (Array.isArray(channel.videos) && channel.videos.length > 0) {
      channel.videos.forEach((cv) => {
        if (!matched.some((m) => m.videoId === cv.videoId)) {
          matched.push(cv);
        }
      });
    }

    // 3. Nếu chưa có video nào, tự động tạo video mẫu từ sampleVideoId hoặc fallback
    if (matched.length === 0) {
      const vidId = channel.sampleVideoId || 'WRVsOCh907o';
      matched.push({
        id: `vid_${vidId}`,
        videoId: vidId,
        title: `${channel.name} - Video hay nhất cho bé`,
        channelId: channel.id,
        channelName: channel.name,
        channelAvatar: channel.avatar,
        channelEmoji: channel.emoji || '📺',
        channelColor: channel.color || '#2563EB',
        category: (channel.category as any) || 'cartoon',
        duration: '04:15',
        thumbnail: `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`,
        views: '1.2 Tr lượt xem',
        publishedAt: 'Mới cập nhật',
      });
    }

    return matched;
  },

  // 5. Thêm video tùy chỉnh từ phụ huynh
  addCustomVideo(video: {
    title: string;
    videoIdOrUrl: string;
    channelId?: string;
    channelName?: string;
    channelEmoji?: string;
    channelColor?: string;
    category?: 'music' | 'english' | 'cartoon' | 'story';
  }): YouTubeVideo | null {
    let cleanVideoId = video.videoIdOrUrl.trim();
    if (cleanVideoId.includes('youtube.com/watch?v=')) {
      cleanVideoId = cleanVideoId.split('v=')[1]?.split('&')[0] || cleanVideoId;
    } else if (cleanVideoId.includes('youtu.be/')) {
      cleanVideoId = cleanVideoId.split('youtu.be/')[1]?.split('?')[0] || cleanVideoId;
    }

    if (!cleanVideoId) return null;

    const chId = video.channelId || 'custom_channel';
    const chName = video.channelName || 'Kênh Phụ Huynh';

    const newVideo: YouTubeVideo = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      videoId: cleanVideoId,
      title: video.title.trim() || 'Video Phụ huynh thêm',
      channelId: chId,
      channelName: chName,
      channelAvatar: `https://img.youtube.com/vi/${cleanVideoId}/hqdefault.jpg`,
      channelEmoji: video.channelEmoji || '📺',
      channelColor: video.channelColor || '#2563EB',
      category: video.category || 'music',
      duration: 'Tùy chọn',
      thumbnail: `https://img.youtube.com/vi/${cleanVideoId}/hqdefault.jpg`,
      views: 'Phụ huynh duyệt',
      publishedAt: 'Mới thêm',
      isCustom: true,
    };

    // Đảm bảo kênh này được phép hiển thị
    const allowed = this.getAllowedChannelIds();
    if (!allowed.includes(chId)) {
      this.toggleChannel(chId, true);
    }

    try {
      const raw = storage.getString(YOUTUBE_STORAGE_KEYS.CUSTOM_VIDEOS);
      const existing: YouTubeVideo[] = raw ? JSON.parse(raw) : [];
      const updated = [newVideo, ...existing];
      storage.set(YOUTUBE_STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    return newVideo;
  },

  deleteCustomVideo(videoId: string): void {
    try {
      const raw = storage.getString(YOUTUBE_STORAGE_KEYS.CUSTOM_VIDEOS);
      if (raw) {
        const existing: YouTubeVideo[] = JSON.parse(raw);
        const updated = existing.filter((v) => v.id !== videoId);
        storage.set(YOUTUBE_STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn(e);
    }
  },

  // 6. Lấy video liền trước hoặc liền sau
  getAdjacentVideo(
    currentVideoId: string,
    direction: 'prev' | 'next'
  ): YouTubeVideo | null {
    const list = this.getVideos(true);
    if (list.length === 0) return null;
    const currentIndex = list.findIndex((v) => v.id === currentVideoId);
    if (currentIndex === -1) return list[0];

    if (direction === 'next') {
      return currentIndex + 1 < list.length ? list[currentIndex + 1] : list[0];
    } else {
      return currentIndex - 1 >= 0
        ? list[currentIndex - 1]
        : list[list.length - 1];
    }
  },
};
