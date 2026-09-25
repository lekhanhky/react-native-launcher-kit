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
  Platform,
  StatusBar,
} from 'react-native';
import { RNLauncherKitHelper } from 'react-native-launcher-kit';
import type { AppDetail } from 'react-native-launcher-kit/src/interfaces/InstalledApps';
import { storage, STORAGE_KEYS } from '../services/storage';
import { ScheduleConfig } from '../services/timeScheduler';
import { launcherHelper } from '../services/launcherHelper';
import { parentalRealtimeService } from '../services/parentalRealtimeService';
import {
  youtubeService,
  YouTubeChannel,
} from '../services/youtubeService';
import { vocabularyService } from '../services/vocabularyService';
import { VocabCategory, VocabCard } from '../data/oxfordKidsVocabulary';
import { YouTubeChannelSearchScreen } from './YouTubeChannelSearchScreen';
import { YouTubeVideoDetailScreen } from './YouTubeVideoDetailScreen';
import {
  natureExplorerService,
  NatureVideoConfigItem,
} from '../services/natureExplorerService';
import {
  NatureCinemaModal,
  extractYoutubeId,
  CinemaEntity,
} from '../components/explorer/NatureCinemaModal';
import { appConfigService } from '../services/appConfigService';
import { INTERNAL_GAMES_REGISTRY, LauncherGameItem } from '../data/launcherGamesRegistry';

interface ParentSettingsScreenProps {
  allApps: AppDetail[];
  onClose: () => void;
  onRefreshPolicies: () => void;
  onResetLicense: () => void;
}

