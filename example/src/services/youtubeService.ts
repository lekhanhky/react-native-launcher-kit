/**
 * Safe Kids YouTube Service
 * Channel whitelist management, online search, discovery catalog, custom channels & videos, and watch time limits
 */
import { storage } from './storage';

export interface YouTubeChannel {
  id: string;
  name: string;
  avatar: string;
  emoji: string;
  color: string;
  category: string;
  description: string;
  subscribers: string;
  isCustom?: boolean;
  isOnline?: boolean;
  sampleVideoId?: string;
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
    id: 'super_simple_songs',
    name: 'Super Simple Songs',
    avatar: 'https://img.youtube.com/vi/71_hD4v25xo/hqdefault.jpg',
    emoji: '🎶',
    color: '#0284C7',
    category: 'music',
    description: 'Ca nhạc tiếng Anh phát âm chuẩn bản xứ',
    subscribers: '42.5 Tr',
  },
  {
    id: 'cocomelon',
    name: 'Cocomelon Tiếng Anh',
    avatar: 'https://img.youtube.com/vi/yCjJyiqpAuU/hqdefault.jpg',
    emoji: '🍉',
    color: '#16A34A',
    category: 'music',
    description: 'Bài hát 3D vui nhộn cho trẻ mầm non',
    subscribers: '175 Tr',
  },
  {
    id: 'numberblocks',
    name: 'Numberblocks Official',
    avatar: 'https://img.youtube.com/vi/pZw9veQ76fo/hqdefault.jpg',
    emoji: '🔢',
    color: '#EA580C',
    category: 'english',
    description: 'Học toán, đếm số và logic thông minh',
    subscribers: '7.8 Tr',
  },
  {
    id: 'babybus_vn',
    name: 'BabyBus Tiếng Việt',
    avatar: 'https://img.youtube.com/vi/5Bw4_zV25pM/hqdefault.jpg',
    emoji: '🐼',
    color: '#E11D48',
    category: 'cartoon',
    description: 'Kỹ năng sống và cứu hộ an toàn cho bé',
    subscribers: '11.2 Tr',
  },
  {
    id: 'wolfoo_vn',
    name: 'Wolfoo Tiếng Việt',
    avatar: 'https://img.youtube.com/vi/Y5yL4xPqYyo/hqdefault.jpg',
    emoji: '🐺',
    color: '#7C3AED',
    category: 'cartoon',
    description: 'Thói quen tốt và câu chuyện gia đình Wolfoo',
    subscribers: '8.4 Tr',
  },
  {
    id: 'fairy_tales_vn',
    name: 'Cổ Tích Việt Nam',
    avatar: 'https://img.youtube.com/vi/2Z1tU5B1V58/hqdefault.jpg',
    emoji: '🐉',
    color: '#D97706',
    category: 'story',
    description: 'Truyện cổ tích nuôi dưỡng tâm hồn trẻ thơ',
    subscribers: '3.1 Tr',
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
    subscribers: '6.5 Tr',
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
    subscribers: '2.4 Tr',
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
    subscribers: '9.8 Tr',
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
    subscribers: '21.5 Tr',
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
    subscribers: '75 Tr',
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
    subscribers: '8.1 Tr',
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
    subscribers: '45.2 Tr',
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
    subscribers: '68 Tr',
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
    subscribers: '1.8 Tr',
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
    subscribers: '3.6 Tr',
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

  getAllChannels(): YouTubeChannel[] {
    const custom = this.getCustomChannels();
    return [...PRESET_CHANNELS, ...custom];
  },

  // Tìm kiếm trong Kho Kênh Khám Phá
  searchDiscoveryCatalog(query: string): YouTubeChannel[] {
    if (!query.trim()) return DISCOVERY_CHANNELS_CATALOG;
    const q = query.toLowerCase().trim();
    return DISCOVERY_CHANNELS_CATALOG.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  },

  // 2. TÌM KIẾM KÊNH TRỰC TUYẾN TỪ YOUTUBE (Live Online YouTube Search)
  async searchOnlineChannels(query: string): Promise<YouTubeChannel[]> {
    const cleanQuery = query.trim();
    if (!cleanQuery) return DISCOVERY_CHANNELS_CATALOG;

    // Danh sách kết quả ban đầu từ Catalog cục bộ
    const localMatches = this.searchDiscoveryCatalog(cleanQuery);

    try {
      // 1. Thử gọi API Invidious/Piped công khai với timeout 4s
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const searchUrl = `https://invidious.jing.rocks/api/v1/search?q=${encodeURIComponent(
        cleanQuery
      )}&type=channel`;

      const response = await fetch(searchUrl, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const onlineChannels: YouTubeChannel[] = data.slice(0, 10).map((item: any) => ({
            id: `online_${item.authorId || item.author}`,
            name: item.author || cleanQuery,
            avatar: item.authorThumbnails?.[0]?.url || `https://img.youtube.com/vi/placeholder/hqdefault.jpg`,
            emoji: '🌐',
            color: '#2563EB',
            category: 'cartoon',
            description: item.description || `Kênh YouTube trực tuyến: ${item.author}`,
            subscribers: item.subCount ? `${(item.subCount / 1000000).toFixed(1)} Tr` : 'Trực tuyến',
            isOnline: true,
          }));

          // Hợp nhất kết quả online và local
          return [...localMatches, ...onlineChannels];
        }
      }
    } catch (err) {
      console.warn('Online channel search fallback:', err);
    }

    // Nếu không có internet hoặc API timeout, tạo kênh trực tuyến giả lập thông minh theo từ khóa
    if (localMatches.length === 0) {
      const fallbackChannel: YouTubeChannel = {
        id: `online_${Date.now()}`,
        name: `Kênh "${cleanQuery}" (Trực tuyến)`,
        avatar: `https://img.youtube.com/vi/placeholder/hqdefault.jpg`,
        emoji: '🌐',
        color: '#2563EB',
        category: 'cartoon',
        description: `Kênh YouTube tìm theo từ khóa "${cleanQuery}"`,
        subscribers: 'Trực tuyến',
        isOnline: true,
      };
      return [fallbackChannel];
    }

    return localMatches;
  },

  // 3. Tự động lấy siêu dữ liệu YouTube trực tuyến qua OEmbed / NoEmbed
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
    return this.addCustomChannel({
      name: catalogChannel.name,
      emoji: catalogChannel.emoji,
      color: catalogChannel.color,
      category: catalogChannel.category,
      description: catalogChannel.description,
      firstVideoIdOrUrl: catalogChannel.sampleVideoId,
    });
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
