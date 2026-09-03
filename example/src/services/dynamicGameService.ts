/**
 * Dynamic Game & Math Engine Service
 * Cloud-Powered with Supabase & Offline-First Cache (MMKV/Memory)
 */
import { storage } from './storage';
import { supabaseClient } from './supabaseClient';

// ==========================================
// 1. TYPE DEFINITIONS
// ==========================================

export type MathGrade = 'preschool' | 'grade1' | 'grade2' | 'grade3';
export type MathOperation =
  | 'COUNTING'
  | 'ADDITION'
  | 'SUBTRACTION'
  | 'MULTIPLICATION'
  | 'DIVISION'
  | 'COMPARISON'
  | 'FILL_MISSING';

export interface MathTopic {
  id: string;
  grade: MathGrade;
  title: string;
  description: string;
  icon: string;
  color_hex: string;
  order_index: number;
}

export interface MathQuestion {
  id: string;
  topic_id?: string;
  grade: MathGrade;
  operation: MathOperation;
  difficulty: number;
  question_text: string;
  sub_text?: string;
  emoji_icons?: string[];
  options: number[];
  correct_answer: number;
  explanation: string;
  star_reward: number;
  time_limit_sec: number;
}

export interface PuzzlePiece {
  id: string;
  name: string;
  emoji: string;
  color: string;
  borderColor?: string;
  width: number;
  height: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  targetX: number;
  targetY: number;
}

export interface PuzzleScene {
  id: string;
  mode: 'tangram' | 'jigsaw';
  category: string;
  title: string;
  emoji: string;
  difficulty: number;
  min_age: number;
  board_width: number;
  board_height: number;
  board_bg_color: string;
  pieces: PuzzlePiece[];
  preview_image_url?: string;
}

export interface MazeScene {
  id: string;
  title: string;
  grid_size: number;
  difficulty: number;
  theme: string;
  start_pos: { x: number; y: number };
  target_pos: { x: number; y: number };
  walls_matrix: Array<{ x: number; y: number; right?: boolean; bottom?: boolean; top?: boolean; left?: boolean }>;
  start_avatar: string;
  target_avatar: string;
}

export interface ChildGameProgress {
  child_id: string;
  game_id: string;
  scene_or_topic_id: string;
  stars_earned: number;
  best_score: number;
  completed_times: number;
  last_played_at: string;
}

// ==========================================
// 2. DEFAULT SEED DATA (FALLBACK KHI OFFLINE)
// ==========================================

export const DEFAULT_MATH_TOPICS: MathTopic[] = [
  {
    id: 'topic-preschool-count',
    grade: 'preschool',
    title: 'Đếm Hình Kỳ Diệu (1-10)',
    description: 'Đếm các loại hoa quả, đồ chơi ngộ nghĩnh',
    icon: '🎈',
    color_hex: '#EC4899',
    order_index: 1,
  },
  {
    id: 'topic-grade1-add-10',
    grade: 'grade1',
    title: 'Phép Cộng Phạm Vi 10 & 20',
    description: 'Làm quen với dấu cộng và tính nhẩm nhanh',
    icon: '🌱',
    color_hex: '#10B981',
    order_index: 2,
  },
  {
    id: 'topic-grade2-mult',
    grade: 'grade2',
    title: 'Bảng Nhân 2, 3, 4, 5',
    description: 'Học thuộc bảng nhân qua các câu đố',
    icon: '🚀',
    color_hex: '#3B82F6',
    order_index: 3,
  },
  {
    id: 'topic-grade3-mult-div',
    grade: 'grade3',
    title: 'Bảng Cửu Chương & Chia Nhẩm',
    description: 'Thử thách bảng cửu chương 6-9 và phép chia',
    icon: '👑',
    color_hex: '#8B5CF6',
    order_index: 4,
  },
];

// ==========================================
// 3. DYNAMIC GAME ENGINE SERVICE
// ==========================================

class DynamicGameService {
  private readonly CACHE_KEY_PREFIX = '@dynamic_games_';
  private inMemoryCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL_MS = 1000 * 60 * 30; // 30 phút

