import { storage, STORAGE_KEYS } from './storage';
import { DetectiveWorldId, SHADOW_CASES_DATA } from '../data/shadowDetectiveData';

export interface DetectiveProgress {
  solvedCaseIds: string[];
  totalStars: number;
  unlockedWorldBadges: DetectiveWorldId[];
  lastPlayedWorldId: DetectiveWorldId;
  lastPlayedCaseNumber: number;
}

export interface DetectiveRankInfo {
  title: string;
  badge: string;
  minSolved: number;
  description: string;
}

export const DETECTIVE_RANKS: DetectiveRankInfo[] = [
  {
    title: 'Thám Tử Tập Sự',
    badge: '🔍',
    minSolved: 0,
    description: 'Bé bắt đầu hành trình phá án bóng đêm!',
  },
  {
    title: 'Thám Tử Tinh Mắt',
    badge: '🔦',
    minSolved: 10,
    description: 'Bé soi đèn pin siêu chuẩn xác!',
  },
  {
    title: 'Trưởng Ban Điều Tra',
    badge: '🎖️',
    minSolved: 20,
    description: 'Bé giải mã được hơn 20 bí ẩn bóng đêm!',
  },
  {
    title: 'Thám Tử Bậc Thầy',
    badge: '🌟',
    minSolved: 30,
    description: 'Không bóng đen nào làm khó được bé!',
  },
  {
    title: 'Thám Tử Huyền Thoại',
    badge: '👑',
    minSolved: 40,
    description: 'Đỉnh cao trí tuệ thám tử toàn diện!',
  },
];

const DEFAULT_PROGRESS: DetectiveProgress = {
  solvedCaseIds: [],
  totalStars: 0,
  unlockedWorldBadges: [],
  lastPlayedWorldId: 'forest',
  lastPlayedCaseNumber: 1,
};

class ShadowDetectiveService {
  private progress: DetectiveProgress = DEFAULT_PROGRESS;
  private initialized: boolean = false;

  constructor() {
    this.loadProgress();
  }

  private loadProgress(): void {
    try {
      const raw = storage.getString(STORAGE_KEYS.SHADOW_DETECTIVE_PROGRESS);
      if (raw) {
        this.progress = { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
      }
    } catch {
      this.progress = DEFAULT_PROGRESS;
    }
    this.initialized = true;
  }

  public getProgress(): DetectiveProgress {
    if (!this.initialized) {
      this.loadProgress();
    }
    return { ...this.progress };
  }

  public saveProgress(updated: DetectiveProgress): void {
    this.progress = updated;
    try {
      storage.set(STORAGE_KEYS.SHADOW_DETECTIVE_PROGRESS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist shadow detective progress:', e);
    }
  }

  /**
   * Đánh dấu vụ án đã được phá thành công
   */
  public markCaseSolved(
    caseId: string,
    worldId: DetectiveWorldId,
    starsEarned: number = 3
  ): { progress: DetectiveProgress; isNewSolved: boolean; worldBadgeUnlocked: boolean } {
    const current = this.getProgress();
    const isNewSolved = !current.solvedCaseIds.includes(caseId);

    const newSolvedIds = isNewSolved ? [...current.solvedCaseIds, caseId] : current.solvedCaseIds;
    const newStars = isNewSolved ? current.totalStars + starsEarned : current.totalStars;

    // Kiểm tra xem đã hoàn thành toàn bộ 10 vụ án của world này chưa
    const worldCases = SHADOW_CASES_DATA.filter((c) => c.worldId === worldId);
    const solvedInWorld = worldCases.filter((c) => newSolvedIds.includes(c.id));
    const allWorldSolved = solvedInWorld.length === worldCases.length;

    let worldBadgeUnlocked = false;
    let newBadges = [...current.unlockedWorldBadges];
    if (allWorldSolved && !newBadges.includes(worldId)) {
      newBadges.push(worldId);
      worldBadgeUnlocked = true;
    }

    const updated: DetectiveProgress = {
      ...current,
      solvedCaseIds: newSolvedIds,
      totalStars: newStars,
      unlockedWorldBadges: newBadges,
      lastPlayedWorldId: worldId,
    };

    this.saveProgress(updated);
    return { progress: updated, isNewSolved, worldBadgeUnlocked };
  }

  /**
   * Tính toán cấp bậc thám tử hiện tại
   */
  public getRank(solvedCount: number): DetectiveRankInfo {
    for (let i = DETECTIVE_RANKS.length - 1; i >= 0; i--) {
      if (solvedCount >= DETECTIVE_RANKS[i].minSolved) {
        return DETECTIVE_RANKS[i];
      }
    }
    return DETECTIVE_RANKS[0];
  }

  /**
   * Reset tiến độ để chơi lại từ đầu
   */
  public resetProgress(): DetectiveProgress {
    this.progress = DEFAULT_PROGRESS;
    this.saveProgress(DEFAULT_PROGRESS);
    return DEFAULT_PROGRESS;
  }
}

export const shadowDetectiveService = new ShadowDetectiveService();
