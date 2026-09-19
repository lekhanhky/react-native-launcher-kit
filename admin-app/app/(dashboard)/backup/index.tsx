import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import {
  HardDriveDownload,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  ShieldCheck,
  Database,
} from 'lucide-react-native';
import { supabase } from '../../../src/lib/supabase';
import { COLORS, SHADOWS } from '../../../src/styles/theme';

export default function BackupScreen() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);

  const handleExportBackup = async () => {
    try {
      setExporting(true);

      // Fetch all tables
      const [animals, math, youtube, apps] = await Promise.all([
        supabase.from('kids_animals').select('*'),
        supabase.from('math_questions').select('*'),
        supabase.from('kids_youtube_channels').select('*'),
        supabase.from('app_catalog').select('*'),
      ]);

      const backupData = {
        version: '1.0.0',
        exported_at: new Date().toISOString(),
        system: 'Kids Launcher Admin Studio',
        data: {
          kids_animals: animals.data || [],
          math_questions: math.data || [],
          kids_youtube_channels: youtube.data || [],
          app_catalog: apps.data || [],
        },
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const filename = `kids_launcher_backup_${Date.now()}.json`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonStr, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      setLastBackupTime(new Date().toLocaleTimeString());

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Lưu hoặc chia sẻ bản sao lưu hệ thống',
        });
      } else {
        Alert.alert('Sao lưu thành công', `Đã xuất file thành công: ${filename}`);
      }
    } catch (e: any) {
      console.warn('Backup error:', e);
      Alert.alert('Lỗi sao lưu', e.message || 'Không thể xuất file sao lưu.');
    } finally {
      setExporting(false);
    }
  };

  const handleImportBackup = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (res.canceled || !res.assets || res.assets.length === 0) return;

      const fileAsset = res.assets[0];
      setImporting(true);

      const content = await FileSystem.readAsStringAsync(fileAsset.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const parsed = JSON.parse(content);
      if (!parsed.data) {
        throw new Error('Định dạng file sao lưu không hợp lệ.');
      }

      Alert.alert(
        'Xác nhận phục hồi',
        `File gồm:\n- ${parsed.data.kids_animals?.length || 0} con vật\n- ${
          parsed.data.math_questions?.length || 0
        } câu toán\n- ${parsed.data.kids_youtube_channels?.length || 0} kênh YouTube\n\nBạn có muốn đồng bộ vào CSDL Supabase không?`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Đồng Bộ Ngay',
            style: 'default',
            onPress: async () => {
              // Upsert data to Supabase
              try {
                if (parsed.data.kids_animals?.length) {
                  await supabase.from('kids_animals').upsert(parsed.data.kids_animals);
                }
                if (parsed.data.math_questions?.length) {
                  await supabase.from('math_questions').upsert(parsed.data.math_questions);
                }
                if (parsed.data.kids_youtube_channels?.length) {
                  await supabase
                    .from('kids_youtube_channels')
                    .upsert(parsed.data.kids_youtube_channels);
                }
                Alert.alert('Thành công', 'Đã phục hồi dữ liệu hệ thống hoàn tất!');
              } catch (err: any) {
                Alert.alert('Lỗi phục hồi', err.message);
              }
            },
          },
        ]
      );
    } catch (e: any) {
      Alert.alert('Lỗi phục hồi', e.message || 'Không thể đọc file JSON.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* STATUS OVERVIEW */}
      <View style={[styles.infoCard, SHADOWS.sm]}>
        <View style={styles.infoIconBox}>
          <Database size={24} color={COLORS.primaryLight} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Trung Tâm Dữ Liệu Supabase</Text>
          <Text style={styles.infoDesc}>
            Bao gồm 4 bảng nghiệp vụ: Thẻ con vật, Ngân hàng câu hỏi toán, Danh mục App, Kênh YouTube Kids.
          </Text>
        </View>
      </View>

      {/* EXPORT SECTION */}
      <View style={[styles.actionCard, SHADOWS.sm]}>
        <View style={styles.cardHeader}>
          <HardDriveDownload size={20} color={COLORS.accentEmerald} />
          <Text style={styles.cardTitle}>1. Xuất Bản Sao Lưu (Export JSON)</Text>
        </View>
        <Text style={styles.cardBody}>
          Tạo tệp `.json` chứa toàn bộ dữ liệu hiện tại của hệ thống. Bạn có thể lưu vào Google Drive, bộ nhớ điện thoại hoặc gửi qua ứng dụng khác.
        </Text>

        {lastBackupTime && (
          <View style={styles.timeBadge}>
            <CheckCircle2 size={14} color={COLORS.accentEmerald} />
            <Text style={styles.timeBadgeText}>
              Đã sao lưu gần nhất lúc: {lastBackupTime}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: COLORS.accentEmerald }]}
          onPress={handleExportBackup}
          disabled={exporting}
          activeOpacity={0.8}
        >
          {exporting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <FileJson size={18} color="#fff" />
              <Text style={styles.btnText}>Tải & Chia Sẻ Bản Sao Lưu JSON</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* IMPORT SECTION */}
      <View style={[styles.actionCard, SHADOWS.sm]}>
        <View style={styles.cardHeader}>
          <UploadCloud size={20} color={COLORS.primaryLight} />
          <Text style={styles.cardTitle}>2. Phục Hồi Dữ Liệu (Import JSON)</Text>
        </View>
        <Text style={styles.cardBody}>
          Chọn tệp JSON sao lưu từ máy để khôi phục hoặc nạp dữ liệu mẫu vào CSDL Supabase.
        </Text>

        <View style={styles.warningBox}>
          <AlertTriangle size={16} color={COLORS.accentAmber} />
          <Text style={styles.warningText}>
            Lưu ý: Dữ liệu từ file sẽ được ghi đè/bổ sung vào cơ sở dữ liệu hiện tại.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: COLORS.primary }]}
          onPress={handleImportBackup}
          disabled={importing}
          activeOpacity={0.8}
        >
          {importing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <UploadCloud size={18} color="#fff" />
              <Text style={styles.btnText}>Chọn Tệp JSON Để Phục Hồi</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 12,
    marginBottom: 16,
  },
  infoIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  infoDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  actionCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardBody: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${COLORS.accentEmerald}15`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accentEmerald,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${COLORS.accentAmber}15`,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.accentAmber,
    lineHeight: 15,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    gap: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
