import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  StatusBar,
  Modal,
  Alert,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import {
  YouTubeChannel,
  YouTubeVideo,
  youtubeService,
} from '../services/youtubeService';
import { ThemeConfig } from '../services/themes';

interface GreenKidsTubeScreenProps {
  theme?: ThemeConfig;
  onClose: () => void;
}

// Cấu trúc danh sách phát (Playlist)
export interface GreenPlaylist {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  emoji: string;
  category: string;
  color: string;
  totalVideos: number;
  author: string;
  videos: YouTubeVideo[];
}

// Danh mục chủ đề xanh
const GREEN_CATEGORIES = [
  { id: 'all', name: 'Tất Cả', emoji: '🌿' },
  { id: 'nature', name: 'Động Vật & Tự Nhiên', emoji: '🐾' },
  { id: 'science', name: 'Khoa Học & Vũ Trụ', emoji: '🔬' },
  { id: 'music', name: 'Nhạc Xanh Vui Nhộn', emoji: '🎵' },
  { id: 'art', name: 'Khéo Tay & Tô Màu', emoji: '🎨' },
  { id: 'story', name: 'Kỹ Năng & Cổ Tích', emoji: '📖' },
];

// Danh sách video mẫu chủ đề thiên nhiên, khoa học, xanh sạch
const GREEN_CURATED_VIDEOS: YouTubeVideo[] = [
  {
    id: 'gv_1',
    videoId: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito (Phiên Bản Nhạc Nhí Vui Nhộn)',
    channelId: 'giai_dieu_chill',
    channelName: 'Nhạc Thiếu Nhi Xanh',
    channelAvatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150',
    channelEmoji: '🎵',
    channelColor: '#10B981',
    category: 'music',
    duration: '03:45',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
    views: '2.5M lượt xem',
    publishedAt: '2 ngày trước',
  },
  {
    id: 'gv_2',
    videoId: 'XqZsoesa55w',
    title: 'Khám Phá Thế Giới Động Vật Hoang Dã Dưới Rừng Xanh',
    channelId: 'the_gioi_dong_vat',
    channelName: 'Thế Giới Động Vật',
    channelAvatar: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=150',
    channelEmoji: '🦁',
    channelColor: '#059669',
    category: 'cartoon',
    duration: '08:20',
    thumbnail: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=500',
    views: '1.8M lượt xem',
    publishedAt: '1 tuần trước',
  },
  {
    id: 'gv_3',
    videoId: 'fJ9rUzIMcZQ',
    title: 'Vũ Trụ Diệu Kỳ: Các Hành Tinh Xung Quanh Mặt Trời',
    channelId: 'khoa_hoc_nhi',
    channelName: 'Bé Yêu Khoa Học',
    channelAvatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150',
    channelEmoji: '🚀',
    channelColor: '#047857',
    category: 'english',
    duration: '06:15',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500',
    views: '950K lượt xem',
    publishedAt: '3 ngày trước',
  },
  {
    id: 'gv_4',
    videoId: 'JGwWNGJdvx8',
    title: 'Ed Sheeran - Shape of You (Bản Nhạc Thiếu Nhi Rộn Ràng)',
    channelId: 'cocomelon_vn',
    channelName: 'Giai Điệu Vui Tươi',
    channelAvatar: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=150',
    channelEmoji: '🍉',
    channelColor: '#10B981',
    category: 'music',
    duration: '04:12',
    thumbnail: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500',
    views: '3.1M lượt xem',
    publishedAt: '5 ngày trước',
  },
  {
    id: 'gv_5',
    videoId: 'kXYiU_JCYtU',
    title: 'Liên Khúc Linkin Park - Numb (Bản Hòa Tấu Xylophone Măng Non)',
    channelId: 'hoa_tau_nhi',
    channelName: 'Hòa Tấu Măng Non',
    channelAvatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150',
    channelEmoji: '🎹',
    channelColor: '#059669',
    category: 'music',
    duration: '03:30',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
    views: '820K lượt xem',
    publishedAt: '1 tháng trước',
  },
  {
    id: 'gv_6',
    videoId: 'uelHwf8o7_U',
    title: 'Eminem - Love The Way You Lie (Hòa Tấu Piano Nhẹ Nhàng Thư Giãn)',
    channelId: 'piano_chill',
    channelName: 'Piano Thư Giãn',
    channelAvatar: 'https://images.unsplash.com/photo-1520523839898-507127053999?w=150',
    channelEmoji: '🎼',
    channelColor: '#047857',
    category: 'music',
    duration: '04:45',
    thumbnail: 'https://images.unsplash.com/photo-1520523839898-507127053999?w=500',
    views: '1.2M lượt xem',
    publishedAt: '2 tuần trước',
  },
];

