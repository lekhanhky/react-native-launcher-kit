import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import {
  INTERNAL_GAMES_REGISTRY,
  BOTTOM_DOCK_GAME_IDS,
} from '../../data/launcherGamesRegistry';
import { ThemeConfig } from '../../services/themes';

interface LauncherBottomDockProps {
  onLaunchGame: (gameId: string) => void;
  theme: ThemeConfig;
  disabledGameIds?: string[];
}

export const LauncherBottomDock: React.FC<LauncherBottomDockProps> = ({
  onLaunchGame,
  theme,
  disabledGameIds,
}) => {
  const dockGames = BOTTOM_DOCK_GAME_IDS.map((id) =>
    INTERNAL_GAMES_REGISTRY.find((g) => g.id === id)
  )
    .filter(Boolean)
    .filter((g) => !disabledGameIds || !disabledGameIds.includes(g!.id));

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View
        style={[
          styles.dockBar,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderColor: 'rgba(255, 255, 255, 0.6)',
          },
        ]}
      >
        {dockGames.map((game) => {
          if (!game) return null;
          return (
            <DockItem
              key={`dock_${game.id}`}
              game={game}
              onPress={() => onLaunchGame(game.id)}
            />
          );
        })}
      </View>
    </View>
  );
};

interface DockItemProps {
  game: any;
  onPress: () => void;
}

const DockItem: React.FC<DockItemProps> = ({ game, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 8,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.dockItemContainer}
        activeOpacity={0.85}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <View
          style={[
            styles.dockIconDish,
            { backgroundColor: game.gradientColors[0] },
          ]}
        >
          <Text style={styles.dockEmoji}>{game.iconEmoji}</Text>
        </View>
        <Text style={styles.dockLabel} numberOfLines={1}>
          {game.title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    paddingTop: 4,
  },
  dockBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 26,
    borderWidth: 1.5,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  dockItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
  },
  dockIconDish: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    marginBottom: 3,
  },
  dockEmoji: {
    fontSize: 24,
  },
  dockLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
  },
});
