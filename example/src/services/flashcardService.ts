import { storage, STORAGE_KEYS } from './storage';
import {
  VocabCard,
  VocabCategory,
  getCardRarity,
  CardRarityTier,
} from '../data/oxfordKidsVocabulary';

export interface CardSrsData {
  wrongCount: number;
  correctCount: number;
  lastAttempt: number;
  masteryLevel: number; // 1 to 5 stars
}

export interface PackInventory {
  commonPacks: number;
  goldPacks: number;
}

type FlashcardChangeListener = () => void;

class FlashcardService {
  private listeners: Set<FlashcardChangeListener> = new Set();

  public subscribe(listener: FlashcardChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.warn('FlashcardService listener error:', e);
      }
    });
  }

  // =========================================================================
  // 1. QUẢN LÝ BỘ SƯU TẬP (ALBUM POKÉDEX)
  // =========================================================================

  getUnlockedCardIds(): Set<string> {
    try {
      const raw = storage.getString(STORAGE_KEYS.FLASHCARD_ALBUM);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc album thẻ:', e);
    }
    // Mặc định mở khóa 15 thẻ cơ bản đầu tiên cho bé làm quen
    const defaultUnlocked = [
      'dog', 'cat', 'lion', 'apple', 'banana', 'orange',
      'car', 'bus', 'sun', 'moon', 'star', 'pencil', 'book', 'ball', 'water'
    ];
    this.saveUnlockedCardIds(defaultUnlocked);
    return new Set(defaultUnlocked);
  }

  isCardUnlocked(cardId: string): boolean {
    const unlocked = this.getUnlockedCardIds();
    return unlocked.has(cardId);
  }

  unlockCards(cardIds: string[]): void {
    const unlocked = this.getUnlockedCardIds();
    let hasNew = false;
    cardIds.forEach((id) => {
      if (!unlocked.has(id)) {
        unlocked.add(id);
        hasNew = true;
      }
    });
    if (hasNew) {
      this.saveUnlockedCardIds(Array.from(unlocked));
    }
  }

  private saveUnlockedCardIds(ids: string[]): void {
    try {
      storage.set(STORAGE_KEYS.FLASHCARD_ALBUM, JSON.stringify(ids));
      this.notifyListeners();
    } catch (e) {
      console.warn('Lỗi lưu album thẻ:', e);
    }
  }

  // =========================================================================
  // 2. QUẢN LÝ TÚI THẺ BÍ ẨN (BOOSTER PACKS)
  // =========================================================================

  getPackInventory(): PackInventory {
    try {
      const raw = storage.getString(STORAGE_KEYS.FLASHCARD_UNOPENED_PACKS);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          commonPacks: typeof parsed.commonPacks === 'number' ? parsed.commonPacks : 1,
          goldPacks: typeof parsed.goldPacks === 'number' ? parsed.goldPacks : 1,
        };
      }
    } catch (e) {
      console.warn('Lỗi đọc kho túi thẻ:', e);
    }
    // Mặc định tặng bé 1 túi thẻ Thường và 1 túi thẻ Vàng khi vào game
    const defaultPacks: PackInventory = { commonPacks: 1, goldPacks: 1 };
    this.savePackInventory(defaultPacks);
    return defaultPacks;
  }

  savePackInventory(inventory: PackInventory): void {
    try {
      storage.set(STORAGE_KEYS.FLASHCARD_UNOPENED_PACKS, JSON.stringify(inventory));
      this.notifyListeners();
    } catch (e) {
      console.warn('Lỗi lưu kho túi thẻ:', e);
    }
  }

  addPacks(type: 'common' | 'gold', count = 1): void {
    const inventory = this.getPackInventory();
    if (type === 'common') {
      inventory.commonPacks += count;
    } else {
      inventory.goldPacks += count;
    }
    this.savePackInventory(inventory);
  }

  consumePack(type: 'common' | 'gold'): boolean {
    const inventory = this.getPackInventory();
    if (type === 'common' && inventory.commonPacks > 0) {
      inventory.commonPacks -= 1;
      this.savePackInventory(inventory);
      return true;
    }
    if (type === 'gold' && inventory.goldPacks > 0) {
      inventory.goldPacks -= 1;
      this.savePackInventory(inventory);
      return true;
    }
    return false;
  }

  /**
   * Bốc ngẫu nhiên 3 thẻ từ danh sách tổng hợp theo tỷ lệ độ hiếm
   */
  drawCardsForPack(type: 'common' | 'gold', allCards: VocabCard[]): VocabCard[] {
    if (!allCards || allCards.length === 0) return [];

    const commonCards: VocabCard[] = [];
    const rareCards: VocabCard[] = [];
    const legendaryCards: VocabCard[] = [];

    allCards.forEach((c) => {
      const rarity = getCardRarity(c);
      if (rarity === 'legendary') legendaryCards.push(c);
      else if (rarity === 'rare') rareCards.push(c);
      else commonCards.push(c);
    });

    const getRandomFrom = (list: VocabCard[]) =>
      list[Math.floor(Math.random() * list.length)] || allCards[0];

    const drawn: VocabCard[] = [];
    const drawnIds = new Set<string>();

    const totalDraws = 3;

    for (let i = 0; i < totalDraws; i++) {
      const rand = Math.random();
      let chosenCard: VocabCard;

      if (type === 'gold') {
        // Gói Vàng: Tỷ lệ Legendary 30%, Rare 50%, Common 20%
        if (i === 0 || rand < 0.3) {
          chosenCard = getRandomFrom(legendaryCards);
        } else if (rand < 0.8) {
          chosenCard = getRandomFrom(rareCards);
        } else {
          chosenCard = getRandomFrom(commonCards);
        }
      } else {
        // Gói Thường: Tỷ lệ Legendary 8%, Rare 32%, Common 60%
        if (rand < 0.08) {
          chosenCard = getRandomFrom(legendaryCards);
        } else if (rand < 0.4) {
          chosenCard = getRandomFrom(rareCards);
        } else {
          chosenCard = getRandomFrom(commonCards);
        }
      }

      // Tránh trùng thẻ trong cùng 1 gói nếu có thể
      if (chosenCard && !drawnIds.has(chosenCard.id)) {
        drawnIds.add(chosenCard.id);
        drawn.push(chosenCard);
      } else {
        // Bốc đại 1 thẻ chưa có
        const candidate = allCards.find((c) => !drawnIds.has(c.id)) || chosenCard;
        drawnIds.add(candidate.id);
        drawn.push(candidate);
      }
    }

    return drawn;
  }

  // =========================================================================
  // 3. THUẬT TOÁN ÔN TẬP NGẮT QUÃNG (SPACED REPETITION SYSTEM - SRS)
  // =========================================================================

  getSrsMap(): Record<string, CardSrsData> {
    try {
      const raw = storage.getString(STORAGE_KEYS.FLASHCARD_SRS_DATA);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Lỗi đọc dữ liệu SRS:', e);
    }
    return {};
  }

  recordAttempt(cardId: string, isCorrect: boolean): void {
    const srsMap = this.getSrsMap();
    const existing: CardSrsData = srsMap[cardId] || {
      wrongCount: 0,
      correctCount: 0,
      lastAttempt: 0,
      masteryLevel: 1,
    };

    if (isCorrect) {
      existing.correctCount += 1;
      if (existing.correctCount >= 3 && existing.wrongCount === 0) {
        existing.masteryLevel = Math.min(5, existing.masteryLevel + 1);
      }
    } else {
      existing.wrongCount += 1;
      existing.masteryLevel = Math.max(1, existing.masteryLevel - 1);
    }
    existing.lastAttempt = Date.now();

    srsMap[cardId] = existing;

    try {
      storage.set(STORAGE_KEYS.FLASHCARD_SRS_DATA, JSON.stringify(srsMap));
      this.notifyListeners();
    } catch (e) {
      console.warn('Lỗi lưu dữ liệu SRS:', e);
    }
  }

  /**
   * Lấy danh sách các thẻ từ vựng mà bé hay trả lời sai để tạo chủ đề "Từ Cần Ôn Luyện"
   */
  getReviewCards(allCategories: VocabCategory[]): VocabCard[] {
    const srsMap = this.getSrsMap();
    const allCards: VocabCard[] = [];
    allCategories.forEach((cat) => {
      cat.cards?.forEach((c) => allCards.push(c));
    });

    const needReview = allCards.filter((card) => {
      const data = srsMap[card.id];
      if (!data) return false;
      // Bé từng làm sai và số lần sai >= 1
      return data.wrongCount > 0 && data.wrongCount >= data.correctCount;
    });

    // Sắp xếp theo số lần sai nhiều nhất lên đầu
    needReview.sort((a, b) => {
      const wa = srsMap[a.id]?.wrongCount || 0;
      const wb = srsMap[b.id]?.wrongCount || 0;
      return wb - wa;
    });

    return needReview.slice(0, 20); // Giới hạn 20 từ cần ôn luyện
  }

  // =========================================================================
  // 4. KỶ LỤC ĐIỂM SỐ THỬ THÁCH 60 GIÂY (SPEED RUSH)
  // =========================================================================

  getSpeedRushHighScore(): number {
    try {
      const raw = storage.getString(STORAGE_KEYS.FLASHCARD_HIGH_SCORES);
      if (raw) {
        const num = parseInt(raw, 10);
        return isNaN(num) ? 0 : num;
      }
    } catch (e) {
      console.warn('Lỗi đọc high score:', e);
    }
    return 0;
  }

  saveSpeedRushHighScore(score: number): boolean {
    const currentHigh = this.getSpeedRushHighScore();
    if (score > currentHigh) {
      try {
        storage.set(STORAGE_KEYS.FLASHCARD_HIGH_SCORES, score.toString());
        this.notifyListeners();
        return true;
      } catch (e) {
        console.warn('Lỗi lưu high score:', e);
      }
    }
    return false;
  }
}

export const flashcardService = new FlashcardService();