// DANH SÁCH CÁC PLAYLIST TUYỂN CHỌN ĐẶC SẮC (PRESET GREEN PLAYLISTS)
const PRESET_GREEN_PLAYLISTS: GreenPlaylist[] = [
  {
    id: 'pl_animals',
    title: 'Thế Giới Động Vật Hoang Dã Kỳ Thú',
    subtitle: 'Khám phá cuộc sống muôn loài thú rừng và đại dương xanh',
    coverImage: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600',
    emoji: '🦁',
    category: 'nature',
    color: '#059669',
    totalVideos: 4,
    author: 'Thế Giới Động Vật',
    videos: [
      GREEN_CURATED_VIDEOS[1],
      {
        id: 'pl_an_2',
        videoId: 'kJQP7kiw5Fk',
        title: 'Các Loài Chim Nhiệt Đới Sặc Sỡ Dưới Tán Rừng',
        channelId: 'the_gioi_dong_vat',
        channelName: 'Thế Giới Động Vật',
        channelAvatar: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=150',
        channelEmoji: '🦜',
        channelColor: '#059669',
        category: 'cartoon',
        duration: '05:15',
        thumbnail: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500',
        views: '750K lượt xem',
        publishedAt: '3 tuần trước',
      },
      {
        id: 'pl_an_3',
        videoId: 'fJ9rUzIMcZQ',
        title: 'Cá Heo Và Những Người Bạn Thông Minh Dưới Biển',
        channelId: 'the_gioi_dong_vat',
        channelName: 'Thế Giới Động Vật',
        channelAvatar: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=150',
        channelEmoji: '🐬',
        channelColor: '#059669',
        category: 'cartoon',
        duration: '07:40',
        thumbnail: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=500',
        views: '1.1M lượt xem',
        publishedAt: '1 tháng trước',
      },
      {
        id: 'pl_an_4',
        videoId: 'JGwWNGJdvx8',
        title: 'Gia Đình Gấu Trúc Vui Nhộn Ở Rừng Trúc Xanh',
        channelId: 'the_gioi_dong_vat',
        channelName: 'Thế Giới Động Vật',
        channelAvatar: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=150',
        channelEmoji: '🐼',
        channelColor: '#059669',
        category: 'cartoon',
        duration: '04:55',
        thumbnail: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?w=500',
        views: '930K lượt xem',
        publishedAt: '2 tháng trước',
      },
    ],
  },
  {
    id: 'pl_space',
    title: 'Bé Yêu Khoa Học & Khám Phá Vũ Trụ',
    subtitle: 'Chuyến du hành kỳ thú khám phá Hệ Mặt Trời và các vì sao',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
    emoji: '🚀',
    category: 'science',
    color: '#047857',
    totalVideos: 3,
    author: 'Bé Yêu Khoa Học',
    videos: [
      GREEN_CURATED_VIDEOS[2],
      {
        id: 'pl_sp_2',
        videoId: 'XqZsoesa55w',
        title: 'Trọng Lực Là Gì? Tại Sao Chúng Ta Không Bay Lên Trời?',
        channelId: 'khoa_hoc_nhi',
        channelName: 'Bé Yêu Khoa Học',
        channelAvatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150',
        channelEmoji: '🔭',
        channelColor: '#047857',
        category: 'english',
        duration: '05:30',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500',
        views: '620K lượt xem',
        publishedAt: '2 tuần trước',
      },
      {
        id: 'pl_sp_3',
        videoId: 'kXYiU_JCYtU',
        title: 'Mặt Trăng Thay Đổi Hình Dạng Như Thế Nào?',
        channelId: 'khoa_hoc_nhi',
        channelName: 'Bé Yêu Khoa Học',
        channelAvatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150',
        channelEmoji: '🌕',
        channelColor: '#047857',
        category: 'english',
        duration: '06:45',
        thumbnail: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=500',
        views: '880K lượt xem',
        publishedAt: '1 tháng trước',
      },
    ],
  },
  {
    id: 'pl_music',
    title: 'Tuyển Tập Ca Nhạc Thiếu Nhi Rộn Ràng',
    subtitle: 'Giai điệu vui tươi giúp bé vận động, ca hát và thư giãn',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
    emoji: '🎵',
    category: 'music',
    color: '#10B981',
    totalVideos: 4,
    author: 'Nhạc Thiếu Nhi Xanh',
    videos: [
      GREEN_CURATED_VIDEOS[0],
      GREEN_CURATED_VIDEOS[3],
      GREEN_CURATED_VIDEOS[4],
      GREEN_CURATED_VIDEOS[5],
    ],
  },
  {
    id: 'pl_eco',
    title: 'Mầm Xanh: Yêu Cây Cối & Bảo Vệ Môi Trường',
    subtitle: 'Học cách trồng cây, tiết kiệm nước và giữ gìn thiên nhiên tươi đẹp',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
    emoji: '🌱',
    category: 'nature',
    color: '#047857',
    totalVideos: 3,
    author: 'Trái Đất Xanh Cho Bé',
    videos: [
      {
        id: 'pl_eco_1',
        videoId: 'kJQP7kiw5Fk',
        title: 'Hạt Mầm Bé Xíu Lớn Lên Thành Cây Cổ Thụ Như Thế Nào?',
        channelId: 'trai_dat_xanh',
        channelName: 'Trái Đất Xanh Cho Bé',
        channelAvatar: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150',
        channelEmoji: '🌿',
        channelColor: '#047857',
        category: 'cartoon',
        duration: '06:10',
        thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500',
        views: '450K lượt xem',
        publishedAt: '1 tuần trước',
      },
      GREEN_CURATED_VIDEOS[1],
      GREEN_CURATED_VIDEOS[2],
    ],
  },
  {
    id: 'pl_arts',
    title: 'Bé Khéo Tay: Tập Vẽ & Tô Màu Sáng Tạo',
    subtitle: 'Hướng dẫn vẽ con vật ngộ nghĩnh và đồ thủ công từ lá cây',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
    emoji: '🎨',
    category: 'art',
    color: '#16A34A',
    totalVideos: 3,
    author: 'Khéo Tay Măng Non',
    videos: [
      {
        id: 'pl_art_1',
        videoId: 'JGwWNGJdvx8',
        title: '5 Phút Học Vẽ Chú Khủng Long Xanh Lá Cực Dễ Thương',
        channelId: 'kheo_tay_nhi',
        channelName: 'Khéo Tay Măng Non',
        channelAvatar: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=150',
        channelEmoji: '🦕',
        channelColor: '#16A34A',
        category: 'cartoon',
        duration: '05:20',
        thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500',
        views: '580K lượt xem',
        publishedAt: '4 ngày trước',
      },
      GREEN_CURATED_VIDEOS[3],
      GREEN_CURATED_VIDEOS[4],
    ],
  },
  {
    id: 'pl_stories',
    title: 'Kỹ Năng Sống & Cổ Tích Ý Nghĩa',
    subtitle: 'Những câu chuyện rèn luyện lòng nhân ái và bài học cuộc sống',
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600',
    emoji: '📖',
    category: 'story',
    color: '#0D9488',
    totalVideos: 3,
    author: 'Vườn Cổ Tích Xanh',
    videos: [
      {
        id: 'pl_st_1',
        videoId: 'uelHwf8o7_U',
        title: 'Cậu Bé Thông Minh Và Bài Học Về Sự Trung Thực',
        channelId: 'co_tich_xanh',
        channelName: 'Vườn Cổ Tích Xanh',
        channelAvatar: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=150',
        channelEmoji: '📚',
        channelColor: '#0D9488',
        category: 'story',
        duration: '09:15',
        thumbnail: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500',
        views: '1.4M lượt xem',
        publishedAt: '2 tuần trước',
      },
      GREEN_CURATED_VIDEOS[5],
      GREEN_CURATED_VIDEOS[0],
    ],
  },
];