  /**
   * Sinh câu hỏi toán dự phòng trực tiếp trên thiết bị (On-Device Fallback Generator)
   */
  public generateLocalMathQuestion(grade: MathGrade): MathQuestion {
    const emojis = ['🍎', '⭐️', '🚗', '🐱', '🍦', '🎈', '🐥', '🍓', '🍩', '🐶', '⚽️', '🚀'];
    const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    if (grade === 'preschool') {
      const count = Math.floor(Math.random() * 8) + 2; // 2 đến 9
      const icons = Array(count).fill(chosenEmoji);

      const wrong1 = Math.max(1, count + (Math.random() > 0.5 ? 1 : -1));
      const wrong2 = Math.max(1, count + (Math.random() > 0.5 ? 2 : -2));
      const wrong3 = Math.max(1, count + (Math.random() > 0.5 ? 3 : -3));
      const opts = Array.from(new Set([count, wrong1, wrong2, wrong3])).slice(0, 4);
      while (opts.length < 4) opts.push(opts.length + 1);
      opts.sort(() => Math.random() - 0.5);

      return {
        id: `local-pre-${Date.now()}-${Math.random()}`,
        grade: 'preschool',
        operation: 'COUNTING',
        difficulty: 1,
        question_text: `Có bao nhiêu ${chosenEmoji} bên dưới?`,
        sub_text: 'Bé hãy chạm ngón tay vào từng hình để đếm nhé!',
        emoji_icons: icons,
        options: opts,
        correct_answer: count,
        explanation: `Đếm lần lượt: Có tất cả đúng ${count} ${chosenEmoji}!`,
        star_reward: 1,
        time_limit_sec: 20,
      };
    }

    if (grade === 'grade1') {
      const isAdd = Math.random() > 0.4;
      if (isAdd) {
        const a = Math.floor(Math.random() * 6) + 1;
        const b = Math.floor(Math.random() * 6) + 1;
        const ans = a + b;
        const w1 = Math.max(1, ans + (Math.random() > 0.5 ? 1 : -1));
        const w2 = Math.max(1, ans + (Math.random() > 0.5 ? 2 : -2));
        const w3 = Math.max(1, ans + (Math.random() > 0.5 ? 3 : -3));
        const opts = Array.from(new Set([ans, w1, w2, w3])).slice(0, 4);
        while (opts.length < 4) opts.push(opts.length + 1);
        opts.sort(() => Math.random() - 0.5);

        return {
          id: `local-g1-${Date.now()}-${Math.random()}`,
          grade: 'grade1',
          operation: 'ADDITION',
          difficulty: 1,
          question_text: `${a} + ${b} = ?`,
          emoji_icons: [],
          options: opts,
          correct_answer: ans,
          explanation: `Phép cộng: ${a} cộng ${b} bằng ${ans}!`,
          star_reward: 1,
          time_limit_sec: 15,
        };
      } else {
        const a = Math.floor(Math.random() * 8) + 3;
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        const ans = a - b;
        const w1 = Math.max(1, ans + (Math.random() > 0.5 ? 1 : -1));
        const w2 = Math.max(1, ans + (Math.random() > 0.5 ? 2 : -2));
        const w3 = Math.max(1, ans + (Math.random() > 0.5 ? 3 : -3));
        const opts = Array.from(new Set([ans, w1, w2, w3])).slice(0, 4);
        while (opts.length < 4) opts.push(opts.length + 1);
        opts.sort(() => Math.random() - 0.5);

        return {
          id: `local-g1-${Date.now()}-${Math.random()}`,
          grade: 'grade1',
          operation: 'SUBTRACTION',
          difficulty: 1,
          question_text: `${a} - ${b} = ?`,
          emoji_icons: [],
          options: opts,
          correct_answer: ans,
          explanation: `Phép trừ: ${a} trừ ${b} bằng ${ans}!`,
          star_reward: 1,
          time_limit_sec: 15,
        };
      }
    }

    if (grade === 'grade2') {
      const a = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      const b = Math.floor(Math.random() * 9) + 1;
      const ans = a * b;
      const w1 = Math.max(1, ans + a);
      const w2 = Math.max(1, ans - a > 0 ? ans - a : ans + 2);
      const w3 = Math.max(1, ans + (Math.random() > 0.5 ? 1 : -1));
      const opts = Array.from(new Set([ans, w1, w2, w3])).slice(0, 4);
      while (opts.length < 4) opts.push(opts.length + 1);
      opts.sort(() => Math.random() - 0.5);

      return {
        id: `local-g2-${Date.now()}-${Math.random()}`,
        grade: 'grade2',
        operation: 'MULTIPLICATION',
        difficulty: 2,
        question_text: `${a} × ${b} = ?`,
        emoji_icons: [],
        options: opts,
        correct_answer: ans,
        explanation: `Bảng nhân: ${a} nhân ${b} bằng ${ans}!`,
        star_reward: 2,
        time_limit_sec: 15,
      };
    }

    // grade3
    const isMult = Math.random() > 0.5;
    if (isMult) {
      const a = Math.floor(Math.random() * 4) + 6; // 6 đến 9
      const b = Math.floor(Math.random() * 9) + 2;
      const ans = a * b;
      const w1 = Math.max(1, ans + a);
      const w2 = Math.max(1, ans - a);
      const w3 = Math.max(1, ans + (Math.random() > 0.5 ? 2 : -2));
      const opts = Array.from(new Set([ans, w1, w2, w3])).slice(0, 4);
      while (opts.length < 4) opts.push(opts.length + 1);
      opts.sort(() => Math.random() - 0.5);

      return {
        id: `local-g3-${Date.now()}-${Math.random()}`,
        grade: 'grade3',
        operation: 'MULTIPLICATION',
        difficulty: 3,
        question_text: `${a} × ${b} = ?`,
        emoji_icons: [],
        options: opts,
        correct_answer: ans,
        explanation: `Bảng cửu chương: ${a} × ${b} = ${ans}`,
        star_reward: 3,
        time_limit_sec: 15,
      };
    } else {
      const b = Math.floor(Math.random() * 7) + 3; // 3 đến 9
      const ans = Math.floor(Math.random() * 8) + 2;
      const a = b * ans;
      const w1 = Math.max(1, ans + 1);
      const w2 = Math.max(1, ans - 1);
      const w3 = Math.max(1, ans + 2);
      const opts = Array.from(new Set([ans, w1, w2, w3])).slice(0, 4);
      while (opts.length < 4) opts.push(opts.length + 1);
      opts.sort(() => Math.random() - 0.5);

      return {
        id: `local-g3-${Date.now()}-${Math.random()}`,
        grade: 'grade3',
        operation: 'DIVISION',
        difficulty: 3,
        question_text: `${a} : ${b} = ?`,
        emoji_icons: [],
        options: opts,
        correct_answer: ans,
        explanation: `Phép chia: ${a} : ${b} = ${ans} (vì ${b} × ${ans} = ${a})`,
        star_reward: 3,
        time_limit_sec: 15,
      };
    }
  }