type SettingsTab = 'apps' | 'youtube' | 'vocab' | 'account';

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
      const hasInitialized = storage.getBoolean(
        STORAGE_KEYS.HAS_INITIALIZED_APP_BLOCK_ALL
      );
      const raw = storage.getString(STORAGE_KEYS.PACKAGE_LIST);
      if (hasInitialized && raw) {
        return JSON.parse(raw);
      }
      // Lần đầu mở app: Mặc định tắt (khóa) tất cả các ứng dụng cài đặt
      const allBlocked = allApps.map((a) => a.packageName);
      if (allApps.length > 0) {
        storage.set(STORAGE_KEYS.PACKAGE_LIST, JSON.stringify(allBlocked));
        storage.set(STORAGE_KEYS.HAS_INITIALIZED_APP_BLOCK_ALL, true);
      }
      return allBlocked;
    } catch {
      return allApps.map((a) => a.packageName);
    }
  });

  useEffect(() => {
    if (
      !storage.getBoolean(STORAGE_KEYS.HAS_INITIALIZED_APP_BLOCK_ALL) &&
      allApps.length > 0
    ) {
      const allBlocked = allApps.map((a) => a.packageName);
      setBlockedPackages(allBlocked);
      storage.set(STORAGE_KEYS.PACKAGE_LIST, JSON.stringify(allBlocked));
      storage.set(STORAGE_KEYS.HAS_INITIALIZED_APP_BLOCK_ALL, true);
    }
  }, [allApps]);
  const [appSearchQuery, setAppSearchQuery] = useState<string>('');
  // Quản lý Bật / Tắt Game nội bộ Kids Wonder Park
  const [appSubTab, setAppSubTab] = useState<'internal' | 'external'>('internal');
  const [disabledInternalGames, setDisabledInternalGames] = useState<string[]>(() =>
    appConfigService.getDisabledInternalGameIds()
  );
  const [gameSearchQuery, setGameSearchQuery] = useState<string>('');

  const handleToggleInternalGame = async (gameId: string, enabled: boolean) => {
    await appConfigService.setInternalGameEnabled(gameId, enabled);
    setDisabledInternalGames(appConfigService.getDisabledInternalGameIds());
    onRefreshPolicies();
  };

  const handleToggleAllInternalGames = async (enableAll: boolean) => {
    for (const g of INTERNAL_GAMES_REGISTRY) {
      await appConfigService.setInternalGameEnabled(g.id, enableAll);
    }
    setDisabledInternalGames(appConfigService.getDisabledInternalGameIds());
    onRefreshPolicies();
  };

  const [isAdminActive, setIsAdminActive] = useState<boolean>(false);
  const [remoteLocked, setRemoteLocked] = useState<boolean>(() => parentalRealtimeService.isEmergencyLocked());
  const [currentDeviceId, setCurrentDeviceId] = useState<string>(() => parentalRealtimeService.getDeviceId() || 'Đang nạp...');

  useEffect(() => {
    const id = parentalRealtimeService.getDeviceId();
    if (id) setCurrentDeviceId(id);
    setRemoteLocked(parentalRealtimeService.isEmergencyLocked());
  }, []);

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

  // 4.1. Phân mục YouTube: 'channels' (Kênh trẻ em) | 'nature' (Video Khám Phá Rừng Xanh)
  const [ytSubTab, setYtSubTab] = useState<'channels' | 'nature'>('channels');
  const [natureVideos, setNatureVideos] = useState<NatureVideoConfigItem[]>(() =>
    natureExplorerService.getNatureVideoConfigs()
  );
  const [previewCinemaEntity, setPreviewCinemaEntity] = useState<CinemaEntity | null>(null);
  const [showPreviewCinema, setShowPreviewCinema] = useState<boolean>(false);

  // 5. Quản lý Từ Vựng (Vocabulary CMS)
  const [vocabCategories, setVocabCategories] = useState<VocabCategory[]>(() =>
    vocabularyService.getAllCategories()
  );
  const [selectedVocabCatId, setSelectedVocabCatId] = useState<string>(
    vocabCategories[0]?.id || 'animals'
  );
  const selectedVocabCat =
    vocabCategories.find((c) => c.id === selectedVocabCatId) || vocabCategories[0];

  // Modal Thêm / Sửa Từ Vựng
  const [showWordModal, setShowWordModal] = useState<boolean>(false);
  const [editingWord, setEditingWord] = useState<VocabCard | null>(null);
  const [wordForm, setWordForm] = useState({
    english: '',
    vietnamese: '',
    ipa: '',
    emoji: '⭐',
    exampleEn: '',
    exampleVi: '',
    funFact: '',
  });

  // Modal Thêm Danh Mục Mới
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [categoryForm, setCategoryForm] = useState({
    titleVi: '',
    titleEn: '',
    icon: '📚',
    color: '#3B82F6',
  });

  // Đăng ký lắng nghe thay đổi từ vựng
  useEffect(() => {
    const unsub = vocabularyService.subscribe((updated) => {
      setVocabCategories(updated);
    });
    return () => unsub();
  }, []);

  // Tổng số từ vựng
  const totalVocabWords = vocabCategories.reduce(
    (acc, cat) => acc + (cat.cards?.length || 0),
    0
  );

  // Mở modal thêm từ vựng mới
  const handleOpenAddWord = () => {
    setEditingWord(null);
    setWordForm({
      english: '',
      vietnamese: '',
      ipa: '',
      emoji: '⭐',
      exampleEn: '',
      exampleVi: '',
      funFact: '',
    });
    setShowWordModal(true);
  };

  // Mở modal sửa từ vựng
  const handleOpenEditWord = (card: VocabCard) => {
    setEditingWord(card);
    setWordForm({
      english: card.english,
      vietnamese: card.vietnamese,
      ipa: card.ipa,
      emoji: card.emoji,
      exampleEn: card.exampleEn,
      exampleVi: card.exampleVi,
      funFact: card.funFact,
    });
    setShowWordModal(true);
  };

  // Lưu từ vựng (Thêm hoặc Sửa)
  const handleSaveWord = () => {
    if (!wordForm.english.trim() || !wordForm.vietnamese.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Từ tiếng Anh và Nghĩa tiếng Việt!');
      return;
    }

    if (editingWord) {
      // Sửa từ
      vocabularyService.updateCard(selectedVocabCat.id, editingWord.id, {
        english: wordForm.english,
        vietnamese: wordForm.vietnamese,
        ipa: wordForm.ipa || `/${wordForm.english.toLowerCase()}/`,
        emoji: wordForm.emoji || '⭐',
        exampleEn: wordForm.exampleEn,
        exampleVi: wordForm.exampleVi,
        funFact: wordForm.funFact,
      });
      Alert.alert('Thành công', `Đã cập nhật từ "${wordForm.english}"!`);
    } else {
      // Thêm từ mới
      vocabularyService.addCard(selectedVocabCat.id, {
        english: wordForm.english,
        vietnamese: wordForm.vietnamese,
        ipa: wordForm.ipa,
        emoji: wordForm.emoji,
        exampleEn: wordForm.exampleEn,
        exampleVi: wordForm.exampleVi,
        funFact: wordForm.funFact,
      });
      Alert.alert('Thành công', `Đã thêm từ "${wordForm.english}" vào danh mục ${selectedVocabCat.titleVi}!`);
    }

    setVocabCategories(vocabularyService.getAllCategories());
    setShowWordModal(false);
  };

  // Xóa từ vựng
  const handleDeleteWord = (card: VocabCard) => {
    Alert.alert(
      'Xóa Từ Vựng',
      `Bạn có chắc chắn muốn xóa từ "${card.english} (${card.vietnamese})" khỏi danh mục?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            vocabularyService.deleteCard(selectedVocabCat.id, card.id);
            setVocabCategories(vocabularyService.getAllCategories());
          },
        },
      ]
    );
  };

  // Thêm danh mục mới
  const handleSaveCategory = () => {
    if (!categoryForm.titleVi.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Tên chủ đề tiếng Việt!');
      return;
    }

    const created = vocabularyService.addCategory({
      titleVi: categoryForm.titleVi,
      titleEn: categoryForm.titleEn || categoryForm.titleVi,
      icon: categoryForm.icon || '📚',
      color: categoryForm.color || '#3B82F6',
    });

    const updated = vocabularyService.getAllCategories();
    setVocabCategories(updated);
    setSelectedVocabCatId(created.id);
    setShowCategoryModal(false);
    setCategoryForm({ titleVi: '', titleEn: '', icon: '📚', color: '#3B82F6' });
    Alert.alert('Thành công', `Đã tạo chủ đề mới "${created.titleVi}"!`);
  };

  // Xóa danh mục
  const handleDeleteCategory = (cat: VocabCategory) => {
    Alert.alert(
      'Xóa Chủ Đề',
      `Bạn có chắc chắn muốn xóa toàn bộ chủ đề "${cat.titleVi}" cùng ${cat.cards?.length || 0} từ vựng bên trong?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa Toàn Bộ',
          style: 'destructive',
          onPress: () => {
            vocabularyService.deleteCategory(cat.id);
            const updated = vocabularyService.getAllCategories();
            setVocabCategories(updated);
            if (updated.length > 0) {
              setSelectedVocabCatId(updated[0].id);
            }
          },
        },
      ]
    );
  };

  // Khôi phục từ vựng mặc định Oxford
  const handleResetVocabDefault = () => {
    Alert.alert(
      'Khôi Phục Mặc Định',
      'Bạn có muốn khôi phục lại danh sách từ vựng chuẩn 3000 từ Oxford ban đầu không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi Phục',
          style: 'destructive',
          onPress: () => {
            vocabularyService.resetToDefault();
            const updated = vocabularyService.getAllCategories();
            setVocabCategories(updated);
            if (updated.length > 0) {
              setSelectedVocabCatId(updated[0].id);
            }
            Alert.alert('Thành công', 'Đã khôi phục toàn bộ từ vựng chuẩn Oxford!');
          },
        },
      ]
    );
  };

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

  // 4.2. Xử lý quản trị video YouTube Khám Phá Rừng Xanh
  const handleUpdateNatureVideo = (
    id: string,
    field: 'youtubeVideoId' | 'youtubeVideoTitleVi',
    value: string
  ) => {
    setNatureVideos((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleResetSingleNatureVideo = (id: string) => {
    setNatureVideos((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            youtubeVideoId: item.defaultYoutubeId,
            youtubeVideoTitleVi: item.defaultYoutubeTitle,
          };
        }
        return item;
      })
    );
  };

  const handleSaveAllNatureVideos = () => {
    const cleaned = natureVideos.map((item) => {
      const extracted = extractYoutubeId(item.youtubeVideoId);
      return {
        ...item,
        youtubeVideoId: extracted || item.defaultYoutubeId,
        youtubeVideoTitleVi: item.youtubeVideoTitleVi.trim() || item.defaultYoutubeTitle,
      };
    });
    setNatureVideos(cleaned);
    natureExplorerService.saveNatureVideoConfigs(cleaned);
    Alert.alert(
      '✅ Đã Lưu Thành Công',
      'Cấu hình 5 video YouTube cho game Khám Phá Rừng Xanh đã được lưu. Bé có thể xem video mới ngay trong game!'
    );
  };

  const handleResetAllNatureVideos = () => {
    Alert.alert(
      'Khôi Phục Mặc Định',
      'Bạn có chắc chắn muốn đặt lại tất cả 5 video sinh vật về video tài liệu giáo dục mặc định không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi Phục',
          style: 'destructive',
          onPress: () => {
            const defaults = natureExplorerService.resetToDefault();
            setNatureVideos(defaults);
            Alert.alert('Hoàn tất', 'Đã khôi phục 5 video về mặc định gốc!');
          },
        },
      ]
    );
  };

  const handlePreviewNatureVideo = (item: NatureVideoConfigItem) => {
    const videoId = extractYoutubeId(item.youtubeVideoId) || item.defaultYoutubeId;
    setPreviewCinemaEntity({
      id: item.id,
      nameVi: item.nameVi,
      badgeIcon: item.badgeIcon,
      youtubeVideoId: videoId,
      youtubeVideoTitleVi: item.youtubeVideoTitleVi || item.defaultYoutubeTitle,
      funFactVi: item.funFactVi,
      imageSource: item.imageSource,
    });
    setShowPreviewCinema(true);
  };

  // Lọc app theo tìm kiếm
  const filteredApps = allApps.filter(
    (app) =>
      !appSearchQuery.trim() ||
      app.label.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(appSearchQuery.toLowerCase())
  );

  const allowedAppsCount = allApps.filter((a) => !blockedPackages.includes(a.packageName)).length;

  // Lọc game nội bộ theo tìm kiếm
  const filteredInternalGames = INTERNAL_GAMES_REGISTRY.filter(
    (game) =>
      !gameSearchQuery.trim() ||
      game.title.toLowerCase().includes(gameSearchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(gameSearchQuery.toLowerCase()) ||
      game.id.toLowerCase().includes(gameSearchQuery.toLowerCase())
  );
  const enabledInternalGamesCount = INTERNAL_GAMES_REGISTRY.length - disabledInternalGames.length;
  const isAllInternalAllowed = disabledInternalGames.length === 0;

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

      {/* 4 TAB CHÍNH - Grid Responsive 2x2 */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'apps' && styles.tabItemActive]}
          onPress={() => setActiveTab('apps')}
          activeOpacity={0.8}
        >
          <Text style={styles.tabIcon}>📱</Text>
          <Text style={[styles.tabTitle, activeTab === 'apps' && styles.tabTitleActive]}>
            App
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
            YouTube
          </Text>
          <View style={[styles.tabBadge, activeTab === 'youtube' && styles.tabBadgeActive]}>
            <Text style={[styles.tabBadgeText, activeTab === 'youtube' && styles.tabBadgeTextActive]}>
              {allowedChannels.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'vocab' && styles.tabItemActive]}
          onPress={() => setActiveTab('vocab')}
          activeOpacity={0.8}
        >
          <Text style={styles.tabIcon}>📚</Text>
          <Text style={[styles.tabTitle, activeTab === 'vocab' && styles.tabTitleActive]}>
            Từ Vựng
          </Text>
          <View style={[styles.tabBadge, activeTab === 'vocab' && styles.tabBadgeActive]}>
            <Text style={[styles.tabBadgeText, activeTab === 'vocab' && styles.tabBadgeTextActive]}>
              {totalVocabWords}
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
            {/* 1.0. KHÓA KHẨN CẤP TỨC THÌ TỪ XA (REALTIME REMOTE LOCK) */}
            <View style={[styles.card, { borderColor: '#DC2626', borderWidth: 1.5 }]}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: '#DC2626' }]}>🚨 Khóa Khẩn Cấp Từ Xa (Realtime)</Text>
                <Switch
                  value={remoteLocked}
                  onValueChange={async (val) => {
                    setRemoteLocked(val);
                    const devId = parentalRealtimeService.getDeviceId();
                    if (devId) {
                      await parentalRealtimeService.setRemoteLock(devId, val);
                      Alert.alert(
                        val ? 'Đã kích hoạt Khóa Khẩn Cấp' : 'Đã Hủy Khóa Khẩn Cấp',
                        val
                          ? 'Thiết bị của bé sẽ hiển thị màn hình khóa ngay lập tức qua Supabase Realtime!'
                          : 'Thiết bị của bé đã được mở khóa bình thường.'
                      );
                    }
                  }}
                  trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
                  thumbColor={remoteLocked ? '#DC2626' : '#F1F5F9'}
                />
              </View>
              <Text style={styles.cardDesc}>
                Mã thiết bị (Device ID): <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>{currentDeviceId}</Text>
              </Text>
              <Text style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
                Khi gạt công tắc này từ App/Web Phụ huynh, máy tính bảng của bé sẽ nhận tín hiệu WebSocket và khóa màn hình ngay tức thì (&lt; 1 giây).
              </Text>
            </View>

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

            {/* 1.4. BỘ CHỌN SUB-TAB: GAME NỘI BỘ vs APP CÀI NGOÀI */}
            <View style={styles.appSubTabRow}>
              <TouchableOpacity
                style={[
                  styles.appSubTabBtn,
                  appSubTab === 'internal' && styles.appSubTabBtnActive,
                ]}
                onPress={() => setAppSubTab('internal')}
                activeOpacity={0.8}
              >
                <Text style={styles.appSubTabIcon}>🎮</Text>
                <Text
                  style={[
                    styles.appSubTabText,
                    appSubTab === 'internal' && styles.appSubTabTextActive,
                  ]}
                >
                  Game Nội Bộ ({enabledInternalGamesCount}/{INTERNAL_GAMES_REGISTRY.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.appSubTabBtn,
                  appSubTab === 'external' && styles.appSubTabBtnActive,
                ]}
                onPress={() => setAppSubTab('external')}
                activeOpacity={0.8}
              >
                <Text style={styles.appSubTabIcon}>📱</Text>
                <Text
                  style={[
                    styles.appSubTabText,
                    appSubTab === 'external' && styles.appSubTabTextActive,
                  ]}
                >
                  App Cài Ngoài ({allowedAppsCount}/{allApps.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* SUB-TAB 1: TRÒ CHƠI & TÍNH NĂNG NỘI BỘ (KIDS PARK) */}
            {appSubTab === 'internal' && (
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>🎮 Trò Chơi & Tiện Ích Nội Bộ</Text>
                  <Text style={styles.counterText}>
                    {enabledInternalGamesCount}/{INTERNAL_GAMES_REGISTRY.length} game
                  </Text>
                </View>
                <Text style={styles.cardDesc}>
                  Bật/tắt từng trò chơi 3D, câu đố hoặc công cụ học tập hiển thị trên màn hình /home của bé.
                </Text>

                {/* Tìm kiếm Game nội bộ */}
                <TextInput
                  style={styles.searchInput}
                  placeholder="🔍 Tìm kiếm game nội bộ theo tên hoặc mô tả..."
                  value={gameSearchQuery}
                  onChangeText={setGameSearchQuery}
                />

                {/* TOGGLE CHO PHÉP / TẮT TẤT CẢ GAME NỘI BỘ */}
                <View style={styles.toggleAllAppsCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleAllAppsTitle}>
                      {isAllInternalAllowed ? 'Bật tất cả trò chơi nội bộ' : 'Bật / Tắt tất cả game nội bộ'}
                    </Text>
                    <Text style={styles.toggleAllAppsSub}>
                      {isAllInternalAllowed
                        ? `Đang bật toàn bộ (${enabledInternalGamesCount}/${INTERNAL_GAMES_REGISTRY.length} game)`
                        : `Gạt công tắc để mở nhanh toàn bộ game nội bộ cho bé`}
                    </Text>
                  </View>
                  <Switch
                    value={isAllInternalAllowed}
                    onValueChange={handleToggleAllInternalGames}
                    trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                    thumbColor={isAllInternalAllowed ? '#16A34A' : '#F1F5F9'}
                  />
                </View>

                {filteredInternalGames.map((game) => {
                  const isAllowed = !disabledInternalGames.includes(game.id);
                  return (
                    <View key={game.id} style={styles.appRow}>
                      <View style={styles.gameIconEmojiBox}>
                        <Text style={styles.gameIconEmoji}>{game.iconEmoji || '🎮'}</Text>
                      </View>
                      <View style={styles.appInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.appName} numberOfLines={1}>
                            {game.title}
                          </Text>
                          {game.badge ? (
                            <View style={styles.gameBadgeTag}>
                              <Text style={styles.gameBadgeTagText}>{game.badge}</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.appPackage} numberOfLines={1}>
                          {game.description}
                        </Text>
                      </View>
                      <Switch
                        value={isAllowed}
                        onValueChange={(val) => handleToggleInternalGame(game.id, val)}
                        trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                        thumbColor={isAllowed ? '#16A34A' : '#F1F5F9'}
                      />
                    </View>
                  );
                })}
              </View>
            )}

            {/* SUB-TAB 2: ỨNG DỤNG ANDROID CÀI NGOÀI */}
            {appSubTab === 'external' && (
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
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: QUẢN LÝ YOUTUBE (YOUTUBE) */}
        {/* ========================================================================= */}
        {activeTab === 'youtube' && (
          <View style={styles.youtubeTabContainer}>
            {/* SUB-TABS: KÊNH WHITELIST & VIDEO KHÁM PHÁ RỪNG */}
            <View style={styles.ytSubTabRow}>
              <TouchableOpacity
                style={[
                  styles.ytSubTabBtn,
                  ytSubTab === 'channels' && styles.ytSubTabBtnActive,
                ]}
                onPress={() => setYtSubTab('channels')}
                activeOpacity={0.8}
              >
                <Text style={styles.ytSubTabIcon}>📺</Text>
                <Text
                  style={[
                    styles.ytSubTabText,
                    ytSubTab === 'channels' && styles.ytSubTabTextActive,
                  ]}
                >
                  Kênh Cho Bé ({allowedChannels.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ytSubTabBtn,
                  ytSubTab === 'nature' && styles.ytSubTabBtnActive,
                ]}
                onPress={() => setYtSubTab('nature')}
                activeOpacity={0.8}
              >
                <Text style={styles.ytSubTabIcon}>🌿</Text>
                <Text
                  style={[
                    styles.ytSubTabText,
                    ytSubTab === 'nature' && styles.ytSubTabTextActive,
                  ]}
                >
                  Video Rừng Xanh (5)
                </Text>
              </TouchableOpacity>
            </View>

            {ytSubTab === 'channels' && (
              <>
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
          </>
        )}

        {/* PHÂN MỤC 2: QUẢN LÝ VIDEO KHÁM PHÁ RỪNG XANH */}
        {ytSubTab === 'nature' && (
          <View style={styles.natureYtContainer}>
            {/* BANNER GIỚI THIỆU & CÔNG CỤ NHANH */}
            <View style={styles.natureBannerCard}>
              <View style={styles.natureBannerHeader}>
                <View style={styles.natureBannerIconBox}>
                  <Text style={{ fontSize: 24 }}>🌿</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.natureBannerTitle}>
                    Video Khám Phá Rừng Xanh
                  </Text>
                  <Text style={styles.natureBannerSub}>
                    Tùy chỉnh link video tài liệu thực tế cho 5 sinh vật trong game. Bé xem trực tiếp khi bấm nút 🎬.
                  </Text>
                </View>
              </View>

              <View style={styles.natureQuickActionBar}>
                <TouchableOpacity
                  style={styles.natureSaveAllBtn}
                  onPress={handleSaveAllNatureVideos}
                  activeOpacity={0.85}
                >
                  <Text style={styles.natureSaveAllBtnText}>💾 Lưu Thay Đổi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.natureResetAllBtn}
                  onPress={handleResetAllNatureVideos}
                  activeOpacity={0.85}
                >
                  <Text style={styles.natureResetAllBtnText}>🔄 Khôi Phục Gốc</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* DANH SÁCH 5 THẺ SINH VẬT */}
            <View style={styles.natureCardsList}>
              {natureVideos.map((item) => {
                const extractedId = extractYoutubeId(item.youtubeVideoId);
                const isCustomized =
                  item.youtubeVideoId !== item.defaultYoutubeId ||
                  item.youtubeVideoTitleVi !== item.defaultYoutubeTitle;
                const isValidId = /^[a-zA-Z0-9_-]{11}$/.test(extractedId);

                return (
                  <View key={item.id} style={styles.natureEntityCard}>
                    {/* HEADER THẺ: HÌNH 3D + TÊN + BADGE */}
                    <View style={styles.natureCardTop}>
                      <Image
                        source={item.imageSource}
                        style={styles.natureEntityThumb}
                      />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={styles.natureNameRow}>
                          <Text style={styles.natureEntityName} numberOfLines={1}>
                            {item.badgeIcon} {item.nameVi}
                          </Text>
                          <View
                            style={[
                              styles.natureStatusBadge,
                              isCustomized
                                ? styles.natureStatusBadgeCustom
                                : styles.natureStatusBadgeDefault,
                            ]}
                          >
                            <Text
                              style={[
                                styles.natureStatusBadgeText,
                                isCustomized
                                  ? styles.natureStatusBadgeTextCustom
                                  : styles.natureStatusBadgeTextDefault,
                              ]}
                            >
                              {isCustomized ? '✨ Đã Sửa' : '🌱 Gốc'}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.natureScientificText}>
                          {item.scientificName} • {item.sceneNameVi}
                        </Text>
                      </View>
                    </View>

                    {/* Ô NHẬP LINK YOUTUBE */}
                    <View style={styles.natureFieldGroup}>
                      <Text style={styles.natureFieldLabel}>
                        🔗 Link YouTube hoặc Video ID:
                      </Text>
                      <View style={styles.natureInputWrapper}>
                        <TextInput
                          style={styles.natureTextInput}
                          placeholder="Dán link youtube.com/... hoặc mã ID"
                          placeholderTextColor="#94A3B8"
                          value={item.youtubeVideoId}
                          onChangeText={(val) =>
                            handleUpdateNatureVideo(item.id, 'youtubeVideoId', val)
                          }
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        {item.youtubeVideoId.length > 0 && (
                          <TouchableOpacity
                            style={styles.natureInputClearBtn}
                            onPress={() =>
                              handleUpdateNatureVideo(item.id, 'youtubeVideoId', '')
                            }
                          >
                            <Text style={styles.natureInputClearText}>✕</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* DÒNG KIỂM TRA MÃ VIDEO */}
                      <View style={styles.natureIdFeedbackRow}>
                        {isValidId ? (
                          <Text style={styles.natureIdFeedbackValid}>
                            ✓ Mã ID nhận diện: <Text style={{ fontWeight: '800' }}>{extractedId}</Text>
                          </Text>
                        ) : item.youtubeVideoId.trim().length > 0 ? (
                          <Text style={styles.natureIdFeedbackWarn}>
                            ⚠️ Mã video chưa đúng định dạng 11 ký tự
                          </Text>
                        ) : (
                          <Text style={styles.natureIdFeedbackEmpty}>
                            ⚠️ Chưa có mã video
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Ô NHẬP TIÊU ĐỀ VIDEO HIỂN THỊ */}
                    <View style={styles.natureFieldGroup}>
                      <Text style={styles.natureFieldLabel}>
                        🏷️ Tiêu đề video hiển thị cho bé:
                      </Text>
                      <TextInput
                        style={styles.natureTextInput}
                        placeholder="Nhập tiêu đề video..."
                        placeholderTextColor="#94A3B8"
                        value={item.youtubeVideoTitleVi}
                        onChangeText={(val) =>
                          handleUpdateNatureVideo(item.id, 'youtubeVideoTitleVi', val)
                        }
                      />
                    </View>

                    {/* CỤM NÚT THAO TÁC CỦA THẺ */}
                    <View style={styles.natureCardActionsRow}>
                      <TouchableOpacity
                        style={styles.naturePreviewBtn}
                        onPress={() => handlePreviewNatureVideo(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.naturePreviewBtnText}>🎬 Xem Thử</Text>
                      </TouchableOpacity>

                      {isCustomized && (
                        <TouchableOpacity
                          style={styles.natureCardResetBtn}
                          onPress={() => handleResetSingleNatureVideo(item.id)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.natureCardResetBtnText}>🔄 Về Mặc Định</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* NÚT LƯU LỚN DƯỚI CÙNG */}
            <TouchableOpacity
              style={styles.natureBigSaveBtn}
              onPress={handleSaveAllNatureVideos}
              activeOpacity={0.85}
            >
              <Text style={styles.natureBigSaveBtnText}>
                💾 LƯU CẤU HÌNH VIDEO (ÁP DỤNG VÀO GAME)
              </Text>
            </TouchableOpacity>

            <Text style={styles.natureHelpNote}>
              💡 Mẹo: Phụ huynh có thể sao chép link video thực tế từ ứng dụng YouTube (bấm Chia sẻ ➔ Sao chép liên kết) rồi dán vào đây. Hệ thống tự động lọc mã ID chuẩn.
            </Text>
          </View>
        )}
      </View>
    )}

        {/* ========================================================================= */}
        {/* TAB 3: QUẢN LÝ TỪ VỰNG (VOCABULARY CMS) */}
        {/* ========================================================================= */}
        {activeTab === 'vocab' && (
          <>
            {/* 3.1. TỔNG QUAN TỪ VỰNG */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>📚 Quản Lý Thẻ Từ Vựng</Text>
                <TouchableOpacity
                  style={styles.resetVocabBtn}
                  onPress={handleResetVocabDefault}
                  activeOpacity={0.8}
                >
                  <Text style={styles.resetVocabBtnText}>🔄 Khôi Phục Gốc</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.cardDesc}>
                Admin và Phụ huynh có thể thêm các chủ đề mới hoặc bổ sung từ vựng song ngữ Anh - Việt cho bé học tập.
              </Text>

              <View style={styles.vocabSummaryRow}>
                <View style={styles.vocabSummaryBox}>
                  <Text style={styles.vocabSummaryNumber}>{vocabCategories.length}</Text>
                  <Text style={styles.vocabSummaryLabel}>Chủ Đề</Text>
                </View>
                <View style={styles.vocabSummaryBox}>
                  <Text style={styles.vocabSummaryNumber}>{totalVocabWords}</Text>
                  <Text style={styles.vocabSummaryLabel}>Tổng Từ Vựng</Text>
                </View>
                <View style={styles.vocabSummaryBox}>
                  <Text style={styles.vocabSummaryNumber}>
                    {selectedVocabCat?.cards?.length || 0}
                  </Text>
                  <Text style={styles.vocabSummaryLabel}>Từ Trong Mục</Text>
                </View>
              </View>
            </View>

            {/* 3.2. CHỌN CHỦ ĐỀ & THÊM CHỦ ĐỀ MỚI */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>🏷️ Danh Sách Chủ Đề</Text>
                <TouchableOpacity
                  style={styles.addCategoryBtn}
                  onPress={() => setShowCategoryModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addCategoryBtnText}>+ Thêm Chủ Đề</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScrollRow}
              >
                {vocabCategories.map((cat) => {
                  const isSelected = cat.id === selectedVocabCatId;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        { borderColor: cat.color },
                        isSelected && { backgroundColor: cat.color },
                      ]}
                      onPress={() => setSelectedVocabCatId(cat.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
                      <Text
                        style={[
                          styles.categoryChipText,
                          isSelected && styles.categoryChipTextActive,
                        ]}
                      >
                        {cat.titleVi} ({cat.cards?.length || 0})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 3.3. DANH SÁCH TỪ VỰNG TRONG CHỦ ĐỀ ĐANG CHỌN */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={styles.cardTitle}>
                    {selectedVocabCat?.icon} {selectedVocabCat?.titleVi}
                  </Text>
                  <Text style={styles.cardSubTitle}>
                    {selectedVocabCat?.titleEn} • {selectedVocabCat?.cards?.length || 0} thẻ từ
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addWordPrimaryBtn}
                  onPress={handleOpenAddWord}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addWordPrimaryBtnText}>+ Thêm Từ Mới</Text>
                </TouchableOpacity>
              </View>

              {(!selectedVocabCat?.cards || selectedVocabCat.cards.length === 0) ? (
                <View style={styles.emptyWordBox}>
                  <Text style={styles.emptyWordEmoji}>📭</Text>
                  <Text style={styles.emptyWordText}>Chưa có từ vựng nào trong chủ đề này.</Text>
                  <TouchableOpacity
                    style={styles.addWordInlineBtn}
                    onPress={handleOpenAddWord}
                  >
                    <Text style={styles.addWordInlineText}>+ Thêm từ vựng đầu tiên</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.wordListContainer}>
                  {selectedVocabCat.cards.map((card, idx) => (
                    <View key={card.id || `word_${idx}`} style={styles.wordItemRow}>
                      <View
                        style={[
                          styles.wordEmojiBox,
                          { backgroundColor: (card.color || '#3B82F6') + '20' },
                        ]}
                      >
                        <Text style={styles.wordEmojiText}>{card.emoji}</Text>
                      </View>

                      <View style={styles.wordInfoBox}>
                        <View style={styles.wordTitleRow}>
                          <Text style={styles.wordEnglish}>{card.english}</Text>
                          <Text style={styles.wordIpa}>{card.ipa}</Text>
                        </View>
                        <Text style={styles.wordVietnamese}>{card.vietnamese}</Text>
                        {card.exampleEn !== '' && (
                          <Text style={styles.wordExample} numberOfLines={1}>
                            💬 {card.exampleEn}
                          </Text>
                        )}
                      </View>

                      <View style={styles.wordActionsBox}>
                        <TouchableOpacity
                          style={styles.wordEditBtn}
                          onPress={() => handleOpenEditWord(card)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.wordEditBtnText}>✏️</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.wordDeleteBtn}
                          onPress={() => handleDeleteWord(card)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.wordDeleteBtnText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Nút xóa chủ đề nếu có nhiều hơn 1 chủ đề */}
              {vocabCategories.length > 1 && (
                <TouchableOpacity
                  style={styles.deleteCategoryBtn}
                  onPress={() => handleDeleteCategory(selectedVocabCat)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteCategoryBtnText}>
                    🗑️ Xóa Toàn Bộ Chủ Đề "{selectedVocabCat?.titleVi}"
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TÀI KHOẢN & BẢN QUYỀN (ACCOUNT) */}
        {/* ========================================================================= */}
        {activeTab === 'account' && (
          <>
            {/* 4.1. THÔNG TIN BẢN QUYỀN THIẾT BỊ */}
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

            {/* 4.2. ĐỒNG BỘ ĐÁM MÂY SUPABASE */}
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

            {/* 4.3. BẢO MẬT & ĐỔI MÃ PIN */}
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
                <TouchableOpacity
                  style={styles.savePinBtn}
                  onPress={handleSavePin}
                  activeOpacity={0.8}
                >
                  <Text style={styles.savePinText}>Lưu PIN</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 4.4. ĐĂNG XUẤT / HỦY KÍCH HOẠT */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚪 Hủy Kích Hoạt Thiết Bị</Text>
              <Text style={styles.cardDesc}>
                Thao tác này sẽ xóa key bản quyền trên máy và đưa thiết bị về màn hình nhập mã kích hoạt.
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
      {activeTab === 'youtube' && ytSubTab === 'channels' && (
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

      {/* MODAL THÊM / SỬA TỪ VỰNG DÀNH CHO ADMIN */}
      <Modal
        visible={showWordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWordModal(false)}
      >
        <View style={styles.addModalBackdrop}>
          <View style={[styles.addModalCard, { maxWidth: 400 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.addModalHeader}>
                <View style={[styles.addModalIconBox, { backgroundColor: '#EEF2FF' }]}>
                  <Text style={{ fontSize: 28 }}>{wordForm.emoji || '🔤'}</Text>
                </View>
                <Text style={styles.addModalTitle}>
                  {editingWord ? '✏️ Chỉnh Sửa Từ Vựng' : '➕ Thêm Từ Vựng Mới'}
                </Text>
                <Text style={styles.addModalSub}>
                  Chủ đề: {selectedVocabCat?.icon} {selectedVocabCat?.titleVi}
                </Text>
              </View>

              <Text style={styles.inputFieldLabel}>Từ Tiếng Anh (*):</Text>
              <TextInput
                style={styles.adminVocabInput}
                placeholder="VD: Lion, Butterfly, Apple..."
                value={wordForm.english}
                onChangeText={(val) => setWordForm((p) => ({ ...p, english: val }))}
              />

              <Text style={styles.inputFieldLabel}>Nghĩa Tiếng Việt (*):</Text>
              <TextInput
                style={styles.adminVocabInput}
                placeholder="VD: Con Sư Tử, Quả Táo..."
                value={wordForm.vietnamese}
                onChangeText={(val) => setWordForm((p) => ({ ...p, vietnamese: val }))}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputFieldLabel}>Phiên Âm IPA:</Text>
                  <TextInput
                    style={styles.adminVocabInput}
                    placeholder="/ˈlaɪ.ən/"
                    value={wordForm.ipa}
                    onChangeText={(val) => setWordForm((p) => ({ ...p, ipa: val }))}
                  />
                </View>
                <View style={{ width: 90 }}>
                  <Text style={styles.inputFieldLabel}>Biểu Tượng:</Text>
                  <TextInput
                    style={styles.adminVocabInput}
                    placeholder="🦁"
                    value={wordForm.emoji}
                    onChangeText={(val) => setWordForm((p) => ({ ...p, emoji: val }))}
                  />
                </View>
              </View>

              <Text style={styles.inputFieldLabel}>Câu Ví Dụ Tiếng Anh:</Text>
              <TextInput
                style={styles.adminVocabInput}
                placeholder="The lion is the king of the jungle."
                value={wordForm.exampleEn}
                onChangeText={(val) => setWordForm((p) => ({ ...p, exampleEn: val }))}
              />

              <Text style={styles.inputFieldLabel}>Câu Ví Dụ Tiếng Việt:</Text>
              <TextInput
                style={styles.adminVocabInput}
                placeholder="Sư tử là chúa tể muôn loài."
                value={wordForm.exampleVi}
                onChangeText={(val) => setWordForm((p) => ({ ...p, exampleVi: val }))}
              />

              <Text style={styles.inputFieldLabel}>Kiến Thức Thú Vị (Fun Fact):</Text>
              <TextInput
                style={styles.adminVocabInput}
                placeholder="Tiếng gầm sư tử vang xa 8km!"
                value={wordForm.funFact}
                onChangeText={(val) => setWordForm((p) => ({ ...p, funFact: val }))}
              />

              <View style={[styles.addModalActions, { marginTop: 12 }]}>
                <TouchableOpacity
                  style={styles.addModalCancelBtn}
                  onPress={() => setShowWordModal(false)}
                >
                  <Text style={styles.addModalCancelText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.addModalConfirmBtn, { backgroundColor: '#4F46E5' }]}
                  onPress={handleSaveWord}
                >
                  <Text style={styles.addModalConfirmText}>
                    {editingWord ? 'Cập Nhật' : 'Lưu Thẻ Từ'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL THÊM CHỦ ĐỀ MỚI DÀNH CHO ADMIN */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.addModalBackdrop}>
          <View style={styles.addModalCard}>
            <View style={styles.addModalHeader}>
              <View style={[styles.addModalIconBox, { backgroundColor: '#FDF4FF' }]}>
                <Text style={{ fontSize: 28 }}>{categoryForm.icon || '🏷️'}</Text>
              </View>
              <Text style={styles.addModalTitle}>➕ Thêm Chủ Đề Mới</Text>
              <Text style={styles.addModalSub}>
                Tạo nhóm từ vựng riêng cho bài học của bé
              </Text>
            </View>

            <Text style={styles.inputFieldLabel}>Tên Chủ Đề Tiếng Việt (*):</Text>
            <TextInput
              style={styles.adminVocabInput}
              placeholder="VD: Đồ Chơi Của Bé, Thức Ăn..."
              value={categoryForm.titleVi}
              onChangeText={(val) => setCategoryForm((p) => ({ ...p, titleVi: val }))}
            />

            <Text style={styles.inputFieldLabel}>Tên Tiếng Anh:</Text>
            <TextInput
              style={styles.adminVocabInput}
              placeholder="VD: Kids Toys, Foods..."
              value={categoryForm.titleEn}
              onChangeText={(val) => setCategoryForm((p) => ({ ...p, titleEn: val }))}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputFieldLabel}>Biểu Tượng Emoji:</Text>
                <TextInput
                  style={styles.adminVocabInput}
                  placeholder="🧸, 🍕, 🎒..."
                  value={categoryForm.icon}
                  onChangeText={(val) => setCategoryForm((p) => ({ ...p, icon: val }))}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputFieldLabel}>Mã Màu Chủ Đề:</Text>
                <TextInput
                  style={styles.adminVocabInput}
                  placeholder="#EC4899"
                  value={categoryForm.color}
                  onChangeText={(val) => setCategoryForm((p) => ({ ...p, color: val }))}
                />
              </View>
            </View>

            <View style={[styles.addModalActions, { marginTop: 12 }]}>
              <TouchableOpacity
                style={styles.addModalCancelBtn}
                onPress={() => setShowCategoryModal(false)}
              >
                <Text style={styles.addModalCancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addModalConfirmBtn, { backgroundColor: '#7C3AED' }]}
                onPress={handleSaveCategory}
              >
                <Text style={styles.addModalConfirmText}>Tạo Chủ Đề</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL XEM THỬ VIDEO KHÁM PHÁ THIÊN NHIÊN (NATURE CINEMA PREVIEW) */}
      <NatureCinemaModal
        visible={showPreviewCinema}
        entity={previewCinemaEntity}
        onClose={() => setShowPreviewCinema(false)}
      />
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
    paddingTop:
      Platform.OS === 'android'
        ? (StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 32)
        : 14,
    paddingBottom: 14,
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
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    gap: 6,
    flexBasis: '47%',
    flexGrow: 1,
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

  /* VOCABULARY CMS STYLES */
  resetVocabBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  resetVocabBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  vocabSummaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  vocabSummaryBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vocabSummaryNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4F46E5',
  },
  vocabSummaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  addCategoryBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addCategoryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryScrollRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    marginRight: 8,
    gap: 6,
  },
  categoryChipIcon: {
    fontSize: 16,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  cardSubTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  addWordPrimaryBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addWordPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyWordBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWordEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyWordText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  addWordInlineBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  addWordInlineText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 13,
  },
  wordListContainer: {
    marginTop: 12,
    gap: 10,
  },
  wordItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  wordEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordEmojiText: {
    fontSize: 24,
  },
  wordInfoBox: {
    flex: 1,
  },
  wordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wordEnglish: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  wordIpa: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  wordVietnamese: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginTop: 1,
  },
  wordExample: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  wordActionsBox: {
    flexDirection: 'row',
    gap: 6,
  },
  wordEditBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  wordEditBtnText: {
    fontSize: 14,
  },
  wordDeleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  wordDeleteBtnText: {
    fontSize: 14,
  },
  deleteCategoryBtn: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteCategoryBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  inputFieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
    marginTop: 8,
  },
  adminVocabInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },

  /* YOUTUBE SUB-TABS SEGMENTED CONTROL */
  ytSubTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  ytSubTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 6,
  },
  ytSubTabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ytSubTabIcon: {
    fontSize: 15,
  },
  ytSubTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  ytSubTabTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },

  /* NATURE EXPLORER YOUTUBE STYLES */
  natureYtContainer: {
    gap: 14,
  },
  natureBannerCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    padding: 14,
    gap: 12,
  },
  natureBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  natureBannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  natureBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#14532D',
  },
  natureBannerSub: {
    fontSize: 12,
    color: '#166534',
    marginTop: 2,
    lineHeight: 16,
  },
  natureQuickActionBar: {
    flexDirection: 'row',
    gap: 10,
  },
  natureSaveAllBtn: {
    flex: 1,
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  natureSaveAllBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  natureResetAllBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  natureResetAllBtnText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 13,
  },

  /* NATURE CARDS LIST */
  natureCardsList: {
    gap: 12,
  },
  natureEntityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  natureCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  natureEntityThumb: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  natureNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  natureEntityName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  natureStatusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  natureStatusBadgeDefault: {
    backgroundColor: '#DCFCE7',
  },
  natureStatusBadgeCustom: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  natureStatusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  natureStatusBadgeTextDefault: {
    color: '#15803D',
  },
  natureStatusBadgeTextCustom: {
    color: '#1D4ED8',
  },
  natureScientificText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 3,
  },
  natureFieldGroup: {
    gap: 4,
  },
  natureFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  natureInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  natureTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  natureInputClearBtn: {
    position: 'absolute',
    right: 10,
    padding: 6,
  },
  natureInputClearText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '700',
  },
  natureIdFeedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    paddingHorizontal: 2,
  },
  natureIdFeedbackValid: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
  },
  natureIdFeedbackWarn: {
    fontSize: 11,
    color: '#EA580C',
    fontWeight: '600',
  },
  natureIdFeedbackEmpty: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  natureCardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  naturePreviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  naturePreviewBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 12,
  },
  natureCardResetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  natureCardResetBtnText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 11.5,
  },
  natureBigSaveBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  natureBigSaveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  natureHelpNote: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  /* APP SUB-TAB & GAME ROW STYLES */
  appSubTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 6,
  },
  appSubTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  appSubTabBtnActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  appSubTabIcon: {
    fontSize: 16,
  },
  appSubTabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  appSubTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  gameIconEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIconEmoji: {
    fontSize: 24,
  },
  gameBadgeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gameBadgeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C3AED',
  },
});
