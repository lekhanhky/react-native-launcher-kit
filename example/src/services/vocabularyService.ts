import { storage, STORAGE_KEYS } from './storage';
import {
  OXFORD_KIDS_VOCABULARY,
  VocabCard,
  VocabCategory,
} from '../data/oxfordKidsVocabulary';

type VocabChangeListener = (categories: VocabCategory[]) => void;

class VocabularyService {
  private listeners: Set<VocabChangeListener> = new Set();

  /**
   * Lấy toàn bộ danh mục từ vựng (từ bộ nhớ storage hoặc mặc định Oxford)
   */
  getAllCategories(): VocabCategory[] {
    try {
      const raw = storage.getString(STORAGE_KEYS.CUSTOM_VOCABULARY);
      if (raw) {
        const parsed: VocabCategory[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const totalCards = parsed.reduce(
            (acc, c) => acc + (c.cards?.length || 0),
            0
          );
          // Tự động nâng cấp khi phiên bản mới có 30 chủ đề và 500+ từ
          if (parsed.length < OXFORD_KIDS_VOCABULARY.length || totalCards < 500) {
            const merged = this.mergeWithDefault(parsed);
            this.saveCategories(merged);
            return merged;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc custom vocabulary từ storage:', e);
    }

    // Nếu chưa có trong storage -> Khởi tạo với dữ liệu chuẩn Oxford
    const defaultData = JSON.parse(JSON.stringify(OXFORD_KIDS_VOCABULARY));
    this.saveCategories(defaultData);
    return defaultData;
  }

  private mergeWithDefault(customCats: VocabCategory[]): VocabCategory[] {
    const defaultData: VocabCategory[] = JSON.parse(
      JSON.stringify(OXFORD_KIDS_VOCABULARY)
    );

    // Giữ lại các danh mục hoặc từ tùy chỉnh do admin thêm vào
    customCats.forEach((cCat) => {
      const targetDefault = defaultData.find((d) => d.id === cCat.id);
      if (targetDefault) {
        cCat.cards?.forEach((cCard) => {
          if (!targetDefault.cards.some((dCard) => dCard.id === cCard.id)) {
            targetDefault.cards.push(cCard);
          }
        });
      } else {
        defaultData.push(cCat);
      }
    });

    return defaultData;
  }

  /**
   * Lưu toàn bộ danh mục vào storage và thông báo cho listeners
   */
  saveCategories(categories: VocabCategory[]): boolean {
    try {
      storage.set(STORAGE_KEYS.CUSTOM_VOCABULARY, JSON.stringify(categories));
      this.notifyListeners(categories);
      return true;
    } catch (e) {
      console.error('Lỗi lưu vocabulary:', e);
      return false;
    }
  }

  /**
   * Lấy 1 danh mục theo ID
   */
  getCategoryById(id: string): VocabCategory | undefined {
    const all = this.getAllCategories();
    return all.find((c) => c.id === id);
  }

  /**
   * Thêm 1 danh mục mới (Chỉ dành cho Admin / Phụ huynh)
   */
  addCategory(category: {
    titleEn: string;
    titleVi: string;
    icon?: string;
    color?: string;
  }): VocabCategory {
    const all = this.getAllCategories();
    const newId = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const newCat: VocabCategory = {
      id: newId,
      titleEn: category.titleEn.trim() || 'New Category',
      titleVi: category.titleVi.trim() || 'Chủ đề mới',
      icon: category.icon || '📚',
      color: category.color || '#3B82F6',
      cards: [],
    };

    all.push(newCat);
    this.saveCategories(all);
    return newCat;
  }

  /**
   * Sửa danh mục (Admin)
   */
  updateCategory(
    id: string,
    updates: Partial<Omit<VocabCategory, 'id' | 'cards'>>
  ): boolean {
    const all = this.getAllCategories();
    const target = all.find((c) => c.id === id);
    if (!target) return false;

    if (updates.titleEn !== undefined) target.titleEn = updates.titleEn.trim();
    if (updates.titleVi !== undefined) target.titleVi = updates.titleVi.trim();
    if (updates.icon !== undefined) target.icon = updates.icon;
    if (updates.color !== undefined) target.color = updates.color;

    return this.saveCategories(all);
  }

  /**
   * Xóa danh mục (Admin)
   */
  deleteCategory(id: string): boolean {
    const all = this.getAllCategories();
    const filtered = all.filter((c) => c.id !== id);
    if (filtered.length === all.length) return false;

    return this.saveCategories(filtered);
  }

  /**
   * Thêm từ vựng mới vào danh mục (Chỉ dành cho Admin / Phụ huynh)
   */
  addCard(
    categoryId: string,
    card: {
      english: string;
      vietnamese: string;
      ipa?: string;
      emoji?: string;
      exampleEn?: string;
      exampleVi?: string;
      funFact?: string;
      color?: string;
    }
  ): VocabCard | null {
    const all = this.getAllCategories();
    const targetCat = all.find((c) => c.id === categoryId);
    if (!targetCat) return null;

    const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const newCard: VocabCard = {
      id: cardId,
      english: card.english.trim(),
      vietnamese: card.vietnamese.trim(),
      ipa: card.ipa?.trim() || `/${card.english.trim().toLowerCase()}/`,
      category: categoryId,
      emoji: card.emoji?.trim() || '⭐',
      color: card.color || targetCat.color || '#3B82F6',
      exampleEn: card.exampleEn?.trim() || `This is a ${card.english.trim()}.`,
      exampleVi: card.exampleVi?.trim() || `Đây là ${card.vietnamese.trim()}.`,
      funFact: card.funFact?.trim() || 'Từ vựng mới do ba mẹ thêm cho bé!',
    };

    targetCat.cards.push(newCard);
    this.saveCategories(all);
    return newCard;
  }

  /**
   * Sửa từ vựng (Admin)
   */
  updateCard(
    categoryId: string,
    cardId: string,
    updates: Partial<Omit<VocabCard, 'id' | 'category'>>
  ): boolean {
    const all = this.getAllCategories();
    const targetCat = all.find((c) => c.id === categoryId);
    if (!targetCat) return false;

    const targetCard = targetCat.cards.find((c) => c.id === cardId);
    if (!targetCard) return false;

    Object.assign(targetCard, updates);
    return this.saveCategories(all);
  }

  /**
   * Xóa từ vựng (Admin)
   */
  deleteCard(categoryId: string, cardId: string): boolean {
    const all = this.getAllCategories();
    const targetCat = all.find((c) => c.id === categoryId);
    if (!targetCat) return false;

    const prevCount = targetCat.cards.length;
    targetCat.cards = targetCat.cards.filter((c) => c.id !== cardId);
    if (targetCat.cards.length === prevCount) return false;

    return this.saveCategories(all);
  }

  /**
   * Khôi phục danh mục & từ vựng về mặc định của Oxford (Admin)
   */
  resetToDefault(): void {
    const defaultData = JSON.parse(JSON.stringify(OXFORD_KIDS_VOCABULARY));
    this.saveCategories(defaultData);
  }

  /**
   * Lắng nghe sự thay đổi của từ vựng
   */
  subscribe(listener: VocabChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(categories: VocabCategory[]) {
    this.listeners.forEach((listener) => {
      try {
        listener(categories);
      } catch (e) {
        console.warn('Lỗi listener vocabulary:', e);
      }
    });
  }
}

export const vocabularyService = new VocabularyService();
