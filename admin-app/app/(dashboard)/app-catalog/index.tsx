import React, { useState, useEffect } from 'react';
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
} from 'lucide-react-native';
import { supabase } from '../../../src/lib/supabase';
import { AppCatalogItem } from '../../../src/types';
import { COLORS, SHADOWS } from '../../../src/styles/theme';

const INITIAL_APPS: AppCatalogItem[] = [
  {
    id: '1',
    package_name: 'com.google.android.youtube.kids',
    app_name: 'YouTube Kids',
    category: 'Giải Trí & Video',
    age_group: 'Mọi lứa tuổi',
    is_enabled: true,
    description: 'Ứng dụng video an toàn chính thức từ YouTube dành cho trẻ em.',
  },
  {
    id: '2',
    package_name: 'org.scratchjr.android',
    app_name: 'ScratchJr',
    category: 'Học Lập Trình',
    age_group: '5-8 tuổi',
    is_enabled: true,
    description: 'Học tư duy lập trình sáng tạo qua kéo thả khối lệnh.',
  },
  {
    id: '3',
    package_name: 'org.khankids.android',
    app_name: 'Khan Academy Kids',
    category: 'Học Tập & Kiến Thức',
    age_group: '2-8 tuổi',
    is_enabled: true,
    description: 'Khóa học tương tác toàn diện từ toán, đọc đến tư duy logic.',
  },
  {
    id: '4',
    package_name: 'com.duolingo.kids',
    app_name: 'Duolingo ABC',
    category: 'Tiếng Anh',
    age_group: '3-7 tuổi',
    is_enabled: false,
    description: 'Học phát âm và tập đọc tiếng Anh qua mini game.',
  },
];

export default function AppCatalogScreen() {
  const [apps, setApps] = useState<AppCatalogItem[]>(INITIAL_APPS);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [appName, setAppName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [category, setCategory] = useState('Học Tập');

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const { data } = await supabase.from('app_catalog').select('*');
      if (data && data.length > 0) {
        setApps(data as AppCatalogItem[]);
      }
    } catch (e) {
      console.warn('Fetch apps error:', e);
    }
  };

  const handleToggle = async (id: string, currentVal: boolean) => {
    const nextVal = !currentVal;
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, is_enabled: nextVal } : app))
    );
    await supabase.from('app_catalog').update({ is_enabled: nextVal }).eq('id', id);
  };

  const handleAddApp = async () => {
    if (!appName.trim() || !packageName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên ứng dụng và package name.');
      return;
    }

    const newApp: AppCatalogItem = {
      id: String(Date.now()),
      app_name: appName.trim(),
      package_name: packageName.trim(),
      category: category.trim(),
      is_enabled: true,
    };

    setApps((prev) => [newApp, ...prev]);
    await supabase.from('app_catalog').insert([newApp]);
    setModalVisible(false);
    setAppName('');
    setPackageName('');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xóa ứng dụng', 'Bé sẽ không còn thấy ứng dụng này trên Launcher.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          setApps((prev) => prev.filter((a) => a.id !== id));
          await supabase.from('app_catalog').delete().eq('id', id);
        },
      },
    ]);
  };

  const filteredApps = apps.filter(
    (a) =>
      a.app_name.toLowerCase().includes(search.toLowerCase()) ||
      a.package_name.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* SEARCH & ADD */}
      <View style={styles.topRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên app hoặc package..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={[styles.addBtn, SHADOWS.glow(COLORS.info)]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus size={18} color="#fff" />
          <Text style={styles.addBtnText}>Thêm App</Text>
        </TouchableOpacity>
      </View>

      {/* APPS LIST */}
      <ScrollView contentContainerStyle={styles.list}>
        {filteredApps.map((app) => (
          <View key={app.id} style={[styles.appCard, SHADOWS.sm]}>
            <View style={styles.appIconBox}>
              <Smartphone size={22} color={COLORS.info} />
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.appNameRow}>
                <Text style={styles.appName}>{app.app_name}</Text>
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
                    {app.is_enabled ? 'CHO PHÉP' : 'TẠM KHÓA'}
                  </Text>
                </View>
              </View>

              <Text style={styles.pkgName}>{app.package_name}</Text>
              <Text style={styles.appCategory}>{app.category}</Text>
            </View>

            {/* Switch Toggle & Delete */}
            <View style={styles.actionCol}>
              <Switch
                value={app.is_enabled}
                onValueChange={() => handleToggle(app.id, app.is_enabled)}
                trackColor={{ false: COLORS.cardBorder, true: COLORS.info }}
                thumbColor={app.is_enabled ? '#fff' : COLORS.textSecondary}
              />
              <TouchableOpacity
                style={styles.delBtn}
                onPress={() => handleDelete(app.id)}
              >
                <Trash2 size={15} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ADD MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, SHADOWS.md]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm App Vào Whitelist</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Tên Ứng Dụng</Text>
            <TextInput
              style={styles.input}
              value={appName}
              onChangeText={setAppName}
              placeholder="Ví dụ: ScratchJr"
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.inputLabel}>Android Package Name</Text>
            <TextInput
              style={styles.input}
              value={packageName}
              onChangeText={setPackageName}
              placeholder="Ví dụ: org.scratchjr.android"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Danh Mục</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Học Tập, Trò Chơi, Sáng Tạo..."
              placeholderTextColor={COLORS.textMuted}
            />

            <TouchableOpacity
              style={[styles.saveBtn, SHADOWS.glow(COLORS.info)]}
              onPress={handleAddApp}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>Lưu Vào Whitelist</Text>
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
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardDark,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    gap: 6,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  appCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 12,
  },
  appIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${COLORS.info}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pkgName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  appCategory: {
    fontSize: 11,
    color: COLORS.primaryLight,
    marginTop: 4,
    fontWeight: '600',
  },
  actionCol: {
    alignItems: 'center',
    gap: 8,
  },
  delBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  saveBtn: {
    height: 48,
    backgroundColor: COLORS.info,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
