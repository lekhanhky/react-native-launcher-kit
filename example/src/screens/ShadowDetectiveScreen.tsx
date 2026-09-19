import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  PanResponder,
} from 'react-native';
import {
  DetectiveWorldId,
  ShadowCaseItem,
  ShadowSuspectOption,
  DETECTIVE_WORLDS,
  getShadowCasesByWorld,
  createSyntheticDetectiveCard,
} from '../data/shadowDetectiveData';
import {
  shadowDetectiveService,
  DetectiveProgress,
} from '../services/shadowDetectiveService';
import { riddleSoundService } from '../services/riddleSoundService';
import { VocabCard3DStage } from '../components/VocabCard3DStage';
import { SoundPlayer } from '../components/SoundPlayer';

const { width, height } = Dimensions.get('window');

interface ShadowDetectiveScreenProps {
  onClose: () => void;
}

export const ShadowDetectiveScreen: React.FC<ShadowDetectiveScreenProps> = ({ onClose }) => {
  const [progress, setProgress] = useState<DetectiveProgress>(() =>
    shadowDetectiveService.getProgress()
  );
  const [currentWorldId, setCurrentWorldId] = useState<DetectiveWorldId>(
    progress.lastPlayedWorldId || 'forest'
  );
  const [caseIndexInWorld, setCaseIndexInWorld] = useState<number>(1);

  // Trạng thái vụ án hiện tại
  const [isRoomLit, setIsRoomLit] = useState<boolean>(false);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [wrongSuspectIds, setWrongSuspectIds] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [mascotMessage, setMascotMessage] = useState<string>(
    'Bé hãy soi đèn pin và nghe kỹ manh mối để tìm ra ai đang trốn nhé!'
  );

  // Modals
  const [showCasebookModal, setShowCasebookModal] = useState<boolean>(false);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  // Tọa độ của Đèn Pin Ma Thuật (Spotlight)
  const spotlightPos = useRef(new Animated.ValueXY({ x: width / 2 - 60, y: 110 })).current;
  const [isFlashlightHeld, setIsFlashlightHeld] = useState<boolean>(false);

  // Hiệu ứng ánh sáng phòng bừng sáng
  const roomBrightnessAnim = useRef(new Animated.Value(0)).current;

  // Lấy dữ liệu vụ án hiện tại
  const currentWorld = DETECTIVE_WORLDS[currentWorldId];
  const worldCases = getShadowCasesByWorld(currentWorldId);
  const currentCase: ShadowCaseItem =
    worldCases.find((c) => c.caseNumber === caseIndexInWorld) || worldCases[0];

  // PanResponder cho chiếc đèn pin có thể rê quanh màn hình
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsFlashlightHeld(true);
        riddleSoundService.playPop();
      },
      onPanResponderMove: (_, gestureState) => {
        const newX = Math.max(10, Math.min(width - 130, gestureState.moveX - 60));
        const newY = Math.max(20, Math.min(220, gestureState.moveY - 140));
        spotlightPos.setValue({ x: newX, y: newY });
      },
      onPanResponderRelease: () => {
        setIsFlashlightHeld(false);
      },
    })
  ).current;

  // Reset trạng thái khi đổi vụ án
  useEffect(() => {
    setIsRoomLit(false);
    setSelectedSuspectId(null);
    setWrongSuspectIds([]);
    setIsAnswerChecked(false);
    roomBrightnessAnim.setValue(0);
    setMascotMessage('Bé hãy soi đèn pin và lắng nghe manh mối nhé!');

    // Tự động đọc câu thơ manh mối khi mở vụ án
    setTimeout(() => {
      riddleSoundService.speakPoem(currentCase.cluePoem);
    }, 600);
  }, [currentCase.id]);

  // Xử lý khi bé chọn một nghi phạm
  const handleSelectSuspect = (suspect: ShadowSuspectOption) => {
    if (isAnswerChecked || isRoomLit) return;

    setSelectedSuspectId(suspect.id);
    setIsAnswerChecked(true);

    if (suspect.isCorrect) {
      // Phá án thành công!
      setIsRoomLit(true);
      riddleSoundService.playPop();

      // Bật sáng bừng căn phòng
      Animated.timing(roomBrightnessAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start();

      // Phát âm thanh chúc mừng & tiếng kêu thật của vật thể
      const syntheticRiddle = {
        id: currentCase.id,
        answer: currentCase.labelVi,
        worldId: 'animals' as any,
        indexInWorld: 1,
        title: currentCase.title,
        poem: currentCase.cluePoem,
        answerClean: currentCase.labelVi,
        scrambleLetters: [],
        image3DWordId: currentCase.targetWordId,
        emoji: currentCase.emoji,
        options3D: [],
        hintPoem: '',
        funFact: currentCase.funFact,
      };
      riddleSoundService.playSuccessReward(syntheticRiddle);

      // Cập nhật tiến độ MMKV
      const { progress: updated } = shadowDetectiveService.markCaseSolved(
        currentCase.id,
        currentWorldId,
        3
      );
      setProgress(updated);
      setMascotMessage(`🎉 CHÍNH XÁC! Đó chính là ${currentCase.labelVi}!`);

      // Mở modal chúc mừng sau 1.2s
      setTimeout(() => {
        setShowVictoryModal(true);
      }, 1400);
    } else {
      // Chọn sai
      riddleSoundService.playWrong();
      setWrongSuspectIds((prev) => [...prev, suspect.id]);
      setMascotMessage('Chưa phải rồi bé ơi! Bé thử soi đèn pin kỹ hơn xem sao nhé! 🔦');
      setTimeout(() => {
        setIsAnswerChecked(false);
        setSelectedSuspectId(null);
      }, 1000);
    }
  };

  // Đọc lại manh mối
  const handleReplayClue = () => {
    riddleSoundService.playPop();
    riddleSoundService.speakPoem(currentCase.cluePoem);
  };

  // Vụ án tiếp theo
  const handleNextCase = () => {
    setShowVictoryModal(false);
    if (caseIndexInWorld < 10) {
      setCaseIndexInWorld((prev) => prev + 1);
    } else {
      // Chuyển sang thế giới tiếp theo
      const worlds: DetectiveWorldId[] = ['forest', 'ocean', 'city', 'space'];
      const currentIdx = worlds.indexOf(currentWorldId);
      const nextWorld = worlds[(currentIdx + 1) % worlds.length];
      setCurrentWorldId(nextWorld);
      setCaseIndexInWorld(1);
    }
  };

  // Cấp bậc thám tử
  const rankInfo = shadowDetectiveService.getRank(progress.solvedCaseIds.length);
  const isCaseSolvedAlready = progress.solvedCaseIds.includes(currentCase.id);

  // Màu nền phòng động chuyển từ tối sang sáng khi bật đèn
  const roomBgColor = roomBrightnessAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [currentWorld.darkBg, '#1E1B4B'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={currentWorld.darkBg} />

      {/* ============================================================ */}
      {/* 1. HEADER TRANG THÁM TỬ                                       */}
      {/* ============================================================ */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={onClose}>
          <Text style={styles.iconButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{currentWorld.name}</Text>
          <Text style={styles.headerSubtitle}>
            Vụ án {caseIndexInWorld}/10 • {currentCase.title}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.casebookButton}
            onPress={() => setShowCasebookModal(true)}
          >
            <Text style={styles.casebookButtonText}>📖 Sổ Tay</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ============================================================ */}
      {/* 2. THANH THẾ GIỚI (WORLD TABS)                                */}
      {/* ============================================================ */}
      <View style={styles.worldTabsRow}>
        {(['forest', 'ocean', 'city', 'space'] as DetectiveWorldId[]).map((wId) => {
          const w = DETECTIVE_WORLDS[wId];
          const isSelected = wId === currentWorldId;
          const solvedInW = getShadowCasesByWorld(wId).filter((c) =>
            progress.solvedCaseIds.includes(c.id)
          ).length;

          return (
            <TouchableOpacity
              key={`tab_${wId}`}
              style={[
                styles.worldTabItem,
                isSelected && {
                  backgroundColor: w.themeColor,
                  borderColor: '#FFFFFF',
                },
              ]}
              onPress={() => {
                riddleSoundService.playPop();
                setCurrentWorldId(wId);
                setCaseIndexInWorld(1);
              }}
            >
              <Text style={styles.worldTabEmoji}>{w.iconEmoji}</Text>
              <Text
                style={[
                  styles.worldTabText,
                  isSelected && { color: '#FFFFFF', fontWeight: '900' },
                ]}
                numberOfLines={1}
              >
                {w.name.split(' ')[0]} ({solvedInW}/10)
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ============================================================ */}
      {/* 3. CĂN PHÒNG TỐI BÍ ẨN (DARK ROOM STAGE)                       */}
      {/* ============================================================ */}
      <Animated.View style={[styles.darkChamberStage, { backgroundColor: roomBgColor }]}>
        {/* Nút bật tắt đèn pin ma thuật */}
        <View style={styles.chamberTopToolbar}>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>
              {isRoomLit ? '💡 ĐÃ BẬT SÁNG PHÒNG' : '🔦 CHẠM RÊ ĐÈN PIN ĐỂ SOI'}
            </Text>
          </View>

          <TouchableOpacity style={styles.soundClueButton} onPress={handleReplayClue}>
            <Text style={styles.soundClueButtonText}>🔊 Nghe Manh Mối</Text>
          </TouchableOpacity>
        </View>

        {/* VÙNG CHIẾU BÓNG & BỤC 3D TRUNG TÂM */}
        <View style={styles.stageVisualContainer}>
          {isRoomLit ? (
            /* Khi đã bật sáng: Hiển thị mô hình 3D rực rỡ đầy đủ */
            <View style={styles.hero3DWrapper}>
              <VocabCard3DStage
                card={createSyntheticDetectiveCard(currentCase)}
                isLight={false}
                size="hero"
                interactive={false}
              />
              <Text style={styles.revealedNameBadge}>{currentCase.labelVi}</Text>
            </View>
          ) : (
            /* Khi bóng đêm bao phủ: Hiển thị bóng đen ma mị */
            <View style={styles.silhouetteContainer}>
              {/* Bóng đen tuyền */}
              <View style={styles.shadowPedestal}>
                <Text style={styles.shadowFigureEmoji}>{currentCase.emoji}</Text>
                {/* Lớp phủ che bóng đen */}
                <View style={styles.silhouetteOverlay} />
              </View>

              <Text style={styles.mysteryQuestionMark}>❓ BÓNG ĐEN BÍ MẬT ❓</Text>
            </View>
          )}

          {/* CHIẾC ĐÈN PIN MA THUẬT RÊ THEO NGÓN TAY */}
          {!isRoomLit && (
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.spotlightDraggableBeam,
                {
                  transform: spotlightPos.getTranslateTransform(),
                  borderColor: currentWorld.flashlightColor,
                  shadowColor: currentWorld.flashlightColor,
                },
                isFlashlightHeld && styles.spotlightActiveGlow,
              ]}
            >
              <Text style={styles.flashlightIcon}>🔦</Text>
              <Text style={styles.spotlightHintText}>Rê đèn pin</Text>
            </Animated.View>
          )}
        </View>

        {/* BANNER THƠ MANH MỐI GỢI MỞ */}
        <View style={styles.clueBanner}>
          <Text style={styles.clueTitle}>📜 Manh Mối Thám Tử:</Text>
          {currentCase.cluePoem.map((line, idx) => (
            <Text key={`line_${idx}`} style={styles.clueLineText}>
              "{line}"
            </Text>
          ))}
        </View>
      </Animated.View>

      {/* ============================================================ */}
      {/* 4. CÁC NGHI PHẠM (SUSPECT OPTIONS)                            */}
      {/* ============================================================ */}
      <View style={styles.suspectsSection}>
        <Text style={styles.suspectSectionTitle}>
          🔍 Đố bé đó là ai trong 4 nghi phạm dưới đây?
        </Text>

        <View style={styles.suspectsGrid}>
          {currentCase.suspectOptions.map((suspect) => {
            const isSelected = selectedSuspectId === suspect.id;
            const isWrong = wrongSuspectIds.includes(suspect.id);
            const isCorrectRevealed = isRoomLit && suspect.isCorrect;

            return (
              <TouchableOpacity
                key={`suspect_${suspect.id}`}
                style={[
                  styles.suspectCard,
                  isWrong && styles.suspectCardWrong,
                  isSelected && styles.suspectCardSelected,
                  isCorrectRevealed && styles.suspectCardCorrect,
                ]}
                disabled={isWrong || isRoomLit}
                onPress={() => handleSelectSuspect(suspect)}
                activeOpacity={0.7}
              >
                <Text style={styles.suspectEmoji}>{suspect.emoji}</Text>
                <Text style={styles.suspectLabel} numberOfLines={1}>
                  {suspect.label}
                </Text>
                {isCorrectRevealed && <Text style={styles.correctCheck}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ============================================================ */}
      {/* 5. MASCOT TRỢ LÝ TOM & MIMI                                   */}
      {/* ============================================================ */}
      <View style={styles.mascotBar}>
        <Text style={styles.mascotEmoji}>🕵️‍♂️✨🔍</Text>
        <View style={styles.mascotBubble}>
          <Text style={styles.mascotText}>{mascotMessage}</Text>
        </View>
      </View>

      {/* ============================================================ */}
      {/* MODAL 1: CHÚC MỪNG PHÁ ÁN THÀNH CÔNG                         */}
      {/* ============================================================ */}
      <Modal visible={showVictoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.victoryCard}>
            <Text style={styles.victoryEmoji}>🔦 🌟 🏆</Text>
            <Text style={styles.victoryTitle}>PHÁ ÁN THÀNH CÔNG!</Text>
            <Text style={styles.victorySubtitle}>
              Bóng đen bí ẩn chính là: <Text style={styles.boldAnswer}>{currentCase.labelVi}</Text>
            </Text>

            {/* Mô hình 3D hiển thị đẹp mắt */}
            <View style={styles.victoryStageBox}>
              <VocabCard3DStage
                card={createSyntheticDetectiveCard(currentCase)}
                isLight={true}
                size="hero"
                interactive={false}
              />
            </View>

            {/* Fun fact */}
            <View style={styles.funFactBox}>
              <Text style={styles.funFactTitle}>📖 Hồ Sơ Thám Tử Tiết Lộ:</Text>
              <Text style={styles.funFactContent}>{currentCase.funFact}</Text>
            </View>

            <TouchableOpacity style={styles.nextCaseButton} onPress={handleNextCase}>
              <Text style={styles.nextCaseButtonText}>🌟 Vụ Án Tiếp Theo ➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 2: SỔ TAY THÁM TỬ (CASEBOOK / POKEDEX)                  */}
      {/* ============================================================ */}
      <Modal visible={showCasebookModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.casebookContainer}>
            <View style={styles.casebookHeader}>
              <View>
                <Text style={styles.casebookTitle}>📖 Sổ Tay Vụ Án Thám Tử</Text>
                <Text style={styles.casebookRankText}>
                  {rankInfo.badge} {rankInfo.title} • {progress.solvedCaseIds.length}/40 Vụ Án
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeCasebookButton}
                onPress={() => setShowCasebookModal(false)}
              >
                <Text style={styles.closeCasebookButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.casebookScroll}>
              {(['forest', 'ocean', 'city', 'space'] as DetectiveWorldId[]).map((wId) => {
                const w = DETECTIVE_WORLDS[wId];
                const cList = getShadowCasesByWorld(wId);
                return (
                  <View key={`casebook_world_${wId}`} style={styles.casebookWorldBlock}>
                    <Text style={[styles.casebookWorldTitle, { color: w.themeColor }]}>
                      {w.iconEmoji} {w.name}
                    </Text>

                    <View style={styles.casebookGrid}>
                      {cList.map((c) => {
                        const isSolved = progress.solvedCaseIds.includes(c.id);
                        return (
                          <TouchableOpacity
                            key={`casebook_c_${c.id}`}
                            style={[
                              styles.casebookItem,
                              isSolved && { borderColor: w.themeColor, backgroundColor: '#1E293B' },
                            ]}
                            onPress={() => {
                              setCurrentWorldId(wId);
                              setCaseIndexInWorld(c.caseNumber);
                              setShowCasebookModal(false);
                            }}
                          >
                            <Text style={styles.casebookItemEmoji}>
                              {isSolved ? c.emoji : '❓'}
                            </Text>
                            <Text style={styles.casebookItemLabel} numberOfLines={1}>
                              {isSolved ? c.labelVi : `Vụ ${c.caseNumber}`}
                            </Text>
                            {isSolved && <Text style={styles.casebookStarBadge}>⭐</Text>}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Native Sound Engine Fallback */}
      <SoundPlayer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0A0E1A',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  casebookButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  casebookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // World tabs
  worldTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 6,
  },
  worldTabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  worldTabEmoji: {
    fontSize: 13,
    marginRight: 4,
  },
  worldTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },

  // Căn phòng tối bí ẩn
  darkChamberStage: {
    marginHorizontal: 12,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  chamberTopToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FEF08A',
  },
  soundClueButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  soundClueButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  stageVisualContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  hero3DWrapper: {
    alignItems: 'center',
  },
  revealedNameBadge: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
    backgroundColor: '#064E3B',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  silhouetteContainer: {
    alignItems: 'center',
  },
  shadowPedestal: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
    position: 'relative',
  },
  shadowFigureEmoji: {
    fontSize: 68,
    opacity: 0.15, // Mờ ảo bí mật
  },
  silhouetteOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  mysteryQuestionMark: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
  },

  // Chiếc đèn pin ma thuật
  spotlightDraggableBeam: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    backgroundColor: 'rgba(254, 240, 138, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  spotlightActiveGlow: {
    backgroundColor: 'rgba(254, 240, 138, 0.45)',
    transform: [{ scale: 1.1 }],
  },
  flashlightIcon: {
    fontSize: 28,
  },
  spotlightHintText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },

  // Thơ manh mối
  clueBanner: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
  },
  clueTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FBBF24',
    marginBottom: 2,
  },
  clueLineText: {
    fontSize: 13,
    color: '#F8FAFC',
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Lưới nghi phạm
  suspectsSection: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  suspectSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 8,
  },
  suspectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suspectCard: {
    width: (width - 34) / 2,
    height: 60,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  suspectCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E3A8A',
  },
  suspectCardWrong: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    opacity: 0.4,
  },
  suspectCardCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
  suspectEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  suspectLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  correctCheck: {
    fontSize: 16,
    fontWeight: '900',
    color: '#10B981',
  },

  // Mascot
  mascotBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  mascotEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  mascotBubble: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mascotText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  victoryCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  victoryEmoji: {
    fontSize: 48,
    marginBottom: 6,
  },
  victoryTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 1,
  },
  victorySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  boldAnswer: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  victoryStageBox: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  funFactBox: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 14,
    width: '100%',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  funFactTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 4,
  },
  funFactContent: {
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 18,
  },
  nextCaseButton: {
    backgroundColor: '#10B981',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextCaseButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  // Casebook
  casebookContainer: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  casebookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    marginBottom: 10,
  },
  casebookTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  casebookRankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A78BFA',
    marginTop: 2,
  },
  closeCasebookButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeCasebookButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '800',
  },
  casebookScroll: {
    paddingBottom: 20,
  },
  casebookWorldBlock: {
    marginBottom: 16,
  },
  casebookWorldTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
  },
  casebookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  casebookItem: {
    width: (width - 76) / 3,
    height: 70,
    backgroundColor: '#111827',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    position: 'relative',
  },
  casebookItemEmoji: {
    fontSize: 24,
  },
  casebookItemLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
    marginTop: 2,
  },
  casebookStarBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    fontSize: 10,
  },
});
