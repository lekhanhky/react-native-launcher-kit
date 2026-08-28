import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import {
  youtubeService,
  YouTubeChannel,
} from '../services/youtubeService';

interface YouTubeChannelSearchScreenProps {
  onClose: () => void;
  onChannelsAdded: () => void;
}

export const YouTubeChannelSearchScreen: React.FC<YouTubeChannelSearchScreenProps> = ({
  onClose,
  onChannelsAdded,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<YouTubeChannel[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<Map<string, YouTubeChannel>>(
    new Map()
  );
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Danh sách các kênh đã có sẵn trong máy
  const existingChannels = useMemo(() => youtubeService.getAllChannels(), []);
  const existingChannelIds = useMemo(
    () => new Set(existingChannels.map((c) => c.id)),
    [existingChannels]
  );

  // Danh sách các kênh đề xuất mặc định ban đầu (Kho Khám Phá)
  const defaultCatalog = useMemo(() => youtubeService.getFeaturedChannels(), []);

  // Tự động tìm kiếm khi nhập từ khóa (Debounce 350ms)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(defaultCatalog);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await youtubeService.searchOnlineChannels(searchQuery.trim());
        setSearchResults(results);
      } catch (e) {
        console.warn('Search channels error:', e);
        setSearchResults(youtubeService.searchDiscoveryCatalog(searchQuery.trim()));
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, defaultCatalog]);

  // Xử lý Check / Uncheck một kênh
  const handleToggleSelect = (channel: YouTubeChannel) => {
    // Nếu kênh đã có trong danh sách của bé từ trước thì không cần chọn lại
    if (existingChannelIds.has(channel.id)) {
      Alert.alert('Thông báo', `Kênh "${channel.name}" đã có sẵn trong danh sách của bé.`);
      return;
    }

    const next = new Map(selectedChannels);
    if (next.has(channel.id)) {
      next.delete(channel.id);
    } else {
      next.set(channel.id, channel);
    }
    setSelectedChannels(next);
  };

  // Chọn tất cả các kênh hiển thị chưa có trong máy
  const handleSelectAll = () => {
    const next = new Map(selectedChannels);
    const unadded = searchResults.filter((c) => !existingChannelIds.has(c.id));
    if (next.size >= unadded.length && unadded.length > 0) {
      // Đã chọn hết -> Bỏ chọn tất cả
      setSelectedChannels(new Map());
    } else {
      // Chọn tất cả
      unadded.forEach((c) => next.set(c.id, c));
      setSelectedChannels(next);
    }
  };

  // Xử lý bấm nút "Thêm X Kênh Vào Danh Sách"
  const handleBatchAddChannels = async () => {
    const channelsToAdd = Array.from(selectedChannels.values());
    if (channelsToAdd.length === 0) return;

    setIsAdding(true);
    try {
      for (const ch of channelsToAdd) {
        // Lưu kênh vào hệ thống
        youtubeService.saveCustomChannel({
          ...ch,
          isCustom: true,
        });
        // Bật kênh cho phép xem
        youtubeService.toggleChannel(ch.id, true);
        // Tải video ngầm
        youtubeService.fetchAndSaveChannelVideos(ch);
      }

      Alert.alert(
        'Thành công 🎉',
        `Đã thêm ${channelsToAdd.length} kênh mới vào danh sách xem của bé!`,
        [
          {
            text: 'OK',
            onPress: () => {
              onChannelsAdded();
              onClose();
            },
          },
        ]
      );
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Có lỗi xảy ra khi thêm kênh.');
    } finally {
      setIsAdding(false);
    }
  };

  const selectedCount = selectedChannels.size;
  const unaddedCount = searchResults.filter((c) => !existingChannelIds.has(c.id)).length;
  const isAllSelected = selectedCount > 0 && selectedCount >= unaddedCount && unaddedCount > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>✕ Đóng</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Tìm & Thêm Kênh</Text>
          <Text style={styles.headerSubtitle}>
            Chọn một hoặc nhiều kênh thiếu nhi cho bé
          </Text>
        </View>

        {unaddedCount > 0 ? (
          <TouchableOpacity style={styles.selectAllBtn} onPress={handleSelectAll}>
            <Text style={styles.selectAllText}>
              {isAllSelected ? 'Bỏ chọn' : 'Chọn hết'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tên kênh (VD: Cocomelon, Peppa Pig, Ca nhạc...)"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {isSearching && (
          <View style={styles.searchingRow}>
            <ActivityIndicator size="small" color="#DC2626" />
            <Text style={styles.searchingText}>Đang tra cứu kênh YouTube trực tuyến...</Text>
          </View>
        )}
      </View>

      {/* DANH SÁCH KÊNH CÓ CHECKBOX */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isAlreadyAdded = existingChannelIds.has(item.id);
          const isChecked = selectedChannels.has(item.id);

          return (
            <TouchableOpacity
              style={[
                styles.channelCard,
                isChecked && styles.channelCardSelected,
                isAlreadyAdded && styles.channelCardDisabled,
              ]}
              activeOpacity={isAlreadyAdded ? 1 : 0.7}
              onPress={() => handleToggleSelect(item)}
            >
              {/* AVATAR KÊNH */}
              {item.avatar && !item.avatar.includes('placeholder') ? (
                <Image source={{ uri: item.avatar }} style={styles.avatarImg} />
              ) : (
                <View
                  style={[
                    styles.avatarLetter,
                    { backgroundColor: item.color || '#E5E7EB' },
                  ]}
                >
                  <Text style={styles.avatarLetterText}>
                    {item.emoji || item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              {/* THÔNG TIN KÊNH */}
              <View style={styles.infoBox}>
                <View style={styles.nameRow}>
                  <Text style={styles.channelName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                </View>
                <Text style={styles.subsText} numberOfLines={1}>
                  {item.subscribers || 'Kênh YouTube Thiếu Nhi'}
                </Text>
                {item.description ? (
                  <Text style={styles.descText} numberOfLines={1}>
                    {item.description}
                  </Text>
                ) : null}
              </View>

              {/* Ô CHECKBOX HOẶC BADGE ĐÃ CÓ */}
              {isAlreadyAdded ? (
                <View style={styles.alreadyAddedBadge}>
                  <Text style={styles.alreadyAddedText}>Đã có</Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.checkboxCircle,
                    isChecked && styles.checkboxCircleChecked,
                  ]}
                >
                  {isChecked && <Text style={styles.checkboxCheckmark}>✓</Text>}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          !isSearching ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>Không tìm thấy kênh phù hợp</Text>
              <Text style={styles.emptySub}>
                Hãy thử tìm kiếm với từ khóa khác như "Heo Peppa", "Cocomelon", "Vui học"...
              </Text>
            </View>
          ) : null
        }
      />

      {/* BOTTOM ACTION BAR (NÚT THÊM NHIỀU KÊNH) */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.selectedCountText}>
            Đã chọn: <Text style={styles.selectedHighlight}>{selectedCount}</Text> kênh
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addSubmitBtn,
            (selectedCount === 0 || isAdding) && styles.addSubmitBtnDisabled,
          ]}
          disabled={selectedCount === 0 || isAdding}
          onPress={handleBatchAddChannels}
          activeOpacity={0.85}
        >
          {isAdding ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.addSubmitText}>
              + Thêm {selectedCount > 0 ? `${selectedCount} Kênh` : ''} Vào Danh Sách
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  headerTitleBox: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  selectAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },

  /* SEARCH SECTION */
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  searchingText: {
    fontSize: 12,
    color: '#DC2626',
    fontStyle: 'italic',
  },

  /* LIST */
  listContainer: {
    padding: 16,
    paddingBottom: 100,
    gap: 10,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  channelCardSelected: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  channelCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#F8FAFC',
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  avatarLetter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetterText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  infoBox: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  channelName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    maxWidth: '85%',
  },
  verifiedBadge: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 8.5,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  subsText: {
    fontSize: 12,
    color: '#64748B',
  },
  descText: {
    fontSize: 11,
    color: '#94A3B8',
  },

  /* CHECKBOX */
  checkboxCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCircleChecked: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  checkboxCheckmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  alreadyAddedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
  },
  alreadyAddedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },

  /* EMPTY */
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12.5,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },

  /* BOTTOM BAR */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomInfo: {
    justifyContent: 'center',
  },
  selectedCountText: {
    fontSize: 13.5,
    color: '#475569',
    fontWeight: '600',
  },
  selectedHighlight: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
  },
  addSubmitBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSubmitBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  addSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
