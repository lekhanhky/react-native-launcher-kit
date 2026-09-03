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

interface PlantType {
  id: string;
  nameVi: string;
  seedEmoji: string;
  sproutEmoji: string;
  growingEmoji: string;
  ripeEmoji: string;
  harvestEmoji: string;
}

const PLANTS: PlantType[] = [
  { id: 'tomato', nameVi: 'Cà Chua Đỏ', seedEmoji: '🌰', sproutEmoji: '🌱', growingEmoji: '🌿', ripeEmoji: '🍅', harvestEmoji: '🧺 🍅🍅🍅' },
  { id: 'carrot', nameVi: 'Cà Rốt Cam', seedEmoji: '🌰', sproutEmoji: '🌱', growingEmoji: '🌿', ripeEmoji: '🥕', harvestEmoji: '🧺 🥕🥕🥕' },
  { id: 'sunflower', nameVi: 'Hoa Hướng Dương', seedEmoji: '🌰', sproutEmoji: '🌱', growingEmoji: '🌿', ripeEmoji: '🌻', harvestEmoji: '💐 🌻🌻🌻' },
  { id: 'apple', nameVi: 'Cây Táo Ngọt', seedEmoji: '🌰', sproutEmoji: '🌱', growingEmoji: '🌳', ripeEmoji: '🍎', harvestEmoji: '🧺 🍎🍎🍎' },
];

const STEPS = [
  { id: 0, nameVi: '1. Xới Đất Tơi Xốp', tool: '⛏️', hint: 'Dùng cuốc xới đất cho tơi xốp nào!' },
  { id: 1, nameVi: '2. Gieo Hạt Mầm', tool: '🌰', hint: 'Thả hạt giống vào luống đất màu mỡ!' },
  { id: 2, nameVi: '3. Tưới Nước Mát', tool: '💧', hint: 'Tưới nước vừa đủ để hạt nảy mầm nhé!' },
  { id: 3, nameVi: '4. Sưởi Nắng & Bắt Sâu', tool: '☀️', hint: 'Ánh nắng ấm áp giúp cây lớn nhanh!' },
  { id: 4, nameVi: '5. Thu Hoạch Trái Ngọt', tool: '🧺', hint: 'Cây đã ra trái chín, mau hái thôi!' },
];

