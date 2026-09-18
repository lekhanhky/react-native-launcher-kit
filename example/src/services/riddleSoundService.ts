/**
 * Riddle Sound Service - Audio & Real Voice Engine
 * Cung cấp hệ thống đọc thơ diễn cảm và thư viện âm thanh hiệu ứng thực tế cho 100 câu đố
 */

import { soundManager } from '../components/SoundPlayer';
import { RiddleItem } from '../data/riddles100Data';

// Thư viện âm thanh hiệu ứng thực tế (Mixkit High Quality SFX CDN)
const REAL_SOUND_EFFECTS_MAP: Record<string, string> = {
  // Động vật
  chicken: 'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3', // Rooster crow
  dog: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',     // Dog bark
  cat: 'https://assets.mixkit.co/active_storage/sfx/2875/2875-preview.mp3',     // Cat meow
  duck: 'https://assets.mixkit.co/active_storage/sfx/2876/2876-preview.mp3',    // Duck quack
  cow: 'https://assets.mixkit.co/active_storage/sfx/2877/2877-preview.mp3',     // Cow moo
  horse: 'https://assets.mixkit.co/active_storage/sfx/2878/2878-preview.mp3',   // Horse neigh
  lion: 'https://assets.mixkit.co/active_storage/sfx/2879/2879-preview.mp3',    // Lion roar
  elephant: 'https://assets.mixkit.co/active_storage/sfx/2880/2880-preview.mp3',// Elephant trumpet
  frog: 'https://assets.mixkit.co/active_storage/sfx/2881/2881-preview.mp3',    // Frog croak
  owl: 'https://assets.mixkit.co/active_storage/sfx/2882/2882-preview.mp3',     // Owl hoot

  // Phương tiện giao thông
  car: 'https://assets.mixkit.co/active_storage/sfx/1544/1544-preview.mp3',         // Car horn beep
  bicycle: 'https://assets.mixkit.co/active_storage/sfx/2833/2833-preview.mp3',     // Bicycle bell
  motorcycle: 'https://assets.mixkit.co/active_storage/sfx/1545/1545-preview.mp3',  // Motorcycle rev
  train: 'https://assets.mixkit.co/active_storage/sfx/2832/2832-preview.mp3',       // Train horn
  fire_truck: 'https://assets.mixkit.co/active_storage/sfx/1650/1650-preview.mp3',  // Siren
  ambulance: 'https://assets.mixkit.co/active_storage/sfx/1651/1651-preview.mp3',   // Ambulance siren
  police_car: 'https://assets.mixkit.co/active_storage/sfx/1652/1652-preview.mp3',  // Police siren
  airplane: 'https://assets.mixkit.co/active_storage/sfx/1258/1258-preview.mp3',    // Airplane whoosh
  helicopter: 'https://assets.mixkit.co/active_storage/sfx/2834/2834-preview.mp3',  // Helicopter blades

  // Thiên nhiên & Hiện tượng
  rain: 'https://assets.mixkit.co/active_storage/sfx/1249/1249-preview.mp3',        // Rain falling
  lightning: 'https://assets.mixkit.co/active_storage/sfx/1271/1271-preview.mp3',   // Thunder rumble
  wind: 'https://assets.mixkit.co/active_storage/sfx/1254/1254-preview.mp3',        // Wind blowing
  sea: 'https://assets.mixkit.co/active_storage/sfx/1188/1188-preview.mp3',         // Ocean waves
  waterfall: 'https://assets.mixkit.co/active_storage/sfx/1190/1190-preview.mp3',   // Waterfall roar

  // Âm thanh tương tác giao diện (UI FX)
  success_fanfare: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3', // Win fanfare
  magic_hint: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',      // Magic twinkle
  tap_letter: 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3',      // Letter pop
  wrong_choice: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3',    // Cartoon boing
  chest_open: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',      // Treasure chest open
};

class RiddleSoundService {
  /**
   * Ngâm đọc thơ câu đố tiếng Việt với ngữ điệu dịu dàng, tự nhiên
   */
  speakPoem(poemLines: string[]) {
    // Ngắt nhịp giữa các dòng thơ bằng dấu phẩy dài để tạo nhịp điệu ngâm thơ
    const formattedPoem = poemLines.join('... ');
    soundManager.speak(formattedPoem, 'vi');
  }

  /**
   * Đọc câu gợi ý ngắn khi bé bấm Bóng Đèn
   */
  speakHint(hintPoem: string) {
    soundManager.speak(`Gợi ý cho bé: ${hintPoem}`, 'vi');
  }

  /**
   * Phát âm thanh hiệu ứng tương tác (UI FX)
   */
  playPop() {
    soundManager.play(REAL_SOUND_EFFECTS_MAP.tap_letter);
  }

  playMagicHint() {
    soundManager.play(REAL_SOUND_EFFECTS_MAP.magic_hint);
  }

  playWrong() {
    soundManager.play(REAL_SOUND_EFFECTS_MAP.wrong_choice);
    soundManager.speak('Chưa đúng rồi bé ơi, thử lại nào!', 'vi');
  }

  /**
   * Phát âm thanh chiến thắng khi giải đúng + âm thanh thực tế của con vật/phương tiện
   */
  playSuccessReward(riddle: RiddleItem) {
    // 1. Kèn đồng chúc mừng
    soundManager.play(REAL_SOUND_EFFECTS_MAP.success_fanfare);

    // 2. Sau 1.2s phát âm thanh thực tế nếu có
    const sfxUrl = REAL_SOUND_EFFECTS_MAP[riddle.image3DWordId];
    setTimeout(() => {
      if (sfxUrl) {
        soundManager.play(sfxUrl);
      }
      // 3. Đọc to tên đáp án và lời khen ngợi
      setTimeout(() => {
        soundManager.speak(`Chính xác! Đáp án là ${riddle.answer}!`, 'vi');
      }, sfxUrl ? 1500 : 300);
    }, 1200);
  }

  /**
   * Đọc kiến thức thú vị (Fun fact) cho bé
   */
  speakFunFact(funFact: string) {
    soundManager.speak(funFact, 'vi');
  }

  /**
   * Phát âm thanh mở rương kho báu hoàng kim
   */
  playTreasureChest() {
    soundManager.play(REAL_SOUND_EFFECTS_MAP.chest_open);
    setTimeout(() => {
      soundManager.speak('Hoan hô bé đã mở khóa rương kho báu hoàng kim!', 'vi');
    }, 1000);
  }

  /**
   * Dừng âm thanh đang phát
   */
  stop() {
    soundManager.stop();
  }
}

export const riddleSoundService = new RiddleSoundService();
