import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { WorldId, RIDDLE_WORLDS_CONFIG } from '../../data/riddles100Data';

const { width } = Dimensions.get('window');

interface RiddleTreasureModalProps {
  visible: boolean;
  worldId: WorldId;
  onClose: () => void;
  onNextWorld?: () => void;
}

export const RiddleTreasureModal: React.FC<RiddleTreasureModalProps> = ({
  visible,
  worldId,
  onClose,
  onNextWorld,
}) => {
  const worldConfig = RIDDLE_WORLDS_CONFIG[worldId] || RIDDLE_WORLDS_CONFIG.animals;
  const bounceAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      bounceAnim.setValue(0.3);
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: bounceAnim }],
            },
          ]}
        >
          {/* Huy hiệu & Biểu tượng Cúp */}
          <Animated.View
            style={[
              styles.trophyWrapper,
              {
                backgroundColor: worldConfig.themeColor,
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <Text style={styles.trophyEmoji}>{worldConfig.trophyIcon}</Text>
          </Animated.View>

          {/* Tiêu đề chiến thắng */}
          <Text style={styles.congratsText}>🎉 XUẤT SẮC QUÁ BÉ ƠI! 🎉</Text>
          <Text style={styles.trophyTitle}>{worldConfig.trophyTitle}</Text>

          <Text style={styles.descriptionText}>
            Bé đã hoàn thành xuất sắc toàn bộ{' '}
            <Text style={{ fontWeight: '800', color: worldConfig.themeColor }}>
              20 câu đố
            </Text>{' '}
            của thế giới{' '}
            <Text style={{ fontWeight: '800' }}>{worldConfig.name}</Text>!
          </Text>

          {/* Phần thưởng đạt được */}
          <View style={styles.rewardBox}>
            <Text style={styles.rewardItem}>⭐ +20 Ngôi Sao Vinh Dự</Text>
            <Text style={styles.rewardItem}>🏆 Mở Khóa Rương Hoàng Kim</Text>
            <Text style={styles.rewardItem}>🎖️ Danh Hiệu Thám Tử Thông Thái</Text>
          </View>

          {/* Nút hành động */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: worldConfig.themeColor },
              ]}
              onPress={() => {
                onClose();
                if (onNextWorld) onNextWorld();
              }}
            >
              <Text style={styles.actionButtonText}>
                🌟 Khám Phá Vùng Đất Mới ➔
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Đóng Lại</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  trophyWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -45,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  trophyEmoji: {
    fontSize: 46,
  },
  congratsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  trophyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  rewardBox: {
    width: '100%',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  rewardItem: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginVertical: 3,
  },
  buttonRow: {
    width: '100%',
    gap: 10,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
});
