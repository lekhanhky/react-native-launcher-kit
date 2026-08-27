import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import {
  YouTubeVideo,
  YouTubeChannel,
  YOUTUBE_CATEGORIES,
  youtubeService,
} from '../services/youtubeService';
import { ThemeConfig } from '../services/themes';

interface KidsYouTubeScreenProps {
  theme: ThemeConfig;
  onClose: () => void;
}

export const KidsYouTubeScreen: React.FC<KidsYouTubeScreenProps> = ({
  theme,
  onClose,
}) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const playerHeight = isLandscape
    ? Math.round((width * 0.6 * 9) / 16)
    : Math.round((width * 9) / 16);

  const [allVideos, setAllVideos] = useState<YouTubeVideo[]>([]);
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [likedVideos, setLikedVideos] = useState<string[]>([]);

  const [watchedMinutes, setWatchedMinutes] = useState<number>(() =>
    youtubeService.getTodayWatchedMinutes()
  );
  const [limitMinutes, setLimitMinutes] = useState<number>(() =>
    youtubeService.getDailyLimitMinutes()
  );
  const [isTimeLimitReached, setIsTimeLimitReached] = useState<boolean>(false);

  // 1. Tải danh sách video và kênh
  useEffect(() => {
    const vids = youtubeService.getVideos(true);
    const chs = youtubeService.getAllChannels();
    const allowedChIds = youtubeService.getAllowedChannelIds();
    const visibleChs = chs.filter((c) => allowedChIds.includes(c.id));

    setAllVideos(vids);
    setChannels(visibleChs);
    if (vids.length > 0) {
      setActiveVideo(vids[0]);
    }
  }, []);

  // 2. Đếm thời lượng xem video
  useEffect(() => {
    const initialWatched = youtubeService.getTodayWatchedMinutes();
    const limit = youtubeService.getDailyLimitMinutes();
    setWatchedMinutes(initialWatched);
    setLimitMinutes(limit);

    if (initialWatched >= limit) {
      setIsTimeLimitReached(true);
      setIsPlaying(false);
    }

    const interval = setInterval(() => {
      if (isPlaying && !isTimeLimitReached) {
        const updatedMins = youtubeService.addWatchedSeconds(5);
        setWatchedMinutes(updatedMins);
        if (updatedMins >= limit) {
          setIsTimeLimitReached(true);
          setIsPlaying(false);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, isTimeLimitReached]);

  // 3. Lọc danh sách video
  const filteredVideos = allVideos.filter((v) => {
    const matchChannel =
      selectedChannelId === 'all' || v.channelId === selectedChannelId;
    const matchCategory =
      selectedCategory === 'all' || v.category === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channelName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchChannel && matchCategory && matchSearch;
  });

  // 4. Chọn phát video
  const handleSelectVideo = (video: YouTubeVideo) => {
    if (isTimeLimitReached) {
      Alert.alert(
        'Đã hết giờ xem hôm nay',
        'Bé đã xem đủ thời lượng cho phép rồi! Hãy nghỉ ngơi hoặc chọn app khác nhé.'
      );
      return;
    }
    setActiveVideo(video);
    setIsPlaying(true);
  };

  // 5. Chuyển video Liền trước / Liền sau
  const handleNavigateVideo = useCallback(
    (direction: 'prev' | 'next') => {
      if (!activeVideo) return;
      if (isTimeLimitReached) {
        Alert.alert('Đã hết giờ xem', 'Bé hãy nghỉ ngơi nhé!');
        return;
      }
      const target = youtubeService.getAdjacentVideo(activeVideo.id, direction);
      if (target) {
        setActiveVideo(target);
        setIsPlaying(true);
      }
    },
    [activeVideo, isTimeLimitReached]
  );

  // 6. Xử lý trạng thái Player (Tự chuyển bài khi hết video)
  const onPlayerStateChange = useCallback(
    (state: string) => {
      if (state === 'ended') {
        handleNavigateVideo('next');
      } else if (state === 'paused') {
        setIsPlaying(false);
      } else if (state === 'playing') {
        setIsPlaying(true);
      }
    },
    [handleNavigateVideo]
  );

  // 7. Thả tim video
  const toggleLike = (videoId: string) => {
    if (likedVideos.includes(videoId)) {
      setLikedVideos(likedVideos.filter((id) => id !== videoId));
    } else {
      setLikedVideos([...likedVideos, videoId]);
    }
  };

  // Header Bar
  const renderTopBar = () => (
    <View style={styles.topBar}>
      <TouchableOpacity
        style={styles.backBtn}
        activeOpacity={0.8}
        onPress={onClose}
      >
        <Text style={styles.backBtnText}>← Launcher</Text>
      </TouchableOpacity>

      <View style={styles.logoBadge}>
        <View style={styles.playIconBox}>
          <Text style={styles.playIconText}>▶</Text>
        </View>
        <Text style={styles.logoTitle}>KidsTube</Text>
      </View>

      {/* Thanh tìm kiếm trực tiếp trên Header nếu là Landscape */}
      {isLandscape && (
        <View style={styles.headerSearchBox}>
          <TextInput
            style={styles.headerSearchInput}
            placeholder="🔍 Tìm video bé thích..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* ĐỒNG HỒ ĐẾM GIỜ */}
      <View
        style={[
          styles.timeBadge,
          {
            backgroundColor: isTimeLimitReached ? '#DC2626' : '#1E293B',
          },
        ]}
      >
        <Text style={styles.timeBadgeText}>
          ⏱️ {watchedMinutes}/{limitMinutes}p
        </Text>
      </View>
    </View>
  );

  // Player & Metadata Box
  const renderPlayerSection = () => {
    if (!activeVideo) return null;
    return (
      <View style={styles.playerWrapper}>
        <View style={[styles.playerContainer, { height: playerHeight }]}>
          {isTimeLimitReached ? (
            <View style={styles.limitReachedBox}>
              <Text style={styles.limitEmoji}>😴</Text>
              <Text style={styles.limitTitle}>Hết giờ xem video hôm nay!</Text>
              <Text style={styles.limitDesc}>
                Bé đã xem đủ {limitMinutes} phút. Bé hãy nghỉ ngơi nhé!
              </Text>
            </View>
          ) : (
            <YoutubePlayer
              key={activeVideo.videoId}
              height={playerHeight}
              play={isPlaying}
              videoId={activeVideo.videoId}
              onChangeState={onPlayerStateChange}
              webViewProps={{
                androidLayerType: 'hardware',
              }}
              initialPlayerParams={{
                preventFullScreen: false,
                controls: true,
                modestbranding: true,
                rel: false,
              }}
            />
          )}
        </View>

        {/* Thanh Điều Khiển */}
        <View style={styles.controlsBar}>
          <TouchableOpacity
            style={styles.navBtn}
            activeOpacity={0.7}
            onPress={() => handleNavigateVideo('prev')}
          >
            <Text style={styles.navBtnText}>⏮️ Bài trước</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, isPlaying ? styles.pauseBtn : styles.playBtn]}
            activeOpacity={0.7}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Text style={styles.navBtnText}>
              {isPlaying ? '⏸️ Tạm dừng' : '▶️ Phát tiếp'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navBtn,
              likedVideos.includes(activeVideo.id) && styles.likeBtnActive,
            ]}
            activeOpacity={0.7}
            onPress={() => toggleLike(activeVideo.id)}
          >
            <Text style={styles.navBtnText}>
              {likedVideos.includes(activeVideo.id) ? '💖 Đã thích' : '🤍 Thích'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, styles.nextBtn]}
            activeOpacity={0.7}
            onPress={() => handleNavigateVideo('next')}
          >
            <Text style={[styles.navBtnText, styles.nextBtnText]}>
              Bài tiếp ⏭️
            </Text>
          </TouchableOpacity>
        </View>

        {/* Thông tin Video */}
        <View style={styles.activeInfoCard}>
          <Text style={styles.activeTitle} numberOfLines={2}>
            {activeVideo.title}
          </Text>
          <View style={styles.activeChannelRow}>
            <View
              style={[
                styles.channelAvatarBadge,
                { backgroundColor: activeVideo.channelColor || '#0284C7' },
              ]}
            >
              <Text style={styles.channelAvatarEmoji}>
                {activeVideo.channelEmoji || '📺'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.channelVerifiedRow}>
                <Text style={styles.activeChannelName}>
                  {activeVideo.channelName}
                </Text>
                <Text style={styles.verifiedBadge}>✔️ Đã duyệt</Text>
              </View>
              <Text style={styles.activeStats}>
                {activeVideo.views} • {activeVideo.publishedAt}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Filter Carousel (Kênh & Thể loại)
  const renderFilters = () => (
    <View style={styles.filtersWrapper}>
      {/* Search Bar nếu Portrait */}
      {!isLandscape && (
        <View style={styles.portraitSearchContainer}>
          <TextInput
            style={styles.portraitSearchInput}
            placeholder="🔍 Tìm video hoặc kênh bé yêu thích..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* Kênh Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.channelScroll}
      >
        <TouchableOpacity
          style={[
            styles.channelChip,
            selectedChannelId === 'all' && styles.channelChipActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setSelectedChannelId('all')}
        >
          <Text style={styles.channelChipEmoji}>🌟</Text>
          <Text
            style={[
              styles.channelChipText,
              selectedChannelId === 'all' && styles.channelChipTextActive,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>

        {channels.map((ch) => {
          const isSelected = ch.id === selectedChannelId;
          return (
            <TouchableOpacity
              key={ch.id}
              style={[
                styles.channelChip,
                isSelected && styles.channelChipActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedChannelId(ch.id)}
            >
              <Text style={styles.channelChipEmoji}>{ch.emoji}</Text>
              <Text
                style={[
                  styles.channelChipText,
                  isSelected && styles.channelChipTextActive,
                ]}
                numberOfLines={1}
              >
                {ch.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {YOUTUBE_CATEGORIES.map((cat) => {
          const isSelected = cat.id === selectedCategory;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                isSelected && styles.categoryPillActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  isSelected && styles.categoryPillTextActive,
                ]}
              >
                {cat.emoji} {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // Up Next / Video Feed List
  const renderVideoFeed = () => (
    <FlatList
      data={filteredVideos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.feedList}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <Text style={styles.feedHeaderTitle}>
          {activeVideo ? '▶️ Video đề xuất tiếp theo:' : '🌟 Khám phá video mới:'}
        </Text>
      }
      renderItem={({ item }) => {
        const isPlayingCard = activeVideo?.id === item.id;
        return (
          <TouchableOpacity
            style={[styles.feedCard, isPlayingCard && styles.feedCardPlaying]}
            activeOpacity={0.8}
            onPress={() => handleSelectVideo(item)}
          >
            {/* Thumbnail */}
            <View style={styles.feedThumbContainer}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.feedThumb}
                resizeMode="cover"
              />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
              {isPlayingCard && (
                <View style={styles.playingOverlay}>
                  <Text style={styles.playingOverlayText}>Đang phát 🎵</Text>
                </View>
              )}
            </View>

            {/* Video Meta */}
            <View style={styles.feedMetaContainer}>
              <Text style={styles.feedTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.feedSubtitle} numberOfLines={1}>
                {item.channelName}
              </Text>
              <Text style={styles.feedStats}>
                {item.views} • {item.publishedAt}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Không có video phù hợp</Text>
          <Text style={styles.emptyDesc}>
            Phụ huynh có thể vào mục Cài đặt Phụ huynh để mở khóa thêm kênh cho bé.
          </Text>
        </View>
      }
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.container}>
        {renderTopBar()}

        {/* RESPONSIVE LAYOUT: Landscape (2 cột) vs Portrait (1 cột) */}
        {isLandscape ? (
          <View style={styles.landscapeBody}>
            {/* CỘT TRÁI (60%): PLAYER & METADATA */}
            <View style={styles.landscapeLeftColumn}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {renderPlayerSection()}
              </ScrollView>
            </View>

            {/* CỘT PHẢI (40%): BỘ LỌC & DANH SÁCH VIDEO TIẾP THEO */}
            <View style={styles.landscapeRightColumn}>
              {renderFilters()}
              <View style={{ flex: 1 }}>{renderVideoFeed()}</View>
            </View>
          </View>
        ) : (
          <View style={styles.portraitBody}>
            {renderPlayerSection()}
            {renderFilters()}
            <View style={{ flex: 1 }}>{renderVideoFeed()}</View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  // TOP BAR
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#1E293B',
    borderRadius: 8,
  },
  backBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playIconBox: {
    width: 24,
    height: 18,
    backgroundColor: '#EF4444',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  headerSearchBox: {
    flex: 1,
    maxWidth: 320,
    marginHorizontal: 12,
  },
  headerSearchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    color: '#FFFFFF',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  timeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // LAYOUT
  landscapeBody: {
    flex: 1,
    flexDirection: 'row',
  },
  landscapeLeftColumn: {
    flex: 6,
    borderRightWidth: 1,
    borderRightColor: '#1E293B',
  },
  landscapeRightColumn: {
    flex: 4,
  },
  portraitBody: {
    flex: 1,
  },

  // PLAYER
  playerWrapper: {
    backgroundColor: '#0F172A',
  },
  playerContainer: {
    width: '100%',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  limitReachedBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E293B',
  },
  limitEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  limitTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  limitDesc: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
  },

  // CONTROLS
  controlsBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#334155',
    borderRadius: 8,
    alignItems: 'center',
  },
  navBtnText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  playBtn: {
    backgroundColor: '#16A34A',
  },
  pauseBtn: {
    backgroundColor: '#D97706',
  },
  likeBtnActive: {
    backgroundColor: '#BE123C',
  },
  nextBtn: {
    backgroundColor: '#2563EB',
  },
  nextBtnText: {
    color: '#FFFFFF',
  },

  // ACTIVE VIDEO INFO
  activeInfoCard: {
    padding: 10,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  activeTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 6,
  },
  activeChannelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelAvatarBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  channelAvatarEmoji: {
    fontSize: 16,
  },
  channelVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeChannelName: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '700',
  },
  verifiedBadge: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '700',
    backgroundColor: '#0C4A6E',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  activeStats: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 1,
  },

  // FILTERS
  filtersWrapper: {
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingVertical: 4,
  },
  portraitSearchContainer: {
    paddingHorizontal: 10,
    paddingBottom: 6,
  },
  portraitSearchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#FFFFFF',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  channelScroll: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  channelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  channelChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  channelChipEmoji: {
    fontSize: 14,
  },
  channelChipText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  channelChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  categoryScroll: {
    paddingHorizontal: 10,
    paddingTop: 2,
    paddingBottom: 4,
    gap: 6,
  },
  categoryPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryPillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  categoryPillText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },

  // FEED LIST
  feedList: {
    padding: 8,
    paddingBottom: 24,
    gap: 8,
  },
  feedHeaderTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  feedCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 6,
  },
  feedCardPlaying: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  feedThumbContainer: {
    position: 'relative',
    width: 110,
    height: 65,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginRight: 8,
  },
  feedThumb: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  playingOverlay: {
    position: 'absolute',
    top: 3,
    left: 3,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  playingOverlayText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  feedMetaContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  feedTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    marginBottom: 2,
  },
  feedSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
  },
  feedStats: {
    color: '#64748B',
    fontSize: 9,
    marginTop: 1,
  },
  emptyContainer: {
    paddingTop: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  emptyDesc: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
  },
});
