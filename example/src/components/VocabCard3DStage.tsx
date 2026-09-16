import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { VocabCard } from '../data/oxfordKidsVocabulary';
import { vocabImageService, WordVisualResult } from '../services/vocabImageService';

interface VocabCard3DStageProps {
  card: VocabCard;
  isLight: boolean;
  size?: 'hero' | 'medium' | 'quiz' | 'small' | 'icon';
  interactive?: boolean;
  onPress?: () => void;
}

export const VocabCard3DStage: React.FC<VocabCard3DStageProps> = ({
  card,
  isLight,
  size = 'hero',
  interactive = true,
  onPress,
}) => {
  const [imageError, setImageError] = useState(false);
  const [visual, setVisual] = useState<WordVisualResult>(() =>
    vocabImageService.getWordVisual(card)
  );
  const [isLoaded, setIsLoaded] = useState(() => !!visual.localAsset);

  // Update visual when card changes
  useEffect(() => {
    setImageError(false);
    const nextVisual = vocabImageService.getWordVisual(card);
    setVisual(nextVisual);
    setIsLoaded(!!nextVisual.localAsset);
  }, [card]);

  // 1. Subtle Idle 3D Float Animation (gives life and hovering 3D depth)
  const floatAnim = useRef(new Animated.Value(0)).current;
  // 2. Interactive Bouncy Spring Scale on Tap
  const springScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (size === 'hero' || size === 'medium') {
      const floatLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -6,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 2,
            duration: 1600,
            useNativeDriver: true,
          }),
        ])
      );
      floatLoop.start();
      return () => floatLoop.stop();
    }
  }, [floatAnim, size]);

  const handlePress = () => {
    // Interactive 3D squish and bounce
    Animated.sequence([
      Animated.timing(springScale, {
        toValue: 0.88,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(springScale, {
        toValue: 1,
        friction: 3.5,
        tension: 160,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) {
      onPress();
    }
  };

  // Dimensions based on size preset
  const stageSize =
    size === 'hero'
      ? 136
      : size === 'medium'
      ? 100
      : size === 'quiz'
      ? 64
      : size === 'small'
      ? 54
      : 44;

  const imgSize =
    size === 'hero'
      ? 108
      : size === 'medium'
      ? 78
      : size === 'quiz'
      ? 50
      : size === 'small'
      ? 42
      : 34;

  const emojiFontSize =
    size === 'hero'
      ? 58
      : size === 'medium'
      ? 42
      : size === 'quiz'
      ? 30
      : size === 'small'
      ? 26
      : 22;

  const hasImage = !imageError && (visual.localAsset || visual.remote3dUrl);
  const imageSource = visual.localAsset
    ? visual.localAsset
    : visual.remote3dUrl
    ? { uri: visual.remote3dUrl }
    : null;

  const ContainerComponent = interactive ? TouchableOpacity : View;

  return (
    <ContainerComponent
      onPress={interactive ? handlePress : undefined}
      activeOpacity={0.88}
      style={[
        styles.outerContainer,
        { width: stageSize, height: stageSize },
      ]}
    >
      {/* 3D Ambient Glow */}
      <View
        style={[
          styles.ambientGlow,
          {
            width: stageSize + 14,
            height: stageSize + 14,
            borderRadius: (stageSize + 14) / 2,
            backgroundColor: card.color || '#3B82F6',
            opacity: isLight ? 0.18 : 0.28,
          },
        ]}
      />

      {/* 3D Neumorphic Pedestal Stage */}
      <View
        style={[
          styles.pedestal,
          isLight ? styles.pedestalLight : styles.pedestalDark,
          {
            width: stageSize,
            height: stageSize,
            borderRadius: stageSize / 2,
            borderColor: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.14)',
          },
        ]}
      >
        {/* Stage Highlight Rim */}
        <View
          style={[
            styles.stageRim,
            {
              width: stageSize - 12,
              height: stageSize - 12,
              borderRadius: (stageSize - 12) / 2,
              backgroundColor: isLight ? '#F8FAFC' : '#1E293B',
            },
          ]}
        />

        {/* 3D Floating Character Asset */}
        <Animated.View
          style={[
            styles.floatWrapper,
            {
              transform: [
                { translateY: floatAnim },
                { scale: springScale },
              ],
            },
          ]}
        >
          {/* Render fallback emoji as placeholder until image loads, or permanently on error */}
          {(!hasImage || !isLoaded) && (
            <Text
              style={[
                styles.fallbackEmoji,
                {
                  fontSize: emojiFontSize,
                  position: hasImage ? 'absolute' : 'relative',
                },
              ]}
            >
              {visual.emoji || card.emoji || '⭐'}
            </Text>
          )}

          {hasImage && imageSource && (
            <Image
              source={imageSource}
              style={{
                width: imgSize,
                height: imgSize,
                borderRadius: imgSize / 2,
                opacity: isLoaded ? 1 : 0,
              }}
              resizeMode="cover"
              onLoad={() => setIsLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
        </Animated.View>

        {/* Real-Life Specimen Badge on hero and medium stages */}
        {(size === 'hero' || size === 'medium') && hasImage && isLoaded && (
          <View
            style={[
              styles.model3DBadge,
              { backgroundColor: '#059669' },
            ]}
          >
            <Text style={styles.model3DBadgeText}>📸 ĐỜI THẬT</Text>
          </View>
        )}
      </View>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    alignSelf: 'center',
    top: -7,
  },
  pedestal: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    overflow: 'visible',
  },
  pedestalDark: {
    backgroundColor: '#0F172A',
  },
  pedestalLight: {
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
  },
  stageRim: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  floatWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  fallbackEmoji: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  model3DBadge: {
    position: 'absolute',
    bottom: -6,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  model3DBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
