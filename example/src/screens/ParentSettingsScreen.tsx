import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import type { AppDetail } from 'react-native-launcher-kit/src/interfaces/InstalledApps';
import { storage, STORAGE_KEYS } from '../services/storage';
import { ScheduleConfig } from '../services/timeScheduler';
import {
  youtubeService,
  YouTubeChannel,
  YOUTUBE_CATEGORIES,
} from '../services/youtubeService';

interface ParentSettingsScreenProps {
  allApps: AppDetail[];
  onClose: () => void;
  onRefreshPolicies: () => void;
  onResetLicense: () => void;
}

const AVAILABLE_CHANNEL_EMOJIS = ['📺', '🎨', '🌈', '🐼', '🐰', '🚀', '⭐', '🎶', '🍉', '🐺', '🐉', '🧸', '🐷', '🐶', '🐻', '🦁', '🌐'];

export const ParentSettingsScreen: React.FC<ParentSettingsScreenProps> = ({
  allApps,
  onClose,
  onRefreshPolicies,
  onResetLicense,
}) => {
  // 1. Quản lý danh sách chặn
  const [blockedPackages, setBlockedPackages] = useState<string[]>(() => {
    try {
      const raw = storage.getString(STORAGE_KEYS.PACKAGE_LIST);
      return raw ? JSON.parse(raw) : ['com.android.settings'];
    } catch {
      return ['com.android.settings'];
    }
  });

  // 2. Quản lý Lịch biểu
  const [schedule, setSchedule] = useState<ScheduleConfig>(() => {
    try {
      const raw = storage.getString(STORAGE_KEYS.SCHEDULE);
      return raw
        ? JSON.parse(raw)
        : {
            isEnabled: true,
            allowedStartTime: '07:00:00',
            allowedEndTime: '21:00:00',
            daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
            lockMessage: 'Đã đến giờ đi ngủ hoặc học bài! Bé hãy nghỉ ngơi nhé.',
          };
    } catch {
      return {
        isEnabled: true,
        allowedStartTime: '07:00:00',
        allowedEndTime: '21:00:00',
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
        lockMessage: 'Đã đến giờ đi ngủ hoặc học bài! Bé hãy nghỉ ngơi nhé.',
      };
    }
  });

  // 3. Quản lý PIN
  const [newPin, setNewPin] = useState(
    storage.getString(STORAGE_KEYS.PARENT_PIN) || '1234'
  );

  // 4. Quản lý YouTube Cho Bé
  const [ytEnabled, setYtEnabled] = useState<boolean>(() =>
    youtubeService.isYouTubeEnabled()
  );
  const [ytDailyLimit, setYtDailyLimit] = useState<string>(() =>
    String(youtubeService.getDailyLimitMinutes())
  );
  const [allChannels, setAllChannels] = useState<YouTubeChannel[]>(() =>
    youtubeService.getAllChannels()
  );
  const [allowedChannels, setAllowedChannels] = useState<string[]>(() =>
    youtubeService.getAllowedChannelIds()
  );

  // Tìm kiếm kênh trực tuyến & khám phá
  const [searchCatalogQuery, setSearchCatalogQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<YouTubeChannel[]>(() =>
    youtubeService.searchDiscoveryCatalog('')
  );
  const [isSearchingOnline, setIsSearchingOnline] = useState<boolean>(false);

  // Form tự tạo kênh mới
  const [showManualCreate, setShowManualCreate] = useState<boolean>(false);
  const [newChannelName, setNewChannelName] = useState<string>('');
  const [newChannelEmoji, setNewChannelEmoji] = useState<string>('📺');
  const [newChannelCategory, setNewChannelCategory] = useState<string>('cartoon');
  const [newChannelFirstVideo, setNewChannelFirstVideo] = useState<string>('');

  // Form thêm video vào kênh
  const [targetChannelId, setTargetChannelId] = useState<string>(() =>
    allChannels.length > 0 ? allChannels[0].id : 'custom_channel'
  );
  const [newVideoUrl, setNewVideoUrl] = useState<string>('');
  const [newVideoTitle, setNewVideoTitle] = useState<string>('');
  const [isFetchingMetadata, setIsFetchingMetadata] = useState<boolean>(false);

  // Cập nhật kết quả tìm kiếm khi query thay đổi
  useEffect(() => {
    if (!searchCatalogQuery.trim()) {
      setSearchResults(youtubeService.searchDiscoveryCatalog(''));
      return;
    }
    const local = youtubeService.searchDiscoveryCatalog(searchCatalogQuery);
    setSearchResults(local);
  }, [searchCatalogQuery]);

  // Kích hoạt tìm kiếm trực tuyến
  const handleOnlineSearch = async () => {
    if (!searchCatalogQuery.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập từ khóa tên kênh để tìm kiếm trực tuyến!');
      return;
    }
    setIsSearchingOnline(true);
    try {
      const results = await youtubeService.searchOnlineChannels(searchCatalogQuery);
      setSearchResults(results);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsSearchingOnline(false);
    }
  };

  // Tự động tải thông tin video / kênh trực tuyến khi dán link
  const handleFetchMetadata = async () => {
    if (!newVideoUrl.trim()) {
      Alert.alert('Lỗi', 'Vui lòng dán Link hoặc ID video YouTube!');
      return;
    }
    setIsFetchingMetadata(true);
    try {
      const meta = await youtubeService.fetchOnlineMetadata(newVideoUrl);
      if (meta) {
        setNewVideoTitle(meta.title);
        Alert.alert('Thành công', `Đã nhận diện: "${meta.title}" (${meta.channelName})`);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  // Toggle ẩn/hiện từng app
  const toggleAppVisibility = (packageName: string) => {
    let updated: string[];
    if (blockedPackages.includes(packageName)) {
      updated = blockedPackages.filter((p) => p !== packageName);
    } else {
      updated = [...blockedPackages, packageName];
    }
    setBlockedPackages(updated);
    storage.set(STORAGE_KEYS.PACKAGE_LIST, JSON.stringify(updated));
    onRefreshPolicies();
  };

  // Cập nhật giờ
  const handleSaveSchedule = (key: keyof ScheduleConfig, value: any) => {
    const updated = { ...schedule, [key]: value };
    setSchedule(updated);
    storage.set(STORAGE_KEYS.SCHEDULE, JSON.stringify(updated));
    onRefreshPolicies();
  };

  // Đổi PIN
  const handleSavePin = () => {
    if (newPin.trim().length < 4) {
      Alert.alert('Lỗi', 'Mã PIN phải có ít nhất 4 chữ số!');
      return;
    }
    storage.set(STORAGE_KEYS.PARENT_PIN, newPin.trim());
    Alert.alert('Thành công', 'Đã cập nhật mã PIN Phụ huynh!');
  };

  // Thêm kênh từ kho / trực tuyến
  const handleAddFromCatalog = (catalogChannel: YouTubeChannel) => {
    const isAlreadyAdded = allChannels.some(
      (c) => c.name.toLowerCase() === catalogChannel.name.toLowerCase()
    );
    if (isAlreadyAdded) {
      Alert.alert('Thông báo', `Kênh "${catalogChannel.name}" đã có trong danh sách!`);
      return;
    }

    const created = youtubeService.addChannelFromCatalog(catalogChannel);
    const updated = youtubeService.getAllChannels();
    setAllChannels(updated);
    setAllowedChannels(youtubeService.getAllowedChannelIds());
    Alert.alert('Thành công', `Đã thêm kênh "${created.name}" vào danh sách của bé!`);
    onRefreshPolicies();
  };

  // Xử lý tạo kênh thủ công
  const handleCreateChannel = () => {
    if (!newChannelName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên kênh thiếu nhi!');
      return;
    }
    const created = youtubeService.addCustomChannel({
      name: newChannelName.trim(),
      emoji: newChannelEmoji,
      color: '#2563EB',
      category: newChannelCategory,
      description: 'Kênh tùy chỉnh do phụ huynh tạo',
      firstVideoIdOrUrl: newChannelFirstVideo.trim(),
    });

    const updatedChannels = youtubeService.getAllChannels();
    setAllChannels(updatedChannels);
    setAllowedChannels(youtubeService.getAllowedChannelIds());
    setTargetChannelId(created.id);

    setNewChannelName('');
    setNewChannelFirstVideo('');
    setShowManualCreate(false);
    Alert.alert('Thành công', `Đã thêm kênh "${created.name}" vào YouTube Cho Bé!`);
    onRefreshPolicies();
  };

  // Xử lý xóa kênh tùy chỉnh
  const handleDeleteChannel = (channel: YouTubeChannel) => {
    Alert.alert(
      'Xóa Kênh',
      `Bạn có chắc muốn xóa kênh "${channel.name}" và toàn bộ video trong kênh này?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            youtubeService.deleteCustomChannel(channel.id);
            const updated = youtubeService.getAllChannels();
            setAllChannels(updated);
            setAllowedChannels(youtubeService.getAllowedChannelIds());
            Alert.alert('Đã xóa', `Đã xóa kênh "${channel.name}".`);
            onRefreshPolicies();
          },
        },
      ]
    );
  };

  // Xử lý thêm video vào kênh đã chọn
  const handleAddVideoToChannel = () => {
    if (!newVideoUrl.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập Link hoặc ID video YouTube!');
      return;
    }

    const selectedCh = allChannels.find((c) => c.id === targetChannelId);
    const res = youtubeService.addCustomVideo({
      videoIdOrUrl: newVideoUrl,
      title: newVideoTitle || 'Video Phụ huynh thêm',
      channelId: targetChannelId,
      channelName: selectedCh ? selectedCh.name : 'Kênh Phụ Huynh',
      channelEmoji: selectedCh ? selectedCh.emoji : '📺',
      channelColor: selectedCh ? selectedCh.color : '#2563EB',
      category: (selectedCh ? selectedCh.category : 'music') as any,
    });

    if (res) {
      setNewVideoUrl('');
      setNewVideoTitle('');
      Alert.alert('Thành công', `Đã thêm video vào kênh "${selectedCh?.name || 'Kênh Phụ Huynh'}"!`);
      onRefreshPolicies();
    } else {
      Alert.alert('Lỗi', 'Không nhận dạng được Link hoặc ID video YouTube hợp lệ!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Cài đặt Quản lý Phụ huynh</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Đóng ✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* NHÓM 1: LỊCH BIỂU SỬ DỤNG */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⏰ Khung Giờ Cho Phép Sử Dụng</Text>
          <Text style={styles.cardDesc}>
            Thiết bị sẽ tự động khóa lại ngoài khoảng thời gian này để bé đi ngủ hoặc học bài.
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Kích hoạt Giới hạn Giờ</Text>
            <Switch
              value={schedule.isEnabled}
              onValueChange={(val) => handleSaveSchedule('isEnabled', val)}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={schedule.isEnabled ? '#16A34A' : '#F1F5F9'}
            />
          </View>

          {schedule.isEnabled && (
            <View style={styles.scheduleInputs}>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Từ (Bắt đầu):</Text>
                <TextInput
                  style={styles.timeInput}
                  value={schedule.allowedStartTime}
                  onChangeText={(val) => handleSaveSchedule('allowedStartTime', val)}
                  placeholder="07:00:00"
                />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Đến (Kết thúc):</Text>
                <TextInput
                  style={styles.timeInput}
                  value={schedule.allowedEndTime}
                  onChangeText={(val) => handleSaveSchedule('allowedEndTime', val)}
                  placeholder="21:00:00"
                />
              </View>
            </View>
          )}
        </View>

        {/* NHÓM 2: QUẢN LÝ DANH SÁCH ỨNG DỤNG ĐƯỢC PHÉP */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 Quản Lý Ứng Dụng Cho Phép</Text>
          <Text style={styles.cardDesc}>
            Chỉ những ứng dụng được gạt công tắc MÀU XANH mới hiển thị trên màn hình của bé.
          </Text>

          {allApps.map((app) => {
            const isAllowed = !blockedPackages.includes(app.packageName);
            return (
              <View key={app.packageName} style={styles.appRow}>
                {app.icon ? (
                  <Image
                    source={{
                      uri:
                        app.icon.startsWith('file://') ||
                        app.icon.startsWith('data:') ||
                        app.icon.startsWith('http')
                          ? app.icon
                          : `data:image/png;base64,${app.icon}`,
                    }}
                    style={styles.appSettingsIcon}
                  />
                ) : (
                  <View style={[styles.appSettingsIcon, styles.appPlaceholderIcon]}>
                    <Text style={{ fontSize: 16 }}>📱</Text>
                  </View>
                )}
                <View style={styles.appInfo}>
                  <Text style={styles.appName} numberOfLines={1}>
                    {app.label}
                  </Text>
                  <Text style={styles.appPackage} numberOfLines={1}>
                    {app.packageName}
                  </Text>
                </View>
                <Switch
                  value={isAllowed}
                  onValueChange={() => toggleAppVisibility(app.packageName)}
                  trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                  thumbColor={isAllowed ? '#16A34A' : '#F1F5F9'}
                />
              </View>
            );
          })}
        </View>

        {/* NHÓM 3: QUẢN LÝ YOUTUBE CHO BÉ & CHỌN/THÊM KÊNH */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📺 Quản lý YouTube An Toàn & Kênh Cho Bé</Text>
          <Text style={styles.cardDesc}>
            Trình phát video thiếu nhi tích hợp sẵn, chặn 100% video rác, Shorts và quảng cáo.
          </Text>

          {/* Công tắc Bật/Tắt YouTube */}
          <View style={styles.row}>
            <Text style={styles.label}>Cho phép bé xem YouTube trong app</Text>
            <Switch
              value={ytEnabled}
              onValueChange={(val) => {
                setYtEnabled(val);
                youtubeService.setYouTubeEnabled(val);
                onRefreshPolicies();
              }}
              trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
              thumbColor={ytEnabled ? '#16A34A' : '#F1F5F9'}
            />
          </View>

          {ytEnabled && (
            <>
              {/* Giới hạn thời lượng xem */}
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subLabel}>Thời lượng xem tối đa mỗi ngày (phút):</Text>
                <View style={styles.row}>
                  <TextInput
                    style={styles.timeInput}
                    value={ytDailyLimit}
                    onChangeText={(val) => {
                      setYtDailyLimit(val);
                      const mins = parseInt(val, 10);
                      if (!isNaN(mins) && mins > 0) {
                        youtubeService.setDailyLimitMinutes(mins);
                      }
                    }}
                    keyboardType="numeric"
                    placeholder="45"
                  />
                  <Text style={{ marginLeft: 10, fontSize: 13, color: '#64748B' }}>
                    phút / ngày
                  </Text>
                </View>
              </View>

              {/* 3.1. Danh Sách Kênh Đang Có */}
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>
                  ⭐ Danh sách Kênh đang có ({allowedChannels.length}/{allChannels.length} được bật)
                </Text>
                <Text style={styles.cardDesc}>
                  Gạt công tắc để ẩn hoặc hiện từng kênh trên màn hình của bé.
                </Text>

                {allChannels.map((ch) => {
                  const isChannelAllowed = allowedChannels.includes(ch.id);
                  return (
                    <View key={ch.id} style={styles.channelRow}>
                      <View
                        style={[
                          styles.channelEmojiBox,
                          { backgroundColor: ch.color || '#2563EB' },
                        ]}
                      >
                        <Text style={styles.channelEmojiText}>{ch.emoji}</Text>
                      </View>
                      <View style={styles.appInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.appName} numberOfLines={1}>
                            {ch.name}
                          </Text>
                          {ch.isCustom && (
                            <Text style={styles.customBadge}>Tùy chỉnh</Text>
                          )}
                        </View>
                        <Text style={styles.appPackage} numberOfLines={1}>
                          {ch.subscribers} • {ch.description}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {ch.isCustom && (
                          <TouchableOpacity
                            style={styles.deleteChBtn}
                            onPress={() => handleDeleteChannel(ch)}
                          >
                            <Text style={styles.deleteChBtnText}>🗑️</Text>
                          </TouchableOpacity>
                        )}
                        <Switch
                          value={isChannelAllowed}
                          onValueChange={(val) => {
                            const updated = youtubeService.toggleChannel(ch.id, val);
                            setAllowedChannels(updated);
                            onRefreshPolicies();
                          }}
                          trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                          thumbColor={isChannelAllowed ? '#16A34A' : '#F1F5F9'}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* 3.2. TÌM KIẾM KÊNH TRỰC TUYẾN & THÊM VÀO (ONLINE & CATALOG SEARCH) */}
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>
                  🔍 Tìm Kiếm Kênh Trực Tuyến & Thêm Vào
                </Text>
                <Text style={styles.cardDesc}>
                  Tìm kiếm kênh YouTube trực tuyến theo tên hoặc chủ đề (Peppa, VTV7, Paw Patrol, Blippi, Học vẽ...) và thêm vào với 1 chạm.
                </Text>

                <View style={styles.searchRow}>
                  <TextInput
                    style={[styles.formInput, { flex: 1 }]}
                    placeholder="Nhập tên kênh hoặc chủ đề bé thích..."
                    value={searchCatalogQuery}
                    onChangeText={setSearchCatalogQuery}
                    onSubmitEditing={handleOnlineSearch}
                  />
                  <TouchableOpacity
                    style={styles.onlineSearchBtn}
                    onPress={handleOnlineSearch}
                    disabled={isSearchingOnline}
                  >
                    {isSearchingOnline ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.onlineSearchText}>🌐 Tìm Online</Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Kết quả tìm kiếm kênh */}
                <View style={styles.catalogGrid}>
                  {searchResults.map((catCh) => {
                    const isAlreadyAdded = allChannels.some(
                      (c) => c.name.toLowerCase() === catCh.name.toLowerCase()
                    );
                    return (
                      <View key={catCh.id} style={styles.catalogCard}>
                        <View style={styles.catalogHeader}>
                          <View
                            style={[
                              styles.channelEmojiBox,
                              { backgroundColor: catCh.color || '#2563EB', width: 34, height: 34 },
                            ]}
                          >
                            <Text style={{ fontSize: 16 }}>{catCh.emoji}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Text style={styles.catalogTitle} numberOfLines={1}>
                                {catCh.name}
                              </Text>
                              {catCh.isOnline && (
                                <Text style={styles.onlineBadge}>Trực tuyến</Text>
                              )}
                            </View>
                            <Text style={styles.catalogSub} numberOfLines={1}>
                              {catCh.subscribers}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.catalogDesc} numberOfLines={2}>
                          {catCh.description}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.catalogAddBtn,
                            isAlreadyAdded && styles.catalogAddBtnDisabled,
                          ]}
                          disabled={isAlreadyAdded}
                          onPress={() => handleAddFromCatalog(catCh)}
                        >
                          <Text
                            style={[
                              styles.catalogAddText,
                              isAlreadyAdded && styles.catalogAddTextDisabled,
                            ]}
                          >
                            {isAlreadyAdded ? '✔️ Đã có trong danh sách' : '+ Thêm Vào YouTube Cho Bé'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* 3.3. TỰ TẠO KÊNH THỦ CÔNG */}
              <View style={styles.subSection}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => setShowManualCreate(!showManualCreate)}
                >
                  <Text style={styles.subSectionTitle}>
                    ✏️ Tự Nhập Kênh Khác Thủ Công {showManualCreate ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {showManualCreate && (
                  <View style={{ marginTop: 8 }}>
                    <TextInput
                      style={[styles.formInput, { marginBottom: 8 }]}
                      placeholder="Tên Kênh mới..."
                      value={newChannelName}
                      onChangeText={setNewChannelName}
                    />

                    {/* Chọn biểu tượng kênh */}
                    <Text style={styles.miniLabel}>Chọn biểu tượng cho kênh:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                      <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 4 }}>
                        {AVAILABLE_CHANNEL_EMOJIS.map((emoji) => (
                          <TouchableOpacity
                            key={emoji}
                            style={[
                              styles.emojiSelectBtn,
                              newChannelEmoji === emoji && styles.emojiSelectBtnActive,
                            ]}
                            onPress={() => setNewChannelEmoji(emoji)}
                          >
                            <Text style={{ fontSize: 20 }}>{emoji}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>

                    {/* Chọn Thể loại */}
                    <Text style={styles.miniLabel}>Thể loại:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        {YOUTUBE_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                          <TouchableOpacity
                            key={cat.id}
                            style={[
                              styles.catSelectBtn,
                              newChannelCategory === cat.id && styles.catSelectBtnActive,
                            ]}
                            onPress={() => setNewChannelCategory(cat.id)}
                          >
                            <Text
                              style={[
                                styles.catSelectText,
                                newChannelCategory === cat.id && styles.catSelectTextActive,
                              ]}
                            >
                              {cat.emoji} {cat.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>

                    <TextInput
                      style={[styles.formInput, { marginBottom: 10 }]}
                      placeholder="Link YouTube hoặc ID video đầu tiên (Tùy chọn)..."
                      value={newChannelFirstVideo}
                      onChangeText={setNewChannelFirstVideo}
                    />

                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#2563EB' }]}
                      onPress={handleCreateChannel}
                    >
                      <Text style={styles.actionBtnText}>+ Tạo Kênh Tùy Chỉnh</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* 3.4. Thêm Video Vào Kênh Đã Có & Tự Động Lấy Thông Tin */}
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>
                  🎬 Thêm Video Mới Vào Kênh
                </Text>
                <Text style={styles.cardDesc}>
                  Chọn kênh đích và dán Link YouTube. Hệ thống có thể tự động nhận diện tiêu đề video trực tuyến.
                </Text>

                {/* Chọn Kênh Đích */}
                <Text style={styles.miniLabel}>Chọn kênh để thêm video:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {allChannels.map((ch) => (
                      <TouchableOpacity
                        key={ch.id}
                        style={[
                          styles.catSelectBtn,
                          targetChannelId === ch.id && styles.catSelectBtnActive,
                        ]}
                        onPress={() => setTargetChannelId(ch.id)}
                      >
                        <Text
                          style={[
                            styles.catSelectText,
                            targetChannelId === ch.id && styles.catSelectTextActive,
                          ]}
                        >
                          {ch.emoji} {ch.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <View style={styles.searchRow}>
                  <TextInput
                    style={[styles.formInput, { flex: 1 }]}
                    placeholder="Dán Link YouTube (VD: https://youtu.be/...)..."
                    value={newVideoUrl}
                    onChangeText={setNewVideoUrl}
                  />
                  <TouchableOpacity
                    style={styles.fetchMetaBtn}
                    onPress={handleFetchMetadata}
                    disabled={isFetchingMetadata}
                  >
                    {isFetchingMetadata ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.fetchMetaText}>⚡ Tải Tên</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={[styles.formInput, { marginBottom: 10, marginTop: 8 }]}
                  placeholder="Tiêu đề video..."
                  value={newVideoTitle}
                  onChangeText={setNewVideoTitle}
                />

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#16A34A' }]}
                  onPress={handleAddVideoToChannel}
                >
                  <Text style={styles.actionBtnText}>+ Thêm Video Vào Kênh</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* NHÓM 4: BẢO MẬT & MÃ PIN */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔒 Mã PIN Phụ huynh</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.pinInput}
              value={newPin}
              onChangeText={setNewPin}
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity style={styles.savePinBtn} onPress={handleSavePin}>
              <Text style={styles.savePinText}>Lưu PIN</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NHÓM 5: THÔNG TIN BẢN QUYỀN */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📜 Bản Quyền Ứng Dụng</Text>
          <Text style={styles.licenseInfo}>
            Trạng thái: <Text style={{ color: '#16A34A', fontWeight: 'bold' }}>Đã Kích Hoạt</Text>
          </Text>
          <Text style={styles.licenseInfo}>
            License Key: <Text style={{ fontWeight: 'bold' }}>{storage.getString(STORAGE_KEYS.LICENSE_KEY) || 'LCK-DEMO'}</Text>
          </Text>
          <TouchableOpacity
            style={styles.resetLicenseBtn}
            onPress={() => {
              Alert.alert(
                'Xác nhận đăng xuất',
                'Bạn có chắc chắn muốn hủy kích hoạt bản quyền trên thiết bị này?',
                [
                  { text: 'Hủy', style: 'cancel' },
                  { text: 'Đồng ý', style: 'destructive', onPress: onResetLicense },
                ]
              );
            }}
          >
            <Text style={styles.resetLicenseText}>Hủy kích hoạt bản quyền (Đăng xuất)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  closeBtnText: {
    fontWeight: '700',
    color: '#475569',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  subLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 4,
  },
  scheduleInputs: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 13,
    color: '#475569',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    width: 120,
    textAlign: 'center',
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  appSettingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#E2E8F0',
  },
  appPlaceholderIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  appPackage: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  subSection: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  channelEmojiBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  channelEmojiText: {
    fontSize: 18,
  },
  customBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  onlineBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  deleteChBtn: {
    padding: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
  },
  deleteChBtnText: {
    fontSize: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  onlineSearchBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 95,
  },
  onlineSearchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  fetchMetaBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fetchMetaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 13,
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  emojiSelectBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiSelectBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    transform: [{ scale: 1.1 }],
  },
  catSelectBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  catSelectBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  catSelectText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  catSelectTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // CATALOG STYLES
  catalogGrid: {
    gap: 10,
  },
  catalogCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catalogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  catalogTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  catalogSub: {
    fontSize: 11,
    color: '#64748B',
  },
  catalogDesc: {
    fontSize: 12,
    color: '#475569',
    marginVertical: 4,
    lineHeight: 16,
  },
  catalogAddBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  catalogAddBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  catalogAddText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  catalogAddTextDisabled: {
    color: '#64748B',
  },
  accordionHeader: {
    paddingVertical: 4,
  },

  pinInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    letterSpacing: 4,
    width: 140,
    textAlign: 'center',
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
    fontWeight: 'bold',
  },
  savePinBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  savePinText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  licenseInfo: {
    fontSize: 13,
    color: '#334155',
    marginVertical: 3,
  },
  resetLicenseBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  resetLicenseText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 13,
  },
});
