import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { riddleSoundService } from '../../services/riddleSoundService';

const { width } = Dimensions.get('window');

interface RiddleLetterScrambleProps {
  answer: string;
  scrambleLetters: string[];
  isLight: boolean;
  onCheckAnswer: (isCorrect: boolean) => void;
  hintLetterTrigger?: number; // Tăng dần mỗi khi bấm gợi ý
}

export const RiddleLetterScramble: React.FC<RiddleLetterScrambleProps> = ({
  answer,
  scrambleLetters,
  isLight,
  onCheckAnswer,
  hintLetterTrigger = 0,
}) => {
  // Chuỗi đáp án chuẩn bỏ dấu cách để khớp với số ô
  const words = answer.trim().toUpperCase().split(/\s+/);
  const targetChars = words.join('').split('');

  // Trạng thái ô điền: mảng các chữ cái đã điền
  const [filledChars, setFilledChars] = useState<(string | null)[]>(() =>
    new Array(targetChars.length).fill(null)
  );

  // Trạng thái các phím ở khay: index nào đã được dùng
  const [usedScrambleIndices, setUsedScrambleIndices] = useState<number[]>([]);

  // Reset khi câu đố thay đổi
  useEffect(() => {
    setFilledChars(new Array(targetChars.length).fill(null));
    setUsedScrambleIndices([]);
  }, [answer]);

  // Xử lý gợi ý: Tự động điền 1 chữ cái đúng tiếp theo
  useEffect(() => {
    if (hintLetterTrigger > 0) {
      const firstEmptyIndex = filledChars.findIndex((c) => c === null);
      if (firstEmptyIndex !== -1) {
        const charNeeded = targetChars[firstEmptyIndex];
        // Tìm chữ trong scramble chưa dùng
        const availIdx = scrambleLetters.findIndex(
          (char, idx) => char === charNeeded && !usedScrambleIndices.includes(idx)
        );
        if (availIdx !== -1) {
          handleSelectLetter(scrambleLetters[availIdx], availIdx);
        }
      }
    }
  }, [hintLetterTrigger]);

  // Chọn 1 chữ cái từ khay dưới
  const handleSelectLetter = (char: string, scrambleIndex: number) => {
    const emptyIndex = filledChars.findIndex((c) => c === null);
    if (emptyIndex === -1) return;

    riddleSoundService.playPop();

    const newFilled = [...filledChars];
    newFilled[emptyIndex] = char;
    const newUsed = [...usedScrambleIndices, scrambleIndex];

    setFilledChars(newFilled);
    setUsedScrambleIndices(newUsed);

    // Nếu đã điền hết các ô, kiểm tra kết quả
    if (emptyIndex === targetChars.length - 1) {
      const isCorrect = newFilled.join('') === targetChars.join('');
      onCheckAnswer(isCorrect);
    }
  };

  // Hoàn tác: Chạm vào ô đã điền để trả lại khay
  const handleRemoveLetter = (slotIndex: number) => {
    const charToRemove = filledChars[slotIndex];
    if (!charToRemove) return;

    riddleSoundService.playPop();

    const newFilled = [...filledChars];
    newFilled[slotIndex] = null;
    setFilledChars(newFilled);

    // Trả lại ký tự trong usedScrambleIndices
    const usedIndexInArray = usedScrambleIndices.findIndex(
      (idx) => scrambleLetters[idx] === charToRemove
    );
    if (usedIndexInArray !== -1) {
      const newUsed = [...usedScrambleIndices];
      newUsed.splice(usedIndexInArray, 1);
      setUsedScrambleIndices(newUsed);
    }
  };

  // Nút xóa tất cả để xếp lại
  const handleResetAll = () => {
    setFilledChars(new Array(targetChars.length).fill(null));
    setUsedScrambleIndices([]);
  };

  // Tính index phẳng cho từng từ
  let currentFlatIndex = 0;

  return (
    <View style={styles.container}>
      {/* 1. Hàng các ô chứa từ khóa đáp án */}
      <View style={styles.wordsContainer}>
        {words.map((word, wIdx) => {
          const wordLetters = word.split('');
          return (
            <View key={`word_${wIdx}`} style={styles.wordRow}>
              {wordLetters.map((char, cIdx) => {
                const flatIdx = currentFlatIndex++;
                const filledValue = filledChars[flatIdx];

                return (
                  <TouchableOpacity
                    key={`slot_${wIdx}_${cIdx}`}
                    activeOpacity={0.7}
                    onPress={() => handleRemoveLetter(flatIdx)}
                    style={[
                      styles.charSlot,
                      {
                        backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                        borderColor: filledValue
                          ? '#3B82F6'
                          : isLight
                          ? '#CBD5E1'
                          : '#475569',
                      },
                      filledValue && styles.charSlotFilled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.charSlotText,
                        { color: isLight ? '#0F172A' : '#F8FAFC' },
                      ]}
                    >
                      {filledValue || ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>

      {/* 2. Nút Xóa Hết */}
      {usedScrambleIndices.length > 0 && (
        <TouchableOpacity style={styles.resetButton} onPress={handleResetAll}>
          <Text style={styles.resetButtonText}>🔄 Xếp Lại Từ Đầu</Text>
        </TouchableOpacity>
      )}

      {/* 3. Khay chứa các viên kẹo chữ cái xáo trộn */}
      <View style={styles.scrambleTray}>
        <Text
          style={[
            styles.trayTitle,
            { color: isLight ? '#64748B' : '#94A3B8' },
          ]}
        >
          🍬 Chạm vào chữ cái để điền vào ô trống:
        </Text>

        <View style={styles.lettersGrid}>
          {scrambleLetters.map((letter, idx) => {
            const isUsed = usedScrambleIndices.includes(idx);
            return (
              <TouchableOpacity
                key={`scramble_${idx}`}
                disabled={isUsed}
                activeOpacity={0.7}
                onPress={() => handleSelectLetter(letter, idx)}
                style={[
                  styles.letterKey,
                  {
                    backgroundColor: isUsed
                      ? isLight
                        ? '#E2E8F0'
                        : '#334155'
                      : isLight
                      ? '#EEF2FF'
                      : '#312E81',
                    borderColor: isUsed
                      ? 'transparent'
                      : isLight
                      ? '#818CF8'
                      : '#6366F1',
                    opacity: isUsed ? 0.3 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.letterKeyText,
                    {
                      color: isUsed
                        ? isLight
                          ? '#94A3B8'
                          : '#64748B'
                        : isLight
                        ? '#4338CA'
                        : '#E0E7FF',
                    },
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    rowGap: 8,
  },
  wordRow: {
    flexDirection: 'row',
    marginHorizontal: 6,
  },
  charSlot: {
    width: 38,
    height: 46,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  charSlotFilled: {
    borderStyle: 'solid',
    borderWidth: 2.5,
    backgroundColor: '#EFF6FF',
  },
  charSlotText: {
    fontSize: 22,
    fontWeight: '800',
  },
  resetButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginBottom: 8,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  scrambleTray: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
  },
  trayTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  lettersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  letterKey: {
    width: 44,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  letterKeyText: {
    fontSize: 22,
    fontWeight: '800',
  },
});
