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

interface Planet {
  id: string;
  nameVi: string;
  nameEn: string;
  emoji: string;
  color: string;
  distanceFromSun: string;
  funFact: string;
  order: number;
}

const PLANETS: Planet[] = [
  { id: 'sun', nameVi: 'Mặt Trời', nameEn: 'The Sun', emoji: '☀️', color: '#F59E0B', distanceFromSun: 'Trung tâm', funFact: 'Ngôi sao khổng lồ cung cấp ánh sáng và hơi ấm cho cả hệ Mặt Trời!', order: 0 },
  { id: 'mercury', nameVi: 'Sao Thủy', nameEn: 'Mercury', emoji: '🌑', color: '#94A3B8', distanceFromSun: 'Hành tinh thứ 1', funFact: 'Hành tinh nhỏ nhất và gần Mặt Trời nhất, ban ngày siêu nóng!', order: 1 },
  { id: 'venus', nameVi: 'Sao Kim', nameEn: 'Venus', emoji: '🟡', color: '#FBBF24', distanceFromSun: 'Hành tinh thứ 2', funFact: 'Hành tinh sáng nhất trên bầu trời đêm, còn gọi là sao Hôm sao Mai!', order: 2 },
  { id: 'earth', nameVi: 'Trái Đất', nameEn: 'Earth', emoji: '🌍', color: '#3B82F6', distanceFromSun: 'Hành tinh thứ 3', funFact: 'Ngôi nhà xanh xinh đẹp nơi con người, động thực vật cùng sinh sống!', order: 3 },
  { id: 'mars', nameVi: 'Sao Hỏa', nameEn: 'Mars', emoji: '🔴', color: '#EF4444', distanceFromSun: 'Hành tinh thứ 4', funFact: 'Hành tinh đỏ có ngọn núi lửa Olympus cao nhất hệ Mặt Trời!', order: 4 },
  { id: 'jupiter', nameVi: 'Sao Mộc', nameEn: 'Jupiter', emoji: '🟤', color: '#D97706', distanceFromSun: 'Hành tinh thứ 5', funFact: 'Hành tinh khí khổng lồ lớn nhất trong hệ Mặt Trời!', order: 5 },
  { id: 'saturn', nameVi: 'Sao Thổ', nameEn: 'Saturn', emoji: '🪐', color: '#EAB308', distanceFromSun: 'Hành tinh thứ 6', funFact: 'Hành tinh tuyệt đẹp với chiếc vành đai băng đá xoay xung quanh!', order: 6 },
  { id: 'uranus', nameVi: 'Sao Thiên Vương', nameEn: 'Uranus', emoji: '🔵', color: '#06B6D4', distanceFromSun: 'Hành tinh thứ 7', funFact: 'Hành tinh băng giá quay nghiêng đặc biệt như đang lăn trên quỹ đạo!', order: 7 },
  { id: 'neptune', nameVi: 'Sao Hải Vương', nameEn: 'Neptune', emoji: '🌊', color: '#2563EB', distanceFromSun: 'Hành tinh thứ 8', funFact: 'Hành tinh xa xôi nhất với những cơn gió bão siêu mạnh mẽ!', order: 8 },
];

