import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';
import { NatureMagnifierModal } from '../components/explorer/NatureMagnifierModal';
import { NatureFeedingModal } from '../components/explorer/NatureFeedingModal';
import { NatureLifeCycleModal } from '../components/explorer/NatureLifeCycleModal';
import { NatureCinemaModal, CinemaEntity } from '../components/explorer/NatureCinemaModal';
import { natureExplorerService } from '../services/natureExplorerService';

const ELEPHANT_3D_IMG = require('../assets/images/baby_elephant_3d.jpg');
const PITCHER_PLANT_3D_IMG = require('../assets/images/pitcher_plant_3d.jpg');
const CHAMELEON_3D_IMG = require('../assets/images/chameleon_3d.jpg');
const TOM_3D_IMG = require('../assets/images/tom_3d.jpg');
const MIMI_3D_IMG = require('../assets/images/mimi_3d.jpg');
const BUTTERFLY_3D_IMG = require('../assets/images/butterfly_3d.jpg');
const MIMOSA_PLANT_3D_IMG = require('../assets/images/mimosa_plant_3d.jpg');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================================
// 🌴 DỮ LIỆU MÀN 1: KHU RỪNG MƯA NHIỆT ĐỚI (TROPICAL RAINFOREST)
// ============================================================

export type InteractionType = 'MAGNIFIER' | 'FEEDING' | 'LIFE_CYCLE' | 'TOUCH_SHRINK' | 'WATER_SPRAY';

export interface RainforestEntity {
  id: string;
  nameVi: string;
  scientificName: string;
  category: 'ANIMAL' | 'PLANT';
  emoji: string;
  imageSource?: any;
  sceneId: 'rainforest_floor' | 'rainforest_canopy';
  tagline: string;
  posX: number; // % ngang
  posY: number; // % dọc
  badgeIcon: string;
  interactionType: InteractionType;
  funFactVi: string;
  dialogueIntroVi: string;
  youtubeVideoId?: string;
  youtubeVideoTitleVi?: string;
}

