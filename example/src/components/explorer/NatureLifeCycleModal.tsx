import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { soundManager } from '../SoundPlayer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TOM_IMG = require('../../assets/images/tom_3d.jpg');
const MIMI_IMG = require('../../assets/images/mimi_3d.jpg');
const BUTTERFLY_EGG_3D_IMG = require('../../assets/images/butterfly_egg_3d.jpg');
const CATERPILLAR_3D_IMG = require('../../assets/images/caterpillar_3d.jpg');
const CHRYSALIS_3D_IMG = require('../../assets/images/chrysalis_3d.jpg');
const BUTTERFLY_3D_IMG = require('../../assets/images/butterfly_3d.jpg');

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface StageData {
  step: number;
  title: string;
  emoji: string;
  badge: string;
  desc: string;
  voiceText: string;
  imageSource?: any;
}

const STAGES: StageData[] = [
  {
    step: 1,
    title: 'Giai Đoạn 1: Hạt Trứng Nhỏ',
    emoji: '🥚',
    imageSource: BUTTERFLY_EGG_3D_IMG,
    badge: 'Đẻ Trứng',
    desc: 'Bướm mẹ đẻ những hạt trứng nhỏ li ti bên dưới mặt lá non để che chở khỏi nắng mưa.',
    voiceText: 'Bướm mẹ đẻ những hạt trứng nhỏ xíu trên lá cây rừng ẩm ướt.',
  },
  {
    step: 2,
    title: 'Giai Đoạn 2: Chú Sâu Háu Ăn',
    emoji: '🐛',
    imageSource: CATERPILLAR_3D_IMG,
    badge: 'Nở Thành Sâu',
    desc: 'Trứng nở ra chú sâu bướm háu ăn, suốt ngày gặm những chiếc lá xanh tươi để lớn thật nhanh!',
    voiceText: 'Oa! Chú sâu róm háu ăn gặm lá non rào rạo để lớn nhanh như thổi nè!',
  },
  {
    step: 3,
    title: 'Giai Đoạn 3: Kén Tằm Ngủ Say',
    emoji: '🥥',
    imageSource: CHRYSALIS_3D_IMG,
    badge: 'Hóa Kén',
    desc: 'Sâu bướm nhả tơ quấn quanh mình thành một chiếc kén vàng óng và ngủ say một giấc dài biến hình.',
    voiceText: 'Bạn sâu quấn kén ngủ say để chuẩn bị mọc đôi cánh thần kỳ đấy bé!',
  },
  {
    step: 4,
    title: 'Giai Đoạn 4: Bướm Xòe Cánh Bay',
    emoji: '🦋',
    imageSource: BUTTERFLY_3D_IMG,
    badge: 'Bướm Rực Rỡ',
    desc: 'Chiếc kén tách ra! Chú bướm nhiệt đới ngũ sắc dang rộng đôi cánh rực rỡ bay lượn hút mật hoa.',
    voiceText: 'Hoan hô! Chiếc kén mở ra, bạn bướm xinh đẹp dang đôi cánh ngũ sắc bay lượn đón ánh mặt trời!',
  },
];

