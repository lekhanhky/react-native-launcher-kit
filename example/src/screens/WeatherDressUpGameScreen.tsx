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

interface WeatherScenario {
  id: string;
  nameVi: string;
  emoji: string;
  bgGradient: string;
  description: string;
  requiredItemIds: string[];
}

const WEATHERS: WeatherScenario[] = [
  {
    id: 'sunny',
    nameVi: 'Trời Nắng Gắt',
    emoji: '☀️',
    bgGradient: '#F59E0B',
    description: 'Trời nắng chói chang, nóng bức quá! Bé hãy giúp bạn mặc đồ thoáng mát & che nắng nhé.',
    requiredItemIds: ['tshirt', 'sunglasses', 'sunhat'],
  },
  {
    id: 'rainy',
    nameVi: 'Trời Mưa Rào',
    emoji: '🌧️',
    bgGradient: '#0284C7',
    description: 'Trời đang mưa to sấm chớp! Hãy trang bị đồ đi mưa để không bị ướt nhé.',
    requiredItemIds: ['raincoat', 'umbrella', 'rainboots'],
  },
  {
    id: 'snowy',
    nameVi: 'Trời Tuyết Lạnh',
    emoji: '❄️',
    bgGradient: '#475569',
    description: 'Trời tuyết rơi lạnh buốt giá! Mau mặc đồ thật ấm từ đầu đến chân thôi nào.',
    requiredItemIds: ['wintercoat', 'beanie', 'scarf'],
  },
  {
    id: 'windy',
    nameVi: 'Gió Bão Lạnh',
    emoji: '🍃',
    bgGradient: '#059669',
    description: 'Gió thổi ào ào rất lạnh! Bé nhớ mặc áo khoác giữ ấm cẩn thận nhé.',
    requiredItemIds: ['windjacket', 'scarf'],
  },
];

interface ClothingItem {
  id: string;
  nameVi: string;
  emoji: string;
  category: 'head' | 'body' | 'accessory' | 'feet';
}

const CLOTHES: ClothingItem[] = [
  { id: 'sunhat', nameVi: 'Mũ Vành', emoji: '👒', category: 'head' },
  { id: 'beanie', nameVi: 'Mũ Len', emoji: '🧶', category: 'head' },
  { id: 'sunglasses', nameVi: 'Kính Râm', emoji: '🕶️', category: 'accessory' },
  { id: 'scarf', nameVi: 'Khăn Quàng', emoji: '🧣', category: 'accessory' },
  { id: 'umbrella', nameVi: 'Chiếc Ô', emoji: '☂️', category: 'accessory' },
  { id: 'tshirt', nameVi: 'Áo Thun', emoji: '👕', category: 'body' },
  { id: 'raincoat', nameVi: 'Áo Mưa', emoji: '🧥', category: 'body' },
  { id: 'wintercoat', nameVi: 'Áo Phao Ấm', emoji: '🥼', category: 'body' },
  { id: 'windjacket', nameVi: 'Áo Gió', emoji: '🦺', category: 'body' },
  { id: 'rainboots', nameVi: 'Ủng Mưa', emoji: '👢', category: 'feet' },
];

