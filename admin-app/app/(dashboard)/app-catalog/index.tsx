import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  Layers,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Sparkles,
  X,
  Smartphone,
  Gamepad2,
  RefreshCw,
} from 'lucide-react-native';
import { supabase } from '../../../src/lib/supabase';
import { AppCatalogItem } from '../../../src/types';
import { COLORS, SHADOWS } from '../../../src/styles/theme';

export const DEFAULT_APP_CATALOG: AppCatalogItem[] = [
  // --- GAME & TÍNH NĂNG NỘI BỘ (KIDS WONDER PARK) ---
  {
    id: 'int_riddles100',
    package_name: 'internal.game.riddles100',
    app_name: '100 Câu Đố Kỳ Thú',
    category: 'Trí Tuệ & Đố Vui',
    icon_emoji: '🧩',
    is_internal: true,
    is_enabled: true,
    description: '100 câu đố đồng dao Việt Nam, tương tác 3D và đối kháng 2 người.',
  },
  {
    id: 'int_shadowdetective',
    package_name: 'internal.game.shadowdetective',
    app_name: 'Thám Tử Soi Đèn Pin',
    category: 'Trí Tuệ & Khám Phá',
    icon_emoji: '🔦',
    is_internal: true,
    is_enabled: true,
    description: 'Cầm đèn pin soi thấu bóng đen, phá 40 vụ án kỳ bí qua thơ đồng dao.',
  },
  {
    id: 'int_flashcards',
    package_name: 'internal.game.flashcards',
    app_name: 'Thẻ Bài 3D Đời Thật',
    category: 'Học Tập & Ngôn Ngữ',
    icon_emoji: '🎴',
    is_internal: true,
    is_enabled: true,
    description: 'Bách khoa toàn thư từ vựng Oxford 3D, mở gói thẻ và sổ Pokédex.',
  },
  {
    id: 'int_natureexplorer',
    package_name: 'internal.game.natureexplorer',
    app_name: 'Tự Nhiên 3D Rừng Mưa',
    category: 'Khám Phá Thiên Nhiên',
    icon_emoji: '🌿',
    is_internal: true,
    is_enabled: true,
    description: 'Bách thảo, rạp chiếu phim tài liệu và vòng đời sinh vật sống động.',
  },
  {
    id: 'int_solarsystem',
    package_name: 'internal.game.solarsystem',
    app_name: 'Du Hành Hệ Mặt Trời',
    category: 'Khám Phá Vũ Trụ',
    icon_emoji: '🪐',
    is_internal: true,
    is_enabled: true,
    description: 'Tàu thám hiểm 8 hành tinh trong hệ mặt trời với đồ họa 3D.',
  },
  {
    id: 'int_continentexplorer',
    package_name: 'internal.game.continentexplorer',
    app_name: 'Năm Châu Bốn Bể',
    category: 'Địa Lý & Văn Hóa',
    icon_emoji: '🦅',
    is_internal: true,
    is_enabled: true,
    description: 'Thám hiểm 5 châu lục, kỳ quan và danh lam thắng cảnh thế giới.',
  },
  {
    id: 'int_fourseasons',
    package_name: 'internal.game.fourseasons',
    app_name: 'Bốn Mùa Kỳ Diệu',
    category: 'Khám Phá Tự Nhiên',
    icon_emoji: '🦋',
    is_internal: true,
    is_enabled: true,
    description: 'Khám phá đặc trưng thời tiết, sinh vật của Xuân, Hạ, Thu, Đông.',
  },
  {
    id: 'int_math',
    package_name: 'internal.game.math',
    app_name: 'Bé Học Toán Thần Tốc',
    category: 'Toán Học & Tư Duy',
    icon_emoji: '🧮',
    is_internal: true,
    is_enabled: true,
    description: 'Đua tốc độ toán học vui nhộn từ đếm số đến cộng trừ nhân chia.',
  },
  {
    id: 'int_wordspelling',
    package_name: 'internal.game.wordspelling',
    app_name: 'Ghép Vần Tiếng Việt',
    category: 'Học Tập & Ngôn Ngữ',
    icon_emoji: '🔤',
    is_internal: true,
    is_enabled: true,
    description: 'Bé tập đánh vần và ghép các chữ cái tiếng Việt với phát âm chuẩn.',
  },
  {
    id: 'int_robotcoder',
    package_name: 'internal.game.robotcoder',
    app_name: 'Bé Tập Lập Trình Robot',
    category: 'Lập Trình & Logic',
    icon_emoji: '🤖',
    is_internal: true,
    is_enabled: true,
    description: 'Lắp ráp chuỗi lệnh di chuyển giúp chú robot thu thập pin năng lượng.',
  },
  {
    id: 'int_dentalhabits',
    package_name: 'internal.game.dentalhabits',
    app_name: 'Bác Sĩ Răng Nhí',
    category: 'Kỹ Năng & Thói Quen',
    icon_emoji: '🦷',
    is_internal: true,
    is_enabled: true,
    description: 'Học thói quen đánh răng đúng cách và chăm sóc vệ sinh cá nhân.',
  },
  {
    id: 'int_memory',
    package_name: 'internal.game.memory',
    app_name: 'Lật Hình Trí Nhớ',
    category: 'Trí Tuệ & Não Bộ',
    icon_emoji: '🃏',
    is_internal: true,
    is_enabled: true,
    description: 'Rèn luyện khả năng ghi nhớ siêu đẳng qua các cặp thẻ bài sinh động.',
  },
  {
    id: 'int_maze',
    package_name: 'internal.game.maze',
    app_name: 'Mê Cung Thử Thách',
    category: 'Trí Tuệ & Định Hướng',
    icon_emoji: '🌀',
    is_internal: true,
    is_enabled: true,
    description: 'Dẫn đường cho các bạn nhỏ tìm lối ra khỏi mê cung ma thuật.',
  },
  {
    id: 'int_tangram',
    package_name: 'internal.game.tangram',
    app_name: 'Xếp Hình Tangram',
    category: 'Hình Học & Sáng Tạo',
    icon_emoji: '📐',
    is_internal: true,
    is_enabled: true,
    description: 'Xếp các mảnh ghép 7 màu thành động vật, xe cộ và nhà cửa.',
  },
  {
    id: 'int_jigsaw',
    package_name: 'internal.game.jigsaw',
    app_name: 'Ghép Tranh Kỳ Thú',
    category: 'Khéo Tay & Quan Sát',
    icon_emoji: '🧩',
    is_internal: true,
    is_enabled: true,
    description: 'Lắp ráp tranh các câu chuyện cổ tích và loài vật đáng yêu.',
  },
  {
    id: 'int_connectdots',
    package_name: 'internal.game.connectdots',
    app_name: 'Nối Số Thông Minh',
    category: 'Học Số & Vẽ Hình',
    icon_emoji: '🔢',
    is_internal: true,
    is_enabled: true,
    description: 'Nối các số từ nhỏ đến lớn để làm xuất hiện bức tranh bất ngờ.',
  },
  {
    id: 'int_shadowmatch',
    package_name: 'internal.game.shadowmatch',
    app_name: 'Ghép Bóng Động Vật',
    category: 'Quan Sát & Nhận Biết',
    icon_emoji: '👥',
    is_internal: true,
    is_enabled: true,
    description: 'Nhận biết hình dáng con vật qua bóng đen đặc trưng.',
  },
  {
    id: 'int_spotdiff',
    package_name: 'internal.game.spotdiff',
    app_name: 'Tìm Điểm Khác Biệt',
    category: 'Quan Sát & Tinh Mắt',
    icon_emoji: '🔍',
    is_internal: true,
    is_enabled: true,
    description: 'So sánh hai bức tranh gần giống nhau và tìm các chi tiết biến đổi.',
  },
  {
    id: 'int_balancescale',
    package_name: 'internal.game.balancescale',
    app_name: 'Cân Thăng Bằng',
    category: 'Khoa Học & Trọng Lượng',
    icon_emoji: '⚖️',
    is_internal: true,
    is_enabled: true,
    description: 'Học khái niệm nặng nhẹ và so sánh khối lượng đồ vật trực quan.',
  },
  {
    id: 'int_bubblepop',
    package_name: 'internal.game.bubblepop',
    app_name: 'Bóng Bay Màu Sắc',
    category: 'Phản Xạ & Giải Trí',
    icon_emoji: '🎈',
    is_internal: true,
    is_enabled: true,
    description: 'Chạm vỡ bong bóng chứa chữ cái và con số bay lên bầu trời.',
  },
  {
    id: 'int_snakeedu',
    package_name: 'internal.game.snakeedu',
    app_name: 'Rắn Săn Chữ Thông Thái',
    category: 'Trí Tuệ & Phản Xạ',
    icon_emoji: '🐍',
    is_internal: true,
    is_enabled: true,
    description: 'Điều khiển chú rắn ăn đúng chữ cái theo thứ tự đánh vần từ khóa.',
  },
  {
    id: 'int_spaceshooter',
    package_name: 'internal.game.spaceshooter',
    app_name: 'Bảo Vệ Không Gian',
    category: 'Phản Xạ & Giải Trí',
    icon_emoji: '🚀',
    is_internal: true,
    is_enabled: true,
    description: 'Bắn phá các thiên thạch chứa câu hỏi trắc nghiệm an toàn.',
  },
  {
    id: 'int_emotions',
    package_name: 'internal.game.emotions',
    app_name: 'Vườn Cảm Xúc',
    category: 'Cảm Xúc & Kỹ Năng',
    icon_emoji: '🌻',
    is_internal: true,
    is_enabled: true,
    description: 'Giúp bé nhận diện và gọi tên cảm xúc: vui vẻ, buồn, tức giận, ngạc nhiên.',
  },
  {
    id: 'int_animalsound',
    package_name: 'internal.game.animalsound',
    app_name: 'Âm Thanh Muông Thú',
    category: 'Âm Thanh & Động Vật',
    icon_emoji: '🦁',
    is_internal: true,
    is_enabled: true,
    description: 'Nghe và đoán tiếng kêu chân thực của hơn 50 loài động vật trên cạn dưới nước.',
  },
  {
    id: 'int_gardener',
    package_name: 'internal.game.gardener',
    app_name: 'Vườn Cây Của Bé',
    category: 'Thiên Nhiên & Trồng Trọt',
    icon_emoji: '🌱',
    is_internal: true,
    is_enabled: true,
    description: 'Gieo hạt, tưới nước, bắt sâu và thu hoạch hoa thơm trái ngọt.',
  },
  {
    id: 'int_petcare',
    package_name: 'internal.game.petcare',
    app_name: 'Chăm Sóc Thú Cưng',
    category: 'Tình Yêu Thương & Trách Nhiệm',
    icon_emoji: '🐶',
    is_internal: true,
    is_enabled: true,
    description: 'Tắm rửa, cho ăn và chơi đùa cùng các chú cún và mèo con dễ thương.',
  },
  {
    id: 'int_weatherdress',
    package_name: 'internal.game.weatherdress',
    app_name: 'Thời Tiết & Thời Trang',
    category: 'Kỹ Năng Sống',
    icon_emoji: '👕',
    is_internal: true,
    is_enabled: true,
    description: 'Chọn trang phục phù hợp với ngày nắng ấm, mưa rào hay tuyết rơi.',
  },
  {
    id: 'int_coloring',
    package_name: 'internal.game.coloring',
    app_name: 'Bé Tập Tô Màu',
    category: 'Hội Họa & Mỹ Thuật',
    icon_emoji: '🎨',
    is_internal: true,
    is_enabled: true,
    description: 'Thỏa sức tô màu hàng trăm mẫu tranh với bảng màu rực rỡ và cọ vẽ thần kỳ.',
  },
  {
    id: 'int_xylophone',
    package_name: 'internal.game.xylophone',
    app_name: 'Đàn Gõ Sắc Màu',
    category: 'Âm Nhạc & Tiết Tấu',
    icon_emoji: '🎹',
    is_internal: true,
    is_enabled: true,
    description: 'Khám phá âm thanh nốt nhạc Đô Rê Mi qua phím đàn gõ lung linh.',
  },
  {
    id: 'int_sorting',
    package_name: 'internal.game.sorting',
    app_name: 'Phân Loại Rác Xanh',
    category: 'Môi Trường & Thói Quen Tốt',
    icon_emoji: '♻️',
    is_internal: true,
    is_enabled: true,
    description: 'Học cách phân loại rác tái chế, rác hữu cơ bảo vệ hành tinh xanh.',
  },
  {
    id: 'int_greentube',
    package_name: 'internal.safe.greentube',
    app_name: 'GreenKids Tube',
    category: 'Video Giáo Dục An Toàn',
    icon_emoji: '📺',
    is_internal: true,
    is_enabled: true,
    description: 'Kho video hoạt hình, ca nhạc thiếu nhi và bài học cuộc sống đã kiểm duyệt.',
  },
  {
    id: 'int_safeyoutube',
    package_name: 'internal.safe.youtube',
    app_name: 'YouTube An Toàn (Curated)',
    category: 'Video Chọn Lọc',
    icon_emoji: '🎬',
    is_internal: true,
    is_enabled: true,
    description: 'Trình phát video an toàn tuyệt đối chỉ mở các kênh phụ huynh đã duyệt.',
  },

  // --- ỨNG DỤNG BÊN THỨ 3 (ANDROID PACKAGES) ---
  {
    id: 'ext_ytkids',
    package_name: 'com.google.android.youtube.kids',
    app_name: 'YouTube Kids',
    category: 'Giải Trí & Video',
    is_internal: false,
    is_enabled: true,
    description: 'Ứng dụng video an toàn chính thức từ YouTube dành cho trẻ em.',
  },
  {
    id: 'ext_scratchjr',
    package_name: 'org.scratchjr.android',
    app_name: 'ScratchJr',
    category: 'Học Lập Trình',
    is_internal: false,
    is_enabled: true,
    description: 'Học tư duy lập trình sáng tạo qua kéo thả khối lệnh trực quan.',
  },
  {
    id: 'ext_khan',
    package_name: 'org.khankids.android',
    app_name: 'Khan Academy Kids',
    category: 'Học Tập & Kiến Thức',
    is_internal: false,
    is_enabled: true,
    description: 'Khóa học tương tác toàn diện từ toán, đọc đến tư duy logic.',
  },
  {
    id: 'ext_duolingo',
    package_name: 'com.duolingo.kids',
    app_name: 'Duolingo ABC',
    category: 'Tiếng Anh Thiếu Nhi',
    is_internal: false,
    is_enabled: false,
    description: 'Học phát âm và tập đọc tiếng Anh qua mini game vui nhộn.',
  },
];