export const SolarSystemGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(PLANETS[3]); // Earth default
  const [visitedPlanets, setVisitedPlanets] = useState<string[]>(['earth']);

  // Star twinkling
  const stars = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      anim: new Animated.Value(Math.random()),
    }))
  ).current;

  // Planet rotation / bounce
  const planetAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    soundManager.speak('Chào mừng phi hành gia nhí đến với chuyến du hành Hệ Mặt Trời!', 'vi');
    readPlanetInfo(PLANETS[3]);
  }, []);

  useEffect(() => {
    stars.forEach((star) => {
      const twinkle = () => {
        Animated.sequence([
          Animated.timing(star.anim, { toValue: 0.2, duration: 1000 + Math.random() * 1000, useNativeDriver: true }),
          Animated.timing(star.anim, { toValue: 1, duration: 1000 + Math.random() * 1000, useNativeDriver: true }),
        ]).start(() => twinkle());
      };
      twinkle();
    });
  }, []);

  const selectPlanet = (planet: Planet) => {
    setSelectedPlanet(planet);
    if (!visitedPlanets.includes(planet.id)) {
      setVisitedPlanets((prev) => [...prev, planet.id]);
    }

    Animated.sequence([
      Animated.timing(planetAnim, { toValue: 1.25, duration: 150, useNativeDriver: true }),
      Animated.spring(planetAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    readPlanetInfo(planet);
  };

  const readPlanetInfo = (planet: Planet) => {
    soundManager.speak(`Đây là ${planet.nameVi}, tiếng Anh là ${planet.nameEn}. ${planet.distanceFromSun}. ${planet.funFact}`, 'vi');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

      {/* TWINKLING STARS */}
      {stars.map((s) => (
        <Animated.View
          key={s.id}
          style={[
            styles.star,
            {
              left: `${s.x}%` as any,
              top: `${s.y}%` as any,
              width: s.size,
              height: s.size,
              borderRadius: s.size / 2,
              opacity: s.anim,
            },
          ]}
        />
      ))}

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>🪐 Du Hành Hệ Mặt Trời</Text>
          <Text style={styles.subtitleText}>Đã khám phá: {visitedPlanets.length}/9 thiên thể</Text>
        </View>
        <TouchableOpacity
          style={styles.soundBtn}
          onPress={() => readPlanetInfo(selectedPlanet)}
          activeOpacity={0.7}
        >
          <Text style={styles.soundBtnText}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* PLANET DETAIL CARD */}
      <View style={styles.planetHeroCard}>
        <Animated.View style={[styles.bigPlanetContainer, { transform: [{ scale: planetAnim }] }]}>
          <Text style={styles.bigPlanetEmoji}>{selectedPlanet.emoji}</Text>
        </Animated.View>

        <Text style={styles.planetTitleVi}>{selectedPlanet.nameVi}</Text>
        <Text style={styles.planetTitleEn}>{selectedPlanet.nameEn} • {selectedPlanet.distanceFromSun}</Text>

        <View style={styles.factBubble}>
          <Text style={styles.factTitle}>🌟 Bí mật vũ trụ:</Text>
          <Text style={styles.factText}>{selectedPlanet.funFact}</Text>
        </View>
      </View>

      {/* ORBIT STRIP / PLANET SELECTOR */}
      <View style={styles.orbitContainer}>
        <Text style={styles.orbitLabel}>🚀 Chạm vào hành tinh để phóng tàu bay tới:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.planetsList}>
          {PLANETS.map((p) => {
            const isSelected = selectedPlanet.id === p.id;
            const isVisited = visitedPlanets.includes(p.id);
            return (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.planetThumb,
                  isSelected && styles.planetThumbActive,
                  isVisited && styles.planetThumbVisited,
                ]}
                activeOpacity={0.8}
                onPress={() => selectPlanet(p)}
              >
                <Text style={styles.thumbEmoji}>{p.emoji}</Text>
                <Text style={[styles.thumbName, isSelected && styles.thumbNameActive]}>{p.nameVi}</Text>
                {isVisited && <Text style={styles.visitedTick}>⭐</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
    paddingBottom: 8,
    zIndex: 10,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
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
    color: '#93C5FD',
    marginTop: 2,
  },
  soundBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundBtnText: {
    fontSize: 18,
  },
  planetHeroCard: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    marginVertical: 10,
    zIndex: 10,
  },
  bigPlanetContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bigPlanetEmoji: {
    fontSize: 84,
  },
  planetTitleVi: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  planetTitleEn: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '700',
    marginBottom: 12,
  },
  factBubble: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 12,
    borderRadius: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  factTitle: {
    color: '#FDE047',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  factText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  orbitContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    padding: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 10,
  },
  orbitLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  planetsList: {
    gap: 10,
    paddingVertical: 4,
  },
  planetThumb: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    width: 76,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planetThumbActive: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
  },
  planetThumbVisited: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  thumbEmoji: {
    fontSize: 28,
  },
  thumbName: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  thumbNameActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  visitedTick: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 10,
  },
});

export default SolarSystemGameScreen;
