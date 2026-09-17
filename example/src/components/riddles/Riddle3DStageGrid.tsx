import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { RiddleOption3D, createSyntheticVocabCard } from '../../data/riddles100Data';
import { VocabCard3DStage } from '../VocabCard3DStage';

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - 48) / 2;

interface Riddle3DStageGridProps {
  options: RiddleOption3D[];
  eliminatedOptionIds: string[];
  selectedOptionId: string | null;
  isAnswerChecked: boolean;
  isLight: boolean;
  onSelectOption: (option: RiddleOption3D) => void;
}

export const Riddle3DStageGrid: React.FC<Riddle3DStageGridProps> = ({
  options,
  eliminatedOptionIds,
  selectedOptionId,
  isAnswerChecked,
  isLight,
  onSelectOption,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {options.map((option, idx) => {
          const isEliminated = eliminatedOptionIds.includes(option.id);
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.isCorrect;

          let cardBorderColor = isLight ? '#E2E8F0' : '#2D3748';
          let badgeBg = isLight ? '#F1F5F9' : '#1E293B';
          let textColor = isLight ? '#1E293B' : '#F8FAFC';

          if (isAnswerChecked && isSelected) {
            if (isCorrect) {
              cardBorderColor = '#10B981';
              badgeBg = isLight ? '#D1FAE5' : '#064E3B';
              textColor = '#10B981';
            } else {
              cardBorderColor = '#EF4444';
              badgeBg = isLight ? '#FEE2E2' : '#7F1D1D';
              textColor = '#EF4444';
            }
          } else if (isSelected) {
            cardBorderColor = '#3B82F6';
            badgeBg = isLight ? '#DBEAFE' : '#1E3A8A';
            textColor = '#3B82F6';
          }

          const syntheticCard = createSyntheticVocabCard(option);

          return (
            <TouchableOpacity
              key={option.id || `opt_${idx}`}
              activeOpacity={isEliminated ? 1 : 0.8}
              disabled={isEliminated || isAnswerChecked}
              onPress={() => onSelectOption(option)}
              style={[
                styles.cardItem,
                {
                  width: GRID_ITEM_WIDTH,
                  backgroundColor: isLight ? '#FFFFFF' : '#1E293B',
                  borderColor: cardBorderColor,
                  opacity: isEliminated ? 0.25 : 1,
                  borderWidth: isSelected ? 2.5 : 1.5,
                },
              ]}
            >
              {/* Sân khấu 3D Neumorphic */}
              <View style={styles.stageWrapper}>
                <VocabCard3DStage
                  card={syntheticCard}
                  isLight={isLight}
                  size="quiz"
                  interactive={!isEliminated && !isAnswerChecked}
                  onPress={() => onSelectOption(option)}
                />
              </View>

              {/* Tên nhãn tiếng Việt của đáp án */}
              <View style={[styles.labelPill, { backgroundColor: badgeBg }]}>
                <Text style={[styles.labelText, { color: textColor }]} numberOfLines={1}>
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  cardItem: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  labelPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