export const LittleGardenerGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedPlant, setSelectedPlant] = useState(PLANTS[0]);
  const [currentStep, setCurrentStep] = useState(0); // 0 to 5 (5 = harvested)
  const [harvestScore, setHarvestScore] = useState(0);

  // Growth animation
  const plantScale = useRef(new Animated.Value(1)).current;
  const plantShake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    soundManager.speak('Chào bé! Chúng mình cùng làm vườn trồng cây nhé!', 'vi');
    readCurrentStep(0);
  }, []);

  const readCurrentStep = (stepIdx: number) => {
    if (stepIdx < STEPS.length) {
      soundManager.speak(STEPS[stepIdx].hint, 'vi');
    }
  };

  const executeTool = (toolStepId: number) => {
    if (toolStepId !== currentStep) {
      soundManager.speak('Chưa đúng bước rồi! Bé hãy xem hướng dẫn ở trên nhé', 'vi');
      Animated.sequence([
        Animated.timing(plantShake, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(plantShake, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(plantShake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    Animated.sequence([
      Animated.timing(plantScale, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.spring(plantScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    if (nextStep === 1) {
      soundManager.speak('Đất đã tơi xốp! Giờ hãy gieo hạt nào', 'vi');
    } else if (nextStep === 2) {
      soundManager.speak('Hạt đã nằm ngoan dưới đất! Mau tưới nước cho hạt nảy mầm', 'vi');
    } else if (nextStep === 3) {
      soundManager.speak('Cây đã nhú mầm xanh tốt! Hãy sưởi nắng ấm áp', 'vi');
    } else if (nextStep === 4) {
      soundManager.speak('Tuyệt vời! Cây đã nở hoa kết trái xum xuê! Mau thu hoạch nào', 'vi');
    } else if (nextStep === 5) {
      setHarvestScore((prev) => prev + 25);
      soundManager.speak('Hoan hô bé! Bé đã thu hoạch một giỏ quả tươi ngon trĩu cành!', 'vi');
    }
  };

  const plantAnother = () => {
    setCurrentStep(0);
    readCurrentStep(0);
  };

  const getPlantVisual = () => {
    if (currentStep === 0) return '🕳️'; // DIRT PLOT
    if (currentStep === 1) return selectedPlant.seedEmoji;
    if (currentStep === 2) return selectedPlant.sproutEmoji;
    if (currentStep === 3) return selectedPlant.growingEmoji;
    if (currentStep === 4) return selectedPlant.ripeEmoji;
    return selectedPlant.harvestEmoji;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#15803D" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>🌱 Bé Làm Vườn Vui Vẻ</Text>
          <Text style={styles.subtitleText}>Giỏ thu hoạch: ⭐ {harvestScore} điểm</Text>
        </View>
        <TouchableOpacity
          style={styles.soundBtn}
          onPress={() => readCurrentStep(currentStep)}
          activeOpacity={0.7}
        >
          <Text style={styles.soundBtnText}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* PLANT SELECTOR */}
      <View style={styles.plantSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.plantList}>
          {PLANTS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.plantCard, selectedPlant.id === p.id && styles.plantCardActive]}
              onPress={() => {
                setSelectedPlant(p);
                setCurrentStep(0);
                soundManager.speak(`Bắt đầu trồng cây ${p.nameVi}`, 'vi');
              }}
            >
              <Text style={styles.plantCardEmoji}>{p.ripeEmoji}</Text>
              <Text style={[styles.plantCardName, selectedPlant.id === p.id && styles.plantCardNameActive]}>
                {p.nameVi}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* GARDEN BED AREA */}
      <View style={styles.gardenBedContainer}>
        {/* STEP BANNER */}
        <View style={styles.stepBanner}>
          <Text style={styles.stepTitle}>
            {currentStep < STEPS.length ? STEPS[currentStep].nameVi : '🎉 Thu hoạch hoàn tất!'}
          </Text>
          <Text style={styles.stepHint}>
            {currentStep < STEPS.length ? STEPS[currentStep].hint : 'Bé đã chăm sóc cây rất chu đáo!'}
          </Text>
        </View>

        {/* SOIL PLOT & GROWING PLANT */}
        <View style={styles.dirtBed}>
          <Animated.View
            style={[
              styles.plantAvatarContainer,
              { transform: [{ scale: plantScale }, { translateX: plantShake }] },
            ]}
          >
            <Text style={styles.bigPlantEmoji}>{getPlantVisual()}</Text>
          </Animated.View>
          <View style={styles.soilLayer}>
            <Text style={styles.soilTexture}>🟫 🟫 🟫 🟫 🟫</Text>
          </View>
        </View>
      </View>

      {/* TOOLBAR */}
      <View style={styles.toolbarContainer}>
        <Text style={styles.toolbarTitle}>🛠️ Chọn dụng cụ theo từng bước:</Text>
        <View style={styles.toolsRow}>
          {STEPS.map((step) => {
            const isCurrent = currentStep === step.id;
            const isDone = currentStep > step.id;
            return (
              <TouchableOpacity
                key={step.id}
                style={[
                  styles.toolButton,
                  isCurrent && styles.toolButtonCurrent,
                  isDone && styles.toolButtonDone,
                ]}
                activeOpacity={0.8}
                onPress={() => executeTool(step.id)}
              >
                <Text style={styles.toolIcon}>{step.tool}</Text>
                <Text style={[styles.toolLabel, isCurrent && styles.toolLabelCurrent]}>
                  {step.tool === '⛏️'
                    ? 'Cuốc'
                    : step.tool === '🌰'
                    ? 'Hạt'
                    : step.tool === '💧'
                    ? 'Tưới'
                    : step.tool === '☀️'
                    ? 'Nắng'
                    : 'Hái'}
                </Text>
                {isDone && <Text style={styles.doneTick}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* HARVEST COMPLETE POPUP */}
      {currentStep >= 5 && (
        <View style={styles.harvestPopup}>
          <Text style={styles.harvestBigIcon}>🧺 🍎 🍅 🌻</Text>
          <Text style={styles.harvestTitle}>THU HOẠCH THÀNH CÔNG!</Text>
          <Text style={styles.harvestSub}>Bé nhận được {selectedPlant.nameVi} tươi ngon!</Text>
          <TouchableOpacity style={styles.plantAgainBtn} onPress={plantAnother} activeOpacity={0.8}>
            <Text style={styles.plantAgainText}>🌱 Trồng Cây Tiếp Theo</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#166534',
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
    color: '#BBF7D0',
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
  plantSelector: {
    marginVertical: 6,
  },
  plantList: {
    gap: 8,
    paddingHorizontal: 14,
  },
  plantCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  plantCardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FDE047',
  },
  plantCardEmoji: {
    fontSize: 18,
  },
  plantCardName: {
    color: '#DCFCE7',
    fontSize: 12,
    fontWeight: '700',
  },
  plantCardNameActive: {
    color: '#166534',
    fontWeight: '900',
  },
  gardenBedContainer: {
    flex: 1,
    marginHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 24,
    padding: 14,
    justifyContent: 'space-between',
  },
  stepBanner: {
    backgroundColor: '#FEF08A',
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  stepTitle: {
    color: '#854D0E',
    fontSize: 14,
    fontWeight: '900',
  },
  stepHint: {
    color: '#A16207',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  dirtBed: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  plantAvatarContainer: {
    alignItems: 'center',
    marginBottom: -10,
    zIndex: 10,
  },
  bigPlantEmoji: {
    fontSize: 80,
  },
  soilLayer: {
    width: '90%',
    height: 40,
    backgroundColor: '#78350F',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#92400E',
  },
  soilTexture: {
    fontSize: 16,
  },
  toolbarContainer: {
    backgroundColor: '#14532D',
    padding: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  toolbarTitle: {
    color: '#DCFCE7',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  toolsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toolButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
    width: 60,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toolButtonCurrent: {
    borderColor: '#FDE047',
    backgroundColor: 'rgba(253, 224, 71, 0.3)',
    transform: [{ scale: 1.08 }],
  },
  toolButtonDone: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    opacity: 0.5,
  },
  toolIcon: {
    fontSize: 26,
  },
  toolLabel: {
    color: '#F0FDF4',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  toolLabelCurrent: {
    color: '#FEF08A',
    fontWeight: '900',
  },
  doneTick: {
    position: 'absolute',
    top: 2,
    right: 4,
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '900',
  },
  harvestPopup: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 83, 45, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    padding: 20,
  },
  harvestBigIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  harvestTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FDE047',
  },
  harvestSub: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  plantAgainBtn: {
    marginTop: 20,
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  plantAgainText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default LittleGardenerGameScreen;
