import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar,
  useWindowDimensions,
  AppState,
  BackHandler,
  Platform,
  ToastAndroid,
} from 'react-native';
import { InstalledApps, RNLauncherKitHelper } from 'react-native-launcher-kit';
import type { AppDetail } from 'react-native-launcher-kit/src/interfaces/InstalledApps';
import { storage, STORAGE_KEYS } from '../services/storage';
import { launcherHelper } from '../services/launcherHelper';
import { checkIsOutsideAllowedHours, ScheduleConfig } from '../services/timeScheduler';
import { parentalRealtimeService } from '../services/parentalRealtimeService';
import { ThemeConfig, themeService } from '../services/themes';
import { KidsWallpaper, wallpaperService } from '../services/wallpapers';
import { youtubeService } from '../services/youtubeService';
import { ThemeSelectorModal } from '../components/ThemeSelectorModal';
import { LockOverlay } from '../components/LockOverlay';
import { ParentPinModal } from '../components/ParentPinModal';
import { DeviceAdminGuideModal } from '../components/DeviceAdminGuideModal';
import { ParentSettingsScreen } from './ParentSettingsScreen';

// Sub-components giao diện mới Kids Wonder Park
import { LauncherHeader } from '../components/launcher/LauncherHeader';
import { LauncherHeroBanner } from '../components/launcher/LauncherHeroBanner';
import { LauncherCategoryTabs } from '../components/launcher/LauncherCategoryTabs';
import { LauncherGameCard } from '../components/launcher/LauncherGameCard';
import { LauncherBottomDock } from '../components/launcher/LauncherBottomDock';

// Registry các trò chơi nội bộ
import {
  INTERNAL_GAMES_REGISTRY,
  LauncherCategoryType,
  LauncherGameItem,
} from '../data/launcherGamesRegistry';

// Màn hình các trò chơi giáo dục & Video an toàn
import { KidsYouTubeScreen } from './KidsYouTubeScreen';
import { GreenKidsTubeScreen } from './GreenKidsTubeScreen';
import { MemoryGameScreen } from './MemoryGameScreen';
import { BubblePopGameScreen } from './BubblePopGameScreen';
import { AnimalSoundGameScreen } from './AnimalSoundGameScreen';
import { ColoringGameScreen } from './ColoringGameScreen';
import { SortingGameScreen } from './SortingGameScreen';
import { MazeGameScreen } from './MazeGameScreen';
import { TangramPuzzleGameScreen } from './TangramPuzzleGameScreen';
import { JigsawPuzzleGameScreen } from './JigsawPuzzleGameScreen';
import { MathQuizGameScreen } from './MathQuizGameScreen';
import { WordSpellingGameScreen } from './WordSpellingGameScreen';
import { ConnectDotsGameScreen } from './ConnectDotsGameScreen';
import { SnakeEduGameScreen } from './SnakeEduGameScreen';
import { FlashcardGameScreen } from './FlashcardGameScreen';
import { SpaceShooterGameScreen } from './SpaceShooterGameScreen';
import { RobotCoderGameScreen } from './RobotCoderGameScreen';
import { EmotionGardenGameScreen } from './EmotionGardenGameScreen';
import { ShadowMatchingGameScreen } from './ShadowMatchingGameScreen';
import { SpotDifferenceGameScreen } from './SpotDifferenceGameScreen';
import { XylophoneGameScreen } from './XylophoneGameScreen';
import { LittleGardenerGameScreen } from './LittleGardenerGameScreen';
import { WeatherDressUpGameScreen } from './WeatherDressUpGameScreen';
import { BalanceScaleGameScreen } from './BalanceScaleGameScreen';
import { SolarSystemGameScreen } from './SolarSystemGameScreen';
import { DentalHabitsGameScreen } from './DentalHabitsGameScreen';
import { PetCareGameScreen } from './PetCareGameScreen';
import { FourSeasonsGameScreen } from './FourSeasonsGameScreen';
import { ContinentExplorerGameScreen } from './ContinentExplorerGameScreen';
import { NatureExplorerGameScreen } from './NatureExplorerGameScreen';
import { RiddlesGameScreen } from './RiddlesGameScreen';
import { ShadowDetectiveScreen } from './ShadowDetectiveScreen';