export const WeatherDressUpGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [weatherIdx, setWeatherIdx] = useState(0);
  const [wornItemIds, setWornItemIds] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Shiver animation when inappropriate
  const shiverAnim = useRef(new Animated.Value(0)).current;

  const currentWeather = WEATHERS[weatherIdx];

  useEffect(() => {
    soundManager.speak('Chào bé! Hãy chọn trang phục phù hợp với thời tiết cho bạn nhé!', 'vi');
    readWeather();
  }, [weatherIdx]);

  const readWeather = () => {
    soundManager.speak(`${currentWeather.nameVi}: ${currentWeather.description}`, 'vi');
  };

  const toggleWearItem = (item: ClothingItem) => {
    const isWorn = wornItemIds.includes(item.id);
    let nextWorn: string[];

    if (isWorn) {
      nextWorn = wornItemIds.filter((id) => id !== item.id);
      soundManager.speak(`Đã cởi ${item.nameVi}`, 'vi');
    } else {
      nextWorn = [...wornItemIds, item.id];
      soundManager.speak(`Đã mặc ${item.nameVi}`, 'vi');
    }
    setWornItemIds(nextWorn);

    // Check suitability
    const isCorrect = currentWeather.requiredItemIds.every((reqId) => nextWorn.includes(reqId));
    if (isCorrect) {
      setIsSuccess(true);
      soundManager.speak('Tuyệt vời! Trang phục rất hoàn hảo cho thời tiết hôm nay!', 'vi');
    } else {
      setIsSuccess(false);
    }
  };

  const nextWeather = () => {
    setWornItemIds([]);
    setIsSuccess(false);
    if (weatherIdx + 1 < WEATHERS.length) {
      setWeatherIdx((prev) => prev + 1);
    } else {
      setWeatherIdx(0);
      soundManager.speak('Chúc mừng bé đã thành thạo kỹ năng chọn trang phục 4 mùa!', 'vi');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentWeather.bgGradient }]}>
      <StatusBar barStyle="light-content" backgroundColor={currentWeather.bgGradient} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>👗 Thời Tiết & Trang Phục</Text>
          <Text style={styles.subtitleText}>{currentWeather.nameVi} {currentWeather.emoji}</Text>
        </View>
        <TouchableOpacity style={styles.soundBtn} onPress={readWeather} activeOpacity={0.7}>
          <Text style={styles.soundBtnText}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* WEATHER BANNER */}
      <View style={styles.weatherBanner}>
        <Text style={styles.weatherEmojiBig}>{currentWeather.emoji}</Text>
        <Text style={styles.weatherDesc}>{currentWeather.description}</Text>
      </View>

      {/* CHARACTER STAGE */}
      <View style={styles.stageContainer}>
        {/* CHARACTER DISPLAY */}
        <Animated.View style={[styles.characterCard, { transform: [{ translateX: shiverAnim }] }]}>
          <Text style={styles.characterFace}>👧</Text>

          {/* WORN ACCESSORIES */}
          <View style={styles.wornOverlay}>
            {wornItemIds.map((id) => {
              const itm = CLOTHES.find((c) => c.id === id);
              return itm ? (
                <View key={id} style={styles.wornItemBadge}>
                  <Text style={styles.wornEmoji}>{itm.emoji}</Text>
                  <Text style={styles.wornName}>{itm.nameVi}</Text>
                </View>
              ) : null;
            })}
          </View>
        </Animated.View>
      </View>

      {/* WARDROBE RACK */}
      <View style={styles.wardrobeContainer}>
        <Text style={styles.wardrobeHeading}>👚 Tủ Quần Áo (Chạm để mặc/cởi):</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.clothesList}>
          {CLOTHES.map((item) => {
            const isWorn = wornItemIds.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.clothingCard, isWorn && styles.clothingCardWorn]}
                activeOpacity={0.8}
                onPress={() => toggleWearItem(item)}
              >
                <Text style={styles.clothingEmoji}>{item.emoji}</Text>
                <Text style={[styles.clothingName, isWorn && styles.clothingNameWorn]}>{item.nameVi}</Text>
                {isWorn && <Text style={styles.checkWorn}>✔️ Đang mặc</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* SUCCESS OVERLAY */}
      {isSuccess && (
        <View style={styles.successBar}>
          <Text style={styles.successText}>🌟 Bé mặc đồ rất chuẩn rồi!</Text>
          <TouchableOpacity style={styles.nextWeatherBtn} onPress={nextWeather} activeOpacity={0.8}>
            <Text style={styles.nextWeatherText}>Thời Tiết Tiếp Theo ➡️</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#FEF3C7',
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
  weatherBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 14,
    marginVertical: 6,
    padding: 10,
    borderRadius: 16,
    gap: 10,
  },
  weatherEmojiBig: {
    fontSize: 36,
  },
  weatherDesc: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    lineHeight: 18,
  },
  stageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  characterCard: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  characterFace: {
    fontSize: 70,
  },
  wornOverlay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  wornItemBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  wornEmoji: {
    fontSize: 14,
  },
  wornName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#854D0E',
  },
  wardrobeContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    padding: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  wardrobeHeading: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  clothesList: {
    gap: 10,
    paddingVertical: 4,
  },
  clothingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    width: 80,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  clothingCardWorn: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  clothingEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  clothingName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  clothingNameWorn: {
    color: '#065F46',
  },
  checkWorn: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '800',
    marginTop: 2,
  },
  successBar: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.95)',
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  nextWeatherBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  nextWeatherText: {
    color: '#059669',
    fontWeight: '900',
    fontSize: 13,
  },
});

export default WeatherDressUpGameScreen;
