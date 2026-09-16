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

const PITCHER_IMG = require('../../assets/images/pitcher_plant_3d.jpg');
const TOM_IMG = require('../../assets/images/tom_3d.jpg');
const MIMI_IMG = require('../../assets/images/mimi_3d.jpg');

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DraggableItem {
  id: string;
  name: string;
  emoji: string;
  isCorrect: boolean;
}

const ITEMS: DraggableItem[] = [
  { id: 'fly', name: 'Chú Ruồi Mắt To', emoji: '🪰', isCorrect: true },
  { id: 'stone', name: 'Viên Sỏi Tròn', emoji: '🪨', isCorrect: false },
  { id: 'leaf', name: 'Chiếc Lá Khô', emoji: '🍂', isCorrect: false },
];

export const NatureFeedingModal: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [isFed, setIsFed] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Animation nhịp thở & nắp ấm
  const lidAnim = useRef(new Animated.Value(1)).current;
  const plantShakeAnim = useRef(new Animated.Value(0)).current;
  const successCardAnim = useRef(new Animated.Value(0)).current;

  // Tọa độ kéo thả cho 3 vật phẩm
  const panFly = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panStone = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panLeaf = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Vùng miệng cây nắp ấm (Target Drop-Zone)
  const PITCHER_TARGET_Y = -120; // Khoảng cách kéo lên phía trên miệng ấm

  useEffect(() => {
    if (visible) {
      setIsFed(false);
      setSelectedItemId(null);
      panFly.setValue({ x: 0, y: 0 });
      panStone.setValue({ x: 0, y: 0 });
      panLeaf.setValue({ x: 0, y: 0 });
      successCardAnim.setValue(0);

      soundManager.speak(
        'Bé Mi Mi chào bé! Cây Nắp Ấm đang mở nắp bình tỏa hương mật ngọt chờ mồi. Bé hãy kéo chú ruồi thả vào bình cho cây nhé!',
        'vi'
      );
    }
  }, [visible]);

  // Hiệu ứng nắp ấm mở nhấp nháy gọi mồi
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(lidAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(lidAnim, {
          toValue: 0.95,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [lidAnim]);

  // Tạo pan responder cho từng item
  const createPanResponder = (item: DraggableItem, panVal: Animated.ValueXY) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !isFed,
      onMoveShouldSetPanResponder: () => !isFed,
      onPanResponderMove: (e, gestureState) => {
        panVal.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (e, gestureState) => {
        // Kiểm tra nếu kéo lên vùng miệng nắp ấm (dy < -80)
        if (gestureState.dy < PITCHER_TARGET_Y + 40 && Math.abs(gestureState.dx) < 90) {
          if (item.isCorrect) {
            triggerSuccessFeeding();
          } else {
            triggerWrongItem(panVal, item.name);
          }
        } else {
          // Bật ngược về vị trí cũ
          Animated.spring(panVal, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    });
  };

  const panResponderFly = useRef(createPanResponder(ITEMS[0], panFly)).current;
  const panResponderStone = useRef(createPanResponder(ITEMS[1], panStone)).current;
  const panResponderLeaf = useRef(createPanResponder(ITEMS[2], panLeaf)).current;

  const triggerWrongItem = (panVal: Animated.ValueXY, itemName: string) => {
    soundManager.speak(
      `Ôi! Cây nắp ấm không ăn ${itemName} đâu bé ơi, cây chỉ bắt sâu bọ thôi!`,
      'vi'
    );
    Animated.spring(panVal, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };

  const triggerSuccessFeeding = () => {
    setIsFed(true);

    // Hoạt ảnh nắp ấm khép sập lại & cây nhai rung rinh
    Animated.sequence([
      Animated.timing(lidAnim, {
        toValue: 0.2,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(plantShakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
        Animated.timing(plantShakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
        Animated.timing(plantShakeAnim, { toValue: -6, duration: 80, useNativeDriver: true }),
        Animated.timing(plantShakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]),
      Animated.spring(successCardAnim, {
        toValue: 1,
        friction: 4,
        tension: 30,
        useNativeDriver: true,
      }),
    ]).start();

    soundManager.speak(
      'Tách! Nắp bình đã khép lại rồi! Bạn Cây Nắp Ấm đang tiêu hóa chú ruồi để lấy chất đạm. Bé thật khéo tay!',
      'vi'
    );
  };

  const handleFinish = () => {
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
              <Text style={styles.headerBadgeText}>🪴 BỮA ĂN SINH THÁI</Text>
            </View>
            <Text style={styles.headerTitle}>Cho Cây Nắp Ấm Bắt Mồi</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Sân khấu Cây Nắp Ấm */}
          <View style={styles.stageArea}>
            {/* Vùng miệng nắp ấm nhận mồi */}
            <View style={styles.targetMouthArea}>
              <Text style={styles.targetMouthHint}>
                {isFed ? '😋 Đang tiêu hóa thơm ngon!' : '🎯 Kéo thả món ăn vào đây!'}
              </Text>
            </View>

            {/* Mô hình Cây nắp ấm 3D */}
            <Animated.View
              style={[
                styles.pitcherPlantWrapper,
                {
                  transform: [
                    { translateX: plantShakeAnim },
                    { scale: isFed ? 1.05 : 1.0 },
                  ],
                },
              ]}
            >
              <Image source={PITCHER_IMG} style={styles.pitcherImg} resizeMode="contain" />
              {/* Nắp ấm đóng mở */}
              <Animated.View
                style={[
                  styles.pitcherLidBadge,
                  {
                    transform: [{ scaleY: isFed ? 0.3 : lidAnim }],
                  },
                ]}
              >
                <Text style={styles.lidText}>{isFed ? '🟢 ĐÃ KHÉP NẮP' : '🍯 NẮP MỞ CHỜ MỒI'}</Text>
              </Animated.View>
            </Animated.View>

            {/* 3 Món đồ kéo thả bên dưới */}
            {!isFed ? (
              <View style={styles.traySection}>
                <Text style={styles.trayTitle}>👇 Bé chọn món ăn cho cây nắp ấm:</Text>
                <View style={styles.itemsRow}>
                  {/* 1. Con ruồi */}
                  <Animated.View
                    {...panResponderFly.panHandlers}
                    style={[
                      styles.draggableBox,
                      {
                        transform: [{ translateX: panFly.x }, { translateY: panFly.y }],
                        borderColor: '#4CAF50',
                      },
                    ]}
                  >
                    <Text style={styles.itemEmoji}>🪰</Text>
                    <Text style={styles.itemLabel}>Ruồi Mắt To</Text>
                  </Animated.View>

                  {/* 2. Hòn sỏi */}
                  <Animated.View
                    {...panResponderStone.panHandlers}
                    style={[
                      styles.draggableBox,
                      {
                        transform: [{ translateX: panStone.x }, { translateY: panStone.y }],
                        borderColor: '#B0BEC5',
                      },
                    ]}
                  >
                    <Text style={styles.itemEmoji}>🪨</Text>
                    <Text style={styles.itemLabel}>Hòn Sỏi</Text>
                  </Animated.View>

                  {/* 3. Chiếc lá */}
                  <Animated.View
                    {...panResponderLeaf.panHandlers}
                    style={[
                      styles.draggableBox,
                      {
                        transform: [{ translateX: panLeaf.x }, { translateY: panLeaf.y }],
                        borderColor: '#D7CCC8',
                      },
                    ]}
                  >
                    <Text style={styles.itemEmoji}>🍂</Text>
                    <Text style={styles.itemLabel}>Cành Khô</Text>
                  </Animated.View>
                </View>
              </View>
            ) : (
              /* Thẻ chúc mừng khi cho ăn thành công */
              <Animated.View
                style={[
                  styles.successCard,
                  {
                    transform: [{ scale: successCardAnim }],
                  },
                ]}
              >
                <Text style={styles.successTitle}>🎉 CÂY NẮP ẤM ĐÃ NO BỤNG!</Text>
                <Text style={styles.successDesc}>
                  Vì đất rừng nghèo dinh dưỡng, cây nắp ấm phải bẫy côn trùng để bổ sung chất đạm lớn lên tươi tốt đấy bé!
                </Text>
                <TouchableOpacity style={styles.claimButton} onPress={handleFinish}>
                  <Text style={styles.claimButtonText}>⭐ Nhận 10 Sao Thưởng</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>

          {/* Dải đối thoại Tom & MiMi */}
          <View style={styles.duoFooter}>
            <Image source={MIMI_IMG} style={styles.dialogueAvatar} />
            <View style={styles.dialogueBubble}>
              <Text style={styles.dialogueName}>👧 Bé MiMi khen bé:</Text>
              <Text style={styles.dialogueText}>
                {isFed
                  ? 'Oa, nắp bình khép cái Tách thật là kỳ diệu anh Tom ơi!'
                  : 'Bé kéo chú ruồi bay vào miệng bình để cây nắp ấm bắt nhé!'}
              </Text>
            </View>
            <Image source={TOM_IMG} style={styles.dialogueAvatar} />
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
    borderColor: '#81C784',
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
    backgroundColor: '#388E3C',
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
  stageArea: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#0F2F16',
    minHeight: 340,
    justifyContent: 'space-between',
  },
  targetMouthArea: {
    backgroundColor: 'rgba(255, 235, 59, 0.15)',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FFD700',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  targetMouthHint: {
    color: '#FFEB3B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pitcherPlantWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  pitcherImg: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  pitcherLidBadge: {
    position: 'absolute',
    top: -6,
    backgroundColor: '#FFB300',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  lidText: {
    color: '#1B5E20',
    fontSize: 10,
    fontWeight: 'bold',
  },
  traySection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  trayTitle: {
    color: '#E8F5E9',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  draggableBox: {
    width: 80,
    height: 80,
    backgroundColor: '#1E4620',
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  itemEmoji: {
    fontSize: 32,
  },
  itemLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  successCard: {
    width: '100%',
    backgroundColor: 'rgba(27, 94, 32, 0.95)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
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