interface KidsLauncherScreenProps {
  onResetLicense: () => void;
}

type LauncherGridItem =
  | { type: 'game'; game: LauncherGameItem }
  | { type: 'external'; app: AppDetail };

export const KidsLauncherScreen: React.FC<KidsLauncherScreenProps> = ({
  onResetLicense,
}) => {
  const { width, height } = useWindowDimensions();
  const numColumns = width > 900 ? 6 : width > 600 ? 4 : 3;
  const cardWidth = (width - 32) / numColumns;

  // State quản lý ứng dụng & bảo mật
  const [allApps, setAllApps] = useState<AppDetail[]>([]);
  const [allowedExternalApps, setAllowedExternalApps] = useState<AppDetail[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [isTempUnlocked, setIsTempUnlocked] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);

  // Theme & Wallpaper
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() =>
    themeService.getSavedTheme()
  );
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [currentWallpaper, setCurrentWallpaper] = useState<KidsWallpaper>(() =>
    wallpaperService.getSavedWallpaper()
  );

  // Tab phân loại danh mục
  const [selectedCategory, setSelectedCategory] = useState<LauncherCategoryType>('all');

  // Router điều hướng mở game/màn hình tập trung (Active ID Router)
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [showAdminGuideModal, setShowAdminGuideModal] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinAction, setPinAction] = useState<'unlock_temp' | 'open_settings'>('open_settings');
  const [showSettingsScreen, setShowSettingsScreen] = useState(false);

  // Chạm 5 lần mở cài đặt phụ huynh
  const parentSecretTapCountRef = useRef<number>(0);
  const parentSecretTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSecretParentTap = useCallback(() => {
    parentSecretTapCountRef.current += 1;
    const currentTaps = parentSecretTapCountRef.current;

    if (parentSecretTapTimerRef.current) {
      clearTimeout(parentSecretTapTimerRef.current);
    }

    if (currentTaps >= 5) {
      parentSecretTapCountRef.current = 0;
      setPinAction('open_settings');
      setShowPinModal(true);
    } else {
      if (Platform.OS === 'android' && currentTaps >= 3) {
        ToastAndroid.show(
          `Chạm thêm ${5 - currentTaps} lần để mở Cài đặt Phụ huynh`,
          ToastAndroid.SHORT
        );
      }
      parentSecretTapTimerRef.current = setTimeout(() => {
        parentSecretTapCountRef.current = 0;
      }, 2500);
    }
  }, []);

  // 1. Tải danh sách ứng dụng Android đã cài
  const loadApps = useCallback(async () => {
    try {
      let apps: AppDetail[] = [];
      try {
        apps = (await InstalledApps.getSortedApps()) || [];
        setAllApps(apps);
      } catch (nativeErr) {
        console.warn('InstalledApps.getSortedApps error:', nativeErr);
      }

      const hasInitialized = storage.getBoolean(STORAGE_KEYS.HAS_INITIALIZED_APP_BLOCK_ALL);
      let blockedList: string[] = [];

      if (!hasInitialized && apps.length > 0) {
        blockedList = apps.map((a) => a.packageName);
        storage.set(STORAGE_KEYS.PACKAGE_LIST, JSON.stringify(blockedList));
        storage.set(STORAGE_KEYS.HAS_INITIALIZED_APP_BLOCK_ALL, true);
      } else {
        try {
          const raw = storage.getString(STORAGE_KEYS.PACKAGE_LIST);
          if (raw) {
            blockedList = JSON.parse(raw);
          } else if (apps.length > 0) {
            blockedList = apps.map((a) => a.packageName);
            storage.set(STORAGE_KEYS.PACKAGE_LIST, JSON.stringify(blockedList));
          }
        } catch (e) {
          console.warn(e);
          blockedList = apps.map((a) => a.packageName);
        }
      }

      const externalAllowed = apps.filter((app) => !blockedList.includes(app.packageName));
      setAllowedExternalApps(externalAllowed);
    } catch (err) {
      console.warn('Lỗi load apps:', err);
    }
  }, []);

  // 2. Đánh giá giờ chơi và thời gian còn lại
  const evaluateSchedule = useCallback(() => {
    if (isTempUnlocked) {
      setIsLocked(false);
      return;
    }

    if (parentalRealtimeService.isEmergencyLocked()) {
      setIsLocked(true);
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

      if (!result.isBlocked && schedule.isEnabled) {
        const now = new Date();
        const [endH, endM] = schedule.allowedEndTime.split(':').map(Number);
        const end = new Date(now);
        end.setHours(endH, endM, 0, 0);
        const diffMinutes = Math.max(0, Math.round((end.getTime() - now.getTime()) / 60000));
        setRemainingMinutes(diffMinutes);
      } else {
        setRemainingMinutes(null);
      }
    } catch (e) {
      console.warn(e);
    }
  }, [isTempUnlocked]);

  // 3. Khởi tạo dịch vụ nền
  useEffect(() => {
    launcherHelper.setupDefaultLauncher();

    launcherHelper.isDeviceAdminActive().then((isActive) => {
      if (!isActive) {
        setShowAdminGuideModal(true);
      }
    });

    loadApps();
    evaluateSchedule();

    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        launcherHelper.isDeviceAdminActive().then((isActive) => {
          if (isActive) {
            setShowAdminGuideModal(false);
          }
        });
      }
    });

    const interval = setInterval(evaluateSchedule, 15000);
    InstalledApps.startListeningForAppInstallations(() => loadApps());
    InstalledApps.startListeningForAppRemovals(() => loadApps());

    const unsubscribeRealtime = parentalRealtimeService.subscribeToRemoteLock(
      (emergencyLocked, message) => {
        if (emergencyLocked) {
          setIsLocked(true);
          setLockReason(message || 'Lệnh khóa khẩn cấp từ phụ huynh.');
        } else {
          evaluateSchedule();
        }
      }
    );

    return () => {
      clearInterval(interval);
      appStateSub.remove();
      unsubscribeRealtime();
    };
  }, [loadApps, evaluateSchedule]);

  // 4. Xử lý nút Back phần cứng Android
  useEffect(() => {
    const onBackPress = () => {
      if (isLocked) return true;

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
      if (activeAppId) {
        setActiveAppId(null);
        return true;
      }
      if (showSettingsScreen) {
        setShowSettingsScreen(false);
        return true;
      }
      // Chặn thoát launcher
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [
    isLocked,
    showPinModal,
    showThemeModal,
    showAdminGuideModal,
    activeAppId,
    showSettingsScreen,
  ]);

  // 5. Xử lý mở ứng dụng
  const handleLaunchApp = (packageName: string) => {
    if (isLocked) {
      Alert.alert('Thiết bị đang bị khóa', lockReason);
      return;
    }

    if (packageName.startsWith('internal.')) {
      setActiveAppId(packageName);
      return;
    }

    // Ứng dụng bên thứ ba
    RNLauncherKitHelper.launchApplication(packageName);
  };

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

  // 6. Danh sách ứng dụng lọc theo danh mục
  const displayItems = useMemo<LauncherGridItem[]>(() => {
    const isYouTubeAllowed = youtubeService.isYouTubeEnabled();

    const filteredGames = INTERNAL_GAMES_REGISTRY.filter((game) => {
      if (game.id === 'internal.safe.youtube' && !isYouTubeAllowed) {
        return false;
      }
      if (selectedCategory === 'all') return true;
      return game.category === selectedCategory;
    });

    const gameItems: LauncherGridItem[] = filteredGames.map((game) => ({
      type: 'game',
      game,
    }));

    if (selectedCategory === 'all' || selectedCategory === 'apps') {
      const appItems: LauncherGridItem[] = allowedExternalApps.map((app) => ({
        type: 'external',
        app,
      }));
      return [...gameItems, ...appItems];
    }

    return gameItems;
  }, [selectedCategory, allowedExternalApps]);

  // 7. Render màn hình cài đặt phụ huynh nếu đang mở
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

  // 8. Render Game toàn màn hình qua Router duy nhất
  if (activeAppId) {
    const closeActiveApp = () => setActiveAppId(null);
    switch (activeAppId) {
      case 'internal.game.riddles100':
        return <RiddlesGameScreen onClose={closeActiveApp} />;
      case 'internal.game.shadowdetective':
        return <ShadowDetectiveScreen onClose={closeActiveApp} />;
      case 'internal.game.flashcards':
        return <FlashcardGameScreen onClose={closeActiveApp} />;
      case 'internal.game.natureexplorer':
        return <NatureExplorerGameScreen onClose={closeActiveApp} />;
      case 'internal.safe.greentube':
        return <GreenKidsTubeScreen theme={currentTheme} onClose={closeActiveApp} />;
      case 'internal.safe.youtube':
        return <KidsYouTubeScreen theme={currentTheme} onClose={closeActiveApp} />;
      case 'internal.game.memory':
        return <MemoryGameScreen theme={currentTheme} onClose={closeActiveApp} />;
      case 'internal.game.bubblepop':
        return <BubblePopGameScreen theme={currentTheme} onClose={closeActiveApp} />;
      case 'internal.game.animalsound':
        return <AnimalSoundGameScreen theme={currentTheme} onClose={closeActiveApp} />;
      case 'internal.game.coloring':
        return <ColoringGameScreen theme={currentTheme} onClose={closeActiveApp} />;
      case 'internal.game.sorting':
        return <SortingGameScreen theme={currentTheme} onClose={closeActiveApp} />;
      case 'internal.game.math':
        return <MathQuizGameScreen onClose={closeActiveApp} />;
      case 'internal.game.wordspelling':
        return <WordSpellingGameScreen onClose={closeActiveApp} />;
      case 'internal.game.maze':
        return <MazeGameScreen theme={currentTheme} onClose={closeActiveApp} />;
      case 'internal.game.connectdots':
        return <ConnectDotsGameScreen onClose={closeActiveApp} />;
      case 'internal.game.tangram':
        return <TangramPuzzleGameScreen theme={currentTheme} onClose={closeActiveApp} />;
      case 'internal.game.jigsaw':
        return <JigsawPuzzleGameScreen theme={currentTheme} onClose={closeActiveApp} />;
      case 'internal.game.snakeedu':
        return <SnakeEduGameScreen onClose={closeActiveApp} />;
      case 'internal.game.spaceshooter':
        return <SpaceShooterGameScreen onClose={closeActiveApp} />;
      case 'internal.game.robotcoder':
        return <RobotCoderGameScreen onClose={closeActiveApp} />;
      case 'internal.game.emotions':
        return <EmotionGardenGameScreen onClose={closeActiveApp} />;
      case 'internal.game.shadowmatch':
        return <ShadowMatchingGameScreen onClose={closeActiveApp} />;
      case 'internal.game.spotdiff':
        return <SpotDifferenceGameScreen onClose={closeActiveApp} />;
      case 'internal.game.xylophone':
        return <XylophoneGameScreen onClose={closeActiveApp} />;
      case 'internal.game.gardener':
        return <LittleGardenerGameScreen onClose={closeActiveApp} />;
      case 'internal.game.weatherdress':
        return <WeatherDressUpGameScreen onClose={closeActiveApp} />;
      case 'internal.game.balancescale':
        return <BalanceScaleGameScreen onClose={closeActiveApp} />;
      case 'internal.game.solarsystem':
        return <SolarSystemGameScreen onClose={closeActiveApp} />;
      case 'internal.game.dentalhabits':
        return <DentalHabitsGameScreen onClose={closeActiveApp} />;
      case 'internal.game.petcare':
        return <PetCareGameScreen onClose={closeActiveApp} />;
      case 'internal.game.fourseasons':
        return <FourSeasonsGameScreen onClose={closeActiveApp} />;
      case 'internal.game.continentexplorer':
        return <ContinentExplorerGameScreen onClose={closeActiveApp} />;
      default:
        break;
    }
  }

  // 9. Render Màn Hình Chính Kids Wonder Park (v3.0)
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
        {/* NỀN HÌNH ẢNH NẾU ĐƯỢC CHỌN */}
        {!!currentWallpaper.imageUri && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Image
              source={{ uri: currentWallpaper.imageUri }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor:
                    currentWallpaper.overlayColor || 'rgba(255, 255, 255, 0.15)',
                },
              ]}
            />
          </View>
        )}

        {/* 1. SMART HEADER */}
        <LauncherHeader
          theme={currentTheme}
          remainingMinutes={remainingMinutes}
          starsCount={125}
          onOpenThemeModal={() => setShowThemeModal(true)}
          onOpenParentGate={() => {
            setPinAction('open_settings');
            setShowPinModal(true);
          }}
          onSecretParentTap={handleSecretParentTap}
        />

        {/* 2 & 3 & 4. LƯỚI THẺ BÀI TOY CARTRIDGE KÈM HERO BANNER VÀ CATEGORY TABS */}
        <FlatList
          key={`wonder_park_${numColumns}`}
          data={displayItems}
          numColumns={numColumns}
          keyExtractor={(item) =>
            item.type === 'game' ? item.game.id : item.app.packageName
          }
          contentContainerStyle={styles.appList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              {/* HERO BANNER NHIỆM VỤ HÔM NAY */}
              <LauncherHeroBanner onLaunchGame={handleLaunchApp} />

              {/* THANH TAB PHÂN LOẠI DANH MỤC */}
              <LauncherCategoryTabs
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                theme={currentTheme}
              />
            </View>
          }
          renderItem={({ item }) => {
            if (item.type === 'game') {
              return (
                <LauncherGameCard
                  game={item.game}
                  cardWidth={cardWidth}
                  theme={currentTheme}
                  onPress={() => handleLaunchApp(item.game.id)}
                />
              );
            }
            return (
              <LauncherGameCard
                externalApp={item.app}
                cardWidth={cardWidth}
                theme={currentTheme}
                onPress={() => handleLaunchApp(item.app.packageName)}
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🎈</Text>
              <Text style={[styles.emptyTitle, { color: currentTheme.emptyTitleColor }]}>
                Không có ứng dụng nào trong mục này
              </Text>
            </View>
          }
        />

        {/* 5. QUICK BOTTOM DOCK CỐ ĐỊNH */}
        <LauncherBottomDock
          onLaunchGame={handleLaunchApp}
          theme={currentTheme}
        />

        {/* MODALS BẢO MẬT & HỆ THỐNG */}
        <ThemeSelectorModal
          visible={showThemeModal}
          currentThemeId={currentTheme.id}
          currentWallpaperId={currentWallpaper.id}
          onSelectTheme={(t) => {
            setCurrentTheme(t);
            setShowThemeModal(false);
          }}
          onSelectWallpaper={(w) => {
            setCurrentWallpaper(w);
            setShowThemeModal(false);
          }}
          onClose={() => setShowThemeModal(false)}
        />

        <ParentPinModal
          visible={showPinModal}
          onSuccess={handlePinSuccess}
          onClose={() => setShowPinModal(false)}
        />

        <DeviceAdminGuideModal
          visible={showAdminGuideModal}
          onClose={() => setShowAdminGuideModal(false)}
          onConfirm={() => {
            launcherHelper.requestDeviceAdmin();
            setShowAdminGuideModal(false);
          }}
        />

        {isLocked && (
          <LockOverlay
            reason={lockReason}
            onUnlockPress={() => {
              setPinAction('unlock_temp');
              setShowPinModal(true);
            }}
          />
        )}
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
  appList: {
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
