import React, { useState, useEffect, useMemo } from 'react';
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
} from 'react-native';
import {
  YouTubeChannel,
  youtubeService,
} from '../services/youtubeService';
import { ThemeConfig } from '../services/themes';
import { YouTubeVideoDetailScreen } from './YouTubeVideoDetailScreen';

interface KidsYouTubeScreenProps {
  theme: ThemeConfig;
  onClose: () => void;
}

export const KidsYouTubeScreen: React.FC<KidsYouTubeScreenProps> = ({
  theme,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'search'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [selectedChannelForDetail, setSelectedChannelForDetail] = useState<YouTubeChannel | null>(null);

  // Giới hạn thời gian xem
  const [watchedMinutes, setWatchedMinutes] = useState<number>(() =>
    youtubeService.getTodayWatchedMinutes()
  );
  const [limitMinutes, setLimitMinutes] = useState<number>(() =>
    youtubeService.getDailyLimitMinutes()
  );
  const isTimeLimitReached = watchedMinutes >= limitMinutes;

  // 1. Tải danh sách kênh được phép xem
  useEffect(() => {
    const loadChannels = () => {
      const allChs = youtubeService.getAllChannels();
      const allowedIds = youtubeService.getAllowedChannelIds();
      // Chỉ hiển thị các kênh được phụ huynh gạt công tắc BẬT
      const filtered = allChs.filter((c) => allowedIds.includes(c.id));
      setChannels(filtered);
    };

    loadChannels();
  }, []);

  // 2. Lọc kênh theo tìm kiếm
  const displayedChannels = useMemo(() => {
    if (!searchQuery.trim()) {
      return channels;
    }
    const q = searchQuery.toLowerCase().trim();
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.subscribers && c.subscribers.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [channels, searchQuery]);

  // 3. Xử lý khi bé bấm vào xem một kênh
  const handleOpenChannel = (channel: YouTubeChannel) => {
    if (isTimeLimitReached) {
      Alert.alert(
        'Đã hết giờ xem hôm nay 😴',
        `Bé đã xem đủ ${limitMinutes} phút rồi. Bé hãy nghỉ ngơi và quay lại vào ngày mai nhé!`
      );
      return;
    }
    setSelectedChannelForDetail(channel);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. HEADER CHÍNH */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.youtubeLogoBadge}>
            <View style={styles.youtubeRedBox}>
              <Text style={styles.youtubePlayIcon}>▶</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>Danh Sách Kênh</Text>
        </View>

        {/* Nút thoát / Avatar bên phải */}
        <TouchableOpacity style={styles.profileBtn} onPress={onClose} activeOpacity={0.8}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileIconText}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 2. BODY NỘI DUNG */}
      <View style={styles.body}>
        {/* THANH TÌM KIẾM NẾU Ở TAB TÌM KIẾM HOẶC KHI CẦN */}
        {activeTab === 'search' && (
          <View style={styles.searchBarContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm kênh thiếu nhi của bé..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* CẢNH BÁO HẾT GIỜ NẾU CÓ */}
        {isTimeLimitReached && (
          <View style={styles.timeLimitBanner}>
            <Text style={styles.timeLimitEmoji}>😴</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.timeLimitTitle}>Đã hết thời lượng xem hôm nay</Text>
              <Text style={styles.timeLimitSub}>Đã xem {watchedMinutes}/{limitMinutes} phút tối đa.</Text>
            </View>
          </View>
        )}

        {/* DANH SÁCH CÁC THẺ KÊNH (MODERN CHANNEL CARDS) */}
        <FlatList
          data={displayedChannels}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modernChannelCard}
              activeOpacity={0.8}
              onPress={() => handleOpenChannel(item)}
            >
              {/* AVATAR KÊNH TRÒN */}
              {item.avatar && !item.avatar.includes('placeholder') ? (
                <Image source={{ uri: item.avatar }} style={styles.channelAvatarImg} />
              ) : (
                <View
                  style={[
                    styles.channelAvatarLetter,
                    { backgroundColor: item.color || '#E5E7EB' },
                  ]}
                >
                  <Text style={styles.channelAvatarLetterText}>
                    {item.emoji || item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              {/* THÔNG TIN KÊNH */}
              <View style={styles.modernChannelInfo}>
                <View style={styles.channelNameRow}>
                  <Text style={styles.modernChannelName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.redVerifiedCircle}>
                    <Text style={styles.redVerifiedCheck}>✓</Text>
                  </View>
                </View>

                <Text style={styles.modernChannelSubs} numberOfLines={1}>
                  {item.subscribers || '1.2M người đăng ký'}
                </Text>
              </View>

              {/* NÚT MŨI TÊN CHEVRON HỒNG NHẠT */}
              <View style={styles.chevronCircle}>
                <Text style={styles.chevronArrow}>›</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📺</Text>
              <Text style={styles.emptyTitle}>Chưa có kênh nào được cho phép</Text>
              <Text style={styles.emptySubtitle}>
                Phụ huynh có thể mở phần Cài Đặt Phụ Huynh để bật thêm các kênh yêu thích cho bé xem nhé.
              </Text>
            </View>
          }
        />
      </View>

      {/* 3. BOTTOM TAB BAR (TRANG CHỦ, DANH SÁCH KÊNH & TÌM KIẾM) */}
      <View style={styles.bottomTabBar}>
        {/* NÚT HOME ĐẦU TIÊN ĐỂ TRỞ VỀ MÀN HÌNH CHÍNH LAUNCHER */}
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={onClose}
        >
          <Text style={styles.tabIcon}>
            🏠
          </Text>
          <Text style={styles.tabLabel}>
            Màn hình chính
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('list');
            setSearchQuery('');
          }}
        >
          <Text style={[styles.tabIcon, activeTab === 'list' && styles.tabIconActive]}>
            📋
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'list' && styles.tabLabelActive]}>
            Danh sách kênh
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('search');
          }}
        >
          <Text style={[styles.tabIcon, activeTab === 'search' && styles.tabIconActive]}>
            🔍
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'search' && styles.tabLabelActive]}>
            Tìm kiếm
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. MODAL CHI TIẾT VIDEO KHI BÉ CHẠM VÀO KÊNH */}
      <Modal
        visible={!!selectedChannelForDetail}
        animationType="slide"
        onRequestClose={() => setSelectedChannelForDetail(null)}
      >
        {selectedChannelForDetail && (
          <YouTubeVideoDetailScreen
            channel={selectedChannelForDetail}
            onClose={() => setSelectedChannelForDetail(null)}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  youtubeLogoBadge: {
    marginRight: 10,
  },
  youtubeRedBox: {
    width: 32,
    height: 24,
    backgroundColor: '#DC2626',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youtubePlayIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  profileBtn: {
    padding: 2,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIconText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  /* BODY */
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  channelCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  channelCountIcon: {
    fontSize: 14,
    color: '#6B7280',
  },
  sectionSubheading: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  /* SEARCH BAR */
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
    color: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#111827',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },

  /* TIME LIMIT BANNER */
  timeLimitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  timeLimitEmoji: {
    fontSize: 24,
  },
  timeLimitTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  timeLimitSub: {
    fontSize: 12,
    color: '#991B1B',
  },

  /* CHANNEL LIST */
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  modernChannelCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  channelAvatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E5E7EB',
  },
  channelAvatarLetter: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelAvatarLetterText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
  },
  modernChannelInfo: {
    flex: 1,
    gap: 3,
  },
  channelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modernChannelName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    maxWidth: '85%',
  },
  redVerifiedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redVerifiedCheck: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  modernChannelSubs: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  chevronCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronArrow: {
    fontSize: 20,
    color: '#DC2626',
    fontWeight: '800',
    marginTop: -2,
  },

  /* EMPTY */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },

  /* BOTTOM TAB BAR */
  bottomTabBar: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
    opacity: 0.4,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabLabelActive: {
    color: '#111827',
    fontWeight: '800',
  },
});
