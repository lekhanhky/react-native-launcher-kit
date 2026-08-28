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
  AppState,
  BackHandler,
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
import { MemoryGameScreen } from './MemoryGameScreen';
import { BubblePopGameScreen } from './BubblePopGameScreen';
import { AnimalSoundGameScreen } from './AnimalSoundGameScreen';
import { ColoringGameScreen } from './ColoringGameScreen';
import { SortingGameScreen } from './SortingGameScreen';
import { MazeGameScreen } from './MazeGameScreen';
import { TangramPuzzleGameScreen } from './TangramPuzzleGameScreen';
import { LockOverlay } from '../components/LockOverlay';
import { ParentPinModal } from '../components/ParentPinModal';
import { DeviceAdminGuideModal } from '../components/DeviceAdminGuideModal';
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

  // Memory Game Screen state
  const [showMemoryGame, setShowMemoryGame] = useState<boolean>(false);

  // Bubble Pop Game Screen state
  const [showBubblePopGame, setShowBubblePopGame] = useState<boolean>(false);

  // Animal Sound Game Screen state
  const [showAnimalSoundGame, setShowAnimalSoundGame] = useState<boolean>(false);

  // Coloring Game Screen state
  const [showColoringGame, setShowColoringGame] = useState<boolean>(false);

  // Sorting Game Screen state
  const [showSortingGame, setShowSortingGame] = useState<boolean>(false);

  // Maze Game Screen state
  const [showMazeGame, setShowMazeGame] = useState<boolean>(false);

  // Tangram Puzzle Game Screen state
  const [showTangramGame, setShowTangramGame] = useState<boolean>(false);

  // Device Admin Guide Modal state
  const [showAdminGuideModal, setShowAdminGuideModal] = useState<boolean>(false);

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

      // Game 1: Lật thẻ trí nhớ cho bé
      const memoryGameApp: AppDetail = {
        label: 'Lật Thẻ Trí Nhớ',
        packageName: 'internal.game.memory',
        icon: '',
      };

      // Game 2: Nổ bong bóng kỳ diệu
      const bubblePopApp: AppDetail = {
        label: 'Nổ Bong Bóng',
        packageName: 'internal.game.bubblepop',
        icon: '',
      };

      // Game 3: Nghe tiếng đoán con vật
      const animalSoundApp: AppDetail = {
        label: 'Đoán Con Vật',
        packageName: 'internal.game.animalsound',
        icon: '',
      };

      // Game 4: Bé vui tô màu & Sáng tạo
      const coloringGameApp: AppDetail = {
        label: 'Bé Tập Tô Màu',
        packageName: 'internal.game.coloring',
        icon: '',
      };

      // Game 5: Phân loại rác & Đồ vật
      const sortingGameApp: AppDetail = {
        label: 'Bé Phân Loại',
        packageName: 'internal.game.sorting',
        icon: '',
      };

      // Game 8: Mê cung tìm đường về tổ
      const mazeGameApp: AppDetail = {
        label: 'Mê Cung Kỳ Thú',
        packageName: 'internal.game.maze',
        icon: '',
      };

      // Game 10: Xếp hình trí tuệ Tangram / Jigsaw
      const tangramGameApp: AppDetail = {
        label: 'Bé Xếp Hình',
        packageName: 'internal.game.tangram',
        icon: '',
      };

      // Thêm ứng dụng YouTube an toàn nếu phụ huynh cho phép
      if (youtubeService.isYouTubeEnabled()) {
        const ytApp: AppDetail = {
          label: 'YouTube Kids',
          packageName: 'internal.safe.youtube',
          icon: '',
        };
        filtered = [memoryGameApp, bubblePopApp, animalSoundApp, coloringGameApp, sortingGameApp, mazeGameApp, tangramGameApp, ytApp, ...filtered];
      } else {
        filtered = [memoryGameApp, bubblePopApp, animalSoundApp, coloringGameApp, sortingGameApp, mazeGameApp, tangramGameApp, ...filtered];
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
    
    // Kiểm tra và hiển thị hướng dẫn kích hoạt Device Admin nếu chưa bật
    launcherHelper.isDeviceAdminActive().then(isActive => {
      if (!isActive) {
        setShowAdminGuideModal(true);
      }
    });

    loadApps();
    evaluateSchedule();

    // Tự động kiểm tra lại khi người dùng quay lại app từ màn hình Cài đặt Android
    const appStateSub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        launcherHelper.isDeviceAdminActive().then(isActive => {
          if (isActive) {
            setShowAdminGuideModal(false);
          }
        });
      }
    });

    const interval = setInterval(evaluateSchedule, 15000);
    InstalledApps.startListeningForAppInstallations(() => loadApps());
    InstalledApps.startListeningForAppRemovals(() => loadApps());

    return () => {
      appStateSub.remove();
      clearInterval(interval);
      InstalledApps.stopListeningForAppInstallations();
      InstalledApps.stopListeningForAppRemovals();
    };
  }, [loadApps, evaluateSchedule]);

  // 3.1. Chặn phím Back vật lý / phím ESC trên Android để không bao giờ thoát khỏi Launcher
  useEffect(() => {
    const onBackPress = () => {
      if (showPinModal) {
        setShowPinModal(false);
        return true;
      }
      if (showThemeModal) {
        setShowThemeModal(false);
        return true;
      }
      if (showAdminGuideModal) {
        setShowAdminGuideModal(false);
        return true;
      }
      if (showMemoryGame) {
        setShowMemoryGame(false);
        return true;
      }
      if (showBubblePopGame) {
        setShowBubblePopGame(false);
        return true;
      }
      if (showAnimalSoundGame) {
        setShowAnimalSoundGame(false);
        return true;
      }
      if (showColoringGame) {
        setShowColoringGame(false);
        return true;
      }
      if (showSortingGame) {
        setShowSortingGame(false);
        return true;
      }
      if (showMazeGame) {
        setShowMazeGame(false);
        return true;
      }
      if (showTangramGame) {
        setShowTangramGame(false);
        return true;
      }
      if (showYouTubeScreen) {
        setShowYouTubeScreen(false);
        return true;
      }
      if (showSettingsScreen) {
        setShowSettingsScreen(false);
        return true;
      }
      // Đang ở màn hình chính của Launcher: CHẶN THOÁT (Return true)
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [
    showPinModal,
    showThemeModal,
    showAdminGuideModal,
    showMemoryGame,
    showBubblePopGame,
    showAnimalSoundGame,
    showColoringGame,
    showSortingGame,
    showMazeGame,
    showTangramGame,
    showYouTubeScreen,
    showSettingsScreen,
  ]);

  // 4. Xử lý mở app
  const handleLaunchApp = (packageName: string) => {
    if (isLocked) {
      Alert.alert('Thiết bị đang bị khóa', lockReason);
      return;
    }

    // Mở Game 1: Lật Thẻ Trí Nhớ
    if (packageName === 'internal.game.memory') {
      setShowMemoryGame(true);
      return;
    }

    // Mở Game 2: Nổ Bong Bóng Kỳ Diệu
    if (packageName === 'internal.game.bubblepop') {
      setShowBubblePopGame(true);
      return;
    }

    // Mở Game 3: Nghe Tiếng Đoán Con Vật
    if (packageName === 'internal.game.animalsound') {
      setShowAnimalSoundGame(true);
      return;
    }

    // Mở Game 4: Bé Tập Tô Màu & Nét Vẽ Sáng Tạo
    if (packageName === 'internal.game.coloring') {
      setShowColoringGame(true);
      return;
    }

    // Mở Game 5: Bé Phân Loại Rác & Đồ Vật
    if (packageName === 'internal.game.sorting') {
      setShowSortingGame(true);
      return;
    }

    // Mở Game 8: Mê Cung Tìm Đường Về Tổ
    if (packageName === 'internal.game.maze') {
      setShowMazeGame(true);
      return;
    }

    // Mở Game 10: Xếp Hình Trí Tuệ Tangram / Jigsaw
    if (packageName === 'internal.game.tangram') {
      setShowTangramGame(true);
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

  // Mở màn hình Game 1: Lật Thẻ Trí Nhớ
  if (showMemoryGame) {
    return (
      <MemoryGameScreen
        theme={currentTheme}
        onClose={() => setShowMemoryGame(false)}
      />
    );
  }

  // Mở màn hình Game 2: Nổ Bong Bóng Kỳ Diệu
  if (showBubblePopGame) {
    return (
      <BubblePopGameScreen
        theme={currentTheme}
        onClose={() => setShowBubblePopGame(false)}
      />
    );
  }

  // Mở màn hình Game 3: Nghe Tiếng Đoán Con Vật
  if (showAnimalSoundGame) {
    return (
      <AnimalSoundGameScreen
        theme={currentTheme}
        onClose={() => setShowAnimalSoundGame(false)}
      />
    );
  }

  // Mở màn hình Game 4: Bé Tập Tô Màu
  if (showColoringGame) {
    return (
      <ColoringGameScreen
        theme={currentTheme}
        onClose={() => setShowColoringGame(false)}
      />
    );
  }

  // Mở màn hình Game 5: Bé Phân Loại Rác & Đồ Vật
  if (showSortingGame) {
    return (
      <SortingGameScreen
        theme={currentTheme}
        onClose={() => setShowSortingGame(false)}
      />
    );
  }

  // Mở màn hình Game 8: Mê Cung Tìm Đường
  if (showMazeGame) {
    return (
      <MazeGameScreen
        theme={currentTheme}
        onClose={() => setShowMazeGame(false)}
      />
    );
  }

  // Mở màn hình Game 10: Xếp Hình Trí Tuệ Tangram / Jigsaw
  if (showTangramGame) {
    return (
      <TangramPuzzleGameScreen
        theme={currentTheme}
        onClose={() => setShowTangramGame(false)}
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
            const isMemoryGame = item.packageName === 'internal.game.memory';
            const isBubblePop = item.packageName === 'internal.game.bubblepop';
            const isAnimalSound = item.packageName === 'internal.game.animalsound';
            const isColoringGame = item.packageName === 'internal.game.coloring';
            const isSortingGame = item.packageName === 'internal.game.sorting';
            const isMazeGame = item.packageName === 'internal.game.maze';
            const isTangramGame = item.packageName === 'internal.game.tangram';
            return (
              <TouchableOpacity
                style={styles.appCard}
                activeOpacity={0.7}
                onPress={() => handleLaunchApp(item.packageName)}
              >
                {/* ICON ỨNG DỤNG */}
                {isMemoryGame ? (
                  <View style={[styles.appIcon, styles.gameIconContainer]}>
                    <View style={styles.gameInnerBadge}>
                      <Text style={styles.gameEmojiIcon}>🃏</Text>
                    </View>
                  </View>
                ) : isBubblePop ? (
                  <View style={[styles.appIcon, styles.bubblePopIconContainer]}>
                    <View style={styles.bubblePopInnerBadge}>
                      <Text style={styles.bubblePopEmojiIcon}>🎈</Text>
                    </View>
                  </View>
                ) : isAnimalSound ? (
                  <View style={[styles.appIcon, styles.animalSoundIconContainer]}>
                    <View style={styles.animalSoundInnerBadge}>
                      <Text style={styles.animalSoundEmojiIcon}>🐶</Text>
                    </View>
                  </View>
                ) : isColoringGame ? (
                  <View style={[styles.appIcon, styles.coloringIconContainer]}>
                    <View style={styles.coloringInnerBadge}>
                      <Text style={styles.coloringEmojiIcon}>🎨</Text>
                    </View>
                  </View>
                ) : isSortingGame ? (
                  <View style={[styles.appIcon, styles.sortingIconContainer]}>
                    <View style={styles.sortingInnerBadge}>
                      <Text style={styles.sortingEmojiIcon}>♻️</Text>
                    </View>
                  </View>
                ) : isMazeGame ? (
                  <View style={[styles.appIcon, styles.mazeIconContainer]}>
                    <View style={styles.mazeInnerBadge}>
                      <Text style={styles.mazeEmojiIcon}>🌀</Text>
                    </View>
                  </View>
                ) : isTangramGame ? (
                  <View style={[styles.appIcon, styles.tangramIconContainer]}>
                    <View style={styles.tangramInnerBadge}>
                      <Text style={styles.tangramEmojiIcon}>🧩</Text>
                    </View>
                  </View>
                ) : isYouTube ? (
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

        {/* MODAL HƯỚNG DẪN KÍCH HOẠT QUẢN TRỊ VIÊN THIẾT BỊ (CHỐNG GỠ APP) */}
        <DeviceAdminGuideModal
          visible={showAdminGuideModal}
          onClose={() => setShowAdminGuideModal(false)}
          onConfirm={() => {
            launcherHelper.requestDeviceAdmin();
          }}
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

  // GAME 1: MEMORY GAME ICON
  gameIconContainer: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  gameInnerBadge: {
    width: 44,
    height: 44,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameEmojiIcon: {
    fontSize: 24,
  },

  // GAME 2: BUBBLE POP ICON
  bubblePopIconContainer: {
    backgroundColor: '#0284C7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  bubblePopInnerBadge: {
    width: 44,
    height: 44,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubblePopEmojiIcon: {
    fontSize: 24,
  },

  // GAME 3: ANIMAL SOUND ICON
  animalSoundIconContainer: {
    backgroundColor: '#D97706',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  animalSoundInnerBadge: {
    width: 44,
    height: 44,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalSoundEmojiIcon: {
    fontSize: 24,
  },

  // GAME 4: COLORING BOOK ICON
  coloringIconContainer: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  coloringInnerBadge: {
    width: 44,
    height: 44,
    backgroundColor: '#EDE9FE',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coloringEmojiIcon: {
    fontSize: 24,
  },

  // GAME 5: SORTING GAME ICON
  sortingIconContainer: {
    backgroundColor: '#059669',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  sortingInnerBadge: {
    width: 44,
    height: 44,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortingEmojiIcon: {
    fontSize: 24,
  },

  // GAME 8: MAZE GAME ICON
  mazeIconContainer: {
    backgroundColor: '#0284C7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  mazeInnerBadge: {
    width: 44,
    height: 44,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mazeEmojiIcon: {
    fontSize: 24,
  },

  // GAME 10: TANGRAM PUZZLE ICON
  tangramIconContainer: {
    backgroundColor: '#D946EF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C026D3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  tangramInnerBadge: {
    width: 44,
    height: 44,
    backgroundColor: '#FAE8FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tangramEmojiIcon: {
    fontSize: 24,
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