export const GreenKidsTubeScreen: React.FC<GreenKidsTubeScreenProps> = ({
  onClose,
}) => {
  const { width } = useWindowDimensions();
  const playerHeight = Math.round((width * 9) / 16);

  // Tabs: 'home' | 'videos' | 'playlists' | 'channels' | 'search'
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'playlists' | 'channels' | 'search'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Kênh, Video và Playlists
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [playlists] = useState<GreenPlaylist[]>(PRESET_GREEN_PLAYLISTS);
  const [selectedPlaylistForDetail, setSelectedPlaylistForDetail] = useState<GreenPlaylist | null>(null);

  // Video đang phát và Playlist ngữ cảnh đang phát
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);
  const [activePlayingPlaylist, setActivePlayingPlaylist] = useState<GreenPlaylist | null>(null);
  const [showPlayerModal, setShowPlayerModal] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  // Giới hạn thời gian xem
  const [watchedMinutes] = useState<number>(() =>
    youtubeService.getTodayWatchedMinutes()
  );
  const [limitMinutes] = useState<number>(() =>
    youtubeService.getDailyLimitMinutes()
  );
  const isTimeLimitReached = watchedMinutes >= limitMinutes;

  useEffect(() => {
    // Tải danh sách kênh từ service
    const allChs = youtubeService.getAllChannels();
    const allowedIds = youtubeService.getAllowedChannelIds();
    const filtered = allChs.filter((c) => allowedIds.includes(c.id));
    setChannels(filtered.length > 0 ? filtered : allChs.slice(0, 8));
  }, []);

  // Lọc playlist theo danh mục & tìm kiếm
  const displayedPlaylists = useMemo(() => {
    let list = [...playlists];
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
      );
    }
    return list;
  }, [playlists, selectedCategory, searchQuery]);

  // Lọc video theo danh mục & tìm kiếm
  const displayedVideos = useMemo(() => {
    let list = [...GREEN_CURATED_VIDEOS];

    if (selectedCategory === 'music') {
      list = list.filter((v) => v.category === 'music');
    } else if (selectedCategory === 'nature') {
      list = list.filter((v) => v.id === 'gv_2' || v.category === 'cartoon');
    } else if (selectedCategory === 'science') {
      list = list.filter((v) => v.id === 'gv_3' || v.category === 'english');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.channelName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  // Lọc kênh theo tìm kiếm
  const displayedChannels = useMemo(() => {
    if (!searchQuery.trim()) return channels;
    const q = searchQuery.toLowerCase().trim();
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [channels, searchQuery]);

  // Mở video đơn lẻ để xem
  const handlePlayVideo = useCallback(
    (video: YouTubeVideo, playlistContext?: GreenPlaylist) => {
      if (isTimeLimitReached) {
        Alert.alert(
          'Đã hết giờ xem hôm nay 😴',
          `Bé đã xem đủ ${limitMinutes} phút rồi. Bé hãy nghỉ ngơi và quay lại vào ngày mai nhé!`
        );
        return;
      }
      setActiveVideo(video);
      setActivePlayingPlaylist(playlistContext || null);
      setIsPlaying(true);
      setIsLiked(false);
      setShowPlayerModal(true);
    },
    [isTimeLimitReached, limitMinutes]
  );

  // Mở toàn bộ playlist (phát từ bài đầu tiên)
  const handlePlayEntirePlaylist = useCallback(
    (playlist: GreenPlaylist) => {
      if (!playlist.videos || playlist.videos.length === 0) {
        Alert.alert('Thông báo', 'Danh sách phát này hiện chưa có video!');
        return;
      }
      handlePlayVideo(playlist.videos[0], playlist);
    },
    [handlePlayVideo]
  );

  // Chuyển bài kế tiếp trong playlist
  const handleNextVideoInPlaylist = () => {
    if (!activePlayingPlaylist || !activeVideo) return;
    const currentIndex = activePlayingPlaylist.videos.findIndex(
      (v) => v.id === activeVideo.id
    );
    if (currentIndex >= 0 && currentIndex < activePlayingPlaylist.videos.length - 1) {
      handlePlayVideo(activePlayingPlaylist.videos[currentIndex + 1], activePlayingPlaylist);
    } else {
      Alert.alert('Hoàn thành', 'Bé đã xem hết danh sách phát này rồi!');
    }
  };

  // Quay lại bài trước trong playlist
  const handlePrevVideoInPlaylist = () => {
    if (!activePlayingPlaylist || !activeVideo) return;
    const currentIndex = activePlayingPlaylist.videos.findIndex(
      (v) => v.id === activeVideo.id
    );
    if (currentIndex > 0) {
      handlePlayVideo(activePlayingPlaylist.videos[currentIndex - 1], activePlayingPlaylist);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#065F46" />

      {/* 1. HEADER XANH LÁ CÂY NỔI BẬT */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.greenLogoBadge}>
            <Text style={styles.greenPlayIcon}>▶</Text>
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>Green Tube</Text>
              <Text style={styles.leafEmoji}>🌱</Text>
            </View>
            <Text style={styles.headerSubtitle}>Kênh Video Xanh Cho Bé</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Badge thời lượng xem */}
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>
              ⏱️ {watchedMinutes}/{limitMinutes}p
            </Text>
          </View>

          {/* Nút đóng / Trở về */}
          <TouchableOpacity
            style={styles.closeHeaderBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeHeaderBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. THANH DANH MỤC (PILL FILTERS) */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {GREEN_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. NỘI DUNG CHÍNH THEO TAB */}
      <View style={styles.body}>
        {/* THANH TÌM KIẾM (KHI Ở TAB TÌM KIẾM HOẶC TÌM NHANH) */}
        {activeTab === 'search' && (
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm video, bài hát hoặc playlist..."
              placeholderTextColor="#6EE7B7"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchBtn}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* TAB 1: KHÁM PHÁ (HOME) HOẶC TAB 2: VIDEO */}
        {(activeTab === 'home' || activeTab === 'videos') && (
          <FlatList
            data={displayedVideos}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.videoListContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              activeTab === 'home' ? (
                <>
                  {/* Hero Banner */}
                  <View style={styles.heroBanner}>
                    <View style={styles.heroBadge}>
                      <Text style={styles.heroBadgeText}>🌟 Video Nổi Bật Tuần Này</Text>
                    </View>
                    <Text style={styles.heroTitle}>
                      Khám Phá Thế Giới Xanh Cùng Green Kids Tube!
                    </Text>
                    <Text style={styles.heroSubtitle}>
                      Tuyển tập video vui học, khoa học bổ ích và âm nhạc thiếu nhi an toàn.
                    </Text>
                    {displayedVideos.length > 0 && (
                      <TouchableOpacity
                        style={styles.heroPlayButton}
                        activeOpacity={0.85}
                        onPress={() => handlePlayVideo(displayedVideos[0])}
                      >
                        <Text style={styles.heroPlayIcon}>▶</Text>
                        <Text style={styles.heroPlayText}>Xem Ngay Bây Giờ</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Section: Playlist Nổi Bật Trên Trang Chủ */}
                  <View style={styles.homeSectionHeader}>
                    <Text style={styles.homeSectionTitle}>📑 Danh Sách Phát Chọn Lọc</Text>
                    <TouchableOpacity
                      onPress={() => setActiveTab('playlists')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.seeAllPlaylistsText}>Xem tất cả ›</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalPlaylistsScroll}
                  >
                    {playlists.slice(0, 3).map((pl) => (
                      <TouchableOpacity
                        key={pl.id}
                        style={styles.miniPlaylistCard}
                        onPress={() => setSelectedPlaylistForDetail(pl)}
                        activeOpacity={0.85}
                      >
                        <Image source={{ uri: pl.coverImage }} style={styles.miniPlaylistImage} />
                        <View style={styles.miniPlaylistBadge}>
                          <Text style={styles.miniPlaylistBadgeText}>📑 {pl.totalVideos} video</Text>
                        </View>
                        <View style={styles.miniPlaylistInfo}>
                          <Text style={styles.miniPlaylistTitle} numberOfLines={1}>
                            {pl.title}
                          </Text>
                          <Text style={styles.miniPlaylistAuthor} numberOfLines={1}>
                            {pl.author}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={styles.homeSectionHeader}>
                    <Text style={styles.homeSectionTitle}>🎬 Video Mới Nhất Cho Bé</Text>
                  </View>
                </>
              ) : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.videoCard}
                activeOpacity={0.85}
                onPress={() => handlePlayVideo(item)}
              >
                <View style={styles.thumbnailWrapper}>
                  <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                  <View style={styles.cardPlayCircle}>
                    <Text style={styles.cardPlayTriangle}>▶</Text>
                  </View>
                </View>

                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.channelRow}>
                    <View style={styles.greenVerifiedBadge}>
                      <Text style={styles.greenVerifiedText}>✓</Text>
                    </View>
                    <Text style={styles.videoChannelName} numberOfLines={1}>
                      {item.channelName}
                    </Text>
                    <Text style={styles.videoDot}>•</Text>
                    <Text style={styles.videoViews}>{item.views}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🍃</Text>
                <Text style={styles.emptyTitle}>Không tìm thấy video nào</Text>
                <Text style={styles.emptySub}>
                  Bé hãy thử tìm kiếm với từ khóa khác nhé!
                </Text>
              </View>
            }
          />
        )}

        {/* TAB 3: DANH SÁCH PHÁT (PLAYLISTS) */}
        {activeTab === 'playlists' && (
          <FlatList
            data={displayedPlaylists}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.playlistListContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.playlistHeaderNotice}>
                <Text style={styles.playlistNoticeEmoji}>📑</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.playlistNoticeTitle}>
                    Tuyển Tập Danh Sách Phát Xanh
                  </Text>
                  <Text style={styles.playlistNoticeSub}>
                    Các video được xếp thành từng bộ chủ đề giúp bé xem liên tục thật dễ dàng!
                  </Text>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.modernPlaylistCard}>
                {/* Visual Stack Layers tạo hiệu ứng chồng đĩa playlist */}
                <View style={styles.playlistStackBackLayer} />
                <View style={styles.playlistStackMidLayer} />

                <TouchableOpacity
                  style={styles.playlistMainCard}
                  activeOpacity={0.88}
                  onPress={() => setSelectedPlaylistForDetail(item)}
                >
                  <View style={styles.playlistCoverWrapper}>
                    <Image source={{ uri: item.coverImage }} style={styles.playlistCover} />
                    <View style={styles.playlistTotalBadge}>
                      <Text style={styles.playlistTotalBadgeText}>
                        📑 {item.totalVideos} Video
                      </Text>
                    </View>
                    <View style={styles.playlistPlayOverlay}>
                      <Text style={styles.playlistPlayOverlayIcon}>▶</Text>
                    </View>
                  </View>

                  <View style={styles.playlistInfoContainer}>
                    <View style={styles.playlistHeaderLine}>
                      <Text style={styles.playlistEmojiBadge}>{item.emoji}</Text>
                      <Text style={styles.playlistTitleText} numberOfLines={1}>
                        {item.title}
                      </Text>
                    </View>

                    <Text style={styles.playlistSubtitleText} numberOfLines={2}>
                      {item.subtitle}
                    </Text>

                    <View style={styles.playlistFooterRow}>
                      <View style={styles.playlistAuthorRow}>
                        <View style={styles.greenVerifiedBadge}>
                          <Text style={styles.greenVerifiedText}>✓</Text>
                        </View>
                        <Text style={styles.playlistAuthorText} numberOfLines={1}>
                          {item.author}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.playPlaylistButton}
                        activeOpacity={0.85}
                        onPress={() => handlePlayEntirePlaylist(item)}
                      >
                        <Text style={styles.playPlaylistBtnIcon}>▶</Text>
                        <Text style={styles.playPlaylistBtnText}>Phát Ngay</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>📑</Text>
                <Text style={styles.emptyTitle}>Chưa có playlist phù hợp</Text>
                <Text style={styles.emptySub}>
                  Bé hãy chọn danh mục khác ở trên để xem thêm nhé!
                </Text>
              </View>
            }
          />
        )}

        {/* TAB 4: DANH SÁCH KÊNH XANH */}
        {activeTab === 'channels' && (
          <FlatList
            data={displayedChannels}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.channelListContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.channelCard}
                activeOpacity={0.8}
                onPress={() => {
                  const firstVideo = GREEN_CURATED_VIDEOS.find(
                    (v) => v.channelId === item.id
                  );
                  if (firstVideo) {
                    handlePlayVideo(firstVideo);
                  } else if (GREEN_CURATED_VIDEOS.length > 0) {
                    handlePlayVideo({
                      ...GREEN_CURATED_VIDEOS[0],
                      channelName: item.name,
                      channelAvatar: item.avatar,
                    });
                  }
                }}
              >
                {item.avatar ? (
                  <Image source={{ uri: item.avatar }} style={styles.channelAvatar} />
                ) : (
                  <View style={[styles.channelAvatar, styles.channelAvatarPlaceholder]}>
                    <Text style={styles.channelEmojiText}>{item.emoji || '🌱'}</Text>
                  </View>
                )}

                <View style={styles.channelDetails}>
                  <View style={styles.channelTitleRow}>
                    <Text style={styles.channelNameText} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.greenVerifiedBadge}>
                      <Text style={styles.greenVerifiedText}>✓</Text>
                    </View>
                  </View>
                  <Text style={styles.channelSubscribers}>
                    {item.subscribers || 'Hơn 1M người đăng ký'}
                  </Text>
                  <Text style={styles.channelDesc} numberOfLines={1}>
                    {item.description || 'Kênh video giáo dục an toàn cho bé.'}
                  </Text>
                </View>

                <View style={styles.channelActionCircle}>
                  <Text style={styles.channelActionArrow}>›</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {/* TAB 5: TÌM KIẾM TỔNG HỢP */}
        {activeTab === 'search' && (
          <FlatList
            data={displayedVideos}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.videoListContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.videoCard}
                activeOpacity={0.85}
                onPress={() => handlePlayVideo(item)}
              >
                <View style={styles.thumbnailWrapper}>
                  <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{item.duration}</Text>
                  </View>
                  <View style={styles.cardPlayCircle}>
                    <Text style={styles.cardPlayTriangle}>▶</Text>
                  </View>
                </View>

                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.channelRow}>
                    <View style={styles.greenVerifiedBadge}>
                      <Text style={styles.greenVerifiedText}>✓</Text>
                    </View>
                    <Text style={styles.videoChannelName} numberOfLines={1}>
                      {item.channelName}
                    </Text>
                    <Text style={styles.videoDot}>•</Text>
                    <Text style={styles.videoViews}>{item.views}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* 4. MODAL CHI TIẾT DANH SÁCH PHÁT (PLAYLIST DETAIL MODAL) */}
      <Modal
        visible={!!selectedPlaylistForDetail}
        animationType="slide"
        onRequestClose={() => setSelectedPlaylistForDetail(null)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#064E3B" />

          {selectedPlaylistForDetail && (
            <>
              {/* Header chi tiết Playlist */}
              <View style={styles.playerHeader}>
                <TouchableOpacity
                  style={styles.backPlayerBtn}
                  onPress={() => setSelectedPlaylistForDetail(null)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.backPlayerBtnText}>‹ Danh Sách Playlist</Text>
                </TouchableOpacity>

                <Text style={styles.playerLogoText}>Chi Tiết Playlist</Text>

                <TouchableOpacity
                  style={styles.closePlayerCircle}
                  onPress={() => setSelectedPlaylistForDetail(null)}
                >
                  <Text style={styles.closePlayerText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.playlistDetailScroll}
                contentContainerStyle={styles.playlistDetailContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Banner Playlist lớn */}
                <View style={styles.playlistDetailBanner}>
                  <Image
                    source={{ uri: selectedPlaylistForDetail.coverImage }}
                    style={styles.playlistDetailCover}
                  />
                  <View style={styles.playlistDetailBannerInfo}>
                    <Text style={styles.playlistDetailTitle}>
                      {selectedPlaylistForDetail.title}
                    </Text>
                    <Text style={styles.playlistDetailSubtitle}>
                      {selectedPlaylistForDetail.subtitle}
                    </Text>
                    <Text style={styles.playlistDetailAuthor}>
                      Tạo bởi: {selectedPlaylistForDetail.author} • {selectedPlaylistForDetail.totalVideos} Video
                    </Text>

                    {/* Nút hành động chính */}
                    <View style={styles.playlistDetailActionRow}>
                      <TouchableOpacity
                        style={styles.playlistPlayAllButton}
                        activeOpacity={0.85}
                        onPress={() => {
                          const pl = selectedPlaylistForDetail;
                          setSelectedPlaylistForDetail(null);
                          handlePlayEntirePlaylist(pl);
                        }}
                      >
                        <Text style={styles.playlistPlayAllIcon}>▶</Text>
                        <Text style={styles.playlistPlayAllText}>Phát Tất Cả</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.playlistShuffleButton}
                        activeOpacity={0.85}
                        onPress={() => {
                          const pl = selectedPlaylistForDetail;
                          setSelectedPlaylistForDetail(null);
                          if (pl.videos && pl.videos.length > 0) {
                            const randomIndex = Math.floor(Math.random() * pl.videos.length);
                            handlePlayVideo(pl.videos[randomIndex], pl);
                          }
                        }}
                      >
                        <Text style={styles.playlistShuffleIcon}>🔀</Text>
                        <Text style={styles.playlistShuffleText}>Trộn Bài</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Danh sách các video trong playlist */}
                <Text style={styles.playlistVideosHeader}>
                  Danh Sách Bài Hát / Video ({selectedPlaylistForDetail.videos.length})
                </Text>

                {selectedPlaylistForDetail.videos.map((vid, index) => (
                  <TouchableOpacity
                    key={vid.id}
                    style={styles.playlistVideoItem}
                    activeOpacity={0.8}
                    onPress={() => {
                      const pl = selectedPlaylistForDetail;
                      setSelectedPlaylistForDetail(null);
                      handlePlayVideo(vid, pl);
                    }}
                  >
                    <View style={styles.playlistIndexCircle}>
                      <Text style={styles.playlistIndexText}>#{index + 1}</Text>
                    </View>

                    <Image source={{ uri: vid.thumbnail }} style={styles.playlistItemThumbnail} />

                    <View style={styles.playlistItemInfo}>
                      <Text style={styles.playlistItemTitle} numberOfLines={2}>
                        {vid.title}
                      </Text>
                      <Text style={styles.playlistItemChannel} numberOfLines={1}>
                        {vid.channelName} • {vid.duration}
                      </Text>
                    </View>

                    <View style={styles.playlistItemPlayBtn}>
                      <Text style={styles.playlistItemPlayIcon}>▶</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
        </SafeAreaView>
      </Modal>

      {/* 5. MODAL TRÌNH PHÁT VIDEO CHỦ ĐỀ XANH LÁ CÂY (KÈM NGỮ CẢNH PLAYLIST) */}
      <Modal
        visible={showPlayerModal}
        animationType="slide"
        onRequestClose={() => setShowPlayerModal(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#064E3B" />

          {/* Header trình phát */}
          <View style={styles.playerHeader}>
            <TouchableOpacity
              style={styles.backPlayerBtn}
              onPress={() => setShowPlayerModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.backPlayerBtnText}>‹ Quay lại</Text>
            </TouchableOpacity>

            <View style={styles.playerHeaderLogo}>
              <View style={styles.playerGreenLogo}>
                <Text style={styles.playerGreenPlay}>▶</Text>
              </View>
              <Text style={styles.playerLogoText}>Green Tube Player</Text>
            </View>

            <TouchableOpacity
              style={styles.closePlayerCircle}
              onPress={() => setShowPlayerModal(false)}
            >
              <Text style={styles.closePlayerText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Banner ngữ cảnh nếu đang phát từ Playlist */}
          {activePlayingPlaylist && (
            <View style={styles.playingPlaylistContextBar}>
              <View style={{ flex: 1 }}>
                <Text style={styles.playingPlaylistLabel} numberOfLines={1}>
                  📑 Đang phát từ Playlist: {activePlayingPlaylist.title}
                </Text>
                <Text style={styles.playingPlaylistSub}>
                  {activePlayingPlaylist.videos.findIndex((v) => v.id === activeVideo?.id) + 1} /{' '}
                  {activePlayingPlaylist.videos.length} video
                </Text>
              </View>

              <View style={styles.playlistControlButtons}>
                <TouchableOpacity
                  style={styles.prevNextBtn}
                  onPress={handlePrevVideoInPlaylist}
                  activeOpacity={0.7}
                >
                  <Text style={styles.prevNextBtnText}>⏮</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.prevNextBtn}
                  onPress={handleNextVideoInPlaylist}
                  activeOpacity={0.7}
                >
                  <Text style={styles.prevNextBtnText}>⏭</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Khung phát YouTube */}
          {activeVideo && (
            <View style={[styles.playerContainer, { height: playerHeight }]}>
              <YoutubePlayer
                height={playerHeight}
                play={isPlaying}
                videoId={activeVideo.videoId}
                onChangeState={(event: string) => {
                  if (event === 'ended') {
                    setIsPlaying(false);
                    // Tự động chuyển bài kế tiếp nếu đang phát trong playlist
                    if (activePlayingPlaylist) {
                      handleNextVideoInPlaylist();
                    }
                  }
                }}
              />
            </View>
          )}

          {/* Thông tin video & nút tương tác */}
          <ScrollView
            style={styles.playerBody}
            contentContainerStyle={styles.playerBodyContent}
            showsVerticalScrollIndicator={false}
          >
            {activeVideo && (
              <>
                <Text style={styles.playerVideoTitle}>{activeVideo.title}</Text>

                <View style={styles.playerMetaRow}>
                  <Text style={styles.playerMetaText}>
                    {activeVideo.views} • {activeVideo.publishedAt}
                  </Text>
                  <View style={styles.safeTag}>
                    <Text style={styles.safeTagText}>🌱 An toàn cho bé</Text>
                  </View>
                </View>

                {/* Hàng kênh & nút đăng ký */}
                <View style={styles.channelBar}>
                  <View style={styles.channelBarLeft}>
                    <View style={styles.channelBarAvatar}>
                      <Text style={styles.channelBarEmoji}>
                        {activeVideo.channelEmoji || '🌿'}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.channelBarName}>
                        {activeVideo.channelName}
                      </Text>
                      <Text style={styles.channelBarSubCount}>
                        Kênh chính thức đã kiểm duyệt
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.subscribeBtn,
                      isSubscribed && styles.subscribedBtnActive,
                    ]}
                    onPress={() => setIsSubscribed(!isSubscribed)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.subscribeBtnText,
                        isSubscribed && styles.subscribedBtnTextActive,
                      ]}
                    >
                      {isSubscribed ? '✓ Đã Đăng Ký' : 'Đăng Ký 🔔'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Nút Thích & Chia Sẻ */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, isLiked && styles.likedBtn]}
                    onPress={() => setIsLiked(!isLiked)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionIcon}>{isLiked ? '💚' : '🤍'}</Text>
                    <Text style={[styles.actionText, isLiked && styles.likedText]}>
                      {isLiked ? 'Đã Thích' : 'Yêu Thích'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      Alert.alert(
                        '🌿 Thông Báo',
                        'Video này hoàn toàn an toàn và đã được phê duyệt trong danh sách Green Tube!'
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionIcon}>🛡️</Text>
                    <Text style={styles.actionText}>Nội Dung Xanh</Text>
                  </TouchableOpacity>
                </View>

                {/* Danh sách video tiếp theo trong playlist nếu có */}
                {activePlayingPlaylist && (
                  <>
                    <Text style={styles.relatedTitle}>
                      📑 Các Video Trong Playlist Này ({activePlayingPlaylist.videos.length})
                    </Text>
                    {activePlayingPlaylist.videos.map((pVid, pIdx) => {
                      const isCur = pVid.id === activeVideo.id;
                      return (
                        <TouchableOpacity
                          key={pVid.id}
                          style={[styles.relatedCard, isCur && styles.currentPlayingCard]}
                          onPress={() => handlePlayVideo(pVid, activePlayingPlaylist)}
                          activeOpacity={0.8}
                        >
                          <Image
                            source={{ uri: pVid.thumbnail }}
                            style={styles.relatedThumbnail}
                          />
                          <View style={styles.relatedInfo}>
                            <Text style={[styles.relatedVideoTitle, isCur && styles.currentPlayingTitle]} numberOfLines={2}>
                              #{pIdx + 1}. {pVid.title}
                            </Text>
                            <Text style={styles.relatedChannelName} numberOfLines={1}>
                              {isCur ? '▶ Đang phát' : pVid.channelName}
                            </Text>
                            <Text style={styles.relatedViews}>
                              {pVid.duration} • {pVid.views}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                )}

                {/* Danh sách video liên quan */}
                <Text style={styles.relatedTitle}>🎬 Video Gợi Ý Khác</Text>
                {GREEN_CURATED_VIDEOS.filter((v) => v.id !== activeVideo.id).map(
                  (relVideo) => (
                    <TouchableOpacity
                      key={relVideo.id}
                      style={styles.relatedCard}
                      onPress={() => handlePlayVideo(relVideo)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: relVideo.thumbnail }}
                        style={styles.relatedThumbnail}
                      />
                      <View style={styles.relatedInfo}>
                        <Text style={styles.relatedVideoTitle} numberOfLines={2}>
                          {relVideo.title}
                        </Text>
                        <Text style={styles.relatedChannelName} numberOfLines={1}>
                          {relVideo.channelName}
                        </Text>
                        <Text style={styles.relatedViews}>
                          {relVideo.duration} • {relVideo.views}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                )}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 6. BOTTOM TAB BAR XANH LÁ CÂY (5 TABS) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === 'home' && styles.navIconActive,
            ]}
          >
            🌿
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'home' && styles.navLabelActive,
            ]}
          >
            Khám phá
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('videos')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === 'videos' && styles.navIconActive,
            ]}
          >
            🎬
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'videos' && styles.navLabelActive,
            ]}
          >
            Video
          </Text>
        </TouchableOpacity>

        {/* TAB PLAYLIST MỚI */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('playlists')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === 'playlists' && styles.navIconActive,
            ]}
          >
            📑
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'playlists' && styles.navLabelActive,
            ]}
          >
            Playlist
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('channels')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === 'channels' && styles.navIconActive,
            ]}
          >
            📺
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'channels' && styles.navLabelActive,
            ]}
          >
            Kênh xanh
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('search')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === 'search' && styles.navIconActive,
            ]}
          >
            🔍
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === 'search' && styles.navLabelActive,
            ]}
          >
            Tìm kiếm
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#064E3B',
  },
  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#065F46',
    borderBottomWidth: 1,
    borderBottomColor: '#047857',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenLogoBadge: {
    width: 44,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  greenPlayIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  leafEmoji: {
    fontSize: 16,
    marginLeft: 4,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#A7F3D0',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerBadge: {
    backgroundColor: '#047857',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  timerText: {
    color: '#D1FAE5',
    fontSize: 11,
    fontWeight: '700',
  },
  closeHeaderBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // CATEGORIES
  categoriesContainer: {
    backgroundColor: '#064E3B',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#065F46',
  },
  categoriesList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#065F46',
    borderWidth: 1,
    borderColor: '#047857',
    marginRight: 6,
  },
  categoryPillActive: {
    backgroundColor: '#10B981',
    borderColor: '#34D399',
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A7F3D0',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // BODY
  body: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
    padding: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // HOME HEADER / SECTIONS
  homeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  homeSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#064E3B',
  },
  seeAllPlaylistsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  horizontalPlaylistsScroll: {
    paddingBottom: 6,
    gap: 12,
  },
  miniPlaylistCard: {
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    marginRight: 10,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  miniPlaylistImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  miniPlaylistBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(6, 78, 59, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  miniPlaylistBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  miniPlaylistInfo: {
    padding: 8,
  },
  miniPlaylistTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064E3B',
    marginBottom: 2,
  },
  miniPlaylistAuthor: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },

  // HERO BANNER
  heroBanner: {
    backgroundColor: '#065F46',
    borderRadius: 20,
    padding: 18,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 22,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#D1FAE5',
    lineHeight: 18,
    marginBottom: 14,
  },
  heroPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  heroPlayIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  heroPlayText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // VIDEO LIST
  videoListContent: {
    padding: 16,
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    shadowColor: '#065F46',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnailWrapper: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: '#064E3B',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(6, 78, 59, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  cardPlayCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -22,
    marginLeft: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPlayTriangle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  videoInfo: {
    padding: 14,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#064E3B',
    lineHeight: 20,
    marginBottom: 8,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenVerifiedBadge: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  greenVerifiedText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  videoChannelName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
    maxWidth: '50%',
  },
  videoDot: {
    color: '#9CA3AF',
    marginHorizontal: 6,
    fontSize: 12,
  },
  videoViews: {
    fontSize: 11,
    color: '#6B7280',
  },

  // PLAYLIST TAB LIST
  playlistListContent: {
    padding: 16,
  },
  playlistHeaderNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 16,
  },
  playlistNoticeEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  playlistNoticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#064E3B',
    marginBottom: 2,
  },
  playlistNoticeSub: {
    fontSize: 12,
    color: '#059669',
    lineHeight: 16,
  },
  modernPlaylistCard: {
    marginBottom: 20,
    position: 'relative',
  },
  playlistStackBackLayer: {
    position: 'absolute',
    top: -8,
    left: 12,
    right: 12,
    height: 20,
    backgroundColor: '#A7F3D0',
    borderRadius: 18,
    opacity: 0.7,
  },
  playlistStackMidLayer: {
    position: 'absolute',
    top: -4,
    left: 6,
    right: 6,
    height: 20,
    backgroundColor: '#6EE7B7',
    borderRadius: 18,
    opacity: 0.85,
  },
  playlistMainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#10B981',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  playlistCoverWrapper: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#064E3B',
  },
  playlistCover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playlistTotalBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(6, 78, 59, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  playlistTotalBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  playlistPlayOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  playlistPlayOverlayIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  playlistInfoContainer: {
    padding: 14,
  },
  playlistHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playlistEmojiBadge: {
    fontSize: 18,
    marginRight: 6,
  },
  playlistTitleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#064E3B',
  },
  playlistSubtitleText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 12,
  },
  playlistFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ECFDF5',
  },
  playlistAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playlistAuthorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  playPlaylistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  playPlaylistBtnIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  playPlaylistBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // PLAYLIST DETAIL MODAL
  playlistDetailScroll: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  playlistDetailContent: {
    padding: 16,
  },
  playlistDetailBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#10B981',
    marginBottom: 20,
  },
  playlistDetailCover: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  playlistDetailBannerInfo: {
    padding: 16,
  },
  playlistDetailTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: 6,
  },
  playlistDetailSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
    marginBottom: 8,
  },
  playlistDetailAuthor: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 14,
  },
  playlistDetailActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  playlistPlayAllButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 11,
    borderRadius: 14,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  playlistPlayAllIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  playlistPlayAllText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  playlistShuffleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#10B981',
    paddingVertical: 11,
    borderRadius: 14,
  },
  playlistShuffleIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  playlistShuffleText: {
    color: '#064E3B',
    fontSize: 13,
    fontWeight: '700',
  },
  playlistVideosHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: 12,
  },
  playlistVideoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  playlistIndexCircle: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistIndexText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  playlistItemThumbnail: {
    width: 80,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#064E3B',
  },
  playlistItemInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  playlistItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064E3B',
    lineHeight: 16,
    marginBottom: 4,
  },
  playlistItemChannel: {
    fontSize: 11,
    color: '#6B7280',
  },
  playlistItemPlayBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  playlistItemPlayIcon: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },

  // CHANNEL LIST
  channelListContent: {
    padding: 16,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  channelAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  channelAvatarPlaceholder: {
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelEmojiText: {
    fontSize: 24,
  },
  channelDetails: {
    flex: 1,
    marginLeft: 12,
  },
  channelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  channelNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#064E3B',
    maxWidth: '85%',
  },
  channelSubscribers: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 2,
  },
  channelDesc: {
    fontSize: 11,
    color: '#6B7280',
  },
  channelActionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  channelActionArrow: {
    color: '#059669',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // EMPTY CONTAINER
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#064E3B',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#059669',
    textAlign: 'center',
  },

  // MODAL PLAYER
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#064E3B',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#065F46',
    borderBottomWidth: 1,
    borderBottomColor: '#047857',
  },
  backPlayerBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backPlayerBtnText: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: '700',
  },
  playerHeaderLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerGreenLogo: {
    width: 24,
    height: 18,
    borderRadius: 5,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  playerGreenPlay: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  playerLogoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  closePlayerCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePlayerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playingPlaylistContextBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#047857',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#10B981',
  },
  playingPlaylistLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  playingPlaylistSub: {
    fontSize: 11,
    color: '#A7F3D0',
    fontWeight: '500',
  },
  playlistControlButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  prevNextBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevNextBtnText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  playerContainer: {
    width: '100%',
    backgroundColor: '#000000',
  },
  playerBody: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  playerBodyContent: {
    padding: 16,
  },
  playerVideoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#064E3B',
    lineHeight: 22,
    marginBottom: 8,
  },
  playerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  playerMetaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  safeTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  safeTagText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '700',
  },
  channelBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    marginBottom: 16,
  },
  channelBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  channelBarAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
    marginRight: 10,
  },
  channelBarEmoji: {
    fontSize: 20,
  },
  channelBarName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#064E3B',
  },
  channelBarSubCount: {
    fontSize: 11,
    color: '#059669',
  },
  subscribeBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  subscribedBtnActive: {
    backgroundColor: '#047857',
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  subscribedBtnTextActive: {
    color: '#D1FAE5',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  likedBtn: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  actionIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064E3B',
  },
  likedText: {
    color: '#047857',
  },
  relatedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: 12,
    marginTop: 6,
  },
  relatedCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  currentPlayingCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1.5,
  },
  currentPlayingTitle: {
    color: '#059669',
    fontWeight: '800',
  },
  relatedThumbnail: {
    width: 100,
    height: 65,
    borderRadius: 10,
    backgroundColor: '#064E3B',
  },
  relatedInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  relatedVideoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#064E3B',
    lineHeight: 16,
    marginBottom: 4,
  },
  relatedChannelName: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 2,
  },
  relatedViews: {
    fontSize: 10,
    color: '#6B7280',
  },

  // BOTTOM TAB BAR
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#065F46',
    borderTopWidth: 1,
    borderTopColor: '#047857',
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 17,
    color: '#A7F3D0',
    marginBottom: 2,
  },
  navIconActive: {
    color: '#FFFFFF',
    transform: [{ scale: 1.15 }],
  },
  navLabel: {
    fontSize: 9.5,
    color: '#A7F3D0',
    fontWeight: '600',
  },
  navLabelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
