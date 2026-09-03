import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';

interface TargetItem {
  id: string;
  nameVi: string;
  emoji: string;
  weight: number;
}

interface WeightItem {
  id: string;
  nameVi: string;
  emoji: string;
  weight: number;
}

const TARGETS: TargetItem[] = [
  { id: 'watermelon', nameVi: 'Quả Dưa Hấu', emoji: '🍉', weight: 3 },
  { id: 'bear', nameVi: 'Gấu Bông', emoji: '🧸', weight: 2 },
  { id: 'cake', nameVi: 'Bánh Sinh Nhật', emoji: '🎂', weight: 4 },
  { id: 'treasure', nameVi: 'Rương Kho Báu', emoji: '📦', weight: 5 },
];

const WEIGHT_OPTIONS: WeightItem[] = [
  { id: 'apple', nameVi: 'Quả Táo (1kg)', emoji: '🍎', weight: 1 },
  { id: 'banana', nameVi: 'Nải Chuối (1kg)', emoji: '🍌', weight: 1 },
  { id: 'orange', nameVi: 'Quả Cam (0.5kg)', emoji: '🍊', weight: 0.5 },
  { id: 'cheese', nameVi: 'Miếng Phô Mai (0.5kg)', emoji: '🧀', weight: 0.5 },
  { id: 'kettlebell', nameVi: 'Quả Tạ (2kg)', emoji: '🏋️', weight: 2 },
];

