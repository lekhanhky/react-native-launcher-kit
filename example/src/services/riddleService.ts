/**
 * Riddle Game Service - Persistence & Progression Engine
 * Quản lý lưu trữ bền vững qua MMKV cho game 100 Câu Đố Kỳ Thú
 */

import { storage, STORAGE_KEYS } from './storage';
import { WorldId, getRiddlesByWorld } from '../data/riddles100Data';

export interface RiddleGameProgress {
  solvedRiddleIds: string[];
  riddleStars: Record<string, number>; // id -> 1 | 2 | 3
  totalStars: number;
  unlockedChests: WorldId[];
  preferredMode: 'preschool' | 'detective';
  lastPlayedWorldId: WorldId;
  lastPlayedIndex: number;
}

const DEFAULT_PROGRESS: RiddleGameProgress = {
  solvedRiddleIds: [],
  riddleStars: {},
  totalStars: 0,
  unlockedChests: [],
  preferredMode: 'preschool',
  lastPlayedWorldId: 'animals',
  lastPlayedIndex: 1,
};

class RiddleService {
  /**
   * Lấy toàn bộ tiến độ chơi từ bộ nhớ MMKV
   */
  getProgress(): RiddleGameProgress {
    try {
      const raw = storage.getString(STORAGE_KEYS.RIDDLE_GAME_PROGRESS);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          solvedRiddleIds: Array.isArray(parsed.solvedRiddleIds) ? parsed.solvedRiddleIds : [],
          riddleStars: parsed.riddleStars || {},
          unlockedChests: Array.isArray(parsed.unlockedChests) ? parsed.unlockedChests : [],
        };
      }
    } catch (e) {
      console.warn('Failed to load riddle progress:', e);
    }
    return { ...DEFAULT_PROGRESS };
  }

  /**
   * Lưu tiến độ vào bộ nhớ
   */
  saveProgress(progress: RiddleGameProgress): void {
    try {
      storage.set(STORAGE_KEYS.RIDDLE_GAME_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save riddle progress:', e);
    }
  }

  /**
   * Đánh dấu hoàn thành một câu đố và tính điểm sao
   */
  markRiddleSolved(
    riddleId: string,
    worldId: WorldId,
    stars: number
  ): { progress: RiddleGameProgress; isFirstTime: boolean; chestUnlockedJustNow: boolean } {
    const progress = this.getProgress();
    const isFirstTime = !progress.solvedRiddleIds.includes(riddleId);

    if (isFirstTime) {
      progress.solvedRiddleIds.push(riddleId);
    }

    // Cập nhật số sao cao nhất của câu này
    const prevStars = progress.riddleStars[riddleId] || 0;
    if (stars > prevStars) {
      progress.riddleStars[riddleId] = stars;
    }

    // Tính lại tổng số sao
    progress.totalStars = Object.values(progress.riddleStars).reduce((sum, s) => sum + s, 0);

    // Kiểm tra xem đã hoàn thành 20/20 câu của thế giới này chưa
    let chestUnlockedJustNow = false;
    const worldRiddles = getRiddlesByWorld(worldId);
    const allWorldSolved = worldRiddles.every((r) => progress.solvedRiddleIds.includes(r.id));

    if (allWorldSolved && !progress.unlockedChests.includes(worldId)) {
      progress.unlockedChests.push(worldId);
      chestUnlockedJustNow = true;
    }

    this.saveProgress(progress);
    return { progress, isFirstTime, chestUnlockedJustNow };
  }

  /**
   * Đổi chế độ chơi ưa thích
   */
  setPreferredMode(mode: 'preschool' | 'detective'): void {
    const progress = this.getProgress();
    progress.preferredMode = mode;
    this.saveProgress(progress);
  }

  /**
   * Cập nhật vị trí câu đố vừa chơi gần nhất
   */
  setLastPlayed(worldId: WorldId, index: number): void {
    const progress = this.getProgress();
    progress.lastPlayedWorldId = worldId;
    progress.lastPlayedIndex = index;
    this.saveProgress(progress);
  }

  /**
   * Mở khóa rương kho báu hoàng kim
   */
  unlockChest(worldId: WorldId): RiddleGameProgress {
    const progress = this.getProgress();
    if (!progress.unlockedChests.includes(worldId)) {
      progress.unlockedChests.push(worldId);
      this.saveProgress(progress);
    }
    return progress;
  }

  /**
   * Thống kê tiến độ của một vùng đất cụ thể
   */
  getWorldProgress(worldId: WorldId): {
    solvedCount: number;
    totalCount: number;
    stars: number;
    isCompleted: boolean;
    isChestUnlocked: boolean;
  } {
    const progress = this.getProgress();
    const riddles = getRiddlesByWorld(worldId);
    let solvedCount = 0;
    let stars = 0;

    riddles.forEach((r) => {
      if (progress.solvedRiddleIds.includes(r.id)) {
        solvedCount++;
        stars += progress.riddleStars[r.id] || 0;
      }
    });

    return {
      solvedCount,
      totalCount: riddles.length,
      stars,
      isCompleted: solvedCount === riddles.length,
      isChestUnlocked: progress.unlockedChests.includes(worldId),
    };
  }

  /**
   * Đặt lại toàn bộ tiến độ chơi về ban đầu
   */
  resetProgress(): RiddleGameProgress {
    const reset = { ...DEFAULT_PROGRESS };
    this.saveProgress(reset);
    return reset;
  }
}

export const riddleService = new RiddleService();