export const NatureLifeCycleModal: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [hasCompletedAll, setHasCompletedAll] = useState<boolean>(false);

  const stageScaleAnim = useRef(new Animated.Value(1)).current;
  const butterflyFloatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      setHasCompletedAll(false);
      soundManager.speak(
        'Bé ơi! Cùng anh Tom và em Mi Mi kéo thanh trượt để khám phá vòng đời biến hình kỳ diệu của bạn Bướm Rừng nhé!',
        'vi'
      );
    }
  }, [visible]);

  // Hiệu ứng bướm bay dập dờn
  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(butterflyFloatAnim, {
          toValue: -12,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(butterflyFloatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();
    return () => floatLoop.stop();
  }, [butterflyFloatAnim]);

  const selectStep = (step: number) => {
    setCurrentStep(step);
    if (step === 4) {
      setHasCompletedAll(true);
    }

    // Nhún nảy hoạt ảnh đổi giai đoạn
    Animated.sequence([
      Animated.timing(stageScaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.spring(stageScaleAnim, { toValue: 1.15, friction: 3, tension: 40, useNativeDriver: true }),
      Animated.spring(stageScaleAnim, { toValue: 1.0, friction: 4, useNativeDriver: true }),
    ]).start();

    soundManager.speak(STAGES[step - 1].voiceText, 'vi');
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
  };

  const activeStage = STAGES[currentStep - 1];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>⏳ VÒNG ĐỜI SINH TRƯỞNG</Text>
            </View>
            <Text style={styles.headerTitle}>Phép Màu Của Bướm Rừng</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Khung trưng bày giai đoạn trung tâm */}
          <View style={styles.stageDisplay}>
            <Animated.View
              style={[
                styles.emojiContainer,
                {
                  transform: [
                    { scale: stageScaleAnim },
                    { translateY: currentStep === 4 ? butterflyFloatAnim : 0 },
                  ],
                },
              ]}
            >
              {activeStage.imageSource ? (
                <Image
                  source={activeStage.imageSource}
                  style={styles.stage3dImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.largeStageEmoji}>{activeStage.emoji}</Text>
              )}
            </Animated.View>

            <View style={styles.stageInfoBox}>
              <Text style={styles.stageTitleText}>{activeStage.title}</Text>
              <Text style={styles.stageDescText}>{activeStage.desc}</Text>
            </View>

            {/* Thanh tiến trình 4 giai đoạn */}
            <View style={styles.progressTracker}>
              {STAGES.map((s) => {
                const isActive = s.step === currentStep;
                const isPassed = s.step <= currentStep;
                return (
                  <TouchableOpacity
                    key={s.step}
                    style={[
                      styles.stepButton,
                      isActive && styles.stepButtonActive,
                      isPassed && styles.stepButtonPassed,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => selectStep(s.step)}
                  >
                    {s.imageSource ? (
                      <Image
                        source={s.imageSource}
                        style={[
                          styles.stepThumb3d,
                          isActive && styles.stepThumb3dActive,
                        ]}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.stepBtnEmoji}>{s.emoji}</Text>
                    )}
                    <Text style={[styles.stepBtnText, isActive && styles.stepBtnTextActive]}>
                      Bước {s.step}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Nút hoàn thành khi đã xem đến bước 4 */}
            {hasCompletedAll && (
              <TouchableOpacity style={styles.completeBtn} activeOpacity={0.8} onPress={handleFinish}>
                <Text style={styles.completeBtnText}>⭐ Hoàn Thành & Nhận Huy Hiệu Bướm</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Dải đối thoại Tom & MiMi */}
          <View style={styles.duoFooter}>
            <Image source={TOM_IMG} style={styles.dialogueAvatar} />
            <View style={styles.dialogueBubble}>
              <Text style={styles.dialogueName}>👦 Bé Tom & 👧 Bé MiMi:</Text>
              <Text style={styles.dialogueText}>
                {hasCompletedAll
                  ? 'Bé đã hiểu trọn vẹn 4 giai đoạn lớn lên của chú bướm rồi đấy! Thật tuyệt vời!'
                  : 'Bé chạm vào các bước tiếp theo để xem chú sâu lột xác thành bướm nhé!'}
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
    borderColor: '#CE93D8',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#3E1C4D',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBadge: {
    backgroundColor: '#AB47BC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerBadgeText: {
    color: '#FFF',
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
  stageDisplay: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#172C19',
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#CE93D8',
    marginBottom: 12,
    overflow: 'hidden',
  },
  largeStageEmoji: {
    fontSize: 64,
  },
  stage3dImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  stageInfoBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  stageTitleText: {
    color: '#FFD54F',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stageDescText: {
    color: '#E1BEE7',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  progressTracker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  stepButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stepButtonPassed: {
    borderColor: '#81C784',
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
  },
  stepButtonActive: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  stepThumb3d: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 3,
    backgroundColor: '#0F2F16',
  },
  stepThumb3dActive: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  stepBtnEmoji: {
    fontSize: 22,
  },
  stepBtnText: {
    color: '#CFD8DC',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  stepBtnTextActive: {
    color: '#FFD700',
  },
  completeBtn: {
    backgroundColor: '#AB47BC',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 6,
    borderWidth: 2,
    borderColor: '#E1BEE7',
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  duoFooter: {
    backgroundColor: '#1E1126',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogueAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#CE93D8',
  },
  dialogueBubble: {
    flex: 1,
    backgroundColor: '#3E1C4D',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 8,
  },
  dialogueName: {
    color: '#CE93D8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  dialogueText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
  },
});