const RAINFOREST_ENTITIES: RainforestEntity[] = [
  // --- CẢNH 1: THẢM RỪNG ẨM ƯỚT ---
  {
    id: 'chameleon',
    nameVi: 'Tắc Kè Hoa Ngụy Trang',
    scientificName: 'Chamaeleonidae',
    category: 'ANIMAL',
    emoji: '🦎',
    imageSource: CHAMELEON_3D_IMG,
    sceneId: 'rainforest_floor',
    tagline: 'Bậc thầy thay đổi màu áo ngụy trang',
    posX: 50,
    posY: 12,
    badgeIcon: '🎨',
    interactionType: 'MAGNIFIER',
    youtubeVideoId: 'ioblgpA5eTo',
    youtubeVideoTitleVi: 'Khoảnh Khắc Tắc Kè Hoa Đổi Màu Da Kỳ Ảo',
    funFactVi:
      'Làn da của tắc kè hoa có các tế bào tinh thể phản chiếu ánh sáng đặc biệt. Bạn ấy đổi màu áo trùng với màu cành lá để hòa mình vào thiên nhiên, tránh kẻ thù săn mồi!',
    dialogueIntroVi:
      'Bạn Tắc Kè Hoa đang ẩn nấp trên cành lá kìa! Bé hãy dùng kính lúp của anh Tom để tìm bạn ấy nhé!',
  },
  {
    id: 'elephant',
    nameVi: 'Chú Voi Con Bên Suối',
    scientificName: 'Elephas maximus',
    category: 'ANIMAL',
    emoji: '🐘',
    imageSource: ELEPHANT_3D_IMG,
    sceneId: 'rainforest_floor',
    tagline: 'Chiếc vòi siêu năng lực phun mưa',
    posX: 22,
    posY: 46,
    badgeIcon: '🚿',
    interactionType: 'WATER_SPRAY',
    youtubeVideoId: 'dGgtu1i5tmg',
    youtubeVideoTitleVi: 'Chú Voi Con Tắm Suối & Phun Mưa Cầu Vồng',
    funFactVi:
      'Vòi voi có tới hơn 40.000 bó cơ linh hoạt! Voi dùng vòi để hút nước suối tắm mát, ngửi mùi từ xa hàng cây số, và cầm nắm từng cọng cỏ non như bàn tay con người.',
    dialogueIntroVi:
      'Bạn Voi con đang khát nước bên bờ suối! Bé chạm vào vòi voi để cùng hút nước phun mưa tắm mát nào!',
  },
  {
    id: 'pitcher_plant',
    nameVi: 'Cây Nắp Ấm Bắt Mồi',
    scientificName: 'Nepenthes',
    category: 'PLANT',
    emoji: '🪴',
    imageSource: PITCHER_PLANT_3D_IMG,
    sceneId: 'rainforest_floor',
    tagline: 'Chiếc bình bẫy mồi thơm ngọt',
    posX: 78,
    posY: 46,
    badgeIcon: '🍯',
    interactionType: 'FEEDING',
    youtubeVideoId: 'womW1y-b_1E',
    youtubeVideoTitleVi: 'Cận Cảnh Cây Nắp Ấm Bắt Côn Trùng Bằng Mật Ngọt',
    funFactVi:
      'Vì đất rừng nhiệt đới nghèo chất dinh dưỡng, cây nắp ấm đã biến đổi lá thành chiếc bình trơn trượt có nắp đậy và hương thơm mật ngọt để bẫy côn trùng bổ sung chất đạm!',
    dialogueIntroVi:
      'Oa! Cây nắp ấm đang mở nắp bình thơm ngọt chờ mồi. Bé kéo chú ruồi thả vào miệng bình cho cây nhé!',
  },

  // --- CẢNH 2: TÁN CÂY & SUỐI RỪNG ---
  {
    id: 'sensitive_plant',
    nameVi: 'Cây Xấu Hổ (Trinh Nữ)',
    scientificName: 'Mimosa pudica',
    category: 'PLANT',
    emoji: '🌸',
    imageSource: MIMOSA_PLANT_3D_IMG,
    sceneId: 'rainforest_canopy',
    tagline: 'Chiếc lá khép lại khi khẽ chạm',
    posX: 28,
    posY: 38,
    badgeIcon: '🌸',
    interactionType: 'TOUCH_SHRINK',
    youtubeVideoId: 'g0LFBM3hOLs',
    youtubeVideoTitleVi: 'Cây Xấu Hổ (Hoa Trinh Nữ) E Thẹn Khép Lá Khi Chạm',
    funFactVi:
      'Khi bị chạm vào hoặc có gió mạnh, các tế bào ở cuống lá cây xấu hổ lập tức xẹp nước, khiến toàn bộ cành lá khép chặt rủ xuống như e thẹn để tự vệ khỏi động vật ăn cỏ!',
    dialogueIntroVi:
      'Bé chạm khẽ ngón tay vào bụi lá cây xấu hổ xem bạn ấy e thẹn khép cành lại như thế nào nhé!',
  },
  {
    id: 'butterfly',
    nameVi: 'Bướm Rừng Nhiệt Đới',
    scientificName: 'Morpho peleides',
    category: 'ANIMAL',
    emoji: '🦋',
    imageSource: BUTTERFLY_3D_IMG,
    sceneId: 'rainforest_canopy',
    tagline: 'Vòng đời hóa bướm 4 giai đoạn',
    posX: 72,
    posY: 28,
    badgeIcon: '✨',
    interactionType: 'LIFE_CYCLE',
    youtubeVideoId: 'ocWgSgMGxOc',
    youtubeVideoTitleVi: 'Thước Phim Quay Chậm: Bướm Rừng Hóa Hình Từ Kén',
    funFactVi:
      'Bướm trải qua 4 giai đoạn biến thái hoàn toàn: Trứng bé xíu ➔ Sâu ăn lá rào rạo ➔ Kén tằm ngủ say ➔ Bướm ngũ sắc bung cánh bay lượn trên nền trời rừng mưa!',
    dialogueIntroVi:
      'Bé có biết chú bướm ngũ sắc xinh đẹp này lớn lên như thế nào không? Cùng anh Tom kéo thanh trượt thời gian nhé!',
  },
];

const getMergedRainforestEntities = (): RainforestEntity[] => {
  const configs = natureExplorerService.getNatureVideoConfigs();
  const configMap = new Map(configs.map((c) => [c.id, c]));

  return RAINFOREST_ENTITIES.map((entity) => {
    const custom = configMap.get(entity.id);
    if (custom) {
      return {
        ...entity,
        youtubeVideoId: custom.youtubeVideoId,
        youtubeVideoTitleVi: custom.youtubeVideoTitleVi,
      };
    }
    return entity;
  });
};

interface Props {
  onClose: () => void;
}

