import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  useWindowDimensions,
  Alert,
  Share,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import {
  YouTubeVideo,
  YouTubeChannel,
  youtubeService,
  DEFAULT_CURATED_VIDEOS,
} from '../services/youtubeService';

interface YouTubeVideoDetailScreenProps {
  channel: YouTubeChannel;
  initialVideo?: YouTubeVideo;
  onClose: () => void;
}

export const YouTubeVideoDetailScreen: React.FC<YouTubeVideoDetailScreenProps> = ({
  channel,
  initialVideo,
  onClose,
}) => {
  const { width } = useWindowDimensions();
  const playerHeight = Math.round((width * 9) / 16);

  // 1. Lấy danh sách video thuộc kênh này
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);

  // 2. Video đang phát hiện tại  
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);

  // Cập nhật khi channel thay đổi & tải thêm video thực tế của kênh
  useEffect(() => {
    if (!channel) return;

    const list = youtubeService.getVideosForChannel(channel);

    // Ưu tiên: initialVideo > video đầu tiên trong list
    if (initialVideo && initialVideo.channelId === channel.id) {
      setChannelVideos(list);
      setActiveVideo(initialVideo);
    } else if (list.length > 0 && list[0].channelId === channel.id) {
      // Video local đã tồn tại và đúng kênh → hiển thị ngay
      setChannelVideos(list);
      setActiveVideo(list[0]);
    } else {
      // Chưa có video local cho kênh này → fetch thật từ YouTube trước
      // KHÔNG dùng fallback hardcoded vì sẽ phát video kênh khác
      setChannelVideos([]);
      setActiveVideo(null); // Hiển thị loading...

      youtubeService.fetchAndSaveChannelVideos(channel).then(() => {
        const fetched = youtubeService.getVideosForChannel(channel);
        if (fetched.length > 0) {
          setChannelVideos(fetched);
          setActiveVideo(fetched[0]);
        } else {
          // Fetch thất bại → tạo video từ sampleVideoId của chính kênh này
          const vidId = channel.sampleVideoId || channel.id;
          const fallbackVideo: YouTubeVideo = {
            id: `fallback_${channel.id}`,
            videoId: vidId,
            title: `${channel.name} - Video đặc sắc cho bé`,
            channelId: channel.id,
            channelName: channel.name,
            channelAvatar: channel.avatar || `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`,
            category: 'music',
            duration: '04:30',
            thumbnail: `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`,
            views: '1.2 Tr lượt xem',
            publishedAt: 'Mới cập nhật',
          };
          setChannelVideos([fallbackVideo]);
          setActiveVideo(fallbackVideo);
        }
      });
      return; // Không cần chạy fetch bên dưới nữa
    }

    // Nếu có video local nhưng ít → fetch thêm ở background
    if (list.length <= 2) {
      youtubeService.fetchAndSaveChannelVideos(channel).then(() => {
        const updated = youtubeService.getVideosForChannel(channel);
        if (updated.length > list.length) {
          setChannelVideos(updated);
        }
      });
    }
  }, [channel, initialVideo]);

  // Xử lý chia sẻ video
  const handleShare = async () => {
    if (!activeVideo) return;
    try {
      await Share.share({
        message: `Xem video "${activeVideo.title}" trên Kids Launcher: https://youtu.be/${activeVideo.videoId}`,
      });
    } catch {}
  };

  if (!activeVideo) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đang tải video...</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. TOP BAR HEADER */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi Tiết Video</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. MAIN VIDEO PLAYER */}
        <View style={[styles.playerContainer, { height: playerHeight }]}>
          <YoutubePlayer
            key={activeVideo.videoId}
            height={playerHeight}
            play={isPlaying}
            videoId={activeVideo.videoId}
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

          {/* Time & Fullscreen Overlay Indicator */}
          <View style={styles.playerTimeOverlay}>
            <Text style={styles.playerTimeText}>
              01:24 / {activeVideo.duration || '04:30'}
            </Text>
            <Text style={styles.fullscreenIcon}>⛶</Text>
          </View>

          {/* Red progress line at bottom */}
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* 3. VIDEO METADATA & TITLE */}
        <View style={styles.videoMetaSection}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {activeVideo.title}
          </Text>
          <Text style={styles.videoStats}>
            {activeVideo.views || '6.2 Tr lượt xem'} • {activeVideo.publishedAt || '2 tuần trước'}
          </Text>

          {/* 4. ACTION BUTTONS ROW */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionButtonsScroll}>
            <View style={styles.actionButtonsRow}>
              {/* Like / Dislike Combined Pill */}
              <View style={styles.likeDislikePill}>
                <TouchableOpacity
                  style={styles.likeBtn}
                  onPress={() => setIsLiked(!isLiked)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.actionIcon, isLiked && { color: '#DC2626' }]}>
                    👍
                  </Text>
                  <Text style={[styles.actionText, isLiked && { fontWeight: '800', color: '#DC2626' }]}>
                    {isLiked ? '34.1N' : '34N'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.pillDivider} />
                <TouchableOpacity style={styles.dislikeBtn} activeOpacity={0.7}>
                  <Text style={styles.actionIcon}>👎</Text>
                </TouchableOpacity>
              </View>

              {/* Share Pill */}
              <TouchableOpacity style={styles.actionPill} onPress={handleShare} activeOpacity={0.7}>
                <Text style={styles.actionIcon}>↗</Text>
                <Text style={styles.actionText}>Chia sẻ</Text>
              </TouchableOpacity>

              {/* Download Pill */}
              <TouchableOpacity
                style={styles.actionPill}
                onPress={() => Alert.alert('Tải xuống', 'Đã lưu video vào danh sách phát ngoại tuyến của bé!')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionIcon}>⬇</Text>
                <Text style={styles.actionText}>Tải xuống</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* 5. CHANNEL INFO BAR */}
          <View style={styles.channelInfoBar}>
            <View style={styles.channelLeft}>
              {channel?.avatar && !channel?.avatar.includes('placeholder') ? (
                <Image source={{ uri: channel?.avatar }} style={styles.channelAvatarImg} />
              ) : (
                <View style={[styles.channelAvatarLetter, { backgroundColor: channel?.color || '#2563EB' }]}>
                  <Text style={styles.channelAvatarLetterText}>
                    {channel?.emoji || channel?.name?.charAt(0).toUpperCase() || '📺'}
                  </Text>
                </View>
              )}

              <View style={styles.channelTextInfo}>
                <View style={styles.channelNameRow}>
                  <Text style={styles.channelName} numberOfLines={1}>
                    {channel?.name || 'Kênh YouTube'}
                  </Text>
                  <View style={styles.verifiedTickCircle}>
                    <Text style={styles.verifiedTickText}>✓</Text>
                  </View>
                </View>
                <Text style={styles.channelSubs}>
                  {channel?.subscribers || '154 Tr người đăng ký'}
                </Text>
              </View>
            </View>

            {/* Subscribe Button */}
            <TouchableOpacity
              style={[styles.subscribeBtn, !isSubscribed && styles.subscribeBtnInactive]}
              onPress={() => setIsSubscribed(!isSubscribed)}
              activeOpacity={0.8}
            >
              <Text style={styles.subscribeBtnText}>
                {isSubscribed ? 'Đã đăng ký' : 'Đăng ký'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. NEXT SUGGESTED VIDEOS ("Video đề xuất tiếp theo") */}
        <View style={styles.suggestedSection}>
          {/* Section Header */}
          <View style={styles.suggestedHeaderRow}>
            <Text style={styles.suggestedHeaderTitle}>Video đề xuất tiếp theo</Text>
            <TouchableOpacity style={styles.filterMenuBtn} activeOpacity={0.7}>
              <Text style={styles.filterMenuIcon}>☰</Text>
            </TouchableOpacity>
          </View>

          {/* Suggested Video Cards List (Chỉ lấy video từ kênh đang xem) */}
          <View style={styles.suggestedList}>
            {channelVideos.map((video) => {
              const isCurrent = video.videoId === activeVideo.videoId;

              return (
                <TouchableOpacity
                  key={video.id || video.videoId}
                  style={[styles.videoCard, isCurrent && styles.videoCardActive]}
                  onPress={() => {
                    setActiveVideo(video);
                    setIsPlaying(true);
                  }}
                  activeOpacity={0.75}
                >
                  {/* Left Thumbnail */}
                  <View style={styles.thumbnailBox}>
                    <Image
                      source={{ uri: video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg` }}
                      style={styles.thumbnailImg}
                      resizeMode="cover"
                    />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{video.duration || '03:30'}</Text>
                    </View>
                  </View>

                  {/* Right Info */}
                  <View style={styles.videoCardInfo}>
                    <Text
                      style={[styles.cardTitle, isCurrent && styles.cardTitleActive]}
                      numberOfLines={2}
                    >
                      {video.title}
                    </Text>
                    <Text style={styles.cardChannel} numberOfLines={1}>
                      {video.channelName}
                    </Text>
                    <Text style={styles.cardMeta} numberOfLines={1}>
                      {video.views || '2.1 Tr lượt xem'} • {video.publishedAt || '3 ngày trước'}
                    </Text>
                  </View>

                  {/* 3-dots Menu Button */}
                  <TouchableOpacity
                    style={styles.moreBtn}
                    onPress={() => {
                      Alert.alert(
                        video.title,
                        `Kênh: ${video.channelName}\nThời lượng: ${video.duration || '3:30'}`,
                        [
                          { text: 'Phát ngay', onPress: () => setActiveVideo(video) },
                          { text: 'Đóng', style: 'cancel' },
                        ]
                      );
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.moreIcon}>⋮</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 6,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* PLAYER */
  playerContainer: {
    width: '100%',
    backgroundColor: '#000000',
    position: 'relative',
  },
  playerTimeOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  playerTimeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  fullscreenIcon: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  progressBarBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBarFill: {
    width: '32%',
    height: '100%',
    backgroundColor: '#DC2626',
  },

  /* VIDEO META */
  videoMetaSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 6,
  },
  videoStats: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
  },

  /* ACTION BUTTONS */
  actionButtonsScroll: {
    marginBottom: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  likeDislikePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 10,
  },
  dislikeBtn: {
    paddingHorizontal: 2,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionIcon: {
    fontSize: 14,
    color: '#1F2937',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },

  /* CHANNEL INFO BAR */
  channelInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  channelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  channelAvatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
  },
  channelAvatarLetter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelAvatarLetterText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  channelTextInfo: {
    flex: 1,
  },
  channelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  channelName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedTickCircle: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedTickText: {
    fontSize: 8.5,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  channelSubs: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  subscribeBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  subscribeBtnInactive: {
    backgroundColor: '#DC2626',
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* SUGGESTED SECTION */
  suggestedSection: {
    padding: 16,
  },
  suggestedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  suggestedHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  filterMenuBtn: {
    padding: 4,
  },
  filterMenuIcon: {
    fontSize: 18,
    color: '#475569',
    fontWeight: 'bold',
  },
  filterChipsScroll: {
    marginBottom: 14,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: '#111827',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  /* SUGGESTED VIDEO LIST */
  suggestedList: {
    gap: 14,
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 14,
    padding: 4,
  },
  videoCardActive: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    paddingLeft: 8,
  },
  thumbnailBox: {
    position: 'relative',
    width: 125,
    height: 74,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  videoCardInfo: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  cardTitleActive: {
    color: '#DC2626',
    fontWeight: '800',
  },
  cardChannel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardMeta: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  moreBtn: {
    padding: 4,
  },
  moreIcon: {
    fontSize: 18,
    color: '#64748B',
  },
});
