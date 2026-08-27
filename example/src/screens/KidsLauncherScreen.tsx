import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { InstalledApps, RNLauncherKitHelper } from 'react-native-launcher-kit';
import type { AppDetail } from 'react-native-launcher-kit/src/interfaces/InstalledApps';
import { storage, STORAGE_KEYS } from '../services/storage';
import { launcherHelper } from '../services/launcherHelper';
import { checkIsOutsideAllowedHours, ScheduleConfig } from '../services/timeScheduler';
import { ThemeConfig, themeService } from '../services/themes';
import { youtubeService } from '../services/youtubeService';
import { ThemeSelectorModal } from '../components/ThemeSelectorModal';
import { KidsYouTubeScreen } from './KidsYouTubeScreen';
import { LockOverlay } from '../components/LockOverlay';
import { ParentPinModal } from '../components/ParentPinModal';
import { ParentSettingsScreen } from './ParentSettingsScreen';

interface KidsLauncherScreenProps {
  onResetLicense: () => void;
}

export const KidsLauncherScreen: React.FC<KidsLauncherScreenProps> = ({
  onResetLicense,
}) => {
  const { width, height } = useWindowDimensions();
  const numColumns = width > height ? 6 : 4;

  const [allApps, setAllApps] = useState<AppDetail[]>([]);
  const [visibleApps, setVisibleApps] = useState<AppDetail[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [isTempUnlocked, setIsTempUnlocked] = useState(false);

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() =>
    themeService.getSavedTheme()
  );
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);

  // Safe YouTube Screen state
  const [showYouTubeScreen, setShowYouTubeScreen] = useState<boolean>(false);

  // Modals & Navigation
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinAction, setPinAction] = useState<'unlock_temp' | 'open_settings'>('open_settings');
  const [showSettingsScreen, setShowSettingsScreen] = useState(false);

  // 1. Tải danh sách app
  const loadApps = useCallback(async () => {
    try {
      const apps = await InstalledApps.getSortedApps();
      setAllApps(apps);

      let blockedList: string[] = ['com.android.settings'];
      try {
        const raw = storage.getString(STORAGE_KEYS.PACKAGE_LIST);
        if (raw) blockedList = JSON.parse(raw);
      } catch (e) {
        console.warn(e);
      }

      let filtered = apps.filter((app) => !blockedList.includes(app.packageName));

      // Thêm ứng dụng YouTube an toàn nếu phụ huynh cho phép
      if (youtubeService.isYouTubeEnabled()) {
        const ytApp: AppDetail = {
          label: 'YouTube Kids',
          packageName: 'internal.safe.youtube',
          icon: '',
        };
        filtered = [ytApp, ...filtered];
      }

      setVisibleApps(filtered);
    } catch (err) {
      console.warn('Lỗi load apps:', err);
    }
  }, []);

  // 2. Đánh giá giờ học/ngủ
  const evaluateSchedule = useCallback(() => {
    if (isTempUnlocked) {
      setIsLocked(false);
      return;
    }

    try {
      const rawSchedule = storage.getString(STORAGE_KEYS.SCHEDULE);
      const schedule: ScheduleConfig = rawSchedule
        ? JSON.parse(rawSchedule)
        : {
            isEnabled: true,
            allowedStartTime: '07:00:00',
            allowedEndTime: '21:00:00',
            daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
            lockMessage: 'Đã đến giờ đi ngủ hoặc học bài! Bé hãy nghỉ ngơi nhé.',
          };

      const result = checkIsOutsideAllowedHours(schedule);
      setIsLocked(result.isBlocked);
      setLockReason(result.message);
    } catch (e) {
      console.warn(e);
    }
  }, [isTempUnlocked]);

  // 3. Khởi tạo
  useEffect(() => {
    launcherHelper.setupDefaultLauncher();
    loadApps();
    evaluateSchedule();

    const interval = setInterval(evaluateSchedule, 15000);
    InstalledApps.startListeningForAppInstallations(() => loadApps());
    InstalledApps.startListeningForAppRemovals(() => loadApps());

    return () => {
      clearInterval(interval);
      InstalledApps.stopListeningForAppInstallations();
      InstalledApps.stopListeningForAppRemovals();
    };
  }, [loadApps, evaluateSchedule]);

  // 4. Xử lý mở app
  const handleLaunchApp = (packageName: string) => {
    if (isLocked) {
      Alert.alert('Thiết bị đang bị khóa', lockReason);
      return;
    }

    // Mở YouTube an toàn nội bộ
    if (packageName === 'internal.safe.youtube') {
      setShowYouTubeScreen(true);
      return;
    }

    RNLauncherKitHelper.launchApplication(packageName);
  };

  // 5. Xử lý sau khi nhập PIN thành công
  const handlePinSuccess = () => {
    setShowPinModal(false);
    if (pinAction === 'unlock_temp') {
      setIsTempUnlocked(true);
      setIsLocked(false);
      Alert.alert('Thành công', 'Đã mở khóa thiết bị tạm thời cho phiên này!');
    } else {
      setShowSettingsScreen(true);
    }
  };

  if (showSettingsScreen) {
    return (
      <ParentSettingsScreen
        allApps={allApps}
        onClose={() => setShowSettingsScreen(false)}
        onRefreshPolicies={() => {
          loadApps();
          evaluateSchedule();
        }}
        onResetLicense={onResetLicense}
      />
    );
  }

  // Mở màn hình YouTube an toàn
  if (showYouTubeScreen) {
    return (
      <KidsYouTubeScreen
        theme={currentTheme}
        onClose={() => setShowYouTubeScreen(false)}
      />
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: currentTheme.backgroundColor },
      ]}
    >
      <StatusBar
        barStyle={currentTheme.statusBarStyle}
        backgroundColor={currentTheme.headerBg}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: currentTheme.backgroundColor },
        ]}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: currentTheme.headerBg,
              borderBottomColor: currentTheme.headerBorderColor,
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.greetingText,
                { color: currentTheme.greetingColor },
              ]}
            >
              {currentTheme.emoji} Chào bé yêu!
            </Text>
            <Text
              style={[
                styles.dateText,
                { color: currentTheme.subtitleColor },
              ]}
            >
              {currentTheme.name}
            </Text>
          </View>

          <View style={styles.headerActions}>
            {/* Nút Đổi Theme */}
            <TouchableOpacity
              style={[
                styles.themeBtn,
                {
                  backgroundColor: currentTheme.themeBtnBg,
                  borderColor: currentTheme.themeBtnBorder,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setShowThemeModal(true)}
            >
              <Text
                style={[
                  styles.themeBtnText,
                  { color: currentTheme.themeBtnText },
                ]}
              >
                🎨 Giao diện
              </Text>
            </TouchableOpacity>

            {/* Nút Phụ huynh */}
            <TouchableOpacity
              style={[
                styles.parentBtn,
                {
                  backgroundColor: currentTheme.parentBtnBg,
                  borderColor: currentTheme.parentBtnBorder,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => {
                setPinAction('open_settings');
                setShowPinModal(true);
              }}
            >
              <Text
                style={[
                  styles.parentBtnText,
                  { color: currentTheme.parentBtnText },
                ]}
              >
                ⚙️ Phụ huynh
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LƯỚI ỨNG DỤNG (KHÔNG CÒN Ô BAO QUANH, CHỈ CÒN ICON TRỰC QUAN) */}
        <FlatList
          key={`launcher_grid_${numColumns}`}
          data={visibleApps}
          numColumns={numColumns}
          keyExtractor={(item) => item.packageName}
          contentContainerStyle={styles.appList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isYouTube = item.packageName === 'internal.safe.youtube';
            return (
              <TouchableOpacity
                style={styles.appCard}
                activeOpacity={0.7}
                onPress={() => handleLaunchApp(item.packageName)}
              >
                {/* ICON ỨNG DỤNG */}
                {isYouTube ? (
                  <View style={[styles.appIcon, styles.youtubeIconContainer]}>
                    <View style={styles.youtubeRedBox}>
                      <Text style={styles.youtubePlayTriangle}>▶</Text>
                    </View>
                  </View>
                ) : item.icon ? (
                  <Image
                    source={{
                      uri:
                        item.icon.startsWith('file://') ||
                        item.icon.startsWith('data:') ||
                        item.icon.startsWith('http')
                          ? item.icon
                          : `data:image/png;base64,${item.icon}`,
                    }}
                    style={[
                      styles.appIcon,
                      {
                        borderRadius: currentTheme.iconBorderRadius,
                      },
                    ]}
                  />
                ) : (
                  <View
                    style={[
                      styles.appIcon,
                      styles.appIconPlaceholder,
                      {
                        backgroundColor: currentTheme.iconPlaceholderBg,
                        borderRadius: currentTheme.iconBorderRadius,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.placeholderChar,
                        { color: currentTheme.iconPlaceholderText },
                      ]}
                    >
                      {item.label?.charAt(0) || '📱'}
                    </Text>
                  </View>
                )}

                {/* TÊN ỨNG DỤNG */}
                <Text
                  style={[
                    styles.appLabel,
                    {
                      color: currentTheme.appLabelColor,
                      fontWeight: currentTheme.appLabelFontWeight,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>{currentTheme.emptyIcon}</Text>
              <Text
                style={[
                  styles.emptyTitle,
                  { color: currentTheme.emptyTitleColor },
                ]}
              >
                Chưa có ứng dụng nào được cấp phép
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: currentTheme.emptySubtitleColor },
                ]}
              >
                Phụ huynh hãy nhấn vào nút "⚙️ Phụ huynh" để mở khóa thêm ứng dụng cho bé.
              </Text>
            </View>
          }
        />

        {/* MODAL CHỌN THEME */}
        <ThemeSelectorModal
          visible={showThemeModal}
          currentThemeId={currentTheme.id}
          onSelectTheme={(theme) => setCurrentTheme(theme)}
          onClose={() => setShowThemeModal(false)}
        />

        {/* MÀN HÌNH KHÓA NGOÀI GIỜ */}
        {isLocked && (
          <LockOverlay
            reason={lockReason}
            onUnlockPress={() => {
              setPinAction('unlock_temp');
              setShowPinModal(true);
            }}
          />
        )}

        {/* MODAL MÃ PIN */}
        <ParentPinModal
          visible={showPinModal}
          onClose={() => setShowPinModal(false)}
          onSuccess={handlePinSuccess}
          title={
            pinAction === 'unlock_temp'
              ? 'Nhập PIN để mở khóa tạm thời'
              : 'Xác thực Phụ huynh'
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  greetingText: {
    fontSize: 17,
    fontWeight: '800',
  },
  dateText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  parentBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  parentBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // GRID & APPS (Clean Launcher Layout - No Outer Box)
  appList: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 40,
  },
  appCard: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 4,
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  appIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },

  // AUTHENTIC YOUTUBE ICON
  youtubeIconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 4,
  },
  youtubeRedBox: {
    width: 44,
    height: 30,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  youtubePlayTriangle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 2,
  },

  appIconPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderChar: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  appLabel: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 4,
    lineHeight: 16,
    maxWidth: 90,
  },

  emptyContainer: {
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
