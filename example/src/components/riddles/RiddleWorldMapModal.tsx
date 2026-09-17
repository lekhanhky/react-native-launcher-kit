import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  WorldId,
  RIDDLE_WORLDS_CONFIG,
  getRiddlesByWorld,
} from '../../data/riddles100Data';
import { riddleService } from '../../services/riddleService';

const { width } = Dimensions.get('window');

interface RiddleWorldMapModalProps {
  visible: boolean;
  currentWorldId: WorldId;
  currentIndexInWorld: number;
  isLight: boolean;
  onSelectRiddle: (worldId: WorldId, indexInWorld: number) => void;
  onClose: () => void;
}

export const RiddleWorldMapModal: React.FC<RiddleWorldMapModalProps> = ({
  visible,
  currentWorldId,
  currentIndexInWorld,
  isLight,
  onSelectRiddle,
  onClose,
}) => {
  const [selectedWorld, setSelectedWorld] = useState<WorldId>(currentWorldId);
  const progress = riddleService.getProgress();

  const worldsList: WorldId[] = ['animals', 'fruits', 'household', 'vehicles', 'nature'];
  const activeWorldConfig = RIDDLE_WORLDS_CONFIG[selectedWorld];
  const worldRiddles = getRiddlesByWorld(selectedWorld);
  const worldStats = riddleService.getWorldProgress(selectedWorld);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: isLight ? '#FFFFFF' : '#0F172A' },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text
                style={[
                  styles.titleText,
                  { color: isLight ? '#0F172A' : '#F8FAFC' },
                ]}
              >
                🗺️ Bản Đồ 5 Vùng Đất
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  { color: isLight ? '#64748B' : '#94A3B8' },
                ]}
              >
                Tổng sao: ⭐ {progress.totalStars} / 300
              </Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 1. Thanh chọn 5 Vùng Đất (Horizontal Scroll) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.worldTabsContainer}
          >
            {worldsList.map((wId) => {
              const cfg = RIDDLE_WORLDS_CONFIG[wId];
              const isSelected = selectedWorld === wId;
              const stats = riddleService.getWorldProgress(wId);

              return (
                <TouchableOpacity
                  key={wId}
                  activeOpacity={0.8}
                  onPress={() => setSelectedWorld(wId)}
                  style={[
                    styles.worldTab,
                    {
                      backgroundColor: isSelected
                        ? cfg.themeColor
                        : isLight
                        ? '#F1F5F9'
                        : '#1E293B',
                      borderColor: cfg.themeColor,
                    },
                  ]}
                >
                  <Text style={styles.worldTabEmoji}>{cfg.iconEmoji}</Text>
                  <Text
                    style={[
                      styles.worldTabName,
                      {
                        color: isSelected
                          ? '#FFFFFF'
                          : isLight
                          ? '#1E293B'
                          : '#F8FAFC',
                      },
                    ]}
                  >
                    {cfg.name}
                  </Text>
                  <Text
                    style={[
                      styles.worldTabProgress,
                      { color: isSelected ? '#FFFFFF' : '#64748B' },
                    ]}
                  >
                    {stats.solvedCount}/20 {stats.isChestUnlocked ? '🏆' : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* 2. Thẻ thông tin vùng đất đang chọn */}
          <View
            style={[
              styles.activeWorldCard,
              {
                backgroundColor: isLight ? activeWorldConfig.bgGradient[0] : '#1E293B',
                borderColor: activeWorldConfig.themeColor,
              },
            ]}
          >
            <View style={styles.activeWorldHeader}>
              <Text style={styles.activeWorldIcon}>{activeWorldConfig.iconEmoji}</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.activeWorldTitle}>{activeWorldConfig.name}</Text>
                <Text style={styles.activeWorldSub}>{activeWorldConfig.subtitle}</Text>
              </View>
              <View style={styles.chestBadge}>
                <Text style={styles.chestIcon}>
                  {worldStats.isChestUnlocked ? '🏆' : '🔒'}
                </Text>
                <Text style={styles.chestText}>
                  {worldStats.isChestUnlocked ? 'Đã Mở' : 'Rương Khóa'}
                </Text>
              </View>
            </View>

            {/* Thanh tiến độ */}
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(worldStats.solvedCount / 20) * 100}%`,
                    backgroundColor: activeWorldConfig.themeColor,
                  },
                ]}
              />
            </View>
          </View>

          {/* 3. Lưới 20 Trạm Câu Đố */}
          <Text
            style={[
              styles.levelsGridTitle,
              { color: isLight ? '#475569' : '#CBD5E1' },
            ]}
          >
            📍 Chọn trạm muốn giải đố:
          </Text>

          <ScrollView style={styles.levelsScroll} contentContainerStyle={styles.levelsGrid}>
            {worldRiddles.map((riddle) => {
              const isSolved = progress.solvedRiddleIds.includes(riddle.id);
              const stars = progress.riddleStars[riddle.id] || 0;
              const isCurrent =
                selectedWorld === currentWorldId &&
                riddle.indexInWorld === currentIndexInWorld;

              return (
                <TouchableOpacity
                  key={riddle.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelectRiddle(selectedWorld, riddle.indexInWorld);
                    onClose();
                  }}
                  style={[
                    styles.levelCircle,
                    {
                      backgroundColor: isCurrent
                        ? '#3B82F6'
                        : isSolved
                        ? isLight
                          ? '#DCFCE7'
                          : '#064E3B'
                        : isLight
                        ? '#F1F5F9'
                        : '#334155',
                      borderColor: isCurrent
                        ? '#1D4ED8'
                        : isSolved
                        ? '#10B981'
                        : '#CBD5E1',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.levelNumber,
                      {
                        color: isCurrent
                          ? '#FFFFFF'
                          : isSolved
                          ? '#10B981'
                          : isLight
                          ? '#475569'
                          : '#94A3B8',
                      },
                    ]}
                  >
                    {riddle.indexInWorld}
                  </Text>
                  {isSolved && (
                    <Text style={styles.levelStars}>
                      {'⭐'.repeat(Math.max(1, Math.min(3, stars)))}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '82%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B',
  },
  worldTabsContainer: {
    flexDirection: 'row',
    paddingBottom: 12,
    gap: 10,
  },
  worldTab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1.5,
  },
  worldTabEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  worldTabName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  worldTabProgress: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeWorldCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 14,
    marginVertical: 10,
  },
  activeWorldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeWorldIcon: {
    fontSize: 32,
  },
  activeWorldTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  activeWorldSub: {
    fontSize: 12,
    color: '#475569',
  },
  chestBadge: {
    alignItems: 'center',
  },
  chestIcon: {
    fontSize: 24,
  },
  chestText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelsGridTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
  },
  levelsScroll: {
    flex: 1,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    paddingBottom: 20,
  },
  levelCircle: {
    width: (width - 64) / 5,
    height: (width - 64) / 5,
    borderRadius: (width - 64) / 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  levelStars: {
    fontSize: 8,
    marginTop: 1,
  },
});