  /**
   * Lấy danh sách Chủ đề Toán theo khối lớp (Cloud -> Cache -> Default)
   */
  public async getMathTopics(grade: MathGrade): Promise<MathTopic[]> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}math_topics_${grade}`;

    try {
      const response = await supabaseClient.from<MathTopic>('math_topics', {
        filter: { grade, is_active: true },
        order: { column: 'order_index', ascending: true },
      });

      if (response.data && response.data.length > 0) {
        await storage.setItem(cacheKey, JSON.stringify(response.data));
        return response.data;
      }
    } catch (err) {
      console.warn('[DynamicGameService] Failed to fetch math topics from Cloud:', err);
    }

    // Đọc từ Cache
    try {
      const cached = await storage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}

    // Fallback dữ liệu mặc định
    return DEFAULT_MATH_TOPICS.filter((t) => t.grade === grade);
  }

  /**
   * Lấy danh sách câu hỏi Toán (Cloud -> Cache -> On-Device Auto Generator)
   */
  public async getMathQuestions(grade: MathGrade, count: number = 10): Promise<MathQuestion[]> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}math_questions_${grade}`;

    try {
      const response = await supabaseClient.from<MathQuestion>('math_questions', {
        filter: { grade },
        limit: count * 2,
      });

      if (response.data && response.data.length > 0) {
        // Trộn ngẫu nhiên câu hỏi lấy từ cloud
        const shuffled = [...response.data].sort(() => Math.random() - 0.5).slice(0, count);
        await storage.setItem(cacheKey, JSON.stringify(response.data));
        return shuffled;
      }
    } catch (err) {
      console.warn('[DynamicGameService] Failed to fetch math questions from Cloud, falling back to local:', err);
    }

    // Đọc từ Cache nếu có
    try {
      const cached = await storage.getItem(cacheKey);
      if (cached) {
        const parsed: MathQuestion[] = JSON.parse(cached);
        if (parsed.length > 0) {
          return [...parsed].sort(() => Math.random() - 0.5).slice(0, count);
        }
      }
    } catch (e) {}

    // Tự động sinh hàng loạt câu hỏi on-device
    const localQuestions: MathQuestion[] = [];
    for (let i = 0; i < count; i++) {
      localQuestions.push(this.generateLocalMathQuestion(grade));
    }
    return localQuestions;
  }

  /**
   * Lấy danh sách Cảnh Ghép Hình Tangram / Jigsaw từ Cloud
   */
  public async getPuzzleScenes(mode: 'tangram' | 'jigsaw'): Promise<PuzzleScene[]> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}puzzle_scenes_${mode}`;

    try {
      const response = await supabaseClient.from<PuzzleScene>('puzzle_scenes', {
        filter: { mode, is_active: true },
        order: { column: 'order_index', ascending: true },
      });

      if (response.data && response.data.length > 0) {
        await storage.setItem(cacheKey, JSON.stringify(response.data));
        return response.data;
      }
    } catch (err) {
      console.warn('[DynamicGameService] Failed to fetch puzzle scenes from Cloud:', err);
    }

    // Đọc từ Cache
    try {
      const cached = await storage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}

    return [];
  }

  /**
   * Lấy danh sách Cảnh Mê Cung từ Cloud
   */
  public async getMazeScenes(): Promise<MazeScene[]> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}maze_scenes`;

    try {
      const response = await supabaseClient.from<MazeScene>('maze_scenes', {
        filter: { is_active: true },
        order: { column: 'order_index', ascending: true },
      });

      if (response.data && response.data.length > 0) {
        await storage.setItem(cacheKey, JSON.stringify(response.data));
        return response.data;
      }
    } catch (err) {
      console.warn('[DynamicGameService] Failed to fetch maze scenes from Cloud:', err);
    }

    // Đọc từ Cache
    try {
      const cached = await storage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}

    return [];
  }

  /**
   * Lưu và đồng bộ tiến độ chơi của bé (Stars & Score) lên Cloud
   */
  public async saveProgress(
    childId: string,
    gameId: string,
    sceneOrTopicId: string,
    starsEarned: number,
    score: number
  ): Promise<boolean> {
    const record: ChildGameProgress = {
      child_id: childId || 'local_child',
      game_id: gameId,
      scene_or_topic_id: sceneOrTopicId,
      stars_earned: starsEarned,
      best_score: score,
      completed_times: 1,
      last_played_at: new Date().toISOString(),
    };

    // 1. Lưu cục bộ
    try {
      const localKey = `@progress_${gameId}_${sceneOrTopicId}`;
      await storage.setItem(localKey, JSON.stringify(record));
    } catch (e) {}

    // 2. Gửi lên Supabase nếu có internet
    try {
      await supabaseClient.upsert('child_game_progress', record);
      return true;
    } catch (err) {
      console.warn('[DynamicGameService] Offline progress saved locally:', err);
      return false;
    }
  }
}

export const dynamicGameService = new DynamicGameService();
