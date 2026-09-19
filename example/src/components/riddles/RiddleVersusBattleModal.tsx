import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import {
  ALL_RIDDLES_100,
  RiddleItem,
  RiddleOption3D,
} from '../../data/riddles100Data';
import { riddleSoundService } from '../../services/riddleSoundService';

const { width, height } = Dimensions.get('window');
const TARGET_WIN_SCORE = 5;

interface RiddleVersusBattleModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RiddleVersusBattleModal: React.FC<RiddleVersusBattleModalProps> = ({
  visible,
  onClose,
}) => {
  // Điểm số của 2 đấu thủ
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);

  // Câu đố hiện tại
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(1);

  // Trạng thái khóa lượt khi bấm sai
  const [p1Locked, setP1Locked] = useState<boolean>(false);
  const [p2Locked, setP2Locked] = useState<boolean>(false);

  // Người chiến thắng của vòng đấu (1 hoặc 2)
  const [roundWinner, setRoundWinner] = useState<1 | 2 | 'draw' | null>(null);

  // Người thắng toàn trận
  const [matchWinner, setMatchWinner] = useState<1 | 2 | null>(null);

  // Chế độ xoay Player 2 (true = ngồi đối diện 180°, false = ngồi cạnh nhau)
  const [isP2Inverted, setIsP2Inverted] = useState<boolean>(true);

  // Hiệu ứng scale khi ghi điểm
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Lấy danh sách câu đố đã được xáo trộn
  const [shuffledRiddles, setShuffledRiddles] = useState<RiddleItem[]>([]);

  useEffect(() => {
    if (visible) {
      resetMatch();
    }
  }, [visible]);

  const resetMatch = () => {
    const shuffled = [...ALL_RIDDLES_100].sort(() => 0.5 - Math.random());
    setShuffledRiddles(shuffled);
    setCurrentRiddleIndex(0);
    setRoundNumber(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setP1Locked(false);
    setP2Locked(false);
    setRoundWinner(null);
    setMatchWinner(null);
    
    // Đọc thơ mở màn câu đầu
    if (shuffled.length > 0) {
      setTimeout(() => {
        riddleSoundService.speakPoem(shuffled[0].poem);
      }, 500);
    }
  };

  const currentRiddle = shuffledRiddles[currentRiddleIndex] || ALL_RIDDLES_100[0];

  // Xử lý khi một người chơi chọn đáp án
  const handleSelectOption = (player: 1 | 2, option: RiddleOption3D) => {
    if (roundWinner !== null || matchWinner !== null) return;
    if (player === 1 && p1Locked) return;
    if (player === 2 && p2Locked) return;

    riddleSoundService.playPop();

    if (option.isCorrect) {
      // Người chơi này trả lời đúng!
      setRoundWinner(player);
      const newScore = player === 1 ? player1Score + 1 : player2Score + 1;
      
      if (player === 1) {
        setPlayer1Score(newScore);
      } else {
        setPlayer2Score(newScore);
      }

      // Hiệu ứng ăn mừng & âm thanh
      riddleSoundService.playSuccessReward(currentRiddle);
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      // Kiểm tra có ai chạm mốc 5 điểm chiến thắng toàn trận không
      if (newScore >= TARGET_WIN_SCORE) {
        setTimeout(() => {
          setMatchWinner(player);
          riddleSoundService.playTreasureChest();
        }, 1200);
      } else {
        // Chuyển sang vòng đấu tiếp theo sau 1.8s
        setTimeout(() => {
          nextRound();
        }, 1800);
      }
    } else {
      // Người chơi chọn sai -> Khóa lượt trong vòng này
      riddleSoundService.playWrong();
      if (player === 1) {
        setP1Locked(true);
      } else {
        setP2Locked(true);
      }

      // Nếu cả 2 đều đoán sai -> Hòa vòng này, chuyển câu tiếp
      const otherLocked = player === 1 ? p2Locked : p1Locked;
      if (otherLocked) {
        setRoundWinner('draw');
        setTimeout(() => {
          nextRound();
        }, 2000);
      }
    }
  };

  // Sang câu đố tiếp theo
  const nextRound = () => {
    setRoundWinner(null);
    setP1Locked(false);
    setP2Locked(false);
    setRoundNumber((prev) => prev + 1);
    
    const nextIdx = (currentRiddleIndex + 1) % (shuffledRiddles.length || 1);
    setCurrentRiddleIndex(nextIdx);

    const nextRiddle = shuffledRiddles[nextIdx];
    if (nextRiddle) {
      riddleSoundService.speakPoem(nextRiddle.poem);
    }
  };

  // Phát lại giọng đọc câu thơ hiện tại
  const handleReplayPoem = () => {
    riddleSoundService.playPop();
    riddleSoundService.speakPoem(currentRiddle.poem);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0B132B" />

        {/* ============================================================ */}
        {/* NỬA TRÊN: NGƯỜI CHƠI 2 (👧 BÉ 2 HOẶC 👨 BA/MẸ)                */}
        {/* ============================================================ */}
        <View
          style={[
            styles.playerHalfZone,
            styles.player2Zone,
            isP2Inverted && { transform: [{ rotate: '180deg' }] },
          ]}
        >
          {/* Header Người chơi 2 */}
          <View style={styles.playerHeader}>
            <View style={styles.playerTag}>
              <Text style={styles.playerAvatar}>👧</Text>
              <Text style={styles.playerName}>ĐẤU THỦ 2 (BÊN ĐỎ)</Text>
            </View>
            <View style={styles.scorePillRed}>
              <Text style={styles.scoreText}>⭐ {player2Score}/{TARGET_WIN_SCORE}</Text>
            </View>
          </View>

          {/* Trạng thái khóa lượt */}
          {p2Locked && !roundWinner && (
            <View style={styles.lockedNotice}>
              <Text style={styles.lockedNoticeText}>❌ ĐÃ CHỌN SAI - BỊ KHÓA LƯỢT!</Text>
            </View>
          )}

          {/* Lưới 4 đáp án của Player 2 */}
          <View style={styles.optionsGrid}>
            {currentRiddle.options3D.map((option, idx) => {
              const isWinRound = roundWinner === 2 && option.isCorrect;
              return (
                <TouchableOpacity
                  key={`p2_opt_${option.id || idx}`}
                  style={[
                    styles.optionButton,
                    styles.optionButtonRed,
                    p2Locked && styles.optionButtonDisabled,
                    isWinRound && styles.optionButtonCorrect,
                  ]}
                  disabled={p2Locked || roundWinner !== null}
                  onPress={() => handleSelectOption(2, option)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionEmoji}>{option.emoji || '✨'}</Text>
                  <Text style={styles.optionLabel} numberOfLines={1}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ============================================================ */}
        {/* THANH TRỌNG TÀI TRUNG TÂM (CENTER REFEREE STRIP)             */}
        {/* ============================================================ */}
        <View style={styles.refereeBar}>
          {/* Hàng điều khiển & Tỉ số */}
          <View style={styles.refereeControlsRow}>
            <TouchableOpacity style={styles.exitButton} onPress={onClose}>
              <Text style={styles.exitButtonText}>✕ Thoát</Text>
            </TouchableOpacity>

            <View style={styles.versusScoreBadge}>
              <Text style={[styles.vsScoreNum, { color: '#3B82F6' }]}>{player1Score}</Text>
              <Text style={styles.vsDivider}>⚔️</Text>
              <Text style={[styles.vsScoreNum, { color: '#EF4444' }]}>{player2Score}</Text>
            </View>

            <View style={styles.rightActionRow}>
              <TouchableOpacity
                style={styles.rotateToggleButton}
                onPress={() => setIsP2Inverted((prev) => !prev)}
              >
                <Text style={styles.rotateToggleText}>
                  {isP2Inverted ? '🔄 Đối diện' : '👥 Ngồi cạnh'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.soundPoemButton} onPress={handleReplayPoem}>
                <Text style={styles.soundPoemButtonText}>🔊</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dòng thơ câu đố hiện tại */}
          <View style={styles.poemBanner}>
            <Text style={styles.roundBadge}>HIỆP {roundNumber}</Text>
            <Text style={styles.poemLineText} numberOfLines={2}>
              "{currentRiddle.poem.join(' - ')}"
            </Text>
          </View>

          {/* Banner thông báo kết quả hiệp */}
          {roundWinner && (
            <View style={styles.roundResultBanner}>
              {roundWinner === 'draw' ? (
                <Text style={styles.roundResultText}>HÒA HIỆP NÀY! CẢ HAI ĐỀU CHƯA ĐÚNG 🤝</Text>
              ) : (
                <Text style={styles.roundResultText}>
                  🎉 ĐẤU THỦ {roundWinner} ({roundWinner === 1 ? 'XANH' : 'ĐỎ'}) GHI ĐIỂM! (+1 ⭐)
                </Text>
              )}
            </View>
          )}
        </View>

        {/* ============================================================ */}
        {/* NỬA DƯỚI: NGƯỜI CHƠI 1 (👦 BÉ 1 - BÊN XANH)                  */}
        {/* ============================================================ */}
        <View style={[styles.playerHalfZone, styles.player1Zone]}>
          {/* Trạng thái khóa lượt */}
          {p1Locked && !roundWinner && (
            <View style={styles.lockedNotice}>
              <Text style={styles.lockedNoticeText}>❌ ĐÃ CHỌN SAI - BỊ KHÓA LƯỢT!</Text>
            </View>
          )}

          {/* Lưới 4 đáp án của Player 1 */}
          <View style={styles.optionsGrid}>
            {currentRiddle.options3D.map((option, idx) => {
              const isWinRound = roundWinner === 1 && option.isCorrect;
              return (
                <TouchableOpacity
                  key={`p1_opt_${option.id || idx}`}
                  style={[
                    styles.optionButton,
                    styles.optionButtonBlue,
                    p1Locked && styles.optionButtonDisabled,
                    isWinRound && styles.optionButtonCorrect,
                  ]}
                  disabled={p1Locked || roundWinner !== null}
                  onPress={() => handleSelectOption(1, option)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionEmoji}>{option.emoji || '✨'}</Text>
                  <Text style={styles.optionLabel} numberOfLines={1}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Header Người chơi 1 */}
          <View style={styles.playerHeader}>
            <View style={styles.playerTag}>
              <Text style={styles.playerAvatar}>👦</Text>
              <Text style={styles.playerName}>ĐẤU THỦ 1 (BÊN XANH)</Text>
            </View>
            <View style={styles.scorePillBlue}>
              <Text style={styles.scoreText}>⭐ {player1Score}/{TARGET_WIN_SCORE}</Text>
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* MODAL KẾT THÚC TRẬN ĐẤU - VINH DANH NHÀ VÔ ĐỊCH             */}
        {/* ============================================================ */}
        <Modal visible={matchWinner !== null} transparent animationType="fade">
          <View style={styles.victoryOverlay}>
            <View style={styles.victoryCard}>
              <Text style={styles.victoryTrophyEmoji}>🏆 👑 🎊</Text>
              <Text style={styles.victoryTitle}>CHIẾN THẮNG CHUNG CUỘC!</Text>
              <Text
                style={[
                  styles.winnerName,
                  { color: matchWinner === 1 ? '#3B82F6' : '#EF4444' },
                ]}
              >
                {matchWinner === 1
                  ? '👦 ĐẤU THỦ 1 (BÊN XANH) ĐÃ THẮNG!'
                  : '👧 ĐẤU THỦ 2 (BÊN ĐỎ) ĐÃ THẮNG!'}
              </Text>
              <Text style={styles.victorySubtitle}>
                Tỉ số đỉnh cao: {player1Score} - {player2Score}
              </Text>

              <View style={styles.victoryButtonRow}>
                <TouchableOpacity style={styles.rematchButton} onPress={resetMatch}>
                  <Text style={styles.rematchButtonText}>⚔️ Đấu Trận Mới</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeVictoryButton} onPress={onClose}>
                  <Text style={styles.closeVictoryButtonText}>Rời Đấu Trường</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  // Nửa màn hình mỗi người chơi
  playerHalfZone: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  player2Zone: {
    backgroundColor: '#1C1917',
    borderBottomWidth: 2,
    borderBottomColor: '#EF4444',
  },
  player1Zone: {
    backgroundColor: '#0F172A',
    borderTopWidth: 2,
    borderTopColor: '#3B82F6',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  playerTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    fontSize: 22,
    marginRight: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  scorePillBlue: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  scorePillRed: {
    backgroundColor: '#7F1D1D',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  lockedNotice: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4,
  },
  lockedNoticeText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '800',
  },
  // Lưới 4 nút lựa chọn
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  optionButton: {
    width: (width - 44) / 2,
    height: 72,
    borderRadius: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  optionButtonBlue: {
    backgroundColor: '#1E293B',
    borderColor: '#3B82F6',
  },
  optionButtonRed: {
    backgroundColor: '#292524',
    borderColor: '#EF4444',
  },
  optionButtonDisabled: {
    opacity: 0.25,
    borderColor: '#64748B',
  },
  optionButtonCorrect: {
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
    transform: [{ scale: 1.03 }],
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Dải phân cách trọng tài trung tâm
  refereeBar: {
    backgroundColor: '#070C1B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  refereeControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exitButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  exitButtonText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  versusScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#475569',
  },
  vsScoreNum: {
    fontSize: 18,
    fontWeight: '900',
  },
  vsDivider: {
    fontSize: 14,
    marginHorizontal: 8,
  },
  rightActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rotateToggleButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  rotateToggleText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  soundPoemButton: {
    backgroundColor: '#F59E0B',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundPoemButtonText: {
    fontSize: 14,
  },
  poemBanner: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roundBadge: {
    backgroundColor: '#8B5CF6',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  poemLineText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 12,
    fontStyle: 'italic',
  },
  roundResultBanner: {
    marginTop: 4,
    backgroundColor: '#10B981',
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  roundResultText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // Modal Vinh Danh Chiến Thắng Toàn Trận
  victoryOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  victoryCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  victoryTrophyEmoji: {
    fontSize: 54,
    marginBottom: 10,
  },
  victoryTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 1,
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  victorySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 24,
  },
  victoryButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rematchButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  rematchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  closeVictoryButton: {
    flex: 1,
    backgroundColor: '#475569',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  closeVictoryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
