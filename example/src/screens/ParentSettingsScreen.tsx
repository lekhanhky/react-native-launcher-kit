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
  useWindowDimensions,
  Modal,
} from 'react-native';
import { RNLauncherKitHelper } from 'react-native-launcher-kit';
import type { AppDetail } from 'react-native-launcher-kit/src/interfaces/InstalledApps';
import { storage, STORAGE_KEYS } from '../services/storage';
import { ScheduleConfig } from '../services/timeScheduler';
import { launcherHelper } from '../services/launcherHelper';
import {
  youtubeService,
  YouTubeChannel,
} from '../services/youtubeService';
import { YouTubeChannelSearchScreen } from './YouTubeChannelSearchScreen';
import { YouTubeVideoDetailScreen } from './YouTubeVideoDetailScreen';

interface ParentSettingsScreenProps {
  allApps: AppDetail[];
  onClose: () => void;
  onRefreshPolicies: () => void;
  onResetLicense: () => void;
}

type SettingsTab = 'apps' | 'youtube' | 'account';

export const ParentSettingsScreen: React.FC<ParentSettingsScreenProps> = ({
  allApps,
  onClose,
  onRefreshPolicies,
  onResetLicense,
}) => {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<SettingsTab>('apps');

  // 1. Quản lý danh sách ứng dụng & Tìm kiếm
  const [blockedPackages, setBlockedPackages] = useState<string[]>(() => {
    try {
      const raw = storage.getString(STORAGE_KEYS.PACKAGE_LIST);
      return raw ? JSON.parse(raw) : ['com.android.settings'];
    } catch {
      return ['com.android.settings'];
    }
  });
  const [appSearchQuery, setAppSearchQuery] = useState<string>('');
  const [isAdminActive, setIsAdminActive] = useState<boolean>(false);

  // 2. Quản lý Lịch biểu Giờ học / Ngủ
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

  // 3. Quản lý PIN Phụ huynh
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
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  // Modal Thêm Kênh Nhanh (khi bấm Floating Action Button +)
  const [showAddChannelModal, setShowAddChannelModal] = useState<boolean>(false);
  const [inputChannelText, setInputChannelText] = useState<string>('');

  // Kênh đang chọn xem Chi Tiết Video
  const [selectedDetailChannel, setSelectedDetailChannel] = useState<YouTubeChannel | null>(null);

  // Kiểm tra trạng thái Device Admin khi mở màn hình
  useEffect(() => {
    launcherHelper.isDeviceAdminActive().then(setIsAdminActive);
  }, []);

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

  // Toggle cho phép / tắt tất cả app
  const isAllAppsAllowed =
    allApps.length > 0 &&
    allApps.every((a) => !blockedPackages.includes(a.packageName));

  const toggleAllApps = (allowAll: boolean) => {
    let updated: string[];
    if (allowAll) {
      // Cho phép tất cả -> danh sách chặn rỗng
      updated = [];
    } else {
      // Tắt tất cả -> chặn tất cả các app
      updated = allApps.map((a) => a.packageName);
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
    Alert.alert('Thành công', 'Đã cập nhật mã PIN Phụ huynh mới!');
  };

  // Xử lý xóa bất kỳ kênh nào
  const handleDeleteChannel = (channel: YouTubeChannel) => {
    Alert.alert(
      'Xóa Kênh',
      `Bạn có chắc chắn muốn xóa kênh "${channel.name}" khỏi danh sách của bé?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            youtubeService.deleteChannel(channel.id);
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

  // Xử lý thêm nhanh kênh từ nút (+)
  const handleQuickAddChannel = () => {
    if (!inputChannelText.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên kênh hoặc dán link YouTube!');
      return;
    }
    const name = inputChannelText.trim();
    const created = youtubeService.addCustomChannel({
      name: name,
      emoji: '📺',
      color: '#DC2626',
      category: 'cartoon',
      description: 'Kênh do phụ huynh thêm',
    });
    const updated = youtubeService.getAllChannels();
    setAllChannels(updated);
    setAllowedChannels(youtubeService.getAllowedChannelIds());
    setInputChannelText('');
    setShowAddChannelModal(false);
    Alert.alert('Thành công', `Đã thêm kênh "${created.name}" vào danh sách của bé!`);
    onRefreshPolicies();
  };

  // Đồng bộ đám mây thủ công
  const handleSyncCloud = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await youtubeService.syncWithSupabase();
      if (res.success) {
        setAllChannels(youtubeService.getAllChannels());
        setAllowedChannels(youtubeService.getAllowedChannelIds());
        Alert.alert('Thành công', 'Đã đồng bộ toàn bộ chính sách và kênh với đám mây Supabase!');
        onRefreshPolicies();
      } else {
        Alert.alert('Thông báo', (res as any).error || 'Không thể đồng bộ Supabase lúc này.');
      }
    } catch (e: any) {
      Alert.alert('Lỗi đồng bộ', e?.message || 'Có lỗi xảy ra khi kết nối Supabase');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Lọc app theo tìm kiếm
  const filteredApps = allApps.filter(
    (app) =>
      !appSearchQuery.trim() ||
      app.label.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(appSearchQuery.toLowerCase())
  );

  const allowedAppsCount = allApps.filter((a) => !blockedPackages.includes(a.packageName)).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER CHÍNH */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>⚙️ Cài đặt Phụ huynh</Text>
          <Text style={styles.headerSubtitle}>Quản lý an toàn và giám sát thiết bị của bé</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>Đóng ✕</Text>
        </TouchableOpacity>
      </View>

      {/* 3 TAB CHÍNH */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'apps' && styles.tabItemActive]}
          onPress={() => setActiveTab('apps')}
          activeOpacity={0.8}
        >
          <Text style={styles.tabIcon}>📱</Text>
          <Text style={[styles.tabTitle, activeTab === 'apps' && styles.tabTitleActive]}>
            Quản Lý App
          </Text>
          <View style={[styles.tabBadge, activeTab === 'apps' && styles.tabBadgeActive]}>
            <Text style={[styles.tabBadgeText, activeTab === 'apps' && styles.tabBadgeTextActive]}>
              {allowedAppsCount}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'youtube' && styles.tabItemActive]}
          onPress={() => setActiveTab('youtube')}
          activeOpacity={0.8}
        >
          <Text style={styles.tabIcon}>📺</Text>
          <Text style={[styles.tabTitle, activeTab === 'youtube' && styles.tabTitleActive]}>
            Quản Lý YouTube
          </Text>
          <View style={[styles.tabBadge, activeTab === 'youtube' && styles.tabBadgeActive]}>
            <Text style={[styles.tabBadgeText, activeTab === 'youtube' && styles.tabBadgeTextActive]}>
              {allowedChannels.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'account' && styles.tabItemActive]}
          onPress={() => setActiveTab('account')}
          activeOpacity={0.8}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabTitle, activeTab === 'account' && styles.tabTitleActive]}>
            Tài Khoản
          </Text>
        </TouchableOpacity>
      </View>

      {/* NỘI DUNG TỪNG TAB */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* ========================================================================= */}
        {/* TAB 1: QUẢN LÝ ỨNG DỤNG (APPS) */}
        {/* ========================================================================= */}
        {activeTab === 'apps' && (
          <>
            {/* 1.1. BẢO VỆ CHỐNG GỠ ỨNG DỤNG (DEVICE ADMIN) */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>🛡️ Bảo Vệ Chống Gỡ Ứng Dụng</Text>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: isAdminActive ? '#DCFCE7' : '#FEF3C7' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: isAdminActive ? '#15803D' : '#B45309' },
                    ]}
                  >
                    {isAdminActive ? 'Đã bảo vệ ✅' : 'Chưa kích hoạt ⚠️'}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardDesc}>
                Khóa quyền gỡ cài đặt trong hệ thống Android để bé không thể xóa Launcher quản lý.
              </Text>
              {!isAdminActive ? (
                <TouchableOpacity
                  style={styles.adminActionBtn}
                  onPress={() => {
                    launcherHelper.requestDeviceAdmin();
                  }}
                >
                  <Text style={styles.adminActionBtnText}>🚀 Kích Hoạt Quyền Quản Trị Viên (Device Admin)</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.adminActiveHint}>
                  ✔️ Ứng dụng đã được cấp quyền quản trị viên thiết bị an toàn.
                </Text>
              )}
            </View>

            {/* 1.2. THIẾT LẬP MÀN HÌNH CHÍNH MẶC ĐỊNH (DEFAULT LAUNCHER) */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>🏠 Đặt Làm Màn Hình Chính Mặc Định</Text>
              </View>
              <Text style={styles.cardDesc}>
                Khóa phím Home và phím Back để bé luôn ở trong Kids Launcher mà không thể thoát ra ngoài.
              </Text>
              <TouchableOpacity
                style={styles.defaultLauncherBtn}
                onPress={async () => {
                  try {
                    await RNLauncherKitHelper.openSetDefaultLauncher();
                  } catch {
                    await RNLauncherKitHelper.requestDefaultLauncher();
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.defaultLauncherBtnText}>
                  ⚙️ Mở Cài Đặt Chọn Màn Hình Chính Mặc Định
                </Text>
              </TouchableOpacity>
            </View>

            {/* 1.3. KHUNG GIỜ CHO PHÉP SỬ DỤNG (SCHEDULE) */}
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

            {/* 1.3. DANH SÁCH ỨNG DỤNG CHO PHÉP (WHITELIST) */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>📱 Ứng Dụng Hiển Thị Cho Bé</Text>
                <Text style={styles.counterText}>
                  {allowedAppsCount}/{allApps.length} app
                </Text>
              </View>
              <Text style={styles.cardDesc}>
                Chỉ những ứng dụng được gạt công tắc MÀU XANH mới hiển thị trên màn hình của bé.
              </Text>

              {/* Thanh tìm kiếm app */}
              <TextInput
                style={styles.searchInput}
                placeholder="🔍 Tìm kiếm ứng dụng theo tên hoặc package..."
                value={appSearchQuery}
                onChangeText={setAppSearchQuery}
              />

              {/* TOGGLE CHO PHÉP / TẮT TẤT CẢ ỨNG DỤNG */}
              <View style={styles.toggleAllAppsCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleAllAppsTitle}>
                    {isAllAppsAllowed ? 'Cho phép tất cả ứng dụng' : 'Bật / Tắt tất cả ứng dụng'}
                  </Text>
                  <Text style={styles.toggleAllAppsSub}>
                    {isAllAppsAllowed
                      ? `Đang bật tất cả (${allowedAppsCount}/${allApps.length} app)`
                      : `Gạt công tắc để bật nhanh tất cả ứng dụng cho bé`}
                  </Text>
                </View>
                <Switch
                  value={isAllAppsAllowed}
                  onValueChange={toggleAllApps}
                  trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                  thumbColor={isAllAppsAllowed ? '#16A34A' : '#F1F5F9'}
                />
              </View>

              {filteredApps.map((app) => {
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
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: QUẢN LÝ YOUTUBE (YOUTUBE) */}
        {/* ========================================================================= */}
        {activeTab === 'youtube' && (
          <View style={styles.youtubeTabContainer}>
            {/* TIÊU ĐỀ SECTION CHÍNH */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeading}>Kênh của bé</Text>
              <Text style={styles.sectionSubheading}>
                Quản lý và xem thống kê các kênh YouTube.
              </Text>
            </View>

            {/* CÔNG TẮC BẬT TẮT YOUTUBE */}
            <View style={styles.ytToggleCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.ytToggleTitle}>📺 Kích hoạt YouTube Cho Bé</Text>
                <Text style={styles.ytToggleSub}>
                  Chặn video rác, Shorts và đề xuất ngoài luồng
                </Text>
              </View>
              <Switch
                value={ytEnabled}
                onValueChange={(val) => {
                  setYtEnabled(val);
                  youtubeService.setYouTubeEnabled(val);
                  onRefreshPolicies();
                }}
                trackColor={{ false: '#E5E7EB', true: '#FCA5A5' }}
                thumbColor={ytEnabled ? '#DC2626' : '#9CA3AF'}
              />
            </View>

            {ytEnabled && (
              <>
                {/* DANH SÁCH CÁC KÊNH (MODERN CHANNEL CARDS) */}
                <View style={styles.channelsList}>
                  {allChannels.map((ch) => {
                    const isAllowed = allowedChannels.includes(ch.id);
                    return (
                      <TouchableOpacity
                        key={ch.id}
                        style={styles.modernChannelCard}
                        activeOpacity={0.85}
                        onPress={() => setSelectedDetailChannel(ch)}
                      >
                        {/* AVATAR KÊNH TRÒN */}
                        {ch.avatar && !ch.avatar.includes('placeholder') ? (
                          <Image
                            source={{ uri: ch.avatar }}
                            style={styles.channelAvatarImg}
                          />
                        ) : (
                          <View
                            style={[
                              styles.channelAvatarLetter,
                              { backgroundColor: ch.color || '#E5E7EB' },
                            ]}
                          >
                            <Text style={styles.channelAvatarLetterText}>
                              {ch.emoji || ch.name.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}

                        {/* THÔNG TIN KÊNH */}
                        <View style={styles.modernChannelInfo}>
                          <View style={styles.channelNameRow}>
                            <Text style={styles.modernChannelName} numberOfLines={1}>
                              {ch.name}
                            </Text>
                            <View style={styles.redVerifiedCircle}>
                              <Text style={styles.redVerifiedCheck}>✓</Text>
                            </View>
                          </View>

                          <Text style={styles.modernChannelSubs} numberOfLines={1}>
                            {ch.subscribers || '1.2M người đăng ký'}
                          </Text>

                          <View style={styles.liveStatusRow}>
                            <View
                              style={[
                                styles.liveDot,
                                { backgroundColor: isAllowed ? '#DC2626' : '#9CA3AF' },
                              ]}
                            />
                            <Text
                              style={[
                                styles.liveStatusText,
                                { color: isAllowed ? '#DC2626' : '#6B7280' },
                              ]}
                            >
                              {isAllowed ? 'Đang cho phép' : 'Đang tắt'}
                            </Text>
                          </View>
                        </View>

                        {/* NÚT XÓA, SWITCH VÀ NÚT MŨI TÊN CHEVRON */}
                        <View style={styles.cardActionsRight}>
                          <TouchableOpacity
                            style={styles.trashCircleBtn}
                            onPress={() => handleDeleteChannel(ch)}
                            activeOpacity={0.7}
                          >
                            <Text style={{ fontSize: 13 }}>🗑️</Text>
                          </TouchableOpacity>

                          <Switch
                            value={isAllowed}
                            onValueChange={() => {
                              const updated = youtubeService.toggleChannel(ch.id, !isAllowed);
                              setAllowedChannels(updated);
                              onRefreshPolicies();
                            }}
                            trackColor={{ false: '#E5E7EB', true: '#FCA5A5' }}
                            thumbColor={isAllowed ? '#DC2626' : '#9CA3AF'}
                          />

                          <View style={styles.chevronCircle}>
                            <Text style={styles.chevronArrow}>›</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* THẺ ĐỎ: TỔNG QUAN THÁNG NÀY / THỜI LƯỢNG */}
                <View style={styles.redStatsBanner}>
                  <View style={styles.redStatsTopRow}>
                    <View style={styles.redStatsIconBox}>
                      <Text style={{ fontSize: 20 }}>📈</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.redStatsTitle}>Tổng quan tháng này</Text>
                      <Text style={styles.redStatsSub}>
                        Đã xem: {youtubeService.getTodayWatchedMinutes()} / {ytDailyLimit} phút tối đa hôm nay.
                      </Text>
                    </View>
                  </View>

                  {/* CHỌN NHANH THỜI LƯỢNG */}
                  <View style={styles.redTimePillsContainer}>
                    {[15, 30, 45, 60, 90, 120].map((mins) => {
                      const isSelected = ytDailyLimit === String(mins);
                      return (
                        <TouchableOpacity
                          key={mins}
                          style={[
                            styles.redTimePill,
                            isSelected && styles.redTimePillActive,
                          ]}
                          onPress={() => {
                            setYtDailyLimit(String(mins));
                            youtubeService.setDailyLimitMinutes(mins);
                          }}
                        >
                          <Text
                            style={[
                              styles.redTimePillText,
                              isSelected && styles.redTimePillTextActive,
                            ]}
                          >
                            {mins}p
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* NÚT XEM BÁO CÁO */}
                  <TouchableOpacity
                    style={styles.redReportPillBtn}
                    onPress={() => {
                      Alert.alert(
                        '📊 Báo Cáo Thời Lượng YouTube',
                        `• Thời lượng đã xem hôm nay: ${youtubeService.getTodayWatchedMinutes()} phút.\n• Hạn mức tối đa: ${ytDailyLimit} phút/ngày.\n• Số kênh đang bật: ${allowedChannels.length}/${allChannels.length} kênh.`
                      );
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.redReportBtnText}>Xem báo cáo</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TÀI KHOẢN & BẢN QUYỀN (ACCOUNT) */}
        {/* ========================================================================= */}
        {activeTab === 'account' && (
          <>
            {/* 3.1. THÔNG TIN BẢN QUYỀN THIẾT BỊ */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📜 Thông Tin Bản Quyền Thiết Bị</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Trạng thái bản quyền:</Text>
                <View style={[styles.statusPill, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.statusPillText, { color: '#15803D' }]}>Đã Kích Hoạt ✅</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>License Key:</Text>
                <Text style={styles.infoValue}>
                  {storage.getString(STORAGE_KEYS.LICENSE_KEY) || 'LCK-DEMO-PARENT'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Device Unique ID:</Text>
                <Text style={styles.infoValue}>
                  {storage.getString(STORAGE_KEYS.DEVICE_ID) || 'ANDROID_DEVICE_TEST'}
                </Text>
              </View>
            </View>

            {/* 3.2. ĐỒNG BỘ ĐÁM MÂY SUPABASE */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>☁️ Đồng Bộ Đám Mây (Supabase)</Text>
              <Text style={styles.cardDesc}>
                Tải các chính sách, kênh YouTube mới nhất từ xa và gửi nhật ký thời lượng xem lên máy chủ.
              </Text>
              <TouchableOpacity
                style={styles.syncBtn}
                onPress={handleSyncCloud}
                disabled={isSyncingCloud}
                activeOpacity={0.8}
              >
                {isSyncingCloud ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.syncBtnText}>🔄 Đồng Bộ Dữ Liệu Ngay</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* 3.3. BẢO MẬT & ĐỔI MÃ PIN */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🔒 Mã PIN Phụ Huynh</Text>
              <Text style={styles.cardDesc}>
                Mã PIN bảo vệ màn hình Cài đặt và mở khóa khẩn cấp ngoài giờ.
              </Text>
              <View style={styles.pinRow}>
                <TextInput
                  style={styles.pinInput}
                  value={newPin}
                  onChangeText={setNewPin}
                  keyboardType="numeric"
                  maxLength={6}
                  secureTextEntry
                  placeholder="1234"
                />
                <TouchableOpacity style={styles.savePinBtn} onPress={handleSavePin}>
                  <Text style={styles.savePinText}>Lưu Mã PIN</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 3.4. ĐĂNG XUẤT THIẾT BỊ */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚪 Đăng Xuất Thiết Bị</Text>
              <Text style={styles.cardDesc}>
                Hủy kích hoạt bản quyền trên thiết bị này và chuyển về màn hình đăng nhập khóa bản quyền ban đầu.
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
                <Text style={styles.resetLicenseText}>Hủy Kích Hoạt Bản Quyền (Đăng Xuất)</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* FLOATING ACTION BUTTON (+) Ở GÓC DƯỚI BÊN PHẢI (BOTTOM RIGHT) */}
      {activeTab === 'youtube' && (
        <TouchableOpacity
          style={styles.floatingAddBtn}
          onPress={() => setShowAddChannelModal(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.floatingAddBtnText}>+</Text>
        </TouchableOpacity>
      )}

      {/* MODAL TÌM KIẾM & CHỌN NHIỀU KÊNH (KHI BẤM NÚT +) */}
      <Modal
        visible={showAddChannelModal}
        animationType="slide"
        onRequestClose={() => setShowAddChannelModal(false)}
      >
        <YouTubeChannelSearchScreen
          onClose={() => setShowAddChannelModal(false)}
          onChannelsAdded={() => {
            setAllChannels(youtubeService.getAllChannels());
            setAllowedChannels(youtubeService.getAllowedChannelIds());
            onRefreshPolicies();
          }}
        />
      </Modal>

      {/* MODAL CHI TIẾT VIDEO CỦA KÊNH KHI BẤM VÀO KÊNH */}
      <Modal
        visible={!!selectedDetailChannel}
        animationType="slide"
        onRequestClose={() => setSelectedDetailChannel(null)}
      >
        {selectedDetailChannel && (
          <YouTubeVideoDetailScreen
            channel={selectedDetailChannel}
            onClose={() => setSelectedDetailChannel(null)}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  closeBtnText: {
    fontWeight: '700',
    color: '#334155',
    fontSize: 13,
  },

  /* TAB BAR */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#6366F1',
  },
  tabIcon: {
    fontSize: 16,
  },
  tabTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTitleActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  tabBadgeActive: {
    backgroundColor: '#4F46E5',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  /* STATUS PILL */
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },

  /* ADMIN BUTTON */
  adminActionBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  adminActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  defaultLauncherBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  defaultLauncherBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  adminActiveHint: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
  },

  /* SCHEDULE */
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  scheduleInputs: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 14,
    color: '#0F172A',
    width: 110,
    textAlign: 'center',
    backgroundColor: '#F8FAFC',
  },

  /* QUICK TIME LIMIT BUTTONS */
  quickTimeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickTimeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  quickTimeBtnActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  quickTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  quickTimeTextActive: {
    color: '#FFFFFF',
  },

  /* APP LIST */
  searchInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 12,
  },
  toggleAllAppsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  toggleAllAppsTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  toggleAllAppsSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  appSettingsIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  appPlaceholderIcon: {
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  appPackage: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },

  /* MODERN YOUTUBE TAB STYLES */
  youtubeTabContainer: {
    gap: 14,
  },
  sectionHeader: {
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  sectionSubheading: {
    fontSize: 13.5,
    color: '#4B5563',
    marginTop: 3,
  },
  ytToggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ytToggleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  ytToggleSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  channelsList: {
    gap: 10,
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
    gap: 2,
  },
  channelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  modernChannelName: {
    fontSize: 15.5,
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
    fontSize: 12.5,
    color: '#4B5563',
    fontWeight: '500',
  },
  liveStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trashCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronArrow: {
    fontSize: 18,
    color: '#4B5563',
    fontWeight: '700',
    marginTop: -2,
  },

  /* RED OVERVIEW CARD */
  redStatsBanner: {
    backgroundColor: '#E11D48',
    borderRadius: 22,
    padding: 18,
    marginTop: 6,
    gap: 12,
    shadowColor: '#E11D48',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  redStatsTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  redStatsIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#9F1239',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redStatsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  redStatsSub: {
    fontSize: 12.5,
    color: '#FFE4E6',
    marginTop: 2,
  },
  redTimePillsContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  redTimePill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#BE123C',
  },
  redTimePillActive: {
    backgroundColor: '#FFFFFF',
  },
  redTimePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFE4E6',
  },
  redTimePillTextActive: {
    color: '#BE123C',
  },
  redReportPillBtn: {
    backgroundColor: '#9F1239',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  redReportBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* ACCOUNT TAB */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 13.5,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  syncBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13.5,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  pinInput: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    width: 120,
    textAlign: 'center',
    letterSpacing: 4,
  },
  savePinBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  savePinText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13.5,
  },
  resetLicenseBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  resetLicenseText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 13.5,
  },

  /* FLOATING ACTION BUTTON (+) */
  floatingAddBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  floatingAddBtnText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -2,
  },

  /* ADD MODAL STYLES */
  addModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  addModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  addModalHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  addModalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  addModalSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  addModalInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 20,
  },
  addModalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  addModalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  addModalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  addModalConfirmBtn: {
    flex: 1.4,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  addModalConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