export const NatureExplorerGameScreen: React.FC<Props> = ({ onClose }) => {
  // Danh sách sinh vật (được đồng bộ cấu hình video từ Admin Dashboard)
  const [entities, setEntities] = useState<RainforestEntity[]>(getMergedRainforestEntities);

  useEffect(() => {
    setEntities(getMergedRainforestEntities());
  }, []);

  // Cảnh hiện tại (Cảnh 1: Thảm rừng | Cảnh 2: Tán cây & suối)
  const [currentSceneId, setCurrentSceneId] = useState<'rainforest_floor' | 'rainforest_canopy'>(
    'rainforest_floor'
  );

  // Mở khóa huy hiệu & Sao
  const [unlockedIds, setUnlockedIds] = useState<string[]>(['elephant']);
  const [stars, setStars] = useState<number>(25);

  // Modals tương tác con
  const [showMagnifier, setShowMagnifier] = useState<boolean>(false);
  const [showFeeding, setShowFeeding] = useState<boolean>(false);
  const [showLifeCycle, setShowLifeCycle] = useState<boolean>(false);
  const [showFieldGuide, setShowFieldGuide] = useState<boolean>(false);
  const [selectedCinemaEntity, setSelectedCinemaEntity] = useState<CinemaEntity | null>(null);
  const [showCinemaModal, setShowCinemaModal] = useState<boolean>(false);

  // Hiệu ứng tương tác trực tiếp trên màn
  const [isPlantShrunk, setIsPlantShrunk] = useState<boolean>(false);
  const [isElephantSpraying, setIsElephantSpraying] = useState<boolean>(false);

  // Thanh đối thoại Tom & MiMi
  const [dialogue, setDialogue] = useState<{ speaker: 'tom' | 'mimi'; text: string }>({
    speaker: 'tom',
    text: 'Chào mừng bé đến với Rừng Mưa Nhiệt Đới! Bé hãy chạm vào các bạn thú và cây cối để cùng khám phá nhé!',
  });

  // Animations
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const pulseGlow = useRef(new Animated.Value(0.4)).current;
  const bounceElephant = useRef(new Animated.Value(1)).current;
  const bouncePitcher = useRef(new Animated.Value(1)).current;
  const bounceChameleon = useRef(new Animated.Value(1)).current;
  const bouncePlant = useRef(new Animated.Value(1)).current;
  const bounceButterfly = useRef(new Animated.Value(1)).current;

  // Hoạt ảnh phun nước vòi voi
  const waterSprayAnim = useRef(new Animated.Value(0)).current;

  // Hoạt ảnh cây xấu hổ khép lá
  const plantShrinkAnim = useRef(new Animated.Value(1)).current;

  // Lặp hoạt ảnh thở & hào quang
  useEffect(() => {
    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.06,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1.0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseGlow, {
          toValue: 0.85,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseGlow, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    breatheLoop.start();
    glowLoop.start();

    soundManager.speak(
      'Biệt Đội Khám Phá Nhí xin chào bé! Chúng mình đang ở Khu Rừng Mưa Nhiệt Đới kỳ diệu!',
      'vi'
    );

    return () => {
      breatheLoop.stop();
      glowLoop.stop();
    };
  }, [breatheAnim, pulseGlow]);

  // Chuyển cảnh chơi (Scene Switcher)
  const switchScene = (sceneId: 'rainforest_floor' | 'rainforest_canopy') => {
    setCurrentSceneId(sceneId);
    if (sceneId === 'rainforest_floor') {
      setDialogue({
        speaker: 'tom',
        text: 'Bé đã đến Cảnh 1: Thảm Rừng Ẩm Ướt! Có bạn Tắc Kè, Cây Nắp Ấm và bạn Voi kìa!',
      });
      soundManager.speak('Cảnh 1: Thảm Rừng Ẩm Ướt. Bé hãy chạm vào các bạn sinh vật nhé!', 'vi');
    } else {
      setDialogue({
        speaker: 'mimi',
        text: 'Oa, Cảnh 2: Tán Cây Cổ Thụ & Suối Rừng! Có cây xấu hổ e thẹn và bướm xinh bay lượn!',
      });
      soundManager.speak('Cảnh 2: Tán Cây Cổ Thụ. Bé hãy chạm vào cành lá và bướm rừng nhé!', 'vi');
    }
  };

  // Mở khóa huy hiệu sinh vật
  const unlockEntity = useCallback((id: string, bonusStars: number = 10) => {
    setUnlockedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setStars((prev) => prev + bonusStars);
  }, []);

  // Mở rạp chiếu phim YouTube an toàn cho bé
  const openCinema = (entity: RainforestEntity) => {
    const videoConfig = natureExplorerService.getVideoForEntity(entity.id);
    const videoId = videoConfig.youtubeVideoId || entity.youtubeVideoId;
    const videoTitle = videoConfig.youtubeVideoTitleVi || entity.youtubeVideoTitleVi || entity.nameVi;

    if (videoId) {
      setSelectedCinemaEntity({
        id: entity.id,
        nameVi: entity.nameVi,
        badgeIcon: entity.badgeIcon,
        youtubeVideoId: videoId,
        youtubeVideoTitleVi: videoTitle,
        funFactVi: entity.funFactVi,
        imageSource: entity.imageSource,
      });
      setShowCinemaModal(true);
    }
  };

  // Xử lý khi chạm vào sinh vật
  const handleTapEntity = (entity: RainforestEntity) => {
    // 1. Tắc Kè Hoa -> Kính lúp
    if (entity.id === 'chameleon') {
      triggerBounce(bounceChameleon);
      setDialogue({ speaker: 'tom', text: entity.dialogueIntroVi });
      setTimeout(() => setShowMagnifier(true), 250);
      return;
    }

    // 2. Cây Nắp Ấm -> Kéo thả thức ăn
    if (entity.id === 'pitcher_plant') {
      triggerBounce(bouncePitcher);
      setDialogue({ speaker: 'mimi', text: entity.dialogueIntroVi });
      setTimeout(() => setShowFeeding(true), 250);
      return;
    }

    // 3. Voi Con -> Phun nước mát rượi
    if (entity.id === 'elephant') {
      triggerBounce(bounceElephant);
      triggerElephantWaterSpray();
      return;
    }

    // 4. Cây Xấu Hổ -> Chạm phản xạ khép lá
    if (entity.id === 'sensitive_plant') {
      triggerBounce(bouncePlant);
      triggerSensitivePlantShrink();
      return;
    }

    // 5. Bướm Nhiệt Đới -> Vòng đời sinh trưởng
    if (entity.id === 'butterfly') {
      triggerBounce(bounceButterfly);
      setDialogue({ speaker: 'tom', text: entity.dialogueIntroVi });
      setTimeout(() => setShowLifeCycle(true), 250);
      return;
    }
  };

  const triggerBounce = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1.15, friction: 3, tension: 40, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1.0, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  // Kích hoạt Voi phun nước
  const triggerElephantWaterSpray = () => {
    setIsElephantSpraying(true);
    waterSprayAnim.setValue(0);

    Animated.timing(waterSprayAnim, {
      toValue: 1,
      duration: 1800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsElephantSpraying(false);
    });

    setDialogue({
      speaker: 'tom',
      text: 'Pa-ooom! Bạn Voi vừa hút nước suối và phun mưa cầu vồng mát rượi kìa bé ơi!',
    });
    soundManager.speak(
      'Pa-ooom! Bạn Voi vừa hút nước suối và phun mưa cầu vồng tắm mát! Vòi voi thật là kỳ diệu!',
      'vi'
    );
    unlockEntity('elephant', 5);
  };

  // Kích hoạt Cây xấu hổ khép lá
  const triggerSensitivePlantShrink = () => {
    const nextShrunk = !isPlantShrunk;
    setIsPlantShrunk(nextShrunk);

    Animated.sequence([
      Animated.timing(plantShrinkAnim, {
        toValue: nextShrunk ? 0.55 : 1.0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(plantShrinkAnim, {
        toValue: nextShrunk ? 0.65 : 1.0,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    if (nextShrunk) {
      setDialogue({
        speaker: 'mimi',
        text: 'Ôi bạn cây xấu hổ e thẹn đã khép chặt lá lại rồi! Đó là cách bạn ấy tự vệ đấy bé!',
      });
      soundManager.speak(
        'Xào xạc! Bé vừa chạm tay vào, cây xấu hổ liền lập tức khép chặt cành lá lại để tự bảo vệ mình!',
        'vi'
      );
      unlockEntity('sensitive_plant', 10);
    } else {
      setDialogue({
        speaker: 'tom',
        text: 'Hết nguy hiểm rồi, cành lá cây xấu hổ lại từ từ xòe rộng đón ánh nắng ấm áp!',
      });
      soundManager.speak('Cành lá cây xấu hổ lại từ từ xòe rộng đón ánh nắng ấm áp!', 'vi');
    }
  };

  // Danh sách sinh vật theo Cảnh hiện tại
  const visibleEntities = entities.filter((e) => e.sceneId === currentSceneId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2F16" />

      {/* ============================================================ */}
      {/* 🧭 HEADER ĐIỀU HƯỚNG & TIẾN ĐỘ THÁM HIỂM */}
      {/* ============================================================ */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={onClose}>
          <Text style={styles.backIconText}>⬅️</Text>
          <Text style={styles.backButtonLabel}>Trở Về</Text>
        </TouchableOpacity>

        {/* Tab chuyển cảnh Cảnh 1 & Cảnh 2 */}
        <View style={styles.sceneSwitcher}>
          <TouchableOpacity
            style={[
              styles.sceneTab,
              currentSceneId === 'rainforest_floor' && styles.sceneTabActive,
            ]}
            activeOpacity={0.8}
            onPress={() => switchScene('rainforest_floor')}
          >
            <Text style={styles.sceneTabEmoji}>🏞️</Text>
            <Text
              style={[
                styles.sceneTabText,
                currentSceneId === 'rainforest_floor' && styles.sceneTabTextActive,
              ]}
            >
              Cảnh 1: Thảm Rừng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sceneTab,
              currentSceneId === 'rainforest_canopy' && styles.sceneTabActive,
            ]}
            activeOpacity={0.8}
            onPress={() => switchScene('rainforest_canopy')}
          >
            <Text style={styles.sceneTabEmoji}>🌳</Text>
            <Text
              style={[
                styles.sceneTabText,
                currentSceneId === 'rainforest_canopy' && styles.sceneTabTextActive,
              ]}
            >
              Cảnh 2: Tán Cây
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nút Sổ Bách Khoa, Rạp Phim & Sao */}
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.headerCinemaButton}
            activeOpacity={0.8}
            onPress={() => {
              const targetEntity = visibleEntities[0] || entities[0];
              openCinema(targetEntity);
            }}
          >
            <Text style={styles.headerCinemaIcon}>🎬</Text>
            <Text style={styles.headerCinemaText}>Phim</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fieldGuideButton}
            activeOpacity={0.8}
            onPress={() => setShowFieldGuide(true)}
          >
            <Text style={styles.fieldGuideIcon}>🎒</Text>
            <View style={styles.badgeCountPill}>
              <Text style={styles.badgeCountText}>{unlockedIds.length}/5</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.starsPill}>
            <Text style={styles.starsEmoji}>⭐</Text>
            <Text style={styles.starsText}>{stars}</Text>
          </View>
        </View>
      </View>

      {/* ============================================================ */}
      {/* 🏞️ KHÔNG GIAN CẢNH RỪNG MƯA & THỰC THỂ TƯƠNG TÁC */}
      {/* ============================================================ */}
      <View style={styles.sceneViewport}>
        {/* Lớp bầu trời & ánh nắng */}
        <View style={styles.jungleSkyLayer}>
          <Text style={styles.sunEmoji}>☀️</Text>
          <Text style={styles.cloudEmoji1}>☁️</Text>
          <Text style={styles.cloudEmoji2}>⛅</Text>
          <View style={styles.sunbeamRays} />
        </View>

        {/* Cây cối tán rừng hậu cảnh */}
        <View style={styles.jungleMidground}>
          <Text style={styles.bgTree1}>🌴</Text>
          <Text style={styles.bgTree2}>🌳</Text>
          <Text style={styles.bgTree3}>🌲</Text>
          <Text style={styles.bgTree4}>🌴</Text>
          <Text style={styles.bgVine1}>🌿</Text>
          <Text style={styles.bgVine2}>🍃</Text>
          {currentSceneId === 'rainforest_canopy' && (
            <Text style={styles.waterfallEmoji}>🏞️ Suối Rừng Róc Rách</Text>
          )}
        </View>

        {/* Sân chơi thực thể con vật & cây cối */}
        <View style={styles.jungleGroundPlayfield}>
          {visibleEntities.map((entity) => {
            const isUnlocked = unlockedIds.includes(entity.id);

            // Gán hoạt ảnh nhún nảy tương ứng
            const bounceAnim =
              entity.id === 'elephant'
                ? bounceElephant
                : entity.id === 'pitcher_plant'
                ? bouncePitcher
                : entity.id === 'chameleon'
                ? bounceChameleon
                : entity.id === 'sensitive_plant'
                ? bouncePlant
                : bounceButterfly;

            return (
              <Animated.View
                key={entity.id}
                style={[
                  styles.hotspotContainer,
                  {
                    left: `${entity.posX}%`,
                    top: `${entity.posY}%`,
                    transform: [{ scale: bounceAnim }],
                  },
                ]}
              >
                {/* Vòng hào quang phát sáng */}
                <Animated.View
                  style={[
                    styles.pulseRing,
                    {
                      opacity: pulseGlow,
                      transform: [{ scale: breatheAnim }],
                    },
                  ]}
                />

                {/* Nút xem phim YouTube trực tiếp ngay trên sinh vật */}
                {entity.youtubeVideoId && (
                  <TouchableOpacity
                    style={styles.entityCinemaBadge}
                    activeOpacity={0.8}
                    onPress={() => openCinema(entity)}
                  >
                    <Text style={styles.entityCinemaBadgeIcon}>🎬</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleTapEntity(entity)}
                  style={styles.spriteTouchTarget}
                >
                  {/* Entity hình ảnh 3D hoặc tương tác */}
                  {entity.id === 'sensitive_plant' ? (
                    <Animated.View
                      style={[
                        styles.spriteTouchTarget,
                        { transform: [{ scale: plantShrinkAnim }] },
                      ]}
                    >
                      <Image
                        source={MIMOSA_PLANT_3D_IMG}
                        style={[
                          styles.spriteImage,
                          isPlantShrunk && styles.plantShrunkImage,
                        ]}
                        resizeMode="cover"
                      />
                      <View style={[styles.plantStatePill, isPlantShrunk && styles.plantStatePillShrunk]}>
                        <Text style={styles.plantStateText}>
                          {isPlantShrunk ? '🌸 Khép lá e thẹn' : '👆 Chạm khẽ lá'}
                        </Text>
                      </View>
                    </Animated.View>
                  ) : entity.id === 'butterfly' ? (
                    <View style={styles.spriteTouchTarget}>
                      <Image
                        source={BUTTERFLY_3D_IMG}
                        style={styles.spriteImage}
                        resizeMode="cover"
                      />
                      <View style={styles.butterflyVibePill}>
                        <Text style={styles.plantStateText}>🦋 Vòng Đời 4 Bước</Text>
                      </View>
                    </View>
                  ) : entity.imageSource ? (
                    <Image source={entity.imageSource} style={styles.spriteImage} resizeMode="cover" />
                  ) : (
                    <Text style={styles.guideItemEmoji}>{entity.emoji}</Text>
                  )}

                  {/* Nhãn tên sinh vật */}
                  <View style={styles.nameTagBadge}>
                    <Text style={styles.badgeEmoji}>{entity.badgeIcon}</Text>
                    <Text style={styles.nameTagText}>{entity.nameVi}</Text>
                    {isUnlocked && <Text style={styles.unlockedStar}>⭐</Text>}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}

          {/* Hiệu ứng Vòi voi phun nước cầu vồng */}
          {isElephantSpraying && (
            <Animated.View
              style={[
                styles.waterSprayOverlay,
                {
                  opacity: waterSprayAnim,
                  transform: [
                    {
                      scale: waterSprayAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.3],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.rainbowArc}>🌈 CẦU VỒNG NƯỚC MÁT!</Text>
              <Text style={styles.dropletsText}>💧 💦 🫧 💦 💧 🫧</Text>
            </Animated.View>
          )}
        </View>

        {/* Nút lật cảnh nhanh ở 2 mép màn hình */}
        <TouchableOpacity
          style={[styles.quickSceneArrow, styles.quickSceneArrowLeft]}
          onPress={() =>
            switchScene(
              currentSceneId === 'rainforest_floor' ? 'rainforest_canopy' : 'rainforest_floor'
            )
          }
        >
          <Text style={styles.quickArrowText}>
            {currentSceneId === 'rainforest_floor' ? 'Đến Cảnh 2 ➡️' : '⬅️ Về Cảnh 1'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ============================================================ */}
      {/* 👦👧 DẢI ĐỐI THOẠI BÉ TOM & BÉ MIMI */}
      {/* ============================================================ */}
      <View style={styles.duoFooterContainer}>
        {/* Nhân vật Bé MiMi */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            soundManager.speak('Em MiMi chào bé! Chúc bé khám phá thật nhiều điều kỳ thú nhé!', 'vi');
          }}
          style={styles.avatarBox}
        >
          <Image source={MIMI_3D_IMG} style={styles.duoAvatarImg} />
          <Text style={styles.avatarLabel}>👧 Bé MiMi</Text>
        </TouchableOpacity>

        {/* Bong bóng thoại dẫn dắt */}
        <View style={styles.speechBubbleCard}>
          <Text style={styles.speechSpeakerName}>
            {dialogue.speaker === 'tom' ? '👦 Bé Tom dẫn chuyện:' : '👧 Bé MiMi hỏi bé:'}
          </Text>
          <ScrollView style={styles.speechScrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.speechBubbleText}>{dialogue.text}</Text>
          </ScrollView>
        </View>

        {/* Nhân vật Bé Tom */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            soundManager.speak('Anh Tom đây! Thiên nhiên quanh ta có biết bao bí mật thú vị!', 'vi');
          }}
          style={styles.avatarBox}
        >
          <Image source={TOM_3D_IMG} style={styles.duoAvatarImg} />
          <Text style={styles.avatarLabel}>👦 Bé Tom</Text>
        </TouchableOpacity>
      </View>

      {/* ============================================================ */}
      {/* 🎒 SỔ TAY BÁCH KHOA TOÀN THƯ (FIELD GUIDE MODAL) */}
      {/* ============================================================ */}
      <Modal
        visible={showFieldGuide}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFieldGuide(false)}
      >
        <View style={styles.fieldGuideOverlay}>
          <View style={styles.fieldGuideContainer}>
            <View style={styles.fieldGuideHeader}>
              <Text style={styles.fieldGuideTitle}>🎒 SỔ TAY BÁCH KHOA RỪNG MƯA</Text>
              <TouchableOpacity
                style={styles.closeGuideBtn}
                onPress={() => setShowFieldGuide(false)}
              >
                <Text style={styles.closeGuideBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.fieldGuideList}>
              {entities.map((item) => {
                const isFound = unlockedIds.includes(item.id);
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.guideCard,
                      isFound ? styles.guideCardFound : styles.guideCardLocked,
                    ]}
                  >
                    <View style={styles.guideCardTopRow}>
                      {item.imageSource ? (
                        <Image source={item.imageSource} style={styles.guideThumb3d} resizeMode="cover" />
                      ) : (
                        <Text style={styles.guideItemEmoji}>{item.emoji}</Text>
                      )}
                      <View style={styles.guideCardTitles}>
                        <Text style={styles.guideNameVi}>{item.nameVi}</Text>
                        <Text style={styles.guideScientific}>{item.scientificName}</Text>
                      </View>
                      <View style={styles.guideStatusBadge}>
                        <Text style={styles.guideStatusText}>
                          {isFound ? '⭐ Đã Khám Phá' : '🔒 Chưa Mở'}
                        </Text>
                      </View>
                    </View>

                    {isFound ? (
                      <View style={styles.guideFunFactBox}>
                        <Text style={styles.guideFunFactText}>{item.funFactVi}</Text>
                        <View style={styles.guideActionRow}>
                          <TouchableOpacity
                            style={styles.listenVoiceBtn}
                            onPress={() => soundManager.speak(item.funFactVi, 'vi')}
                          >
                            <Text style={styles.listenVoiceText}>🔊 Nghe thuyết minh</Text>
                          </TouchableOpacity>
                          {item.youtubeVideoId && (
                            <TouchableOpacity
                              style={styles.watchCinemaBtn}
                              activeOpacity={0.8}
                              onPress={() => openCinema(item)}
                            >
                              <Text style={styles.watchCinemaBtnText}>🎬 Xem Thước Phim Thật</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.guideLockedHint}>
                        👉 Bé hãy đến {item.sceneId === 'rainforest_floor' ? 'Cảnh 1' : 'Cảnh 2'} và chạm vào bạn ấy để mở khóa nhé!
                      </Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* 🎮 CÁC MODAL MINI-GAME TƯƠNG TÁC CON */}
      {/* ============================================================ */}
      {/* 1. Kính Lúp Thám Tử Tìm Tắc Kè */}
      <NatureMagnifierModal
        visible={showMagnifier}
        onClose={() => setShowMagnifier(false)}
        onSuccess={() => unlockEntity('chameleon', 15)}
      />

      {/* 2. Kéo Thả Cho Cây Nắp Ấm Ăn */}
      <NatureFeedingModal
        visible={showFeeding}
        onClose={() => setShowFeeding(false)}
        onSuccess={() => unlockEntity('pitcher_plant', 15)}
      />

      {/* 3. Thanh Trượt Vòng Đời Bướm */}
      <NatureLifeCycleModal
        visible={showLifeCycle}
        onClose={() => setShowLifeCycle(false)}
        onSuccess={() => unlockEntity('butterfly', 15)}
      />

      {/* 4. Rạp Chiếu Phim Sinh Học Nhí YouTube (In-Game Cinema) */}
      <NatureCinemaModal
        visible={showCinemaModal}
        entity={selectedCinemaEntity}
        onClose={() => setShowCinemaModal(false)}
        onReward={() => {
          setStars((prev) => prev + 5);
        }}
      />
    </SafeAreaView>
  );
};

// ============================================================
// 🎨 STYLESHEET
// ============================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F2F16',
  },
  headerBar: {
    height: 56,
    backgroundColor: '#163E1B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  backIconText: {
    fontSize: 16,
    marginRight: 4,
  },
  backButtonLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sceneSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 18,
    padding: 3,
  },
  sceneTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  sceneTabActive: {
    backgroundColor: '#4CAF50',
  },
  sceneTabEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  sceneTabText: {
    color: '#B0BEC5',
    fontSize: 11,
    fontWeight: '600',
  },
  sceneTabTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCinemaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C62828',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  headerCinemaIcon: {
    fontSize: 13,
    marginRight: 2,
  },
  headerCinemaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  entityCinemaBadge: {
    position: 'absolute',
    top: -6,
    right: 18,
    backgroundColor: '#C62828',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    zIndex: 35,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  entityCinemaBadgeIcon: {
    fontSize: 14,
  },
  fieldGuideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    marginRight: 8,
  },
  fieldGuideIcon: {
    fontSize: 16,
  },
  badgeCountPill: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 4,
    marginLeft: 4,
  },
  badgeCountText: {
    color: '#1B5E20',
    fontSize: 10,
    fontWeight: 'bold',
  },
  starsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  starsEmoji: {
    fontSize: 13,
    marginRight: 3,
  },
  starsText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sceneViewport: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#1B4D2E',
    overflow: 'hidden',
  },
  jungleSkyLayer: {
    height: 100,
    backgroundColor: '#2E6930',
    position: 'relative',
  },
  sunEmoji: {
    position: 'absolute',
    top: 10,
    right: 30,
    fontSize: 44,
  },
  cloudEmoji1: {
    position: 'absolute',
    top: 20,
    left: 40,
    fontSize: 32,
    opacity: 0.8,
  },
  cloudEmoji2: {
    position: 'absolute',
    top: 35,
    left: 160,
    fontSize: 24,
    opacity: 0.7,
  },
  sunbeamRays: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    height: 100,
    backgroundColor: 'rgba(255, 235, 59, 0.08)',
  },
  jungleMidground: {
    height: 110,
    backgroundColor: '#1E5225',
    position: 'relative',
  },
  bgTree1: { position: 'absolute', bottom: 10, left: 15, fontSize: 48, opacity: 0.7 },
  bgTree2: { position: 'absolute', bottom: 15, left: 110, fontSize: 56, opacity: 0.8 },
  bgTree3: { position: 'absolute', bottom: 8, right: 90, fontSize: 50, opacity: 0.7 },
  bgTree4: { position: 'absolute', bottom: 12, right: 20, fontSize: 44, opacity: 0.8 },
  bgVine1: { position: 'absolute', top: 5, left: 70, fontSize: 26, opacity: 0.6 },
  bgVine2: { position: 'absolute', top: 8, right: 150, fontSize: 24, opacity: 0.6 },
  waterfallEmoji: {
    position: 'absolute',
    top: 20,
    left: '35%',
    color: '#80DEEA',
    fontSize: 13,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 150, 136, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  jungleGroundPlayfield: {
    flex: 1,
    backgroundColor: '#143C1B',
    position: 'relative',
  },
  hotspotContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
    width: 140,
    marginLeft: -70,
  },
  pulseRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    top: -8,
    alignSelf: 'center',
  },
  spriteTouchTarget: {
    alignItems: 'center',
  },
  spriteImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#81C784',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  sensitivePlantCard: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#2E7D32',
    borderWidth: 2,
    borderColor: '#A5D6A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantShrunkImage: {
    opacity: 0.8,
    borderColor: '#E91E63',
  },
  plantStatePill: {
    backgroundColor: 'rgba(46, 125, 50, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 3,
  },
  plantStatePillShrunk: {
    backgroundColor: 'rgba(233, 30, 99, 0.85)',
  },
  plantStateText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  butterflyVibePill: {
    backgroundColor: 'rgba(156, 39, 176, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 3,
  },
  guideThumb3d: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginRight: 10,
    backgroundColor: '#0F2F16',
  },
  plantLargeEmoji: {
    fontSize: 38,
  },
  plantStateLabel: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },
  butterflyCard: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#6A1B9A',
    borderWidth: 2,
    borderColor: '#E1BEE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  butterflyLargeEmoji: {
    fontSize: 40,
  },
  nameTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#81C784',
  },
  badgeEmoji: {
    fontSize: 11,
    marginRight: 3,
  },
  nameTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  unlockedStar: {
    fontSize: 10,
    marginLeft: 3,
  },
  waterSprayOverlay: {
    position: 'absolute',
    top: 50,
    left: '25%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 188, 212, 0.3)',
    padding: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#80DEEA',
    zIndex: 20,
  },
  rainbowArc: {
    color: '#FFEB3B',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowRadius: 4,
    marginBottom: 4,
  },
  dropletsText: {
    fontSize: 26,
  },
  quickSceneArrow: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: '#FFB300',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 30,
  },
  quickSceneArrowLeft: {
    right: 16,
  },
  quickArrowText: {
    color: '#1B5E20',
    fontSize: 12,
    fontWeight: 'bold',
  },
  duoFooterContainer: {
    height: 80,
    backgroundColor: '#0C2611',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopWidth: 2,
    borderTopColor: '#2E7D32',
  },
  avatarBox: {
    alignItems: 'center',
    width: 60,
  },
  duoAvatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  avatarLabel: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  speechBubbleCard: {
    flex: 1,
    backgroundColor: '#1B4D24',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 8,
    height: 64,
    borderWidth: 1,
    borderColor: '#81C784',
  },
  speechSpeakerName: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
  },
  speechScrollView: {
    flex: 1,
  },
  speechBubbleText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
  },
  fieldGuideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  fieldGuideContainer: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '85%',
    backgroundColor: '#1E4620',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFD700',
    overflow: 'hidden',
  },
  fieldGuideHeader: {
    backgroundColor: '#143818',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldGuideTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeGuideBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeGuideBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fieldGuideList: {
    padding: 14,
  },
  guideCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
  },
  guideCardFound: {
    backgroundColor: '#173E1B',
    borderColor: '#4CAF50',
  },
  guideCardLocked: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: '#37474F',
    opacity: 0.7,
  },
  guideCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideItemEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  guideCardTitles: {
    flex: 1,
  },
  guideNameVi: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  guideScientific: {
    color: '#A5D6A7',
    fontSize: 11,
    fontStyle: 'italic',
  },
  guideStatusBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  guideStatusText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  guideFunFactBox: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
  },
  guideFunFactText: {
    color: '#E8F5E9',
    fontSize: 12,
    lineHeight: 17,
  },
  guideActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  listenVoiceBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  listenVoiceText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  watchCinemaBtn: {
    backgroundColor: '#C62828',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF5350',
    alignSelf: 'flex-start',
  },
  watchCinemaBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  guideLockedHint: {
    color: '#CFD8DC',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 6,
  },
});
