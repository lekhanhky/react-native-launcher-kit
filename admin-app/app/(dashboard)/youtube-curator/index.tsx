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
  Youtube,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Tv,
  X,
} from 'lucide-react-native';
import { supabase } from '../../../src/lib/supabase';
import { KidsYouTubeChannel } from '../../../src/types';
import { COLORS, SHADOWS } from '../../../src/styles/theme';

const INITIAL_CHANNELS: KidsYouTubeChannel[] = [
  {
    id: '1',
    channel_id: 'UCbCmjCuTUZos6242uIvGDAw',
    channel_title: 'Cocomelon - Nursery Rhymes',
    category: 'Nhạc Thiếu Nhi & Bài Hát',
    video_count: 850,
    is_active: true,
  },
  {
    id: '2',
    channel_id: 'UC4NALVCmcmL5ntpV0thoH6Q',
    channel_title: 'Blippi - Educational Videos for Kids',
    category: 'Khám Phá Thực Tế',
    video_count: 420,
    is_active: true,
  },
  {
    id: '3',
    channel_id: 'UC5PyNgKG9YoPWyytK_rZPow',
    channel_title: 'Pinkfong Baby Shark',
    category: 'Nhạc Vui Nhộn & Vũ Đạo',
    video_count: 1200,
    is_active: true,
  },
  {
    id: '4',
    channel_id: 'UCvlE5gTbOvjiolFlEm-c_Ow',
    channel_title: 'Vlad and Niki',
    category: 'Trò Chơi & Đồ Chơi',
    video_count: 650,
    is_active: false,
  },
];

export default function YoutubeCuratorScreen() {
  const [channels, setChannels] = useState<KidsYouTubeChannel[]>(INITIAL_CHANNELS);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [channelTitle, setChannelTitle] = useState('');
  const [channelId, setChannelId] = useState('');
  const [category, setCategory] = useState('Khám Phá');

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const { data } = await supabase.from('kids_youtube_channels').select('*');
      if (data && data.length > 0) {
        setChannels(data as KidsYouTubeChannel[]);
      }
    } catch (e) {
      console.warn('Fetch youtube channels error:', e);
    }
  };

  const handleToggle = async (id: string, currentVal: boolean) => {
    const nextVal = !currentVal;
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: nextVal } : c))
    );
    await supabase
      .from('kids_youtube_channels')
      .update({ is_active: nextVal })
      .eq('id', id);
  };

  const handleAddChannel = async () => {
    if (!channelTitle.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên kênh YouTube.');
      return;
    }

    const newChannel: KidsYouTubeChannel = {
      id: String(Date.now()),
      channel_title: channelTitle.trim(),
      channel_id: channelId.trim() || `UC_${Date.now()}`,
      category: category.trim(),
      video_count: 50,
      is_active: true,
    };

    setChannels((prev) => [newChannel, ...prev]);
    await supabase.from('kids_youtube_channels').insert([newChannel]);
    setModalVisible(false);
    setChannelTitle('');
    setChannelId('');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc muốn gỡ kênh YouTube này khỏi danh sách duyệt?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          setChannels((prev) => prev.filter((c) => c.id !== id));
          await supabase.from('kids_youtube_channels').delete().eq('id', id);
        },
      },
    ]);
  };

  const filteredChannels = channels.filter(
    (c) =>
      c.channel_title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* SEARCH & ADD */}
      <View style={styles.topRow}>
        <View style={styles.searchBox}>
          <Search size={16} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên kênh hoặc thể loại..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={[styles.addBtn, SHADOWS.glow(COLORS.accentRose)]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Plus size={18} color="#fff" />
          <Text style={styles.addBtnText}>Thêm Kênh</Text>
        </TouchableOpacity>
      </View>

      {/* CHANNELS LIST */}
      <ScrollView contentContainerStyle={styles.list}>
        {filteredChannels.map((channel) => (
          <View key={channel.id} style={[styles.channelCard, SHADOWS.sm]}>
            <View style={styles.channelIconBox}>
              <Youtube size={22} color={COLORS.accentRose} />
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.channelNameRow}>
                <Text style={styles.channelTitle} numberOfLines={1}>
                  {channel.channel_title}
                </Text>
              </View>
              <Text style={styles.categoryText}>{channel.category}</Text>
              <Text style={styles.metaText}>
                ID: {channel.channel_id.slice(0, 14)}... • {channel.video_count || 100} videos
              </Text>
            </View>

            {/* Switch Toggle & Delete */}
            <View style={styles.actionCol}>
              <Switch
                value={channel.is_active}
                onValueChange={() => handleToggle(channel.id, channel.is_active)}
                trackColor={{ false: COLORS.cardBorder, true: COLORS.accentRose }}
                thumbColor={channel.is_active ? '#fff' : COLORS.textSecondary}
              />
              <TouchableOpacity
                style={styles.delBtn}
                onPress={() => handleDelete(channel.id)}
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
              <Text style={styles.modalTitle}>Thêm Kênh YouTube An Toàn</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Tên Kênh YouTube</Text>
            <TextInput
              style={styles.input}
              value={channelTitle}
              onChangeText={setChannelTitle}
              placeholder="Ví dụ: Numberblocks Official"
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.inputLabel}>YouTube Channel ID hoặc URL</Text>
            <TextInput
              style={styles.input}
              value={channelId}
              onChangeText={setChannelId}
              placeholder="UC..."
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Thể Loại Nội Dung</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Toán Học, Tiếng Anh, Khám Phá..."
              placeholderTextColor={COLORS.textMuted}
            />

            <TouchableOpacity
              style={[styles.saveBtn, SHADOWS.glow(COLORS.accentRose)]}
              onPress={handleAddChannel}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>Lưu & Kiểm Duyệt Kênh</Text>
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
    backgroundColor: COLORS.accentRose,
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
  channelCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 12,
  },
  channelIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${COLORS.accentRose}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  categoryText: {
    fontSize: 11,
    color: COLORS.accentRose,
    marginTop: 2,
    fontWeight: '600',
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
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
    backgroundColor: COLORS.accentRose,
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
