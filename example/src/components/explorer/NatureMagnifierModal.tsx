import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { soundManager } from '../SoundPlayer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CHAMELEON_IMG = require('../../assets/images/chameleon_3d.jpg');
const TOM_IMG = require('../../assets/images/tom_3d.jpg');
const MIMI_IMG = require('../../assets/images/mimi_3d.jpg');

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Tọa độ mục tiêu Tắc kè hoa ngụy trang trên cành lá (% màn hình)
const TARGET_X = SCREEN_WIDTH * 0.65;
const TARGET_Y = SCREEN_HEIGHT * 0.35;
const TARGET_RADIUS = 70; // Bán kính nhận diện phát hiện

export const NatureMagnifierModal: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  // Tọa độ kính lúp
  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH * 0.2, y: SCREEN_HEIGHT * 0.3 })).current;
  const [currentPos, setCurrentPos] = useState({ x: SCREEN_WIDTH * 0.2, y: SCREEN_HEIGHT * 0.3 });
  const [isFound, setIsFound] = useState(false);
  const [chameleonColorIndex, setChameleonColorIndex] = useState(0);

  // Animation hiệu ứng
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  // Danh sách màu ngụy trang của Tắc kè khi tìm thấy
  const CHAMELEON_COLORS = ['#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'];

  useEffect(() => {
    if (visible) {
      setIsFound(false);
      setChameleonColorIndex(0);
      successScale.setValue(0);
      pan.setValue({ x: SCREEN_WIDTH * 0.2, y: SCREEN_HEIGHT * 0.3 });
      setCurrentPos({ x: SCREEN_WIDTH * 0.2, y: SCREEN_HEIGHT * 0.3 });

      soundManager.speak(
        'Bé ơi! Bạn Tắc Kè Hoa đang ngụy trang ẩn mình trên cành lá. Bé hãy di chuyển chiếc kính lúp của anh Tom để tìm bạn ấy nhé!',
        'vi'
      );
    }
  }, [visible]);

  // Hiệu ứng nhấp nháy của kính lúp
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 700,
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Xử lý kéo kính lúp với PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        const newX = Math.max(20, Math.min(SCREEN_WIDTH - 120, gestureState.moveX - 50));
        const newY = Math.max(80, Math.min(SCREEN_HEIGHT - 220, gestureState.moveY - 50));
        pan.setValue({ x: newX, y: newY });
        setCurrentPos({ x: newX, y: newY });

        // Kiểm tra khoảng cách đến mục tiêu Tắc kè
        const dx = newX + 50 - TARGET_X;
        const dy = newY + 50 - TARGET_Y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < TARGET_RADIUS && !isFound) {
          triggerFound();
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  // Kích hoạt khi tìm thấy Tắc kè
  const triggerFound = () => {
    setIsFound(true);
    Animated.spring(successScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    soundManager.speak(
      'A hoan hô bé! Bé đã tìm thấy bạn Tắc Kè Hoa rồi! Bạn ấy đang đổi màu áo chào bé kìa!',
      'vi'
    );

    // Chuyển màu ngụy trang liên tục
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setChameleonColorIndex((prev) => (prev + 1) % CHAMELEON_COLORS.length);
      if (count > 8) clearInterval(interval);
    }, 350);
  };

  const handleComplete = () => {
    onSuccess();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>🔍 THỬ THÁCH THÁM TỬ NHÍ</Text>
            </View>
            <Text style={styles.headerTitle}>Truy Tìm Tắc Kè Hoa Ngụy Trang</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Vùng sân chơi cành lá rậm rạp */}
          <View style={styles.forestArea}>
            {/* Các chi tiết cây cối lá ngụy trang */}
            <Text style={[styles.decorLeaf, { top: 30, left: 40 }]}>🌿</Text>
            <Text style={[styles.decorLeaf, { top: 90, left: 100 }]}>🍃</Text>
            <Text style={[styles.decorLeaf, { top: 40, right: 80 }]}>🌿</Text>
            <Text style={[styles.decorLeaf, { top: 140, left: 30 }]}>🌱</Text>
            <Text style={[styles.decorLeaf, { bottom: 60, left: 120 }]}>🍃</Text>
            <Text style={[styles.decorLeaf, { bottom: 40, right: 60 }]}>🌾</Text>
            <Text style={[styles.decorBranch, { top: TARGET_Y - 40, left: TARGET_X - 100 }]}>
              🪵──────────────
            </Text>

            {/* Mục tiêu Tắc Kè Hoa đang ẩn nấp */}
            <View
              style={[
                styles.targetChameleonBox,
                {
                  left: TARGET_X - 45,
                  top: TARGET_Y - 45,
                  backgroundColor: isFound ? CHAMELEON_COLORS[chameleonColorIndex] : 'rgba(76, 175, 80, 0.15)',
                  borderColor: isFound ? '#FFD700' : 'rgba(255,255,255,0.2)',
                },
              ]}
            >
              <Image
                source={CHAMELEON_IMG}
                style={[
                  styles.targetChameleonImg,
                  { opacity: isFound ? 1.0 : 0.25 },
                ]}
                resizeMode="contain"
              />
              {isFound && (
                <View style={styles.chameleonGlowRing}>
                  <Text style={styles.sparkleIcon}>✨</Text>
                </View>
              )}
            </View>

            {/* Chiếc Kính Lúp có thể kéo bằng tay */}
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.magnifierWrapper,
                {
                  transform: [
                    { translateX: pan.x },
                    { translateY: pan.y },
                    { scale: isFound ? 1.0 : pulseAnim },
                  ],
                },
              ]}
            >
              <View style={styles.magnifierGlass}>
                <Text style={styles.lensReflection}>💫</Text>
                <View style={styles.centerDot} />
              </View>
              <View style={styles.magnifierHandle} />
            </Animated.View>

            {/* Hướng dẫn khi chưa tìm thấy */}
            {!isFound && (
              <View style={styles.guideHintBox}>
                <Text style={styles.guideHintText}>
                  👉 Chạm & rê chiếc kính lúp khắp cành lá để tìm bạn Tắc Kè!
                </Text>
              </View>
            )}

            {/* Hộp chúc mừng khi phát hiện */}
            {isFound && (
              <Animated.View
                style={[
                  styles.successCard,
                  {
                    transform: [{ scale: successScale }],
                  },
                ]}
              >
                <Text style={styles.successTitle}>🎉 XUẤT SẮC QUÁ BÉ ƠI!</Text>
                <Text style={styles.successDesc}>
                  Bạn Tắc Kè Hoa đã đổi màu da để ngụy trang hòa vào cành cây tránh kẻ thù. Bé đã soi thấy bạn ấy rồi!
                </Text>
                <TouchableOpacity style={styles.claimButton} onPress={handleComplete}>
                  <Text style={styles.claimButtonText}>⭐ Nhận 10 Sao & Huy Hiệu</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          {/* Dải đối thoại Tom & MiMi bên dưới */}
          <View style={styles.duoFooter}>
            <Image source={TOM_IMG} style={styles.dialogueAvatar} />
            <View style={styles.dialogueBubble}>
              <Text style={styles.dialogueName}>👦 Bé Tom hướng dẫn:</Text>
              <Text style={styles.dialogueText}>
                {isFound
                  ? 'Bé thấy bạn ấy đổi màu áo kỳ diệu chưa? Giỏi quá!'
                  : 'Kính lúp của anh Tom giúp soi rõ từng kẽ lá, bé rê qua cành cây bên phải xem nào!'}
              </Text>
            </View>
            <Image source={MIMI_IMG} style={styles.dialogueAvatar} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#1E4620',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#4CAF50',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#143818',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBadge: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerBadgeText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forestArea: {
    height: 340,
    backgroundColor: '#0E2E14',
    position: 'relative',
    overflow: 'hidden',
  },
  decorLeaf: {
    position: 'absolute',
    fontSize: 36,
    opacity: 0.8,
  },
  decorBranch: {
    position: 'absolute',
    color: '#8D6E63',
    fontSize: 22,
    fontWeight: 'bold',
    opacity: 0.9,
  },
  targetChameleonBox: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  targetChameleonImg: {
    width: 75,
    height: 75,
  },
  chameleonGlowRing: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  sparkleIcon: {
    fontSize: 20,
  },
  magnifierWrapper: {
    position: 'absolute',
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  magnifierGlass: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 5,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  lensReflection: {
    position: 'absolute',
    top: 8,
    left: 10,
    fontSize: 16,
    opacity: 0.7,
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.8)',
  },
  magnifierHandle: {
    width: 14,
    height: 38,
    backgroundColor: '#8D6E63',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D7CCC8',
    transform: [{ rotate: '-45deg' }],
    marginTop: -8,
    marginLeft: 60,
  },
  guideHintBox: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  guideHintText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  successCard: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(20, 56, 24, 0.95)',
    padding: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
  },
  successTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  successDesc: {
    color: '#E8F5E9',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  claimButton: {
    backgroundColor: '#FFB300',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  claimButtonText: {
    color: '#1B5E20',
    fontSize: 14,
    fontWeight: 'bold',
  },
  duoFooter: {
    backgroundColor: '#163E1B',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogueAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  dialogueBubble: {
    flex: 1,
    backgroundColor: '#275B2D',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 8,
  },
  dialogueName: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
  },
  dialogueText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
  },
});
