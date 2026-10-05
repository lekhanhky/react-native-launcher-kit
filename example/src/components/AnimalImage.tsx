import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ImageStyle,
  ActivityIndicator,
} from 'react-native';
import { animalLibrary, AnimalProfile } from '../libraries/animalLibrary';

export interface AnimalImageProps {
  /**
   * Mã định danh của động vật (vd: 'lion', 'tiger', 'dog'...)
   */
  id?: string;
  /**
   * Hoặc truyền trực tiếp đối tượng AnimalProfile
   */
  animal?: AnimalProfile;
  /**
   * Kích thước khung hình (vuông: width = height = size), mặc định 64
   */
  size?: number;
  /**
   * Tùy chọn bo tròn góc: nếu true bo tròn tối đa (size / 2)
   */
  rounded?: boolean;
  /**
   * Bán kính góc bo tùy biến
   */
  borderRadius?: number;
  /**
   * Tùy chọn hiển thị emoji huy hiệu nhỏ góc dưới phải
   */
  showBadge?: boolean;
  /**
   * Tùy chọn hiển thị nút loa phát âm thanh
   */
  showSoundButton?: boolean;
  /**
   * Tự động phát âm thanh tiếng kêu khi bé chạm vào ảnh (mặc định false)
   */
  enableSoundOnPress?: boolean;
  /**
   * Sự kiện khi bé nhấn vào
   */
  onPress?: () => void;
  /**
   * Tùy biến style container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Tùy biến style ảnh
   */
  imageStyle?: StyleProp<ImageStyle>;
  /**
   * Test identifier
   */
  testID?: string;
}

export const AnimalImage: React.FC<AnimalImageProps> = ({
  id,
  animal: directAnimal,
  size = 64,
  rounded = false,
  borderRadius: customRadius,
  showBadge = false,
  showSoundButton = false,
  enableSoundOnPress = false,
  onPress,
  style,
  imageStyle,
  testID = 'animal-image',
}) => {
  // Lấy dữ liệu động vật từ Library hoặc prop truyền vào
  const animal: AnimalProfile | undefined = useMemo(() => {
    if (directAnimal) return directAnimal;
    if (id) return animalLibrary.getById(id);
    return undefined;
  }, [id, directAnimal]);

  // Trạng thái load ảnh & lỗi
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Tính toán border radius
  const calculatedRadius = customRadius !== undefined
    ? customRadius
    : rounded
    ? size / 2
    : Math.max(8, Math.round(size * 0.18));

  // Xác định nguồn ảnh (3-tier fallback engine)
  const imageSource = useMemo(() => {
    if (!animal || loadError) return null;
    
    // Tầng 1: Ảnh 3D Pixar cục bộ
    if (animal.image.local3D) {
      return animal.image.local3D;
    }
    // Tầng 2: Ảnh Cloud CDN HD
    if (animal.image.photoHd || animal.image.thumbnail) {
      return { uri: animal.image.photoHd || animal.image.thumbnail };
    }
    return null;
  }, [animal, loadError]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (enableSoundOnPress && animal) {
      animalLibrary.playSound(animal.id, 'sfx');
    }
  };

  const handleSoundBtnPress = () => {
    if (animal) {
      animalLibrary.playSound(animal.id, 'sfx');
    }
  };

  const backgroundColor = animal?.image.colorBg || '#FEF3C7';
  const emoji = animal?.emoji || '🐾';
  const emojiSize = Math.max(16, Math.round(size * 0.52));

  const content = (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: calculatedRadius,
          backgroundColor,
        },
        style,
      ]}
    >
      {imageSource ? (
        <>
          <Image
            source={imageSource}
            style={[
              styles.image,
              {
                width: size,
                height: size,
                borderRadius: calculatedRadius,
              },
              imageStyle,
            ]}
            resizeMode="cover"
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setLoadError(true);
              setIsLoading(false);
            }}
          />
          {isLoading && !animal?.image.local3D && (
            <View style={[styles.loadingOverlay, { borderRadius: calculatedRadius }]}>
              <ActivityIndicator size="small" color="#F59E0B" />
            </View>
          )}
        </>
      ) : (
        // Tầng 3 Fallback: Emoji To Rõ + Màu Nền Pastel An Toàn
        <View style={styles.fallbackContainer} testID={`${testID}-fallback`}>
          <Text style={[styles.fallbackEmoji, { fontSize: emojiSize }]}>
            {emoji}
          </Text>
        </View>
      )}

      {/* Huy hiệu nhỏ (nếu bật) */}
      {showBadge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{emoji}</Text>
        </View>
      )}

      {/* Nút loa phát âm thanh */}
      {showSoundButton && (
        <TouchableOpacity
          style={styles.soundButton}
          onPress={handleSoundBtnPress}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.soundButtonIcon}>🔊</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress || enableSoundOnPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.82}
        accessibilityRole="button"
        accessibilityLabel={animal ? animal.nameVi : 'Động vật'}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackEmoji: {
    textAlign: 'center',
    includeFontPadding: false,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  badgeText: {
    fontSize: 12,
  },
  soundButton: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  soundButtonIcon: {
    fontSize: 11,
  },
});

export default AnimalImage;
