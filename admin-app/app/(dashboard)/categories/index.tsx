import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  FolderTree,
  Plus,
  Search,
  Volume2,
  Play,
  Pause,
  Edit2,
  Trash2,
  Check,
  X,
} from 'lucide-react-native';
import { supabase } from '../../../src/lib/supabase';
import { AnimalItem, CategoryItem } from '../../../src/types';
import { useAudioPlayer } from '../../../src/hooks/useAudioPlayer';
import { COLORS, SHADOWS } from '../../../src/styles/theme';

type ActiveTab = 'ANIMALS' | 'ANIMAL_CATEGORIES' | 'APP_CATEGORIES';

const INITIAL_ANIMALS: AnimalItem[] = [
  {
    id: '1',
    animal_code: 'DOG',
    name_vi: 'Chú Chó Cưng',
    name_en: 'Dog',
    category: 'Vật Nuôi',
    icon_emoji: '🐶',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/dog.mp3',
    pronounce_en_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/pronounce/dog.mp3',
    fun_fact_vi: 'Chó là người bạn trung thành nhất của con người!',
    is_active: true,
  },
  {
    id: '2',
    animal_code: 'CAT',
    name_vi: 'Mèo Con Dễ Thương',
    name_en: 'Cat',
    category: 'Vật Nuôi',
    icon_emoji: '🐱',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/cat.mp3',
    fun_fact_vi: 'Mèo có thể nhảy cao gấp 6 lần chiều dài cơ thể!',
    is_active: true,
  },
  {
    id: '3',
    animal_code: 'LION',
    name_vi: 'Sư Tử Chúa Sơn Lâm',
    name_en: 'Lion',
    category: 'Rừng Rậm',
    icon_emoji: '🦁',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/lion.mp3',
    fun_fact_vi: 'Tiếng gầm của sư tử có thể nghe thấy từ cách xa 8km.',
    is_active: true,
  },
  {
    id: '4',
    animal_code: 'ELEPHANT',
    name_vi: 'Chú Voi Khổng Lồ',
    name_en: 'Elephant',
    category: 'Rừng Rậm',
    icon_emoji: '🐘',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/elephant.mp3',
    fun_fact_vi: 'Voi là loài động vật có vú trên cạn lớn nhất hành tinh.',
    is_active: true,
  },
];