type FilterType = 'all' | 'internal' | 'external';

export default function AppCatalogScreen() {
  const [apps, setApps] = useState<AppCatalogItem[]>(DEFAULT_APP_CATALOG);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Modal thêm App mới
  const [modalVisible, setModalVisible] = useState(false);
  const [appName, setAppName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [category, setCategory] = useState('Học Tập');
  const [isInternalNew, setIsInternalNew] = useState(false);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('app_catalog').select('*');
      if (data && data.length > 0) {
        // Hợp nhất dữ liệu Supabase với metadata icon_emoji mặc định
        const merged: AppCatalogItem[] = data.map((item: any) => {
          const defaultItem = DEFAULT_APP_CATALOG.find(
            (d) => d.package_name === item.package_name
          );
          return {
            ...item,
            icon_emoji: item.icon_emoji || defaultItem?.icon_emoji,
            is_internal:
              item.is_internal !== undefined
                ? item.is_internal
                : item.package_name?.startsWith('internal.'),
          };
        });
        setApps(merged);
      } else {
        // Nếu DB chưa có dữ liệu, nạp danh sách ban đầu
        setApps(DEFAULT_APP_CATALOG);
      }
    } catch (e) {
      console.warn('Fetch apps error:', e);
      setApps(DEFAULT_APP_CATALOG);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Bật / Tắt một ứng dụng hoặc game trên /home
   */
  const handleToggle = async (id: string, currentVal: boolean) => {
    const nextVal = !currentVal;
    // Cập nhật optimistic UI
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, is_enabled: nextVal } : app))
    );

    const targetApp = apps.find((a) => a.id === id);
    if (!targetApp) return;

    try {
      // Cập nhật Supabase
      await supabase
        .from('app_catalog')
        .upsert(
          [
            {
              id: targetApp.id,
              package_name: targetApp.package_name,
              app_name: targetApp.app_name,
              category: targetApp.category,
              is_enabled: nextVal,
              is_internal: targetApp.is_internal,
              description: targetApp.description,
              icon_emoji: targetApp.icon_emoji,
            },
          ],
          { onConflict: 'package_name' }
        );
    } catch (err) {
      console.warn('Supabase toggle error:', err);
    }
  };

  /**
   * Nạp đầy đủ 32+ Game và App mặc định lên Supabase
   */
  const handleSeedDefaults = async () => {
    Alert.alert(
      'Nạp Game & App Mặc Định',
      `Hành động này sẽ cập nhật ${DEFAULT_APP_CATALOG.length} trò chơi nội bộ và ứng dụng an toàn vào hệ thống máy chủ Supabase. Tiếp tục?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Nạp Ngay',
          style: 'default',
          onPress: async () => {
            setIsSeeding(true);
            try {
              for (const item of DEFAULT_APP_CATALOG) {
                await supabase.from('app_catalog').upsert([item], { onConflict: 'package_name' });
              }
              await fetchApps();
              Alert.alert('Thành công', 'Đã nạp toàn bộ danh mục game & app vào hệ thống!');
            } catch (err) {
              console.warn('Lỗi seed app catalog:', err);
              Alert.alert('Lỗi', 'Không thể nạp dữ liệu lên server, vui lòng thử lại sau.');
            } finally {
              setIsSeeding(false);
            }
          },
        },
      ]
    );
  };

  const handleAddApp = async () => {
    if (!appName.trim() || !packageName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên ứng dụng và package name / app id.');
      return;
    }

    const newApp: AppCatalogItem = {
      id: String(Date.now()),
      app_name: appName.trim(),
      package_name: packageName.trim(),
      category: category.trim(),
      is_internal: isInternalNew,
      icon_emoji: isInternalNew ? '🎮' : undefined,
      is_enabled: true,
      description: isInternalNew
        ? 'Game nội bộ Kids Wonder Park'
        : 'Ứng dụng Android được phê duyệt',
    };

    setApps((prev) => [newApp, ...prev]);
    try {
      await supabase.from('app_catalog').insert([newApp]);
    } catch (err) {
      console.warn('Insert app error:', err);
    }

    setModalVisible(false);
    setAppName('');
    setPackageName('');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xóa ứng dụng', 'Ứng dụng này sẽ bị xóa khỏi danh mục quản trị.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          setApps((prev) => prev.filter((a) => a.id !== id));
          try {
            await supabase.from('app_catalog').delete().eq('id', id);
          } catch (e) {
            console.warn('Delete error:', e);
          }
        },
      },
    ]);
  };

  // Đếm số lượng ứng dụng
  const internalCount = useMemo(
    () => apps.filter((a) => a.is_internal || a.package_name?.startsWith('internal.')).length,
    [apps]
  );
  const externalCount = useMemo(
    () => apps.filter((a) => !a.is_internal && !a.package_name?.startsWith('internal.')).length,
    [apps]
  );
  const enabledCount = useMemo(() => apps.filter((a) => a.is_enabled).length, [apps]);

  // Bộ lọc danh sách hiển thị
  const filteredApps = useMemo(() => {
    return apps.filter((a) => {
      const isInternal = Boolean(a.is_internal || a.package_name?.startsWith('internal.'));
      if (filterType === 'internal' && !isInternal) return false;
      if (filterType === 'external' && isInternal) return false;

      const q = search.toLowerCase();
      if (!q) return true;
      return (
        a.app_name.toLowerCase().includes(q) ||
        a.package_name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    });
  }, [apps, filterType, search]);

  return (
    <View style={styles.container}>
      {/* 1. THANH TÌM KIẾM & NÚT THAO TÁC */}
      <View style={styles.topRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên app, game hoặc mã..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <TouchableOpacity
          style={[styles.seedBtn, SHADOWS.sm]}
          onPress={handleSeedDefaults}
          disabled={isSeeding}
          activeOpacity={0.8}
        >
          {isSeeding ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Sparkles size={16} color="#fff" />
          )}
          <Text style={styles.seedBtnText}>Nạp Game Mẫu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addBtn, SHADOWS.glow(COLORS.info)]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus size={16} color="#fff" />
          <Text style={styles.addBtnText}>Thêm App</Text>
        </TouchableOpacity>
      </View>

      {/* 2. STATS & PHÂN LOẠI TABS */}
      <View style={styles.filterSection}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, filterType === 'all' && styles.tabItemActive]}
            onPress={() => setFilterType('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, filterType === 'all' && styles.tabTextActive]}>
              Tất cả ({apps.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, filterType === 'internal' && styles.tabItemActive]}
            onPress={() => setFilterType('internal')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, filterType === 'internal' && styles.tabTextActive]}>
              🎮 Game Nội Bộ ({internalCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, filterType === 'external' && styles.tabItemActive]}
            onPress={() => setFilterType('external')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, filterType === 'external' && styles.tabTextActive]}>
              📱 App Ngoài ({externalCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Thanh đếm trạng thái */}
        <View style={styles.statusBarRow}>
          <Text style={styles.statusSummaryText}>
            Đang bật hiển thị trên /home: <Text style={styles.boldText}>{enabledCount}</Text> / {apps.length} ứng dụng
          </Text>
          <TouchableOpacity onPress={fetchApps} style={styles.refreshIconBtn}>
            <RefreshCw size={14} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. DANH SÁCH ỨNG DỤNG & GAME */}
      <ScrollView contentContainerStyle={styles.list}>
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.info} />
            <Text style={styles.loadingText}>Đang tải cấu hình ứng dụng...</Text>
          </View>
        ) : filteredApps.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎈</Text>
            <Text style={styles.emptyTitle}>Không tìm thấy ứng dụng phù hợp</Text>
            <Text style={styles.emptySub}>Thử tìm với từ khóa khác hoặc nhấn "Nạp Game Mẫu"</Text>
          </View>
        ) : (
          filteredApps.map((app) => {
            const isInternal = Boolean(
              app.is_internal || app.package_name?.startsWith('internal.')
            );

            return (
              <View key={app.id} style={[styles.appCard, SHADOWS.sm]}>
                {/* ICON & EMOJI */}
                <View
                  style={[
                    styles.appIconBox,
                    {
                      backgroundColor: isInternal
                        ? 'rgba(139, 92, 246, 0.12)'
                        : 'rgba(59, 130, 246, 0.12)',
                    },
                  ]}
                >
                  {isInternal ? (
                    <Text style={styles.appIconEmoji}>{app.icon_emoji || '🎮'}</Text>
                  ) : (
                    <Smartphone size={22} color={COLORS.info} />
                  )}
                </View>

                {/* THÔNG TIN CHI TIẾT */}
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={styles.appNameRow}>
                    <Text style={styles.appName} numberOfLines={1}>
                      {app.app_name}
                    </Text>

                    <View
                      style={[
                        styles.badgePill,
                        {
                          backgroundColor: isInternal
                            ? 'rgba(139, 92, 246, 0.15)'
                            : 'rgba(59, 130, 246, 0.15)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgePillText,
                          { color: isInternal ? '#8B5CF6' : '#2563EB' },
                        ]}
                      >
                        {isInternal ? 'KIDS PARK 3D' : 'ANDROID APP'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.pkgName} numberOfLines={1}>
                    {app.package_name}
                  </Text>
                  {app.description ? (
                    <Text style={styles.appDesc} numberOfLines={1}>
                      {app.description}
                    </Text>
                  ) : null}
                  <Text style={styles.appCategory}>🏷️ {app.category}</Text>
                </View>

                {/* CÔNG TẮC BẬT/TẮT HIỂN THỊ TRÊN HOME */}
                <View style={styles.actionCol}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: app.is_enabled
                          ? `${COLORS.accentEmerald}15`
                          : `${COLORS.textMuted}15`,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: app.is_enabled ? COLORS.accentEmerald : COLORS.textMuted,
                      }}
                    >
                      {app.is_enabled ? 'BẬT /HOME' : 'TẠM TẮT'}
                    </Text>
                  </View>

                  <Switch
                    value={app.is_enabled}
                    onValueChange={() => handleToggle(app.id, app.is_enabled)}
                    trackColor={{ false: COLORS.cardBorder, true: COLORS.accentEmerald }}
                    thumbColor={app.is_enabled ? '#fff' : COLORS.textSecondary}
                  />

                  {!isInternal && (
                    <TouchableOpacity
                      style={styles.delBtn}
                      onPress={() => handleDelete(app.id)}
                    >
                      <Trash2 size={13} color={COLORS.danger} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* 4. MODAL THÊM ỨNG DỤNG MỚI */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, SHADOWS.md]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Ứng Dụng Mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.typeSelectorRow}>
              <TouchableOpacity
                style={[styles.typeBtn, !isInternalNew && styles.typeBtnActive]}
                onPress={() => setIsInternalNew(false)}
              >
                <Smartphone size={16} color={!isInternalNew ? '#fff' : COLORS.textSecondary} />
                <Text
                  style={[
                    styles.typeBtnText,
                    !isInternalNew && styles.typeBtnTextActive,
                  ]}
                >
                  App Cài Ngoài
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeBtn, isInternalNew && styles.typeBtnActive]}
                onPress={() => setIsInternalNew(true)}
              >
                <Gamepad2 size={16} color={isInternalNew ? '#fff' : COLORS.textSecondary} />
                <Text
                  style={[
                    styles.typeBtnText,
                    isInternalNew && styles.typeBtnTextActive,
                  ]}
                >
                  Game Nội Bộ
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Tên Ứng Dụng / Trò Chơi</Text>
            <TextInput
              style={styles.input}
              value={appName}
              onChangeText={setAppName}
              placeholder={isInternalNew ? 'Ví dụ: Cờ Vua Thiếu Nhi' : 'Ví dụ: Duolingo ABC'}
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.inputLabel}>
              {isInternalNew ? 'Mã Game ID (internal.*)' : 'Android Package Name'}
            </Text>
            <TextInput
              style={styles.input}
              value={packageName}
              onChangeText={setPackageName}
              placeholder={
                isInternalNew ? 'internal.game.chess' : 'org.scratchjr.android'
              }
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Danh Mục</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Học Tập, Trí Tuệ, Video, Khám Phá..."
              placeholderTextColor={COLORS.textMuted}
            />

            <TouchableOpacity
              style={[styles.saveBtn, SHADOWS.glow(COLORS.info)]}
              onPress={handleAddApp}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>Lưu Vào Hệ Thống</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  topRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    height: 42,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  seedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    gap: 6,
  },
  seedBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    gap: 6,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: COLORS.info,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  statusSummaryText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.accentEmerald,
  },
  refreshIconBtn: {
    padding: 4,
  },
  list: {
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  loadingBox: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 12,
  },
  appIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconEmoji: {
    fontSize: 22,
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  appName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  pkgName: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  appDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  appCategory: {
    fontSize: 11,
    color: COLORS.info,
    marginTop: 4,
    fontWeight: '600',
  },
  actionCol: {
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  delBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgDark,
    borderRadius: 10,
    padding: 4,
    marginBottom: 14,
    gap: 4,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  typeBtnActive: {
    backgroundColor: COLORS.info,
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  typeBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.bgDark,
    borderRadius: 10,
    padding: 12,
    color: COLORS.textPrimary,
    fontSize: 13,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
  },
  saveBtn: {
    backgroundColor: COLORS.info,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
