import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { soundManager } from '../SoundPlayer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TOM_IMG = require('../../assets/images/tom_3d.jpg');
const MIMI_IMG = require('../../assets/images/mimi_3d.jpg');

export interface CinemaEntity {
  id: string;
  nameVi: string;
  badgeIcon: string;
  youtubeVideoId: string;
  youtubeVideoTitleVi: string;
  funFactVi?: string;
  imageSource?: any;
}

/**
 * Tự động trích xuất mã ID 11 ký tự từ bất kỳ định dạng link YouTube nào
 * Hỗ trợ: https://youtube.com/watch?v=xxx, https://youtu.be/xxx, hoặc mã ID trực tiếp
 */
export const extractYoutubeId = (urlOrId: string): string => {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : trimmed;
};

interface Props {
  visible: boolean;
  entity: CinemaEntity | null;
  onClose: () => void;
  onReward?: () => void;
}

export const NatureCinemaModal: React.FC<Props> = ({
  visible,
  entity,
  onClose,
  onReward,
}) => {
  const [playing, setPlaying] = useState<boolean>(true);
  const [hasRewarded, setHasRewarded] = useState<boolean>(false);

  // Tính toán kích thước 16:9 chuẩn
  const modalWidth = Math.min(SCREEN_WIDTH - 32, 520);
  const videoHeight = Math.round((modalWidth - 24) * (9 / 16));

  useEffect(() => {
    if (visible && entity) {
      setPlaying(true);
      setHasRewarded(false);
      soundManager.speak(
        `Chào mừng bé đến với rạp chiếu phim Rừng Xanh! Cùng xem thước phim thật về ${entity.nameVi} nhé!`,
        'vi'
      );
    } else {
      setPlaying(false);
    }
  }, [visible, entity]);

  const handleStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      soundManager.speak(
        'Hoan hô bé đã xem hết thước phim khoa học bổ ích! Bé nhận được thêm 5 sao thám hiểm nhé!',
        'vi'
      );
    }
  }, []);

  const handleClaimReward = () => {
    if (!hasRewarded) {
      setHasRewarded(true);
      if (onReward) {
        onReward();
      }
      soundManager.speak('Chúc mừng bé nhận được 5 sao thám hiểm!', 'vi');
    }
  };

  const handleClose = () => {
    setPlaying(false);
    onClose();
  };

  if (!entity) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.container, { maxWidth: modalWidth }]}>
          {/* Header Rạp Phim */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>🎬 RẠP PHIM THÁM HIỂM NHÍ</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              activeOpacity={0.8}
              onPress={handleClose}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tiêu đề thước phim */}
          <View style={styles.titleRow}>
            <Text style={styles.entityEmoji}>{entity.badgeIcon}</Text>
            <View style={styles.titleTextBox}>
              <Text style={styles.videoMainTitle} numberOfLines={2}>
                {entity.youtubeVideoTitleVi}
              </Text>
              <Text style={styles.entitySubTitle}>Loài: {entity.nameVi}</Text>
            </View>
          </View>

          {/* Khung phát YouTube an toàn */}
          <View style={[styles.playerWrapper, { height: videoHeight }]}>
            <YoutubePlayer
              height={videoHeight}
              play={playing}
              videoId={extractYoutubeId(entity.youtubeVideoId)}
              onChangeState={handleStateChange}
              initialPlayerParams={{
                preventFullScreen: false,
                controls: true,
                modestbranding: true,
                rel: false,
              }}
            />
          </View>

          {/* Bảng điều khiển & Tom, MiMi đối thoại */}
          <View style={styles.footerSection}>
            {/* Hàng nút bấm chức năng */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.playPauseBtn}
                activeOpacity={0.8}
                onPress={() => setPlaying((prev) => !prev)}
              >
                <Text style={styles.playPauseText}>
                  {playing ? '⏸️ Tạm Dừng' : '▶️ Tiếp Tục Phát'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.rewardBtn,
                  hasRewarded && styles.rewardBtnClaimed,
                ]}
                activeOpacity={0.8}
                onPress={handleClaimReward}
                disabled={hasRewarded}
              >
                <Text style={styles.rewardBtnText}>
                  {hasRewarded ? '✅ Đã Nhận +5 ⭐' : '⭐ Nhận +5 Sao'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Khung đối thoại Tom & MiMi */}
            <View style={styles.dialogueRow}>
              <Image source={TOM_IMG} style={styles.avatarImg} />
              <View style={styles.speechBubble}>
                <Text style={styles.speechSpeaker}>👦 Bé Tom & 👧 Bé MiMi:</Text>
                <Text style={styles.speechText} numberOfLines={2}>
                  {entity.funFactVi ||
                    `Bé thấy ${entity.nameVi} ngoài đời thực chuyển động sinh động không nè?`}
                </Text>
              </View>
              <Image source={MIMI_IMG} style={styles.avatarImg} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    backgroundColor: '#0F2613',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFD700',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    backgroundColor: '#1B4D24',
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: '#2E7D32',
  },
  headerBadge: {
    backgroundColor: '#C62828',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#143818',
  },
  entityEmoji: {
    fontSize: 26,
    marginRight: 10,
  },
  titleTextBox: {
    flex: 1,
  },
  videoMainTitle: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  entitySubTitle: {
    color: '#A5D6A7',
    fontSize: 11,
    marginTop: 2,
  },
  playerWrapper: {
    width: '100%',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerSection: {
    padding: 12,
    backgroundColor: '#0C2010',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  playPauseBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#81C784',
  },
  playPauseText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rewardBtn: {
    flex: 1,
    backgroundColor: '#FF8F00',
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  rewardBtnClaimed: {
    backgroundColor: '#2E7D32',
    borderColor: '#81C784',
    opacity: 0.85,
  },
  rewardBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dialogueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  speechBubble: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
  },
  speechSpeaker: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  speechText: {
    color: '#E0E0E0',
    fontSize: 11,
    lineHeight: 15,
  },
});
