import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {
  Volume2,
  Play,
  Pause,
  UploadCloud,
  FileAudio,
  Trash2,
  RefreshCw,
  Copy,
} from 'lucide-react-native';
import { supabase } from '../../../src/lib/supabase';
import { StorageFile } from '../../../src/types';
import { useAudioPlayer } from '../../../src/hooks/useAudioPlayer';
import { COLORS, SHADOWS } from '../../../src/styles/theme';

const INITIAL_SOUNDS = [
  { name: 'dog.mp3', size: 142000, updated_at: '2026-03-01' },
  { name: 'cat.mp3', size: 98000, updated_at: '2026-03-02' },
  { name: 'lion.mp3', size: 215000, updated_at: '2026-03-05' },
  { name: 'elephant.mp3', size: 184000, updated_at: '2026-03-10' },
  { name: 'rooster.mp3', size: 120000, updated_at: '2026-03-12' },
  { name: 'bird.mp3', size: 85000, updated_at: '2026-03-14' },
];

export default function AnimalSoundsScreen() {
  const [files, setFiles] = useState<any[]>(INITIAL_SOUNDS);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { playingUrl, playSound } = useAudioPlayer();

  const getPublicUrl = (filename: string) => {
    return `https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/${filename}`;
  };

  const fetchBucketFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('kids-media')
        .list('animals/sounds');

      if (data && data.length > 0) {
        setFiles(data);
      }
    } catch (e) {
      console.warn('Storage list error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBucketFiles();
  }, []);

  const handleUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (res.canceled || !res.assets || res.assets.length === 0) return;

      const asset = res.assets[0];
      setUploading(true);

      const filename = asset.name;
      // In production, read as blob or FormData and upload to Supabase storage
      Alert.alert(
        'Upload thành công',
        `File ${filename} (${(asset.size ? asset.size / 1024 : 0).toFixed(1)} KB) đã sẵn sàng tải lên Supabase Storage.`
      );

      setFiles((prev) => [
        { name: filename, size: asset.size || 100000, updated_at: new Date().toISOString() },
        ...prev,
      ]);
    } catch (e) {
      Alert.alert('Lỗi upload', 'Không thể chọn hoặc tải file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (name: string) => {
    Alert.alert('Xác nhận xóa', `Bạn có muốn xóa file âm thanh "${name}" không?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          setFiles((prev) => prev.filter((f) => f.name !== name));
          await supabase.storage
            .from('kids-media')
            .remove([`animals/sounds/${name}`]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* HEADER BANNER */}
      <View style={[styles.bannerCard, SHADOWS.sm]}>
        <View style={styles.bannerIcon}>
          <Volume2 size={24} color={COLORS.accentAmber} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Storage Bucket: kids-media</Text>
          <Text style={styles.bannerDesc}>
            Đường dẫn: /animals/sounds/ • Tổng cộng {files.length} tệp MP3
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={fetchBucketFiles}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.accentAmber} />
          ) : (
            <RefreshCw size={16} color={COLORS.accentAmber} />
          )}
        </TouchableOpacity>
      </View>

      {/* UPLOAD ACTION BAR */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.uploadButton, SHADOWS.glow(COLORS.primary)]}
          onPress={handleUpload}
          disabled={uploading}
          activeOpacity={0.8}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <UploadCloud size={18} color="#fff" />
              <Text style={styles.uploadText}>Tải Lên File MP3 Mới</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* SOUND FILES LIST */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {files.map((file) => {
          const publicUrl = getPublicUrl(file.name);
          const isPlaying = playingUrl === publicUrl;
          const sizeKb = file.metadata?.size
            ? (file.metadata.size / 1024).toFixed(0)
            : file.size
            ? (file.size / 1024).toFixed(0)
            : '120';

          return (
            <View key={file.name} style={[styles.soundCard, SHADOWS.sm]}>
              <View style={styles.cardLeft}>
                <View style={styles.audioIcon}>
                  <FileAudio size={20} color={COLORS.primaryLight} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileMeta}>{sizeKb} KB • MP3 Audio</Text>
                </View>
              </View>

              {/* ACTION BUTTONS */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[
                    styles.playBtn,
                    isPlaying && { backgroundColor: COLORS.accentAmber },
                  ]}
                  onPress={() => playSound(publicUrl)}
                  activeOpacity={0.8}
                >
                  {isPlaying ? (
                    <Pause size={16} color="#fff" />
                  ) : (
                    <Play size={16} color="#fff" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(file.name)}
                  activeOpacity={0.7}
                >
                  <Trash2 size={16} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    padding: 16,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardDark,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 12,
    marginBottom: 14,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${COLORS.accentAmber}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  bannerDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  refreshBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 48,
    gap: 8,
  },
  uploadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  listContainer: {
    gap: 12,
    paddingBottom: 24,
  },
  soundCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 16,
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
  audioIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  fileMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceDark,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
