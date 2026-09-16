import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { soundManager } from './SoundPlayer';

export type MascotMood = 'idle' | 'correct' | 'wrong' | 'celebrate' | 'thinking';

interface FlashcardMascotProps {
  mood: MascotMood;
  isLight?: boolean;
}

export const FlashcardMascot: React.FC<FlashcardMascotProps> = ({
  mood,
  isLight = false,
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mood === 'correct' || mood === 'celebrate') {
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -12, duration: 150, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: -8, duration: 120, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      ]).start();
    } else if (mood === 'wrong') {
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 4, duration: 100, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: -4, duration: 100, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [mood]);

  const handlePressMascot = () => {
    const lines = [
      'Bé học giỏi lắm! Cùng khám phá thêm nhiều thẻ mới nhé!',
      'Tom và MiMi luôn đồng hành cùng bé!',
      'Chạm vào hình ảnh 3D để nghe tiếng kêu của con vật nhé!',
      'Bé nhớ mở gói thẻ bí ẩn để sưu tập thẻ vàng nhé!',
    ];
    const picked = lines[Math.floor(Math.random() * lines.length)];
    soundManager.speak(picked, 'vi');
  };

  const getEmojiAndQuote = () => {
    switch (mood) {
      case 'correct':
        return { emoji: '👧🎉👦', quote: 'Đúng rồi! Bé giỏi quá!' };
      case 'celebrate':
        return { emoji: '🏆🌟🎴', quote: 'Bé là Siêu Thám Tử Từ Vựng!' };
      case 'wrong':
        return { emoji: '👦💡👧', quote: 'Không sao đâu, thử lại nhé!' };
      case 'thinking':
        return { emoji: '👦🤔👧', quote: 'Cùng suy nghĩ nào bé ơi...' };
      default:
        return { emoji: '👦✨👧', quote: 'Tom & MiMi cùng học với bé!' };
    }
  };

  const { emoji, quote } = getEmojiAndQuote();

  return (
    <TouchableOpacity
      style={[
        styles.mascotContainer,
        isLight ? styles.mascotContainerLight : styles.mascotContainerDark,
      ]}
      onPress={handlePressMascot}
      activeOpacity={0.85}
    >
      <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
        <Text style={styles.mascotEmoji}>{emoji}</Text>
      </Animated.View>
      <View style={styles.bubbleBox}>
        <Text
          style={[
            styles.bubbleText,
            isLight ? styles.bubbleTextLight : styles.bubbleTextDark,
          ]}
          numberOfLines={1}
        >
          {quote}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mascotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 6,
  },
  mascotContainerDark: {
    backgroundColor: '#1E293B',
    borderColor: '#38BDF8',
  },
  mascotContainerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#93C5FD',
  },
  mascotEmoji: {
    fontSize: 22,
  },
  bubbleBox: {
    flex: 1,
  },
  bubbleText: {
    fontSize: 11,
    fontWeight: '800',
  },
  bubbleTextDark: {
    color: '#E0F2FE',
  },
  bubbleTextLight: {
    color: '#0369A1',
  },
});
