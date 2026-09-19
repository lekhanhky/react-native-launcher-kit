import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FolderTree,
  Volume2,
  Calculator,
  Layers,
  Youtube,
  HardDriveDownload,
  Play,
  Pause,
  Sparkles,
  Smartphone,
  RefreshCw,
} from 'lucide-react-native';

import { Header } from '../../src/components/Header';
import { StatCard } from '../../src/components/StatCard';
import { ModuleHubCard } from '../../src/components/ModuleHubCard';
import { useDashboardMetrics } from '../../src/hooks/useDashboardMetrics';
import { useAudioPlayer } from '../../src/hooks/useAudioPlayer';
import { COLORS, SHADOWS } from '../../src/styles/theme';

export default function DashboardHubScreen() {
  const router = useRouter();
  const { metrics, recentAnimals, isLoading, refetch } = useDashboardMetrics();
  const { playingUrl, playSound } = useAudioPlayer();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* TOP HEADER */}
      <Header
        title="Admin Studio"
        subtitle="Super Admin Role"
        showLogout={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI OVERVIEW CARDS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tổng Quan Hệ Thống</Text>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={refetch}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.primaryLight} />
            ) : (
              <RefreshCw size={14} color={COLORS.primaryLight} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statRow}>
            <StatCard
              label="Kho App An Toàn"
              value={metrics.totalApps}
              icon={<Layers size={20} color={COLORS.info} />}
              color={COLORS.info}
              change="+12 Whitelist"
            />
            <StatCard
              label="Kênh YouTube Kids"
              value={metrics.totalChannels}
              icon={<Youtube size={20} color={COLORS.accentRose} />}
              color={COLORS.accentRose}
              change="17 Kênh"
            />
          </View>
          <View style={styles.statRow}>
            <StatCard
              label="Câu Hỏi Toán"
              value={metrics.totalMathQuestions}
              icon={<Calculator size={20} color={COLORS.accentEmerald} />}
              color={COLORS.accentEmerald}
              change="Tự động"
            />
            <StatCard
              label="Thẻ Con Vật"
              value={metrics.totalAnimals}
              icon={<FolderTree size={20} color={COLORS.accentAmber} />}
              color={COLORS.accentAmber}
              change="Âm thanh"
            />
          </View>
        </View>

        {/* QUICK ANIMAL SOUNDS MINI-PLAYER */}
        <View style={styles.quickPlayerCard}>
          <View style={styles.quickPlayerHeader}>
            <View style={styles.quickPlayerTitleRow}>
              <Volume2 size={18} color={COLORS.accentAmber} />
              <Text style={styles.quickPlayerTitle}>Nghe Thử Âm Thanh Con Vật</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(dashboard)/animal-sounds')}
            >
              <Text style={styles.viewMoreText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.animalChipScroll}
          >
            {recentAnimals.map((animal) => {
              const isPlaying = playingUrl === animal.sound_url;
              return (
                <TouchableOpacity
                  key={animal.id}
                  style={[
                    styles.animalChip,
                    isPlaying && styles.animalChipPlaying,
                  ]}
                  onPress={() => playSound(animal.sound_url)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.animalEmoji}>{animal.icon_emoji}</Text>
                  <View>
                    <Text style={styles.animalNameVi}>{animal.name_vi}</Text>
                    <Text style={styles.animalNameEn}>{animal.name_en}</Text>
                  </View>
                  <View
                    style={[
                      styles.chipPlayIcon,
                      isPlaying && { backgroundColor: COLORS.accentAmber },
                    ]}
                  >
                    {isPlaying ? (
                      <Pause size={12} color="#fff" />
                    ) : (
                      <Play size={12} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 6 MODULES HUB GRID */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Phân Hệ Quản Trị</Text>
          <Text style={styles.sectionBadge}>6 Chức Năng</Text>
        </View>

        <View style={styles.hubGrid}>
          {/* Module 1: Categories & Animals */}
          <ModuleHubCard
            title="Danh Mục & Con Vật"
            subtitle="Quản lý thẻ, song ngữ, tiếng kêu & phát âm"
            icon={<FolderTree size={22} color={COLORS.primaryLight} />}
            accentColor={COLORS.primary}
            badge="Mới"
            badgeColor={COLORS.accentPink}
            onPress={() => router.push('/(dashboard)/categories')}
          />

          {/* Module 2: Animal Sounds */}
          <ModuleHubCard
            title="Âm Thanh MP3"
            subtitle="Storage Bucket, nghe thử & upload file"
            icon={<Volume2 size={22} color={COLORS.accentAmber} />}
            accentColor={COLORS.accentAmber}
            badge="Bucket"
            badgeColor={COLORS.accentAmber}
            onPress={() => router.push('/(dashboard)/animal-sounds')}
          />

          {/* Module 3: Math Generator */}
          <ModuleHubCard
            title="Sinh Đề Toán"
            subtitle="Tự động tạo câu hỏi trắc nghiệm +, -, ×, ÷"
            icon={<Calculator size={22} color={COLORS.accentEmerald} />}
            accentColor={COLORS.accentEmerald}
            badge="Hot"
            badgeColor={COLORS.accentEmerald}
            onPress={() => router.push('/(dashboard)/math-generator')}
          />

          {/* Module 4: App Catalog */}
          <ModuleHubCard
            title="Kho App An Toàn"
            subtitle="Whitelist package Android cho bé"
            icon={<Layers size={22} color={COLORS.info} />}
            accentColor={COLORS.info}
            badge="Whitelist"
            badgeColor={COLORS.info}
            onPress={() => router.push('/(dashboard)/app-catalog')}
          />

          {/* Module 5: YouTube Curator */}
          <ModuleHubCard
            title="Duyệt YouTube Kids"
            subtitle="Kiểm duyệt kênh & video phù hợp độ tuổi"
            icon={<Youtube size={22} color={COLORS.accentRose} />}
            accentColor={COLORS.accentRose}
            badge="Curator"
            badgeColor={COLORS.accentRose}
            onPress={() => router.push('/(dashboard)/youtube-curator')}
          />

          {/* Module 6: Backup & Restore */}
          <ModuleHubCard
            title="Sao Lưu Dữ Liệu"
            subtitle="Xuất & nạp bản sao lưu JSON an toàn"
            icon={<HardDriveDownload size={22} color={COLORS.textSecondary} />}
            accentColor={COLORS.textSecondary}
            badge="Backup"
            badgeColor={COLORS.textSecondary}
            onPress={() => router.push('/(dashboard)/backup')}
          />
        </View>

        {/* FOOTER STATUS */}
        <View style={styles.dbStatusCard}>
          <View style={styles.dbStatusDot} />
          <Text style={styles.dbStatusText}>
            Supabase DB:{' '}
            <Text style={{ color: COLORS.accentEmerald, fontWeight: '700' }}>
              Connected & Synced
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollContainer: {
    padding: 18,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
    backgroundColor: `${COLORS.primary}25`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  refreshBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  statGrid: {
    gap: 12,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickPlayerCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 24,
  },
  quickPlayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickPlayerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickPlayerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  viewMoreText: {
    fontSize: 12,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  animalChipScroll: {
    gap: 10,
  },
  animalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceDark,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  animalChipPlaying: {
    borderColor: COLORS.accentAmber,
    backgroundColor: `${COLORS.accentAmber}15`,
  },
  animalEmoji: {
    fontSize: 22,
  },
  animalNameVi: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  animalNameEn: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  chipPlayIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  hubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dbStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.cardDark,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  dbStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accentEmerald,
  },
  dbStatusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