export default function CategoriesScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ANIMALS');
  const [animals, setAnimals] = useState<AnimalItem[]>(INITIAL_ANIMALS);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<AnimalItem | null>(null);
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [emoji, setEmoji] = useState('🐶');
  const [category, setCategory] = useState('Vật Nuôi');
  const [soundUrl, setSoundUrl] = useState('');

  const { playingUrl, playSound } = useAudioPlayer();

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('kids_animals').select('*');
      if (data && data.length > 0) {
        setAnimals(data as AnimalItem[]);
      }
    } catch (e) {
      console.warn('Error fetching animals:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingAnimal(null);
    setNameVi('');
    setNameEn('');
    setEmoji('🐾');
    setCategory('Vật Nuôi');
    setSoundUrl('');
    setModalVisible(true);
  };

  const handleOpenEdit = (item: AnimalItem) => {
    setEditingAnimal(item);
    setNameVi(item.name_vi);
    setNameEn(item.name_en);
    setEmoji(item.icon_emoji);
    setCategory(item.category);
    setSoundUrl(item.sound_url);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!nameVi.trim() || !nameEn.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên tiếng Việt và tiếng Anh.');
      return;
    }

    const payload: Partial<AnimalItem> = {
      name_vi: nameVi.trim(),
      name_en: nameEn.trim(),
      icon_emoji: emoji.trim() || '🐾',
      category: category.trim(),
      sound_url: soundUrl.trim(),
      animal_code: nameEn.toUpperCase().replace(/\s+/g, '_'),
      is_active: true,
    };

    try {
      if (editingAnimal) {
        // Update
        setAnimals((prev) =>
          prev.map((a) => (a.id === editingAnimal.id ? { ...a, ...payload } : a))
        );
        await supabase.from('kids_animals').update(payload).eq('id', editingAnimal.id);
      } else {
        // Insert
        const newId = String(Date.now());
        const newItem = { id: newId, ...payload } as AnimalItem;
        setAnimals((prev) => [newItem, ...prev]);
        await supabase.from('kids_animals').insert([newItem]);
      }
      setModalVisible(false);
    } catch (e) {
      console.warn('Save animal error:', e);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc muốn xóa con vật này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          setAnimals((prev) => prev.filter((a) => a.id !== id));
          await supabase.from('kids_animals').delete().eq('id', id);
        },
      },
    ]);
  };

  const filteredAnimals = animals.filter(
    (a) =>
      a.name_vi.toLowerCase().includes(search.toLowerCase()) ||
      a.name_en.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* TABS */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'ANIMALS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('ANIMALS')}
        >
          <Text
            style={[styles.tabText, activeTab === 'ANIMALS' && styles.tabTextActive]}
          >
            Thẻ Con Vật ({animals.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'ANIMAL_CATEGORIES' && styles.tabBtnActive]}
          onPress={() => setActiveTab('ANIMAL_CATEGORIES')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'ANIMAL_CATEGORIES' && styles.tabTextActive,
            ]}
          >
            Danh Mục Loài
          </Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH & ADD BAR */}
      <View style={styles.searchBarRow}>
        <View style={styles.searchWrapper}>
          <Search size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm con vật, tiếng kêu, danh mục..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={[styles.addBtn, SHADOWS.glow(COLORS.primary)]}
          onPress={handleOpenAdd}
          activeOpacity={0.8}
        >
          <Plus size={18} color="#fff" />
          <Text style={styles.addBtnText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* LIST CONTENT */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollList}>
          {filteredAnimals.map((item) => {
            const isPlaying = playingUrl === item.sound_url;
            return (
              <View key={item.id} style={[styles.animalCard, SHADOWS.sm]}>
                <View style={styles.cardLeft}>
                  <View style={styles.emojiBox}>
                    <Text style={styles.cardEmoji}>{item.icon_emoji}</Text>
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={styles.nameVi}>{item.name_vi}</Text>
                    <Text style={styles.nameEn}>{item.name_en}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{item.category}</Text>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                  {item.sound_url ? (
                    <TouchableOpacity
                      style={[
                        styles.actionCircle,
                        isPlaying && { backgroundColor: COLORS.accentAmber },
                      ]}
                      onPress={() => playSound(item.sound_url)}
                      activeOpacity={0.7}
                    >
                      {isPlaying ? (
                        <Pause size={14} color="#fff" />
                      ) : (
                        <Volume2 size={14} color={COLORS.accentAmber} />
                      )}
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    style={styles.actionCircle}
                    onPress={() => handleOpenEdit(item)}
                    activeOpacity={0.7}
                  >
                    <Edit2 size={14} color={COLORS.primaryLight} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionCircle}
                    onPress={() => handleDelete(item.id)}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={14} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* MODAL ADD/EDIT */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, SHADOWS.md]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAnimal ? 'Sửa Thẻ Con Vật' : 'Thêm Con Vật Mới'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={styles.inputLabel}>Biểu tượng (Emoji)</Text>
              <TextInput
                style={styles.modalInput}
                value={emoji}
                onChangeText={setEmoji}
                placeholder="🐶"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={styles.inputLabel}>Tên Tiếng Việt</Text>
              <TextInput
                style={styles.modalInput}
                value={nameVi}
                onChangeText={setNameVi}
                placeholder="Ví dụ: Chú Chó Cưng"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={styles.inputLabel}>Tên Tiếng Anh</Text>
              <TextInput
                style={styles.modalInput}
                value={nameEn}
                onChangeText={setNameEn}
                placeholder="Ví dụ: Dog"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={styles.inputLabel}>Danh Mục</Text>
              <TextInput
                style={styles.modalInput}
                value={category}
                onChangeText={setCategory}
                placeholder="Vật Nuôi, Rừng Rậm, Đại Dương..."
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={styles.inputLabel}>URL Âm Thanh MP3 (Supabase Bucket)</Text>
              <TextInput
                style={styles.modalInput}
                value={soundUrl}
                onChangeText={setSoundUrl}
                placeholder="https://.../sound.mp3"
                placeholderTextColor={COLORS.textMuted}
              />
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveModalBtn, SHADOWS.glow(COLORS.primary)]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Check size={18} color="#fff" />
              <Text style={styles.saveModalBtnText}>Lưu Dữ Liệu</Text>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceDark,
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  searchBarRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  searchWrapper: {
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
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 46,
    gap: 6,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollList: {
    gap: 12,
    paddingBottom: 24,
  },
  animalCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emojiBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardDetails: {
    flex: 1,
  },
  nameVi: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  nameEn: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${COLORS.accentAmber}15`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.accentAmber,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
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
  modalInput: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  saveModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 48,
    gap: 8,
    marginTop: 20,
  },
  saveModalBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