export const BalanceScaleGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [targetIdx, setTargetIdx] = useState(0);
  const [rightItems, setRightItems] = useState<WeightItem[]>([]);
  const [isBalanced, setIsBalanced] = useState(false);

  const currentTarget = TARGETS[targetIdx];
  const rightTotal = rightItems.reduce((sum, item) => sum + item.weight, 0);

  // Scale tilt animation
  const tiltAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    soundManager.speak('Chào bé! Hãy đặt các vật nặng lên đĩa bên phải để cân thăng bằng nhé!', 'vi');
    readTask();
  }, [targetIdx]);

  const readTask = () => {
    soundManager.speak(`Bên trái có ${currentTarget.nameVi} nặng ${currentTarget.weight} ký. Bé hãy đặt thêm đồ vào đĩa phải nhé!`, 'vi');
  };

  useEffect(() => {
    // Calculate tilt angle: -15deg (left heavier) to +15deg (right heavier)
    const diff = rightTotal - currentTarget.weight;
    let targetAngle = 0;
    if (diff < 0) targetAngle = -12; // left down
    else if (diff > 0) targetAngle = 12; // right down
    else targetAngle = 0; // balanced!

    Animated.spring(tiltAnim, {
      toValue: targetAngle,
      friction: 4,
      useNativeDriver: true,
    }).start();

    if (diff === 0 && rightItems.length > 0) {
      setIsBalanced(true);
      soundManager.speak('Tuyệt vời! Cán cân đã thăng bằng hoàn hảo!', 'vi');
    } else {
      setIsBalanced(false);
    }
  }, [rightTotal, currentTarget.weight]);

  const addItemToRight = (item: WeightItem) => {
    if (isBalanced) return;
    setRightItems((prev) => [...prev, item]);
    soundManager.speak(`Thêm ${item.nameVi}`, 'vi');
  };

  const clearRightItems = () => {
    setRightItems([]);
    setIsBalanced(false);
    soundManager.speak('Đã dọn sạch đĩa cân bên phải', 'vi');
  };

  const nextTarget = () => {
    setRightItems([]);
    setIsBalanced(false);
    if (targetIdx + 1 < TARGETS.length) {
      setTargetIdx((prev) => prev + 1);
    } else {
      setTargetIdx(0);
      soundManager.speak('Hoan hô bé! Bé đã hoàn thành tất cả các bài tập cân thăng bằng!', 'vi');
    }
  };

  const tiltInterpolate = tiltAnim.interpolate({
    inputRange: [-15, 0, 15],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>⚖️ Chiếc Cân Thăng Bằng</Text>
          <Text style={styles.subtitleText}>Mục tiêu: {currentTarget.weight}kg • Hiện tại: {rightTotal}kg</Text>
        </View>
        <TouchableOpacity style={styles.soundBtn} onPress={readTask} activeOpacity={0.7}>
          <Text style={styles.soundBtnText}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* BALANCE SCALE DISPLAY */}
      <View style={styles.scaleArea}>
        {/* CENTER PILLAR */}
        <View style={styles.fulcrum}>
          <View style={styles.pillarPost} />
          <View style={styles.pillarBase} />
        </View>

        {/* TILTING BEAM */}
        <Animated.View style={[styles.beam, { transform: [{ rotate: tiltInterpolate }] }]}>
          {/* LEFT PAN */}
          <View style={styles.panLeft}>
            <View style={styles.panRope} />
            <View style={styles.panPlate}>
              <Text style={styles.panEmoji}>{currentTarget.emoji}</Text>
              <Text style={styles.panWeightBadge}>{currentTarget.weight} kg</Text>
            </View>
          </View>

          {/* BALANCE NEEDLE */}
          <View style={styles.centerNeedle}>
            <Text style={styles.needlePointer}>{isBalanced ? '🟢' : '🔴'}</Text>
          </View>

          {/* RIGHT PAN */}
          <View style={styles.panRight}>
            <View style={styles.panRope} />
            <View style={[styles.panPlate, isBalanced && styles.panPlateBalanced]}>
              <View style={styles.rightItemsGrid}>
                {rightItems.map((itm, i) => (
                  <Text key={i} style={styles.smallRightEmoji}>{itm.emoji}</Text>
                ))}
              </View>
              <Text style={styles.panWeightBadge}>{rightTotal} kg</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* TRAY OF WEIGHTS */}
      <View style={styles.trayContainer}>
        <View style={styles.trayHeader}>
          <Text style={styles.trayTitle}>📦 Chạm để đặt đồ lên đĩa phải:</Text>
          <TouchableOpacity onPress={clearRightItems}>
            <Text style={styles.clearBtnText}>🧹 Dọn Đĩa</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weightsRow}>
          {WEIGHT_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.weightCard}
              activeOpacity={0.8}
              onPress={() => addItemToRight(item)}
            >
              <Text style={styles.weightEmoji}>{item.emoji}</Text>
              <Text style={styles.weightName}>{item.nameVi}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* BALANCED CELEBRATION */}
      {isBalanced && (
        <View style={styles.balancedPopup}>
          <Text style={styles.balancedEmoji}>⚖️ 🌟 🏆</Text>
          <Text style={styles.balancedTitle}>CÂN ĐÃ THĂNG BẰNG!</Text>
          <Text style={styles.balancedSub}>{currentTarget.weight}kg = {rightTotal}kg</Text>
          <TouchableOpacity style={styles.nextTargetBtn} onPress={nextTarget} activeOpacity={0.8}>
            <Text style={styles.nextTargetText}>Bài Toán Tiếp Theo ➡️</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitleText: {
    fontSize: 12,
    color: '#FDE047',
    marginTop: 2,
  },
  soundBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundBtnText: {
    fontSize: 18,
  },
  scaleArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fulcrum: {
    position: 'absolute',
    bottom: '25%',
    alignItems: 'center',
  },
  pillarPost: {
    width: 14,
    height: 100,
    backgroundColor: '#64748B',
    borderRadius: 7,
  },
  pillarBase: {
    width: 90,
    height: 18,
    backgroundColor: '#475569',
    borderRadius: 9,
  },
  beam: {
    width: '85%',
    height: 12,
    backgroundColor: '#F59E0B',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  centerNeedle: {
    position: 'absolute',
    top: -24,
    left: '46%',
  },
  needlePointer: {
    fontSize: 18,
  },
  panLeft: {
    position: 'absolute',
    left: -10,
    top: 6,
    alignItems: 'center',
  },
  panRight: {
    position: 'absolute',
    right: -10,
    top: 6,
    alignItems: 'center',
  },
  panRope: {
    width: 3,
    height: 40,
    backgroundColor: '#CBD5E1',
  },
  panPlate: {
    width: 90,
    minHeight: 70,
    backgroundColor: '#334155',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  panPlateBalanced: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
  panEmoji: {
    fontSize: 34,
  },
  panWeightBadge: {
    backgroundColor: '#1E293B',
    color: '#FDE047',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  rightItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    minHeight: 30,
  },
  smallRightEmoji: {
    fontSize: 20,
  },
  trayContainer: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  trayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trayTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },
  clearBtnText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '800',
  },
  weightsRow: {
    gap: 10,
    paddingVertical: 4,
  },
  weightCard: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    width: 80,
    borderWidth: 1.5,
    borderColor: '#475569',
  },
  weightEmoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  weightName: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  balancedPopup: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    padding: 20,
  },
  balancedEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  balancedTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FDE047',
  },
  balancedSub: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  nextTargetBtn: {
    marginTop: 20,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  nextTargetText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default BalanceScaleGameScreen;
