import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Modal,
  PanResponder,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { soundManager } from '../components/SoundPlayer';

// ============================================================
// TYPES & INTERFACES
// ============================================================
type GamePhase = 'world_map' | 'character_select' | 'level_intro' | 'playing' | 'quiz' | 'boss_fight' | 'victory' | 'game_over' | 'pause' | 'level_complete';

interface Vec2 { x: number; y: number; }
interface Rect { x: number; y: number; w: number; h: number; }

interface PlayerState {
  x: number; y: number;
  vx: number; vy: number;
  w: number; h: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  isInvincible: boolean;
  invincibleTimer: number;
  animFrame: number;
  animTimer: number;
  isJumping: boolean;
  isDead: boolean;
}

interface TileEntity {
  type: 'ground' | 'brick' | 'question' | 'pipe_left' | 'pipe_right' | 'pipe_top_left' | 'pipe_top_right' | 'tree_trunk' | 'tree_top' | 'bush' | 'cloud' | 'water' | 'bridge' | 'lava' | 'spike' | 'ladder' | 'door' | 'sign';
  col: number;
  row: number;
  activated?: boolean;
  bounceOffset?: number;
  bounceTimer?: number;
}

interface Collectible {
  id: string;
  type: 'coin' | 'letter' | 'star' | 'heart' | 'gem' | 'key' | 'costume_hat' | 'costume_shirt' | 'costume_accessory';
  x: number; y: number;
  w: number; h: number;
  value: string;
  collected: boolean;
  floatOffset: number;
  floatTimer: number;
}

interface Enemy {
  id: string;
  type: 'mushroom' | 'snail' | 'butterfly' | 'squirrel' | 'fox' | 'boss_owl';
  x: number; y: number;
  w: number; h: number;
  vx: number;
  facing: 'left' | 'right';
  alive: boolean;
  squishTimer: number;
  health: number;
  patrolRange: [number, number];
  animFrame: number;
  animTimer: number;
}

interface QuizQuestion {
  id: string;
  type: 'math' | 'spelling' | 'science' | 'logic';
  question: string;
  options: { label: string; value: string; emoji: string }[];
  correctAnswer: string;
  hint: string;
  difficulty: 1 | 2 | 3;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  emoji?: string;
}

interface CharacterInfo {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  ability: string;
  unlocked: boolean;
  sprites: { idle: string; walk1: string; walk2: string; jump: string; hurt: string };
}

interface LevelData {
  id: string;
  name: string;
  subtitle: string;
  worldWidth: number;
  tiles: TileEntity[];
  collectibles: Collectible[];
  enemies: Enemy[];
  spawnPoint: Vec2;
  exitPoint: Vec2;
  targetWord: string;
  quizzes: QuizQuestion[];
  bgLayers: { emoji: string; x: number; y: number; speed: number }[];
  isBossLevel: boolean;
  storyText: string;
}

// ============================================================
// PHYSICS CONSTANTS
// ============================================================
const PHYSICS = {
  GRAVITY: 0.55,
  MAX_FALL: 11,
  MOVE_SPEED: 3.8,
  RUN_SPEED: 6.0,          // Sprint speed nhanh hơn
  ACCEL: 0.85,             // Phản xạ tức thì — tăng từ 0.32
  FRICTION: 0.75,
  JUMP_FORCE: -11.5,
  BOUNCE_FORCE: -8,
  TILE: 36,
  INVINCIBLE_TIME: 90,
  COYOTE_FRAMES: 10,       // Số frames ân hạn nhảy khi vừa rời mép
  JUMP_BUFFER_FRAMES: 9,   // Số frames nhớ lệnh nhảy khi chưa chạm đất
};

// ============================================================
// COLOR PALETTES — Forest World "Pixel Art HD"
// ============================================================
const FOREST_PALETTE = {
  sky: ['#87CEEB', '#B8E4FA', '#E8F6FF'],
  skyNight: ['#1A1A2E', '#16213E', '#0F3460'],
  groundTop: '#4A7C39',
  groundMid: '#3D6B2E',
  groundBottom: '#2D5A1E',
  dirt: '#8B6914',
  dirtDark: '#6B4F0A',
  brick: '#C17A3A',
  brickDark: '#9B5E28',
  questionBlock: '#FFD700',
  questionBlockDark: '#E5A800',
  questionMark: '#C17A3A',
  pipe: '#3CB043',
  pipeDark: '#2D8B34',
  pipeHighlight: '#5CD96A',
  treeTrunk: '#8B6914',
  treeLeaves: '#2D8B34',
  treeLeavesLight: '#5CD96A',
  water: '#4FC3F7',
  waterDeep: '#0288D1',
  bush: '#3CB043',
  bushLight: '#66D96A',
  cloud: '#FFFFFF',
  cloudShadow: '#E0E8F0',
  coin: '#FFD700',
  coinShadow: '#E5A800',
  star: '#FFD700',
  heart: '#FF4757',
  gem: '#7C3AED',
  letterBg: '#FF6B35',
  hudBg: 'rgba(0,0,0,0.6)',
  hudText: '#FFFFFF',
  hudAccent: '#FFD700',
};

// ============================================================
// PIXEL ART SPRITE DATA (Emoji-based with colored backgrounds for premium look)
// ============================================================
const SPRITES = {
  // Player characters
  cat: { idle: '🐱', walk1: '🐱', walk2: '🐈', jump: '😺', hurt: '🙀' },
  dog: { idle: '🐶', walk1: '🐶', walk2: '🐕', jump: '🐕', hurt: '😿' },
  bunny: { idle: '🐰', walk1: '🐰', walk2: '🐇', jump: '🐇', hurt: '😿' },
  fox: { idle: '🦊', walk1: '🦊', walk2: '🦊', jump: '🦊', hurt: '😿' },
  panda: { idle: '🐼', walk1: '🐼', walk2: '🐼', jump: '🐼', hurt: '😿' },
  lion: { idle: '🦁', walk1: '🦁', walk2: '🦁', jump: '🦁', hurt: '😿' },
  // Enemies
  mushroom: '🍄',
  snail: '🐌',
  butterfly: '🦋',
  squirrel: '🐿️',
  foxEnemy: '🦊',
  owl: '🦉',
  // Tiles
  ground: '🟫',
  brick: '🧱',
  questionMark: '❓',
  questionEmpty: '📦',
  pipe: '🟩',
  tree: '🌳',
  bush: '🌿',
  cloud: '☁️',
  flower: '🌸',
  mushroom_tile: '🍄',
  // Collectibles
  coin: '🪙',
  star: '⭐',
  heart: '❤️',
  gem: '💎',
  key: '🔑',
  hat: '🎩',
  shirt: '👕',
  bow: '🎀',
};

// ============================================================
// CHARACTERS
// ============================================================
const CHARACTERS: CharacterInfo[] = [
  {
    id: 'cat', name: 'Miu', emoji: '🐱', color: '#FF9800',
    description: 'Mèo thám hiểm dũng cảm', ability: 'Cân bằng tốt',
    unlocked: true, sprites: SPRITES.cat,
  },
  {
    id: 'dog', name: 'Gâu', emoji: '🐶', color: '#795548',
    description: 'Cún trung thành nhanh nhẹn', ability: 'Chạy nhanh hơn',
    unlocked: false, sprites: SPRITES.dog,
  },
  {
    id: 'bunny', name: 'Thỏ Bông', emoji: '🐰', color: '#E91E63',
    description: 'Thỏ nhảy cao nhất', ability: 'Nhảy đôi (Double Jump)',
    unlocked: false, sprites: SPRITES.bunny,
  },
  {
    id: 'fox', name: 'Cáo Thông Minh', emoji: '🦊', color: '#FF5722',
    description: 'Cáo thông minh hay gợi ý', ability: 'Gợi ý đáp án (1 lần/màn)',
    unlocked: false, sprites: SPRITES.fox,
  },
  {
    id: 'panda', name: 'Gấu Trúc', emoji: '🐼', color: '#607D8B',
    description: 'Gấu trúc có khiên bảo vệ', ability: 'Shield (chống mất điểm 1 lần)',
    unlocked: false, sprites: SPRITES.panda,
  },
  {
    id: 'lion', name: 'Sư Tử Vua', emoji: '🦁', color: '#FFC107',
    description: 'Vua rừng mạnh mẽ nhất', ability: 'Tất cả ability',
    unlocked: false, sprites: SPRITES.lion,
  },
];

// ============================================================
// QUIZ QUESTION BANKS
// ============================================================
const MATH_QUESTIONS: QuizQuestion[] = [
  { id: 'm1', type: 'math', question: '2 + 3 = ?', options: [{ label: '4', value: '4', emoji: '🍄' }, { label: '5', value: '5', emoji: '⭐' }, { label: '6', value: '6', emoji: '🍄' }], correctAnswer: '5', hint: 'Đếm ngón tay nhé!', difficulty: 1 },
  { id: 'm2', type: 'math', question: '7 - 4 = ?', options: [{ label: '2', value: '2', emoji: '🌿' }, { label: '3', value: '3', emoji: '⭐' }, { label: '4', value: '4', emoji: '🌿' }], correctAnswer: '3', hint: 'Bé có 7 quả táo, cho bạn 4 quả', difficulty: 1 },
  { id: 'm3', type: 'math', question: '4 + 5 = ?', options: [{ label: '8', value: '8', emoji: '🍃' }, { label: '9', value: '9', emoji: '⭐' }, { label: '10', value: '10', emoji: '🍃' }], correctAnswer: '9', hint: 'Đếm thêm từ 4 lên 5 nhé!', difficulty: 1 },
  { id: 'm4', type: 'math', question: '6 + 6 = ?', options: [{ label: '11', value: '11', emoji: '🌻' }, { label: '12', value: '12', emoji: '⭐' }, { label: '13', value: '13', emoji: '🌻' }], correctAnswer: '12', hint: 'Hai tay mỗi tay 6 ngón!', difficulty: 2 },
  { id: 'm5', type: 'math', question: '10 - 7 = ?', options: [{ label: '2', value: '2', emoji: '🍄' }, { label: '3', value: '3', emoji: '⭐' }, { label: '4', value: '4', emoji: '🍄' }], correctAnswer: '3', hint: 'Từ 10 đếm ngược 7 bước', difficulty: 2 },
  { id: 'm6', type: 'math', question: '3 × 4 = ?', options: [{ label: '7', value: '7', emoji: '🌺' }, { label: '12', value: '12', emoji: '⭐' }, { label: '10', value: '10', emoji: '🌺' }], correctAnswer: '12', hint: '3 nhóm, mỗi nhóm 4 bạn', difficulty: 3 },
  { id: 'm7', type: 'math', question: '8 + 7 = ?', options: [{ label: '14', value: '14', emoji: '🍂' }, { label: '15', value: '15', emoji: '⭐' }, { label: '16', value: '16', emoji: '🍂' }], correctAnswer: '15', hint: '8 thêm 2 là 10, còn thêm 5 nữa!', difficulty: 2 },
  { id: 'm8', type: 'math', question: '5 + 5 + 5 = ?', options: [{ label: '10', value: '10', emoji: '🌲' }, { label: '15', value: '15', emoji: '⭐' }, { label: '20', value: '20', emoji: '🌲' }], correctAnswer: '15', hint: 'Ba nhóm 5!', difficulty: 2 },
];

const SPELLING_QUESTIONS: QuizQuestion[] = [
  { id: 's1', type: 'spelling', question: '🍎 là gì trong tiếng Anh?', options: [{ label: 'Apple', value: 'Apple', emoji: '🍎' }, { label: 'Banana', value: 'Banana', emoji: '🍌' }, { label: 'Cat', value: 'Cat', emoji: '🐱' }], correctAnswer: 'Apple', hint: 'Bắt đầu bằng chữ A', difficulty: 1 },
  { id: 's2', type: 'spelling', question: '🐶 là gì trong tiếng Anh?', options: [{ label: 'Cat', value: 'Cat', emoji: '🐱' }, { label: 'Dog', value: 'Dog', emoji: '🐶' }, { label: 'Fish', value: 'Fish', emoji: '🐟' }], correctAnswer: 'Dog', hint: 'Bắt đầu bằng chữ D', difficulty: 1 },
  { id: 's3', type: 'spelling', question: '🌳 là gì trong tiếng Anh?', options: [{ label: 'Flower', value: 'Flower', emoji: '🌸' }, { label: 'Tree', value: 'Tree', emoji: '🌳' }, { label: 'Star', value: 'Star', emoji: '⭐' }], correctAnswer: 'Tree', hint: 'Bắt đầu bằng chữ T', difficulty: 1 },
  { id: 's4', type: 'spelling', question: '🌈 là gì trong tiếng Anh?', options: [{ label: 'Rain', value: 'Rain', emoji: '🌧️' }, { label: 'Sun', value: 'Sun', emoji: '☀️' }, { label: 'Rainbow', value: 'Rainbow', emoji: '🌈' }], correctAnswer: 'Rainbow', hint: 'Rain + Bow', difficulty: 2 },
  { id: 's5', type: 'spelling', question: '🦋 là gì trong tiếng Anh?', options: [{ label: 'Bird', value: 'Bird', emoji: '🐦' }, { label: 'Butterfly', value: 'Butterfly', emoji: '🦋' }, { label: 'Bee', value: 'Bee', emoji: '🐝' }], correctAnswer: 'Butterfly', hint: 'Butter + Fly', difficulty: 2 },
  { id: 's6', type: 'spelling', question: '🐸 là gì trong tiếng Anh?', options: [{ label: 'Frog', value: 'Frog', emoji: '🐸' }, { label: 'Fish', value: 'Fish', emoji: '🐟' }, { label: 'Fox', value: 'Fox', emoji: '🦊' }], correctAnswer: 'Frog', hint: 'Bắt đầu bằng Fr', difficulty: 1 },
  { id: 's7', type: 'spelling', question: '🌻 là gì trong tiếng Anh?', options: [{ label: 'Rose', value: 'Rose', emoji: '🌹' }, { label: 'Sunflower', value: 'Sunflower', emoji: '🌻' }, { label: 'Tulip', value: 'Tulip', emoji: '🌷' }], correctAnswer: 'Sunflower', hint: 'Sun + Flower', difficulty: 2 },
];

const SCIENCE_QUESTIONS: QuizQuestion[] = [
  { id: 'sc1', type: 'science', question: 'Cây cần gì để sống?', options: [{ label: 'Ánh sáng & Nước', value: 'light_water', emoji: '☀️' }, { label: 'Kẹo', value: 'candy', emoji: '🍬' }, { label: 'Đá', value: 'rock', emoji: '🪨' }], correctAnswer: 'light_water', hint: 'Cây uống nước và tắm nắng!', difficulty: 1 },
  { id: 'sc2', type: 'science', question: 'Con nào biết bay?', options: [{ label: 'Cá 🐟', value: 'fish', emoji: '🐟' }, { label: 'Chim 🐦', value: 'bird', emoji: '🐦' }, { label: 'Cá sấu 🐊', value: 'croc', emoji: '🐊' }], correctAnswer: 'bird', hint: 'Con này có cánh!', difficulty: 1 },
  { id: 'sc3', type: 'science', question: 'Mặt Trời là gì?', options: [{ label: 'Ngôi sao ⭐', value: 'star', emoji: '⭐' }, { label: 'Hành tinh 🌍', value: 'planet', emoji: '🌍' }, { label: 'Mặt trăng 🌙', value: 'moon', emoji: '🌙' }], correctAnswer: 'star', hint: 'Nó phát ra ánh sáng và rất nóng!', difficulty: 2 },
  { id: 'sc4', type: 'science', question: 'Con bướm trước khi thành bướm là gì?', options: [{ label: 'Sâu 🐛', value: 'caterpillar', emoji: '🐛' }, { label: 'Ếch 🐸', value: 'frog', emoji: '🐸' }, { label: 'Cá 🐟', value: 'fish', emoji: '🐟' }], correctAnswer: 'caterpillar', hint: 'Nó bò trên lá!', difficulty: 2 },
  { id: 'sc5', type: 'science', question: 'Nước khi nóng quá sẽ thành?', options: [{ label: 'Đá 🧊', value: 'ice', emoji: '🧊' }, { label: 'Hơi nước 💨', value: 'steam', emoji: '💨' }, { label: 'Sữa 🥛', value: 'milk', emoji: '🥛' }], correctAnswer: 'steam', hint: 'Mẹ đun nước sôi thấy gì bay lên?', difficulty: 2 },
];

// ============================================================
// LEVEL DATA GENERATOR — FOREST WORLD (5 LEVELS)
// ============================================================
const T = PHYSICS.TILE;

function generateForestLevel(levelNum: number): LevelData {
  const levels: Record<number, () => LevelData> = {
    // ============ LEVEL 1-1: Hành trình đầu tiên ============
    1: () => {
      const W = 80; // 80 tiles wide
      const H = 14; // 14 tiles tall
      const tiles: TileEntity[] = [];
      const collectibles: Collectible[] = [];
      const enemies: Enemy[] = [];

      // Ground layer
      for (let c = 0; c < W; c++) {
        if ((c >= 18 && c <= 20) || (c >= 38 && c <= 39) || (c >= 55 && c <= 56)) continue; // Gaps
        for (let r = H - 2; r < H; r++) {
          tiles.push({ type: 'ground', col: c, row: r });
        }
      }
      // Elevated platforms
      [[8, 10, 8], [14, 17, 7], [25, 28, 9], [30, 33, 7], [42, 46, 9], [48, 52, 7], [60, 63, 9], [65, 68, 7]].forEach(([s, e, r]) => {
        for (let c = s; c <= e; c++) tiles.push({ type: 'brick', col: c, row: r });
      });
      // Question blocks
      [[10, 6], [16, 5], [26, 7], [31, 5], [44, 7], [50, 5], [62, 7]].forEach(([c, r]) => {
        tiles.push({ type: 'question', col: c, row: r, activated: false, bounceOffset: 0, bounceTimer: 0 });
      });
      // Pipes
      [[22, H - 4], [35, H - 3], [53, H - 4], [70, H - 3]].forEach(([c, r]) => {
        tiles.push({ type: 'pipe_top_left', col: c, row: r });
        tiles.push({ type: 'pipe_top_right', col: c + 1, row: r });
        for (let pr = r + 1; pr < H - 2; pr++) {
          tiles.push({ type: 'pipe_left', col: c, row: pr });
          tiles.push({ type: 'pipe_right', col: c + 1, row: pr });
        }
      });
      // Trees (decorative)
      [[3, H - 4], [12, H - 4], [28, H - 4], [45, H - 4], [58, H - 4], [73, H - 4]].forEach(([c, r]) => {
        tiles.push({ type: 'tree_trunk', col: c, row: r });
        tiles.push({ type: 'tree_trunk', col: c, row: r - 1 });
        tiles.push({ type: 'tree_top', col: c - 1, row: r - 2 });
        tiles.push({ type: 'tree_top', col: c, row: r - 2 });
        tiles.push({ type: 'tree_top', col: c + 1, row: r - 2 });
        tiles.push({ type: 'tree_top', col: c, row: r - 3 });
      });
      // Bushes
      [[5, H - 3], [20, H - 3], [40, H - 3], [56, H - 3], [68, H - 3]].forEach(([c, r]) => {
        tiles.push({ type: 'bush', col: c, row: r });
      });
      // Coins
      const targetWord = 'TREE';
      const letterPositions = [[6, 9], [15, 6], [27, 8], [32, 6], [43, 8]];
      targetWord.split('').forEach((letter, i) => {
        const [cx, cy] = letterPositions[i] || [10 + i * 8, 8];
        collectibles.push({
          id: `letter_${i}`, type: 'letter', x: cx * T, y: cy * T,
          w: T * 0.8, h: T * 0.8, value: letter, collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
        });
      });
      // Regular coins
      [[9, 5], [11, 5], [15, 4], [17, 4], [26, 6], [27, 6], [31, 4], [32, 4], [44, 6], [45, 6], [50, 4], [51, 4], [62, 6], [63, 6]].forEach(([cx, cy], i) => {
        collectibles.push({
          id: `coin_${i}`, type: 'coin', x: cx * T, y: cy * T,
          w: T * 0.6, h: T * 0.6, value: '1', collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
        });
      });
      // Stars
      [[16, 3], [44, 5], [62, 5]].forEach(([cx, cy], i) => {
        collectibles.push({
          id: `star_${i}`, type: 'star', x: cx * T, y: cy * T,
          w: T * 0.8, h: T * 0.8, value: '50', collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
        });
      });
      // Enemies
      [[13, H - 3], [24, H - 3], [36, H - 3], [47, H - 3], [64, H - 3]].forEach(([ex, ey], i) => {
        enemies.push({
          id: `enemy_${i}`, type: i % 2 === 0 ? 'mushroom' : 'snail',
          x: ex * T, y: ey * T, w: T * 0.9, h: T * 0.9,
          vx: i % 2 === 0 ? -1.2 : -0.8, facing: 'left', alive: true, squishTimer: 0,
          health: 1, patrolRange: [(ex - 4) * T, (ex + 4) * T], animFrame: 0, animTimer: 0,
        });
      });

      return {
        id: '1-1', name: 'Bước Chân Đầu Tiên', subtitle: 'Thu thập chữ cái để ghép từ TREE',
        worldWidth: W * T, tiles, collectibles, enemies,
        spawnPoint: { x: 2 * T, y: (H - 4) * T },
        exitPoint: { x: (W - 3) * T, y: (H - 3) * T },
        targetWord, quizzes: [MATH_QUESTIONS[0], SPELLING_QUESTIONS[0], SCIENCE_QUESTIONS[0]],
        bgLayers: [], isBossLevel: false,
        storyText: 'Miu bắt đầu hành trình khám phá Khu Rừng Xanh! Hãy nhặt các chữ cái T-R-E-E để hoàn thành từ đầu tiên nhé! 🌳',
      };
    },

    // ============ LEVEL 1-2: Giải đố mở cổng rừng ============
    2: () => {
      const W = 90;
      const H = 14;
      const tiles: TileEntity[] = [];
      const collectibles: Collectible[] = [];
      const enemies: Enemy[] = [];

      for (let c = 0; c < W; c++) {
        if ((c >= 25 && c <= 28) || (c >= 50 && c <= 52) || (c >= 70 && c <= 72)) continue;
        for (let r = H - 2; r < H; r++) tiles.push({ type: 'ground', col: c, row: r });
      }
      // Staircase sections
      for (let step = 0; step < 5; step++) {
        for (let c = 15 + step; c < 15 + step + 1; c++) {
          tiles.push({ type: 'brick', col: c, row: H - 3 - step });
        }
      }
      for (let step = 0; step < 4; step++) {
        for (let c = 40 + step; c < 40 + step + 1; c++) {
          tiles.push({ type: 'brick', col: c, row: H - 3 - step });
        }
      }
      // More question blocks
      [[12, 7], [20, 6], [35, 7], [45, 6], [55, 7], [65, 6], [75, 7]].forEach(([c, r]) => {
        tiles.push({ type: 'question', col: c, row: r, activated: false, bounceOffset: 0, bounceTimer: 0 });
      });
      // Platforms with bridges
      for (let c = 25; c <= 28; c++) tiles.push({ type: 'bridge', col: c, row: H - 4 });
      for (let c = 50; c <= 52; c++) tiles.push({ type: 'bridge', col: c, row: H - 4 });
      // Decorative
      [[5, H - 3], [30, H - 3], [60, H - 3], [80, H - 3]].forEach(([c, r]) => {
        tiles.push({ type: 'tree_trunk', col: c, row: r });
        tiles.push({ type: 'tree_trunk', col: c, row: r - 1 });
        tiles.push({ type: 'tree_top', col: c - 1, row: r - 2 });
        tiles.push({ type: 'tree_top', col: c, row: r - 2 });
        tiles.push({ type: 'tree_top', col: c + 1, row: r - 2 });
        tiles.push({ type: 'tree_top', col: c, row: r - 3 });
      });

      const targetWord = 'FROG';
      [[8, 8], [22, 5], [38, 8], [58, 6], [73, 8]].forEach(([cx, cy], i) => {
        if (i < targetWord.length) {
          collectibles.push({
            id: `letter_${i}`, type: 'letter', x: cx * T, y: cy * T,
            w: T * 0.8, h: T * 0.8, value: targetWord[i], collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
          });
        }
      });
      // Coins scattered
      for (let i = 0; i < 18; i++) {
        const cx = 5 + Math.floor(i * 4.5);
        collectibles.push({
          id: `coin_${i}`, type: 'coin', x: cx * T, y: (H - 5) * T,
          w: T * 0.6, h: T * 0.6, value: '1', collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
        });
      }
      // Enemies
      [[10, H - 3], [30, H - 3], [48, H - 3], [62, H - 3], [78, H - 3], [83, H - 3]].forEach(([ex, ey], i) => {
        enemies.push({
          id: `enemy_${i}`, type: i < 3 ? 'mushroom' : 'squirrel',
          x: ex * T, y: ey * T, w: T * 0.9, h: T * 0.9,
          vx: -1.0, facing: 'left', alive: true, squishTimer: 0,
          health: 1, patrolRange: [(ex - 5) * T, (ex + 5) * T], animFrame: 0, animTimer: 0,
        });
      });

      return {
        id: '1-2', name: 'Cổng Rừng Bí Ẩn', subtitle: 'Vượt qua các hố sâu và cầu treo!',
        worldWidth: W * T, tiles, collectibles, enemies,
        spawnPoint: { x: 2 * T, y: (H - 4) * T },
        exitPoint: { x: (W - 3) * T, y: (H - 3) * T },
        targetWord, quizzes: [MATH_QUESTIONS[1], MATH_QUESTIONS[2], SPELLING_QUESTIONS[1], SPELLING_QUESTIONS[2], SCIENCE_QUESTIONS[1]],
        bgLayers: [], isBossLevel: false,
        storyText: 'Cổng rừng đã bị khóa! Miu phải giải các câu đố ở hộp bí ẩn để mở đường đi tiếp! 🔐',
      };
    },

    // ============ LEVEL 1-3: Đua thuyền qua sông ============
    3: () => {
      const W = 100;
      const H = 14;
      const tiles: TileEntity[] = [];
      const collectibles: Collectible[] = [];
      const enemies: Enemy[] = [];

      // Land sections with water in between
      for (let c = 0; c < 12; c++) for (let r = H - 2; r < H; r++) tiles.push({ type: 'ground', col: c, row: r });
      for (let c = 12; c < 30; c++) { tiles.push({ type: 'water', col: c, row: H - 1 }); tiles.push({ type: 'water', col: c, row: H - 2 }); }
      // Floating platforms over water
      [[14, H - 4], [17, H - 5], [20, H - 4], [23, H - 5], [26, H - 4]].forEach(([c, r]) => {
        tiles.push({ type: 'bridge', col: c, row: r });
        tiles.push({ type: 'bridge', col: c + 1, row: r });
      });
      for (let c = 30; c < 45; c++) for (let r = H - 2; r < H; r++) tiles.push({ type: 'ground', col: c, row: r });
      for (let c = 45; c < 65; c++) { tiles.push({ type: 'water', col: c, row: H - 1 }); tiles.push({ type: 'water', col: c, row: H - 2 }); }
      [[47, H - 4], [50, H - 5], [53, H - 4], [56, H - 5], [59, H - 4], [62, H - 5]].forEach(([c, r]) => {
        tiles.push({ type: 'bridge', col: c, row: r });
        tiles.push({ type: 'bridge', col: c + 1, row: r });
      });
      for (let c = 65; c < W; c++) for (let r = H - 2; r < H; r++) tiles.push({ type: 'ground', col: c, row: r });
      // Question blocks
      [[6, 7], [15, 6], [22, 6], [36, 7], [48, 6], [55, 6], [70, 7], [80, 7]].forEach(([c, r]) => {
        tiles.push({ type: 'question', col: c, row: r, activated: false, bounceOffset: 0, bounceTimer: 0 });
      });
      // Trees on land
      [[3, H - 4], [33, H - 4], [40, H - 4], [68, H - 4], [85, H - 4]].forEach(([c, r]) => {
        tiles.push({ type: 'tree_trunk', col: c, row: r });
        tiles.push({ type: 'tree_top', col: c, row: r - 1 });
        tiles.push({ type: 'tree_top', col: c - 1, row: r - 1 });
        tiles.push({ type: 'tree_top', col: c + 1, row: r - 1 });
      });

      const targetWord = 'FISH';
      [[5, 8], [20, 5], [50, 5], [75, 8]].forEach(([cx, cy], i) => {
        collectibles.push({
          id: `letter_${i}`, type: 'letter', x: cx * T, y: cy * T,
          w: T * 0.8, h: T * 0.8, value: targetWord[i], collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
        });
      });
      for (let i = 0; i < 22; i++) {
        const cx = 3 + Math.floor(i * 4.3);
        collectibles.push({
          id: `coin_${i}`, type: 'coin', x: cx * T, y: (H - 6) * T,
          w: T * 0.6, h: T * 0.6, value: '1', collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
        });
      }
      [[8, H - 3], [35, H - 3], [42, H - 3], [72, H - 3], [88, H - 3]].forEach(([ex, ey], i) => {
        enemies.push({
          id: `enemy_${i}`, type: 'butterfly',
          x: ex * T, y: ey * T, w: T * 0.9, h: T * 0.9,
          vx: -0.8, facing: 'left', alive: true, squishTimer: 0,
          health: 1, patrolRange: [(ex - 3) * T, (ex + 3) * T], animFrame: 0, animTimer: 0,
        });
      });

      return {
        id: '1-3', name: 'Sông Suối Trong Veo', subtitle: 'Nhảy qua sông trên các cầu gỗ!',
        worldWidth: W * T, tiles, collectibles, enemies,
        spawnPoint: { x: 2 * T, y: (H - 4) * T },
        exitPoint: { x: (W - 3) * T, y: (H - 3) * T },
        targetWord, quizzes: [MATH_QUESTIONS[3], MATH_QUESTIONS[4], SPELLING_QUESTIONS[3], SCIENCE_QUESTIONS[2], SCIENCE_QUESTIONS[3]],
        bgLayers: [], isBossLevel: false,
        storyText: 'Một con sông lớn chắn ngang đường! Miu phải nhảy qua các cầu gỗ nổi để sang bờ bên kia. Cẩn thận không rơi xuống nước nhé! 🌊',
      };
    },

    // ============ LEVEL 1-4: Tìm kiếm kho báu ẩn ============
    4: () => {
      const W = 95;
      const H = 14;
      const tiles: TileEntity[] = [];
      const collectibles: Collectible[] = [];
      const enemies: Enemy[] = [];

      for (let c = 0; c < W; c++) {
        if ((c >= 30 && c <= 31) || (c >= 60 && c <= 61)) continue;
        for (let r = H - 2; r < H; r++) tiles.push({ type: 'ground', col: c, row: r });
      }
      // Dense platform maze
      [[5, 8, 10], [12, 15, 6], [18, 22, 8], [25, 29, 5], [33, 37, 9], [40, 44, 7], [47, 50, 5], [54, 58, 8], [62, 65, 6], [68, 72, 9], [75, 78, 7], [80, 84, 5]].forEach(([s, e, r]) => {
        for (let c = s; c <= e; c++) tiles.push({ type: 'brick', col: c, row: r });
      });
      // Many question blocks (treasure hunt!)
      [[7, 7], [14, 5], [20, 7], [27, 4], [35, 8], [42, 6], [49, 4], [56, 7], [64, 5], [70, 8], [77, 6], [82, 4]].forEach(([c, r]) => {
        tiles.push({ type: 'question', col: c, row: r, activated: false, bounceOffset: 0, bounceTimer: 0 });
      });
      // Pipes as obstacles
      [[10, H - 4], [38, H - 5], [58, H - 4], [78, H - 3]].forEach(([c, r]) => {
        tiles.push({ type: 'pipe_top_left', col: c, row: r });
        tiles.push({ type: 'pipe_top_right', col: c + 1, row: r });
        for (let pr = r + 1; pr < H - 2; pr++) {
          tiles.push({ type: 'pipe_left', col: c, row: pr });
          tiles.push({ type: 'pipe_right', col: c + 1, row: pr });
        }
      });

      const targetWord = 'BIRD';
      [[6, 6], [19, 6], [48, 3], [76, 5]].forEach(([cx, cy], i) => {
        collectibles.push({
          id: `letter_${i}`, type: 'letter', x: cx * T, y: cy * T,
          w: T * 0.8, h: T * 0.8, value: targetWord[i], collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
        });
      });
      // Hidden gems!
      [[13, 4], [26, 3], [41, 5], [55, 6], [63, 4], [77, 5]].forEach(([cx, cy], i) => {
        collectibles.push({
          id: `gem_${i}`, type: 'gem', x: cx * T, y: cy * T,
          w: T * 0.7, h: T * 0.7, value: '25', collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
        });
      });
      // Many coins
      for (let i = 0; i < 25; i++) {
        const cx = 4 + Math.floor(i * 3.5);
        collectibles.push({
          id: `coin_${i}`, type: 'coin', x: cx * T, y: (H - 5) * T,
          w: T * 0.6, h: T * 0.6, value: '1', collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
        });
      }
      [[15, H - 3], [28, H - 3], [43, H - 3], [55, H - 3], [67, H - 3], [80, H - 3], [87, H - 3]].forEach(([ex, ey], i) => {
        enemies.push({
          id: `enemy_${i}`, type: i % 3 === 0 ? 'squirrel' : i % 3 === 1 ? 'mushroom' : 'snail',
          x: ex * T, y: ey * T, w: T * 0.9, h: T * 0.9,
          vx: -1.0 - i * 0.1, facing: 'left', alive: true, squishTimer: 0,
          health: 1, patrolRange: [(ex - 4) * T, (ex + 4) * T], animFrame: 0, animTimer: 0,
        });
      });

      return {
        id: '1-4', name: 'Kho Báu Ẩn Giấu', subtitle: 'Tìm tất cả đá quý và hộp bí ẩn!',
        worldWidth: W * T, tiles, collectibles, enemies,
        spawnPoint: { x: 2 * T, y: (H - 4) * T },
        exitPoint: { x: (W - 3) * T, y: (H - 3) * T },
        targetWord, quizzes: [...MATH_QUESTIONS.slice(4, 7), ...SPELLING_QUESTIONS.slice(4, 6), SCIENCE_QUESTIONS[4]],
        bgLayers: [], isBossLevel: false,
        storyText: 'Miu nghe tin trong rừng có một kho báu bí ẩn! Hãy tìm tất cả các viên đá quý 💎 ẩn giấu trên đường đi nhé!',
      };
    },

    // ============ LEVEL 1-5: BOSS — Cú Mèo Thông Thái ============
    5: () => {
      const W = 60;
      const H = 14;
      const tiles: TileEntity[] = [];
      const collectibles: Collectible[] = [];
      const enemies: Enemy[] = [];

      // Arena-style flat ground
      for (let c = 0; c < W; c++) {
        for (let r = H - 2; r < H; r++) tiles.push({ type: 'ground', col: c, row: r });
      }
      // Elevated platforms for boss arena
      for (let c = 5; c < 15; c++) tiles.push({ type: 'brick', col: c, row: 8 });
      for (let c = 20; c < 30; c++) tiles.push({ type: 'brick', col: c, row: 6 });
      for (let c = 35; c < 45; c++) tiles.push({ type: 'brick', col: c, row: 8 });
      for (let c = 15; c < 20; c++) tiles.push({ type: 'brick', col: c, row: 4 });
      for (let c = 30; c < 35; c++) tiles.push({ type: 'brick', col: c, row: 4 });
      // Question blocks throughout arena
      [[8, 7], [12, 7], [22, 5], [27, 5], [37, 7], [42, 7], [17, 3], [32, 3]].forEach(([c, r]) => {
        tiles.push({ type: 'question', col: c, row: r, activated: false, bounceOffset: 0, bounceTimer: 0 });
      });
      // Trees at edges
      [[2, H - 4], [W - 4, H - 4]].forEach(([c, r]) => {
        tiles.push({ type: 'tree_trunk', col: c, row: r });
        tiles.push({ type: 'tree_top', col: c, row: r - 1 });
        tiles.push({ type: 'tree_top', col: c - 1, row: r - 1 });
        tiles.push({ type: 'tree_top', col: c + 1, row: r - 1 });
      });
      // Coins throughout arena
      for (let i = 0; i < 15; i++) {
        const cx = 4 + i * 3.5;
        collectibles.push({
          id: `coin_${i}`, type: 'coin', x: cx * T, y: (H - 5) * T,
          w: T * 0.6, h: T * 0.6, value: '1', collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
        });
      }
      // Hearts for healing
      [[16, 2], [31, 2]].forEach(([cx, cy], i) => {
        collectibles.push({
          id: `heart_${i}`, type: 'heart', x: cx * T, y: cy * T,
          w: T * 0.7, h: T * 0.7, value: '1', collected: false, floatOffset: 0, floatTimer: Math.random() * Math.PI * 2,
        });
      });
      // Boss: Owl
      enemies.push({
        id: 'boss_owl', type: 'boss_owl',
        x: 28 * T, y: 3 * T, w: T * 2.2, h: T * 2.2,
        vx: 1.5, facing: 'right', alive: true, squishTimer: 0,
        health: 5, patrolRange: [8 * T, (W - 10) * T], animFrame: 0, animTimer: 0,
      });
      // Minion enemies
      [[10, H - 3], [25, H - 3], [40, H - 3]].forEach(([ex, ey], i) => {
        enemies.push({
          id: `minion_${i}`, type: 'mushroom',
          x: ex * T, y: ey * T, w: T * 0.9, h: T * 0.9,
          vx: -1.2, facing: 'left', alive: true, squishTimer: 0,
          health: 1, patrolRange: [(ex - 5) * T, (ex + 5) * T], animFrame: 0, animTimer: 0,
        });
      });

      return {
        id: '1-5', name: '⭐ Cú Mèo Thông Thái', subtitle: 'Boss cuối: Trả lời 5 câu đố để chiến thắng!',
        worldWidth: W * T, tiles, collectibles, enemies,
        spawnPoint: { x: 2 * T, y: (H - 4) * T },
        exitPoint: { x: (W - 3) * T, y: (H - 3) * T },
        targetWord: 'OWL', quizzes: [...MATH_QUESTIONS.slice(5, 8), ...SPELLING_QUESTIONS.slice(5, 7), ...SCIENCE_QUESTIONS.slice(3, 5)],
        bgLayers: [], isBossLevel: true,
        storyText: '🦉 Cú Mèo Thông Thái canh giữ lối ra khỏi rừng! Chỉ những bạn nhỏ giỏi giang mới có thể trả lời đúng 5 câu đố để vượt qua! Chiến đấu nào! ⚔️',
      };
    },
  };

  return (levels[levelNum] || levels[1])();
}

// ============================================================
// PIXEL ART TILE RENDERER HELPERS
// ============================================================
const renderTile = (tile: TileEntity, tileSize: number): { bg: string; border: string; emoji: string; highlight?: string } => {
  switch (tile.type) {
    case 'ground': return { bg: FOREST_PALETTE.groundTop, border: FOREST_PALETTE.groundMid, emoji: '', highlight: FOREST_PALETTE.groundBottom };
    case 'brick': return { bg: FOREST_PALETTE.brick, border: FOREST_PALETTE.brickDark, emoji: '' };
    case 'question': return { bg: tile.activated ? '#8B6914' : FOREST_PALETTE.questionBlock, border: tile.activated ? '#5A4510' : FOREST_PALETTE.questionBlockDark, emoji: tile.activated ? '' : '❓' };
    case 'pipe_top_left': case 'pipe_top_right': return { bg: FOREST_PALETTE.pipe, border: FOREST_PALETTE.pipeDark, emoji: '', highlight: FOREST_PALETTE.pipeHighlight };
    case 'pipe_left': case 'pipe_right': return { bg: FOREST_PALETTE.pipe, border: FOREST_PALETTE.pipeDark, emoji: '' };
    case 'tree_trunk': return { bg: FOREST_PALETTE.treeTrunk, border: '#6B4F0A', emoji: '' };
    case 'tree_top': return { bg: FOREST_PALETTE.treeLeaves, border: FOREST_PALETTE.treeLeavesLight, emoji: '' };
    case 'bush': return { bg: FOREST_PALETTE.bush, border: FOREST_PALETTE.bushLight, emoji: '🌿' };
    case 'water': return { bg: FOREST_PALETTE.water, border: FOREST_PALETTE.waterDeep, emoji: '' };
    case 'bridge': return { bg: '#8B6914', border: '#6B4F0A', emoji: '' };
    default: return { bg: 'transparent', border: 'transparent', emoji: '' };
  }
};

const isSolidTile = (type: string) => ['ground', 'brick', 'question', 'pipe_top_left', 'pipe_top_right', 'pipe_left', 'pipe_right', 'bridge'].includes(type);

// ============================================================
// MAIN COMPONENT
// ============================================================
export const ExplorerGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();
  const TILE = PHYSICS.TILE;
  const VIEWPORT_W = SCREEN_W;
  const VIEWPORT_H = SCREEN_H; // Toàn màn hình — không còn thanh controls phía dưới

  // ─────────── Game State ───────────
  const [phase, setPhase] = useState<GamePhase>('world_map');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedChar, setSelectedChar] = useState<CharacterInfo>(CHARACTERS[0]);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [stars, setStars] = useState(0);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [levelStars, setLevelStars] = useState<Record<string, number>>({});
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [bossHealth, setBossHealth] = useState(5);
  const [showHint, setShowHint] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [levelMessage, setLevelMessage] = useState('');
  const [levelCompleteStars, setLevelCompleteStars] = useState(0);
  const [unlockedCharacters, setUnlockedCharacters] = useState<string[]>(['cat']);

  // ─────────── Refs for Game Loop ───────────
  const playerRef = useRef<PlayerState>({
    x: 0, y: 0, vx: 0, vy: 0, w: TILE * 0.85, h: TILE * 1.1,
    isGrounded: false, facing: 'right', isInvincible: false, invincibleTimer: 0,
    animFrame: 0, animTimer: 0, isJumping: false, isDead: false,
  });
  const cameraRef = useRef({ x: 0, y: 0 });
  // inputRef — nguồn sự thật duy nhất cho input engine
  const inputRef = useRef({
    left: false, right: false,
    jump: false, jumpPressed: false,
    run: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    // Điểm chạm khởi đầu (tính từ khi ngón tay đặt xuống)
    touchStartX: 0,
    touchStartY: 0,
    lastDx: 0,
    isTouching: false,
    // Dùng cho nhận biết swipe up nhanh
    touchStartTime: 0,
    // Bỏ các trường cũ của 2-zone (giữ để không lỗi ref)
    leftTouchX: 0, leftDragDx: 0, isLeftTouching: false,
    rightTouchStartY: 0, isRightTouching: false,
  });
  // Floating joystick trên màn hình (xuất hiện ngay dưới ngón tay)
  const joystickPos = useRef({ x: 0, y: 0 }).current;
  const joystickDrag = useRef({ dx: 0 }).current;
  const [showJoystick, setShowJoystick] = useState(false);
  const [joystickCenter, setJoystickCenter] = useState({ x: 0, y: 0 });
  const [joystickOffset, setJoystickOffset] = useState(0);
  // Ripple hiệu ứng khi nhảy
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });
  // Glow xung quanh nhân vật khi đang được điều khiển
  const charGlowAnim = useRef(new Animated.Value(0)).current;
  const frameRef = useRef<number | null>(null);
  const levelDataRef = useRef<LevelData | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const tickRef = useRef(0);

  // ─────────── Animated Values ───────────
  const parallaxBg1 = useRef(new Animated.Value(0)).current;
  const parallaxBg2 = useRef(new Animated.Value(0)).current;
  const parallaxBg3 = useRef(new Animated.Value(0)).current;
  const hudPulse = useRef(new Animated.Value(1)).current;
  const quizSlideAnim = useRef(new Animated.Value(0)).current;
  const victoryAnim = useRef(new Animated.Value(0)).current;
  const screenShake = useRef(new Animated.Value(0)).current;
  const coinPopAnim = useRef(new Animated.Value(0)).current;
  const bossShakeAnim = useRef(new Animated.Value(0)).current;

  // ─────────── Force re-render counter ───────────
  const [renderTick, setRenderTick] = useState(0);

  // ============================================================
  // LEVEL INITIALIZATION
  // ============================================================
  const initLevel = useCallback((levelNum: number) => {
    const data = generateForestLevel(levelNum);
    levelDataRef.current = data;

    const p = playerRef.current;
    p.x = data.spawnPoint.x;
    p.y = data.spawnPoint.y;
    p.vx = 0; p.vy = 0;
    p.isGrounded = false;
    p.facing = 'right';
    p.isInvincible = false;
    p.invincibleTimer = 0;
    p.animFrame = 0;
    p.isDead = false;

    cameraRef.current = { x: 0, y: 0 };
    particlesRef.current = [];
    tickRef.current = 0;

    setCollectedLetters([]);
    setQuizCorrect(0);
    setQuizTotal(0);
    setCurrentQuiz(null);
    setQuizResult(null);
    setComboCount(0);
    setLevelMessage('');

    if (data.isBossLevel) {
      setBossHealth(5);
    }
  }, []);

  // ============================================================
  // PHYSICS UPDATE
  // ============================================================
  const updatePhysics = useCallback(() => {
    const p = playerRef.current;
    const inp = inputRef.current;
    const ld = levelDataRef.current;
    if (!ld || p.isDead) return;

    // Horizontal movement — swipe-based auto-sprint
    const targetSpeed = inp.run ? PHYSICS.RUN_SPEED : PHYSICS.MOVE_SPEED;
    if (inp.left) {
      p.vx = Math.max(p.vx - PHYSICS.ACCEL, -targetSpeed);
      p.facing = 'left';
    } else if (inp.right) {
      p.vx = Math.min(p.vx + PHYSICS.ACCEL, targetSpeed);
      p.facing = 'right';
    } else {
      p.vx *= PHYSICS.FRICTION;
      if (Math.abs(p.vx) < 0.1) p.vx = 0;
    }

    // ── Coyote Time: duy trì khả năng nhảy ngay sau khi rời mép ──
    if (p.isGrounded) {
      inp.coyoteTimer = PHYSICS.COYOTE_FRAMES;
    } else if (inp.coyoteTimer > 0) {
      inp.coyoteTimer--;
    }

    // ── Jump Buffer: ghi nhớ lệnh nhảy trước khi chạm đất ──
    if (inp.jump && !inp.jumpPressed) {
      inp.jumpBufferTimer = PHYSICS.JUMP_BUFFER_FRAMES;
    }
    if (inp.jumpBufferTimer > 0) inp.jumpBufferTimer--;

    // ── Thực thi nhảy: coyote time + jump buffer kết hợp ──
    const canJump = inp.coyoteTimer > 0 || p.isGrounded;
    const wantsJump = inp.jumpBufferTimer > 0;
    if (wantsJump && canJump && !inp.jumpPressed) {
      p.vy = PHYSICS.JUMP_FORCE;
      p.isGrounded = false;
      p.isJumping = true;
      inp.jumpPressed = true;
      inp.coyoteTimer = 0;
      inp.jumpBufferTimer = 0;
      soundManager.play(undefined, 'Nhảy!');
    }

    // Gravity
    p.vy += PHYSICS.GRAVITY;
    if (p.vy > PHYSICS.MAX_FALL) p.vy = PHYSICS.MAX_FALL;

    // Move X
    p.x += p.vx;
    // Clamp to world bounds
    if (p.x < 0) { p.x = 0; p.vx = 0; }
    if (p.x + p.w > ld.worldWidth) { p.x = ld.worldWidth - p.w; p.vx = 0; }

    // X collision with solid tiles
    for (const tile of ld.tiles) {
      if (!isSolidTile(tile.type)) continue;
      const tx = tile.col * TILE;
      const ty = tile.row * TILE + (tile.bounceOffset || 0);
      if (p.x + p.w > tx && p.x < tx + TILE && p.y + p.h > ty && p.y < ty + TILE) {
        // Horizontal resolution
        if (p.vx > 0) { p.x = tx - p.w; p.vx = 0; }
        else if (p.vx < 0) { p.x = tx + TILE; p.vx = 0; }
      }
    }

    // Move Y
    p.y += p.vy;
    p.isGrounded = false;

    // Y collision with solid tiles
    for (const tile of ld.tiles) {
      if (!isSolidTile(tile.type)) continue;
      const tx = tile.col * TILE;
      const ty = tile.row * TILE + (tile.bounceOffset || 0);
      if (p.x + p.w > tx + 2 && p.x < tx + TILE - 2 && p.y + p.h > ty && p.y < ty + TILE) {
        if (p.vy > 0 && p.y + p.h - p.vy <= ty + 2) {
          // Landing on top
          p.y = ty - p.h;
          p.vy = 0;
          p.isGrounded = true;
          p.isJumping = false;
        } else if (p.vy < 0 && p.y - p.vy >= ty + TILE - 2) {
          // Hit head on bottom of tile
          p.y = ty + TILE;
          p.vy = 1;

          // Question block activation
          if (tile.type === 'question' && !tile.activated) {
            tile.activated = true;
            tile.bounceTimer = 10;
            tile.bounceOffset = -6;
            // Spawn quiz or coin
            if (ld.quizzes.length > 0 && Math.random() > 0.3) {
              const q = ld.quizzes.shift();
              if (q) {
                setCurrentQuiz(q);
                setPhase('quiz');
              }
            } else {
              setCoins(c => c + 5);
              setScore(s => s + 50);
              spawnParticles(tx + TILE / 2, ty - 10, FOREST_PALETTE.coin, 6, '🪙');
            }
          }
        }
      }
    }

    // Bounce timer for question blocks
    for (const tile of ld.tiles) {
      if (tile.bounceTimer && tile.bounceTimer > 0) {
        tile.bounceTimer--;
        tile.bounceOffset = tile.bounceTimer > 5 ? -6 : (-6 * tile.bounceTimer / 5);
        if (tile.bounceTimer <= 0) tile.bounceOffset = 0;
      }
    }

    // Fall into pit/water
    if (p.y > ld.tiles.reduce((max, t) => Math.max(max, t.row), 0) * TILE + TILE * 3) {
      handlePlayerDeath();
      return;
    }

    // Invincibility timer
    if (p.isInvincible) {
      p.invincibleTimer--;
      if (p.invincibleTimer <= 0) {
        p.isInvincible = false;
      }
    }

    // Animation
    p.animTimer++;
    if (p.animTimer > 8) {
      p.animTimer = 0;
      p.animFrame = (p.animFrame + 1) % 2;
    }

    // ─── Collectible checks ───
    for (const c of ld.collectibles) {
      if (c.collected) continue;
      c.floatTimer += 0.05;
      c.floatOffset = Math.sin(c.floatTimer) * 4;

      if (p.x + p.w > c.x && p.x < c.x + c.w && p.y + p.h > c.y + c.floatOffset && p.y < c.y + c.floatOffset + c.h) {
        c.collected = true;
        switch (c.type) {
          case 'coin':
            setCoins(prev => prev + 1);
            setScore(prev => prev + 10);
            spawnParticles(c.x, c.y, FOREST_PALETTE.coin, 4, '🪙');
            break;
          case 'letter':
            setCollectedLetters(prev => [...prev, c.value]);
            setScore(prev => prev + 100);
            soundManager.speak(c.value, 'en');
            spawnParticles(c.x, c.y, FOREST_PALETTE.letterBg, 8, c.value);
            break;
          case 'star':
            setStars(prev => prev + 1);
            setScore(prev => prev + 50);
            spawnParticles(c.x, c.y, FOREST_PALETTE.star, 10, '⭐');
            break;
          case 'heart':
            setLives(prev => Math.min(prev + 1, 5));
            spawnParticles(c.x, c.y, FOREST_PALETTE.heart, 6, '❤️');
            break;
          case 'gem':
            setScore(prev => prev + 250);
            setCoins(prev => prev + 25);
            spawnParticles(c.x, c.y, FOREST_PALETTE.gem, 12, '💎');
            break;
        }
        Animated.sequence([
          Animated.timing(coinPopAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(coinPopAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        ]).start();
      }
    }

    // ─── Enemy logic ───
    for (const e of ld.enemies) {
      if (!e.alive) {
        if (e.squishTimer > 0) e.squishTimer--;
        continue;
      }
      // Enemy movement
      e.x += e.vx;
      if (e.x <= e.patrolRange[0] || e.x >= e.patrolRange[1]) {
        e.vx *= -1;
        e.facing = e.vx < 0 ? 'left' : 'right';
      }
      e.animTimer++;
      if (e.animTimer > 12) { e.animTimer = 0; e.animFrame = (e.animFrame + 1) % 2; }

      // Player-Enemy collision
      if (p.isInvincible) continue;
      if (p.x + p.w > e.x + 4 && p.x < e.x + e.w - 4 && p.y + p.h > e.y + 4 && p.y < e.y + e.h - 4) {
        if (p.vy > 0 && p.y + p.h < e.y + e.h * 0.6) {
          // Stomp!
          if (e.type === 'boss_owl') {
            e.health--;
            setBossHealth(e.health);
            if (e.health <= 0) {
              e.alive = false;
              e.squishTimer = 30;
              setScore(s => s + 1000);
              spawnParticles(e.x, e.y, '#FFD700', 20, '🏆');
              // Trigger boss quiz battle
              if (ld.quizzes.length > 0) {
                const q = ld.quizzes.shift();
                if (q) { setCurrentQuiz(q); setPhase('boss_fight'); }
              } else {
                setTimeout(() => handleLevelComplete(), 500);
              }
            } else {
              spawnParticles(e.x, e.y, '#FF4757', 10, '💥');
              Animated.sequence([
                Animated.timing(bossShakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
                Animated.timing(bossShakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
                Animated.timing(bossShakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
              ]).start();
            }
            p.vy = PHYSICS.BOUNCE_FORCE;
          } else {
            e.alive = false;
            e.squishTimer = 20;
            p.vy = PHYSICS.BOUNCE_FORCE;
            setScore(s => s + 100);
            setComboCount(c => c + 1);
            spawnParticles(e.x, e.y, '#FFD700', 6, '💫');
          }
        } else {
          // Hurt
          handlePlayerHit();
        }
      }
    }

    // ─── Check exit ───
    const dist = Math.sqrt(Math.pow(p.x - ld.exitPoint.x, 2) + Math.pow(p.y - ld.exitPoint.y, 2));
    if (dist < TILE * 1.5 && !ld.isBossLevel) {
      handleLevelComplete();
    }
    // For boss levels, exit is only available after boss is defeated
    if (ld.isBossLevel && dist < TILE * 1.5) {
      const bossAlive = ld.enemies.some(e => e.type === 'boss_owl' && e.alive);
      if (!bossAlive) handleLevelComplete();
    }

    // Particle update
    particlesRef.current = particlesRef.current.filter(pt => {
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.vy += 0.15;
      pt.life--;
      return pt.life > 0;
    });

    // Update camera
    const targetCamX = p.x - VIEWPORT_W * 0.4;
    const targetCamY = p.y - VIEWPORT_H * 0.5;
    cameraRef.current.x += (Math.max(0, Math.min(targetCamX, ld.worldWidth - VIEWPORT_W)) - cameraRef.current.x) * 0.1;
    cameraRef.current.y += (Math.max(0, Math.min(targetCamY, 0)) - cameraRef.current.y) * 0.1;

    tickRef.current++;
  }, [VIEWPORT_W, VIEWPORT_H, TILE]);

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  const spawnParticles = useCallback((x: number, y: number, color: string, count: number, emoji?: string) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x, y, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 8 - 2,
        life: 30 + Math.random() * 20, maxLife: 50, color, size: 4 + Math.random() * 4,
        emoji: emoji && i < 3 ? emoji : undefined,
      });
    }
  }, []);

  const handlePlayerHit = useCallback(() => {
    const p = playerRef.current;
    if (p.isInvincible || p.isDead) return;

    setLives(prev => {
      if (prev <= 1) {
        handlePlayerDeath();
        return 0;
      }
      return prev - 1;
    });
    p.isInvincible = true;
    p.invincibleTimer = PHYSICS.INVINCIBLE_TIME;
    p.vx = p.facing === 'right' ? -3 : 3; // Knockback
    p.vy = -5;

    Animated.sequence([
      Animated.timing(screenShake, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(screenShake, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(screenShake, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(screenShake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePlayerDeath = useCallback(() => {
    const p = playerRef.current;
    p.isDead = true;
    setLives(prev => {
      if (prev <= 0) {
        setTimeout(() => setPhase('game_over'), 1000);
        return 0;
      }
      setTimeout(() => {
        initLevel(currentLevel);
        setPhase('playing');
      }, 1500);
      return prev - 1;
    });
  }, [currentLevel, initLevel]);

  const handleLevelComplete = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const ld = levelDataRef.current;
    if (!ld) return;

    const totalCollectibles = ld.collectibles.length;
    const collected = ld.collectibles.filter(c => c.collected).length;
    const ratio = totalCollectibles > 0 ? collected / totalCollectibles : 1;
    const earnedStars = ratio > 0.9 ? 3 : ratio > 0.6 ? 2 : 1;

    setLevelCompleteStars(earnedStars);
    setLevelStars(prev => ({ ...prev, [ld.id]: Math.max(prev[ld.id] || 0, earnedStars) }));

    // Unlock characters based on level
    if (currentLevel >= 2 && !unlockedCharacters.includes('dog')) {
      setUnlockedCharacters(prev => [...prev, 'dog']);
    }
    if (currentLevel >= 3 && !unlockedCharacters.includes('bunny')) {
      setUnlockedCharacters(prev => [...prev, 'bunny']);
    }
    if (currentLevel >= 4 && !unlockedCharacters.includes('fox')) {
      setUnlockedCharacters(prev => [...prev, 'fox']);
    }
    if (currentLevel >= 5 && !unlockedCharacters.includes('panda')) {
      setUnlockedCharacters(prev => [...prev, 'panda']);
    }

    Animated.timing(victoryAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    soundManager.speak('Giỏi lắm! Bé đã hoàn thành màn chơi!', 'vi');
    setPhase('level_complete');
  }, [currentLevel, unlockedCharacters]);

  // ============================================================
  // QUIZ HANDLERS
  // ============================================================
  const handleQuizAnswer = useCallback((answer: string) => {
    if (!currentQuiz) return;
    const isCorrect = answer === currentQuiz.correctAnswer;
    setQuizResult(isCorrect ? 'correct' : 'wrong');
    setQuizTotal(prev => prev + 1);

    if (isCorrect) {
      setQuizCorrect(prev => prev + 1);
      setScore(prev => prev + 200);
      setCoins(prev => prev + 5);
      soundManager.speak('Đúng rồi! Giỏi lắm!', 'vi');
      spawnParticles(SCREEN_W / 2, SCREEN_H / 2, '#FFD700', 15, '⭐');
    } else {
      soundManager.speak('Sai rồi! Thử lại nhé bé ơi!', 'vi');
    }

    setTimeout(() => {
      setQuizResult(null);
      setCurrentQuiz(null);
      setPhase('playing');
      startGameLoop();
    }, isCorrect ? 1200 : 2000);
  }, [currentQuiz, SCREEN_W, SCREEN_H]);

  // ============================================================
  // GAME LOOP
  // ============================================================
  const startGameLoop = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const loop = () => {
      updatePhysics();
      setRenderTick(t => t + 1);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
  }, [updatePhysics]);

  const stopGameLoop = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  // Start/stop game loop based on phase
  useEffect(() => {
    if (phase === 'playing') {
      startGameLoop();
    } else {
      stopGameLoop();
    }
    return () => stopGameLoop();
  }, [phase, startGameLoop, stopGameLoop]);

  // ============================================================
  // START LEVEL
  // ============================================================
  const startLevel = useCallback((levelNum: number) => {
    setCurrentLevel(levelNum);
    initLevel(levelNum);
    setPhase('level_intro');
    setTimeout(() => {
      setPhase('playing');
    }, 3000);
  }, [initLevel]);

  // ============================================================
  // RENDER FUNCTIONS
  // ============================================================
  const player = playerRef.current;
  const cam = cameraRef.current;
  const ld = levelDataRef.current;

  // ─── Visible tiles (culling) ───
  const visibleTiles = useMemo(() => {
    if (!ld) return [];
    const startCol = Math.floor(cam.x / TILE) - 1;
    const endCol = Math.ceil((cam.x + VIEWPORT_W) / TILE) + 1;
    const startRow = 0;
    const endRow = 20;
    return ld.tiles.filter(t => t.col >= startCol && t.col <= endCol && t.row >= startRow && t.row <= endRow);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ld, Math.floor(cam.x / TILE), VIEWPORT_W, TILE]);

  // ─── Visible collectibles ───
  const visibleCollectibles = useMemo(() => {
    if (!ld) return [];
    return ld.collectibles.filter(c =>
      !c.collected && c.x > cam.x - TILE * 2 && c.x < cam.x + VIEWPORT_W + TILE * 2
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ld, Math.floor(cam.x / 100), VIEWPORT_W, renderTick]);

  // ─── Visible enemies ───
  const visibleEnemies = useMemo(() => {
    if (!ld) return [];
    return ld.enemies.filter(e =>
      (e.alive || e.squishTimer > 0) && e.x > cam.x - TILE * 3 && e.x < cam.x + VIEWPORT_W + TILE * 3
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ld, Math.floor(cam.x / 100), VIEWPORT_W, renderTick]);

  // ============================================================
  // RENDER: WORLD MAP
  // ============================================================
  if (phase === 'world_map') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.worldMapContainer}>
          {/* Parallax forest background */}
          <View style={styles.worldMapBg}>
            <Text style={styles.worldMapMountain}>{'⛰️'.repeat(8)}</Text>
            <Text style={styles.worldMapTrees}>{'🌲🌳🌲🌳🌲🌳🌲🌳🌲🌳'}</Text>
          </View>

          <View style={styles.worldMapHeader}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn}>
              <Text style={styles.backBtnText}>◀ Thoát</Text>
            </TouchableOpacity>
            <View style={styles.worldMapTitleContainer}>
              <Text style={styles.worldMapTitle}>🌍 BÉ KHÁM PHÁ THẾ GIỚI</Text>
              <Text style={styles.worldMapSubtitle}>Thế Giới 1: Khu Rừng Xanh 🌳</Text>
            </View>
            <View style={styles.worldMapStats}>
              <Text style={styles.worldMapStatText}>⭐ {stars}</Text>
              <Text style={styles.worldMapStatText}>🪙 {coins}</Text>
            </View>
          </View>

          {/* Character button */}
          <TouchableOpacity
            style={[styles.charSelectBtn, { backgroundColor: selectedChar.color + '40' }]}
            onPress={() => setPhase('character_select')}
          >
            <Text style={styles.charSelectEmoji}>{selectedChar.emoji}</Text>
            <Text style={styles.charSelectName}>{selectedChar.name}</Text>
          </TouchableOpacity>

          {/* Level nodes */}
          <View style={styles.levelNodesContainer}>
            {[1, 2, 3, 4, 5].map((lvl) => {
              const levelId = `1-${lvl}`;
              const isLocked = lvl > 1 && !levelStars[`1-${lvl - 1}`];
              const earnedStars = levelStars[levelId] || 0;
              const isCompleted = earnedStars > 0;
              const isBoss = lvl === 5;

              return (
                <TouchableOpacity
                  key={lvl}
                  style={[
                    styles.levelNode,
                    isLocked && styles.levelNodeLocked,
                    isCompleted && styles.levelNodeCompleted,
                    isBoss && styles.levelNodeBoss,
                  ]}
                  disabled={isLocked}
                  onPress={() => startLevel(lvl)}
                >
                  {isLocked ? (
                    <Text style={styles.levelNodeLockEmoji}>🔒</Text>
                  ) : (
                    <>
                      <Text style={styles.levelNodeNumber}>{isBoss ? '⭐' : `1-${lvl}`}</Text>
                      <Text style={styles.levelNodeName}>
                        {lvl === 1 ? 'Bước Chân\nĐầu Tiên' :
                         lvl === 2 ? 'Cổng Rừng\nBí Ẩn' :
                         lvl === 3 ? 'Sông Suối\nTrong Veo' :
                         lvl === 4 ? 'Kho Báu\nẨn Giấu' :
                         '🦉 BOSS\nCú Mèo'}
                      </Text>
                      {isCompleted && (
                        <Text style={styles.levelNodeStars}>
                          {'⭐'.repeat(earnedStars)}{'☆'.repeat(3 - earnedStars)}
                        </Text>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Path connecting nodes */}
          <View style={styles.levelPathContainer}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={[styles.levelPath, levelStars[`1-${i}`] ? styles.levelPathActive : {}]} />
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // RENDER: CHARACTER SELECT
  // ============================================================
  if (phase === 'character_select') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.charScreenContainer}>
          <Text style={styles.charScreenTitle}>👤 CHỌN NHÂN VẬT</Text>
          <View style={styles.charGrid}>
            {CHARACTERS.map(char => {
              const isUnlocked = unlockedCharacters.includes(char.id);
              const isSelected = selectedChar.id === char.id;
              return (
                <TouchableOpacity
                  key={char.id}
                  style={[
                    styles.charCard,
                    !isUnlocked && styles.charCardLocked,
                    isSelected && { borderColor: char.color, borderWidth: 3 },
                  ]}
                  disabled={!isUnlocked}
                  onPress={() => {
                    setSelectedChar(char);
                  }}
                >
                  <Text style={styles.charCardEmoji}>{isUnlocked ? char.emoji : '🔒'}</Text>
                  <Text style={[styles.charCardName, { color: isUnlocked ? char.color : '#666' }]}>{char.name}</Text>
                  {isUnlocked && <Text style={styles.charCardAbility}>{char.ability}</Text>}
                  {!isUnlocked && <Text style={styles.charCardLockText}>Mở khóa sau</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={styles.charConfirmBtn} onPress={() => setPhase('world_map')}>
            <Text style={styles.charConfirmText}>✅ Xác Nhận: {selectedChar.name} {selectedChar.emoji}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // RENDER: LEVEL INTRO
  // ============================================================
  if (phase === 'level_intro') {
    const introData = generateForestLevel(currentLevel);
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.levelIntroContainer}>
          <Animated.View style={[styles.levelIntroBg]}>
            <Text style={styles.levelIntroWorldEmoji}>🌳🌿🌲🍃🌻🌸</Text>
            <Text style={styles.levelIntroTitle}>MÀN {introData.id}</Text>
            <Text style={styles.levelIntroName}>{introData.name}</Text>
            <View style={styles.levelIntroDivider} />
            <Text style={styles.levelIntroStory}>{introData.storyText}</Text>
            <View style={styles.levelIntroGoal}>
              <Text style={styles.levelIntroGoalLabel}>🎯 Mục tiêu:</Text>
              <Text style={styles.levelIntroGoalText}>{introData.subtitle}</Text>
              {introData.targetWord && (
                <View style={styles.levelIntroWordContainer}>
                  <Text style={styles.levelIntroWordLabel}>Ghép từ:</Text>
                  {introData.targetWord.split('').map((l, i) => (
                    <View key={i} style={styles.levelIntroLetterBox}>
                      <Text style={styles.levelIntroLetter}>{l}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.levelIntroCharPreview}>
              <Text style={styles.levelIntroCharEmoji}>{selectedChar.emoji}</Text>
              <Text style={styles.levelIntroCharName}>{selectedChar.name} sẵn sàng!</Text>
            </View>
            <Text style={styles.levelIntroCountdown}>Bắt đầu trong...</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // RENDER: QUIZ OVERLAY
  // ============================================================
  if ((phase === 'quiz' || phase === 'boss_fight') && currentQuiz) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={[styles.quizContainer, phase === 'boss_fight' && styles.bossQuizContainer]}>
          {phase === 'boss_fight' && (
            <View style={styles.bossHeader}>
              <Text style={styles.bossEmoji}>🦉</Text>
              <Text style={styles.bossTitle}>Cú Mèo Thông Thái hỏi:</Text>
              <View style={styles.bossHealthBar}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Text key={i} style={styles.bossHealthHeart}>{i < bossHealth ? '❤️' : '🖤'}</Text>
                ))}
              </View>
            </View>
          )}

          <View style={styles.quizCard}>
            <View style={styles.quizTypeTag}>
              <Text style={styles.quizTypeText}>
                {currentQuiz.type === 'math' ? '🧮 Toán Học' :
                 currentQuiz.type === 'spelling' ? '🔤 Tiếng Anh' :
                 currentQuiz.type === 'science' ? '🔬 Khoa Học' : '🧩 Logic'}
              </Text>
            </View>

            <Text style={styles.quizQuestion}>{currentQuiz.question}</Text>

            <View style={styles.quizOptions}>
              {currentQuiz.options.map((opt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.quizOptionBtn,
                    quizResult === 'correct' && opt.value === currentQuiz.correctAnswer && styles.quizOptionCorrect,
                    quizResult === 'wrong' && opt.value === currentQuiz.correctAnswer && styles.quizOptionCorrect,
                    quizResult === 'wrong' && opt.value !== currentQuiz.correctAnswer && styles.quizOptionWrong,
                  ]}
                  disabled={quizResult !== null}
                  onPress={() => handleQuizAnswer(opt.value)}
                >
                  <Text style={styles.quizOptionEmoji}>{opt.emoji}</Text>
                  <Text style={styles.quizOptionLabel}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {quizResult && (
              <View style={[styles.quizResultBanner, quizResult === 'correct' ? styles.quizResultCorrect : styles.quizResultWrong]}>
                <Text style={styles.quizResultText}>
                  {quizResult === 'correct' ? '🎉 ĐÚNG RỒI! +200 điểm!' : '😊 Sai rồi! Đáp án đúng đã sáng lên!'}
                </Text>
              </View>
            )}

            {showHint && (
              <View style={styles.hintContainer}>
                <Text style={styles.hintText}>💡 Gợi ý: {currentQuiz.hint}</Text>
              </View>
            )}

            {!quizResult && (
              <TouchableOpacity style={styles.hintBtn} onPress={() => setShowHint(true)}>
                <Text style={styles.hintBtnText}>💡 Gợi ý</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // RENDER: LEVEL COMPLETE
  // ============================================================
  if (phase === 'level_complete') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.levelCompleteContainer}>
          <Text style={styles.levelCompleteTitle}>🎉 HOÀN THÀNH!</Text>
          <Text style={styles.levelCompleteLevelName}>Màn {currentLevel}: {levelDataRef.current?.name}</Text>

          <View style={styles.levelCompleteStarsRow}>
            {[1, 2, 3].map(i => (
              <Text key={i} style={styles.levelCompleteStar}>
                {i <= levelCompleteStars ? '⭐' : '☆'}
              </Text>
            ))}
          </View>

          <View style={styles.levelCompleteStats}>
            <View style={styles.levelCompleteStatRow}>
              <Text style={styles.levelCompleteStatLabel}>🪙 Xu thu thập:</Text>
              <Text style={styles.levelCompleteStatValue}>{coins}</Text>
            </View>
            <View style={styles.levelCompleteStatRow}>
              <Text style={styles.levelCompleteStatLabel}>📝 Câu đố đúng:</Text>
              <Text style={styles.levelCompleteStatValue}>{quizCorrect}/{quizTotal}</Text>
            </View>
            <View style={styles.levelCompleteStatRow}>
              <Text style={styles.levelCompleteStatLabel}>🏆 Tổng điểm:</Text>
              <Text style={styles.levelCompleteStatValue}>{score}</Text>
            </View>
            {collectedLetters.length > 0 && (
              <View style={styles.levelCompleteStatRow}>
                <Text style={styles.levelCompleteStatLabel}>🔤 Chữ cái:</Text>
                <Text style={styles.levelCompleteStatValue}>{collectedLetters.join(' ')}</Text>
              </View>
            )}
          </View>

          <View style={styles.levelCompleteBtns}>
            <TouchableOpacity style={styles.levelCompleteBtn} onPress={() => {
              victoryAnim.setValue(0);
              setPhase('world_map');
            }}>
              <Text style={styles.levelCompleteBtnText}>🗺️ Bản Đồ</Text>
            </TouchableOpacity>
            {currentLevel < 5 && (
              <TouchableOpacity style={[styles.levelCompleteBtn, styles.levelCompleteNextBtn]} onPress={() => {
                victoryAnim.setValue(0);
                startLevel(currentLevel + 1);
              }}>
                <Text style={styles.levelCompleteBtnText}>▶ Màn Tiếp</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // RENDER: GAME OVER
  // ============================================================
  if (phase === 'game_over') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverEmoji}>😢</Text>
          <Text style={styles.gameOverTitle}>HẾT MẠNG RỒI!</Text>
          <Text style={styles.gameOverSubtitle}>Đừng buồn, thử lại nhé bé ơi!</Text>
          <Text style={styles.gameOverScore}>🏆 Điểm: {score}</Text>
          <View style={styles.gameOverBtns}>
            <TouchableOpacity style={styles.gameOverBtn} onPress={() => {
              setLives(3);
              setScore(0);
              setCoins(0);
              startLevel(currentLevel);
            }}>
              <Text style={styles.gameOverBtnText}>🔄 Chơi Lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.gameOverBtn, styles.gameOverMapBtn]} onPress={() => {
              setLives(3);
              setPhase('world_map');
            }}>
              <Text style={styles.gameOverBtnText}>🗺️ Bản Đồ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // RENDER: PAUSE
  // ============================================================
  if (phase === 'pause') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.pauseContainer}>
          <Text style={styles.pauseTitle}>⏸️ TẠM DỪNG</Text>
          <TouchableOpacity style={styles.pauseBtn} onPress={() => setPhase('playing')}>
            <Text style={styles.pauseBtnText}>▶ Tiếp tục</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pauseBtn} onPress={() => { startLevel(currentLevel); }}>
            <Text style={styles.pauseBtnText}>🔄 Chơi lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pauseBtn, styles.pauseExitBtn]} onPress={() => setPhase('world_map')}>
            <Text style={styles.pauseBtnText}>🗺️ Về bản đồ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // RENDER: MAIN GAMEPLAY
  // ============================================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <Animated.View style={[styles.gameContainer, { transform: [{ translateX: screenShake }] }]}>
        {/* ─── HUD ─── */}
        <View style={styles.hud}>
          <View style={styles.hudLeft}>
            <Text style={styles.hudItem}>{'❤️'.repeat(Math.max(0, lives))}{'🖤'.repeat(Math.max(0, 3 - lives))}</Text>
          </View>
          <View style={styles.hudCenter}>
            <Text style={styles.hudItem}>🪙 {coins}</Text>
            <Text style={styles.hudItem}>⭐ {score}</Text>
          </View>
          <View style={styles.hudRight}>
            <TouchableOpacity onPress={() => setPhase('pause')} style={styles.pauseHudBtn}>
              <Text style={styles.pauseHudBtnText}>⏸</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Target Word Display ─── */}
        {ld?.targetWord && (
          <View style={styles.targetWordContainer}>
            <Text style={styles.targetWordLabel}>🔤</Text>
            {ld.targetWord.split('').map((letter, i) => (
              <View key={i} style={[
                styles.targetLetterBox,
                collectedLetters.includes(letter) && styles.targetLetterCollected,
              ]}>
                <Text style={[
                  styles.targetLetter,
                  collectedLetters.includes(letter) && styles.targetLetterTextCollected,
                ]}>
                  {collectedLetters.includes(letter) ? letter : '?'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ─── GAME VIEWPORT + FULL-SCREEN SWIPE CONTROL ─── */}
        <View
          style={[styles.viewport, { height: VIEWPORT_H }]}
          {...PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: (evt) => {
              const { locationX, locationY } = evt.nativeEvent;
              const inp = inputRef.current;
              inp.isTouching = true;
              inp.touchStartX = locationX;
              inp.touchStartY = locationY;
              inp.touchStartTime = Date.now();
              inp.lastDx = 0;
              inp.left = false;
              inp.right = false;
              inp.run = false;
              // Floating joystick hiện tại vị trí ngón tay
              setJoystickCenter({ x: locationX, y: locationY });
              setJoystickOffset(0);
              setShowJoystick(true);
            },

            onPanResponderMove: (evt) => {
              const inp = inputRef.current;
              if (!inp.isTouching) return;
              const dx = evt.nativeEvent.locationX - inp.touchStartX;
              const dy = evt.nativeEvent.locationY - inp.touchStartY;
              const absDx = Math.abs(dx);
              const absDy = Math.abs(dy);
              inp.lastDx = dx;

              // ── Phát hiện Swipe Up nhanh để nhảy ──
              // Nếu vuốt lên > 25px và lệch dọc rõ hơn ngang → NHẢY
              if (dy < -25 && absDy > absDx * 0.8) {
                inp.jump = true;
                inp.jumpPressed = false;
                // Ripple tại điểm chạm
                setRipplePos({ x: inp.touchStartX, y: inp.touchStartY });
                rippleAnim.setValue(0);
                rippleOpacity.setValue(1);
                Animated.parallel([
                  Animated.timing(rippleAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
                  Animated.timing(rippleOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
                ]).start();
              }

              // ── Phát hiện trượt ngang để di chuyển ──
              // Dead zone 10px để tránh rung tay
              if (absDx < 10) {
                inp.left = false;
                inp.right = false;
                inp.run = false;
              } else if (dx < 0) {
                inp.left = true;
                inp.right = false;
                inp.run = absDx > 50; // Sprint khi kéo xa
              } else {
                inp.right = true;
                inp.left = false;
                inp.run = absDx > 50;
              }

              // Cập nhật vị trí joystick thumb (clamp ±48px)
              const clamped = Math.max(-48, Math.min(48, dx));
              setJoystickOffset(clamped);
            },

            onPanResponderRelease: (evt) => {
              const inp = inputRef.current;
              // Phát hiện TAP nhanh (< 200ms, ít di chuyển) = nhảy
              const elapsed = Date.now() - inp.touchStartTime;
              const totalDx = Math.abs(inp.lastDx);
              if (elapsed < 200 && totalDx < 15) {
                // Quick tap → nhảy
                inp.jump = true;
                inp.jumpPressed = false;
                const { locationX, locationY } = evt.nativeEvent;
                setRipplePos({ x: locationX, y: locationY });
                rippleAnim.setValue(0);
                rippleOpacity.setValue(1);
                Animated.parallel([
                  Animated.timing(rippleAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
                  Animated.timing(rippleOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
                ]).start();
                // Tự tắt jump sau 1 frame
                setTimeout(() => {
                  inp.jump = false;
                  inp.jumpPressed = false;
                }, 50);
              }
              inp.left = false;
              inp.right = false;
              inp.run = false;
              inp.jump = false;
              inp.jumpPressed = false;
              inp.isTouching = false;
              setShowJoystick(false);
              setJoystickOffset(0);
            },

            onPanResponderTerminate: () => {
              const inp = inputRef.current;
              inp.left = false;
              inp.right = false;
              inp.run = false;
              inp.jump = false;
              inp.jumpPressed = false;
              inp.isTouching = false;
              setShowJoystick(false);
              setJoystickOffset(0);
            },
          }).panHandlers}
        >
          {/* Parallax Background Layer 1 — Sky gradient */}
          <View style={[styles.bgLayer, styles.bgSky]} />

          {/* Parallax Background Layer 2 — Far mountains */}
          <View style={[styles.bgLayer, styles.bgMountains, { transform: [{ translateX: -(cam.x * 0.1) % SCREEN_W }] }]}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Text key={i} style={[styles.bgMountainEmoji, { left: i * SCREEN_W * 0.18 }]}>
                {i % 2 === 0 ? '⛰️' : '🏔️'}
              </Text>
            ))}
          </View>

          {/* Parallax Background Layer 3 — Trees */}
          <View style={[styles.bgLayer, styles.bgTreeLine, { transform: [{ translateX: -(cam.x * 0.25) % SCREEN_W }] }]}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Text key={i} style={[styles.bgTreeEmoji, { left: i * SCREEN_W * 0.11 }]}>
                {i % 3 === 0 ? '🌲' : i % 3 === 1 ? '🌳' : '🌿'}
              </Text>
            ))}
          </View>

          {/* Parallax Background Layer 4 — Clouds */}
          <View style={[styles.bgLayer, { transform: [{ translateX: -(cam.x * 0.05 + tickRef.current * 0.1) % (SCREEN_W * 1.5) }] }]}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Text key={i} style={[styles.cloudEmoji, { left: i * SCREEN_W * 0.3, top: 10 + (i % 3) * 25 }]}>☁️</Text>
            ))}
          </View>

          {/* ─── TILE RENDERING ─── */}
          {visibleTiles.map((tile, idx) => {
            const tileStyle = renderTile(tile, TILE);
            const tx = tile.col * TILE - cam.x;
            const ty = tile.row * TILE + (tile.bounceOffset || 0);
            if (tx < -TILE || tx > VIEWPORT_W + TILE) return null;

            // Decorative tiles (trees, bushes) are rendered differently
            if (tile.type === 'tree_top' || tile.type === 'bush') {
              return (
                <View key={`tile_${idx}`} style={[styles.tile, {
                  left: tx, top: ty, width: TILE, height: TILE,
                }]}>
                  <Text style={styles.tileEmoji}>{tile.type === 'tree_top' ? '🌿' : '🌿'}</Text>
                </View>
              );
            }
            if (tile.type === 'tree_trunk') {
              return (
                <View key={`tile_${idx}`} style={[styles.tile, {
                  left: tx, top: ty, width: TILE, height: TILE,
                  backgroundColor: tileStyle.bg,
                }]}>
                  <View style={[styles.tileInner, { backgroundColor: tileStyle.border }]} />
                </View>
              );
            }
            if (tile.type === 'water') {
              return (
                <View key={`tile_${idx}`} style={[styles.tile, {
                  left: tx, top: ty, width: TILE, height: TILE,
                  backgroundColor: tileStyle.bg, opacity: 0.7,
                }]}>
                  <Text style={styles.waterWave}>{'~'}</Text>
                </View>
              );
            }

            return (
              <View key={`tile_${idx}`} style={[styles.tile, {
                left: tx, top: ty, width: TILE, height: TILE,
                backgroundColor: tileStyle.bg,
                borderColor: tileStyle.border,
                borderWidth: tile.type === 'ground' ? 0 : 1.5,
              }]}>
                {/* Pixel art shading */}
                {tile.type === 'ground' && (
                  <>
                    <View style={[styles.groundGrassTop, { backgroundColor: '#5CD96A' }]} />
                    <View style={[styles.groundDirtPattern]} />
                  </>
                )}
                {tile.type === 'question' && !tile.activated && (
                  <Text style={styles.questionMarkText}>❓</Text>
                )}
                {tile.type === 'question' && tile.activated && (
                  <View style={styles.emptyBlockPattern} />
                )}
                {(tile.type === 'brick') && (
                  <View style={styles.brickPattern}>
                    <View style={styles.brickLine1} />
                    <View style={styles.brickLine2} />
                  </View>
                )}
                {tile.type === 'pipe_top_left' && (
                  <View style={[styles.pipeHighlight, { backgroundColor: FOREST_PALETTE.pipeHighlight }]} />
                )}
                {tile.type === 'bridge' && (
                  <View style={styles.bridgePattern}>
                    <View style={[styles.bridgePlank, { backgroundColor: '#A0733D' }]} />
                  </View>
                )}
              </View>
            );
          })}

          {/* ─── COLLECTIBLE RENDERING ─── */}
          {visibleCollectibles.map(c => {
            const cx = c.x - cam.x;
            const cy = c.y + c.floatOffset;
            const emoji = c.type === 'coin' ? '🪙' : c.type === 'letter' ? c.value : c.type === 'star' ? '⭐' : c.type === 'heart' ? '❤️' : c.type === 'gem' ? '💎' : c.type === 'key' ? '🔑' : '🎁';
            const bgColor = c.type === 'letter' ? FOREST_PALETTE.letterBg :
                            c.type === 'coin' ? FOREST_PALETTE.coin + '40' :
                            c.type === 'gem' ? FOREST_PALETTE.gem + '40' : 'transparent';

            return (
              <View key={c.id} style={[styles.collectible, {
                left: cx, top: cy, width: c.w, height: c.h,
              }]}>
                <View style={[styles.collectibleInner, { backgroundColor: bgColor }]}>
                  <Text style={[styles.collectibleEmoji, c.type === 'letter' && styles.letterEmoji]}>{emoji}</Text>
                </View>
                {/* Glow effect */}
                {(c.type === 'star' || c.type === 'gem') && (
                  <View style={[styles.collectibleGlow, {
                    opacity: 0.3 + Math.sin(c.floatTimer * 2) * 0.2,
                    backgroundColor: c.type === 'star' ? '#FFD700' : '#7C3AED',
                  }]} />
                )}
              </View>
            );
          })}

          {/* ─── ENEMY RENDERING ─── */}
          {visibleEnemies.map(e => {
            const ex = e.x - cam.x;
            const ey = e.y;
            const emoji = e.type === 'mushroom' ? '🍄' : e.type === 'snail' ? '🐌' : e.type === 'butterfly' ? '🦋' : e.type === 'squirrel' ? '🐿️' : e.type === 'boss_owl' ? '🦉' : '🍄';

            return (
              <View key={e.id} style={[styles.enemy, {
                left: ex, top: ey, width: e.w, height: e.alive ? e.h : e.h * 0.3,
                opacity: e.alive ? 1 : (e.squishTimer / 20),
                transform: [{ scaleX: e.facing === 'left' ? -1 : 1 }],
              }]}>
                {e.type === 'boss_owl' ? (
                  <View style={styles.bossEnemyContainer}>
                    <Text style={styles.bossEnemyEmoji}>{emoji}</Text>
                    {e.alive && (
                      <View style={styles.bossEnemyHealthBar}>
                        <View style={[styles.bossEnemyHealthFill, { width: `${(e.health / 5) * 100}%` }]} />
                      </View>
                    )}
                  </View>
                ) : (
                  <Text style={[styles.enemyEmoji, !e.alive && styles.enemySquished]}>{emoji}</Text>
                )}
              </View>
            );
          })}

          {/* ─── PLAYER RENDERING ─── */}
          <View style={[styles.player, {
            left: player.x - cam.x,
            top: player.y,
            width: player.w,
            height: player.h,
            opacity: player.isInvincible ? (tickRef.current % 6 < 3 ? 0.4 : 1) : 1,
            transform: [{ scaleX: player.facing === 'left' ? -1 : 1 }],
          }]}>
            <View style={[styles.playerBody, { backgroundColor: selectedChar.color + '30' }]}>
              <Text style={styles.playerEmoji}>
                {player.isDead ? selectedChar.sprites.hurt :
                 player.isJumping ? selectedChar.sprites.jump :
                 Math.abs(player.vx) > 0.5 ?
                   (player.animFrame === 0 ? selectedChar.sprites.walk1 : selectedChar.sprites.walk2) :
                 selectedChar.sprites.idle}
              </Text>
            </View>
            {/* Player shadow */}
            {player.isGrounded && (
              <View style={styles.playerShadow} />
            )}
          </View>

          {/* ─── EXIT FLAG ─── */}
          {ld && (
            <View style={[styles.exitFlag, {
              left: ld.exitPoint.x - cam.x,
              top: ld.exitPoint.y - TILE * 2,
            }]}>
              <Text style={styles.exitFlagPole}>│</Text>
              <Text style={styles.exitFlagEmoji}>🚩</Text>
            </View>
          )}

        {/* ─── PARTICLES ─── */}
          {particlesRef.current.slice(0, 30).map((pt, i) => (
            <View key={`pt_${i}`} style={[styles.particle, {
              left: pt.x - cam.x, top: pt.y,
              width: pt.size, height: pt.size,
              backgroundColor: pt.emoji ? 'transparent' : pt.color,
              opacity: pt.life / pt.maxLife,
              borderRadius: pt.size / 2,
            }]}>
              {pt.emoji && <Text style={styles.particleEmoji}>{pt.emoji}</Text>}
            </View>
          ))}

          {/* ─── RIPPLE KHI NHẢY ─── */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ripple,
              {
                left: ripplePos.x - 40,
                top: ripplePos.y - 40,
                opacity: rippleOpacity,
                transform: [{ scale: rippleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 2.5] }) }],
              },
            ]}
          />

          {/* ─── FLOATING JOYSTICK trên màn chơi ─── */}
          {showJoystick && (
            <View style={[
              styles.joystickBase,
              { left: joystickCenter.x - 40, top: joystickCenter.y - 40 },
            ]}>
              <View style={[
                styles.joystickThumb,
                { transform: [{ translateX: joystickOffset }] },
              ]} />
            </View>
          )}

          {/* ─── HINT: Hướng dẫn nhẹ khi mới vào game (fade sau 3s) ─── */}
          <Animated.View
            pointerEvents="none"
            style={styles.fullscreenSwipeHint}
          >
            <Text style={styles.fullscreenSwipeHintText}>◀ trượt để chạy · vuốt lên để nhảy ▶</Text>
          </Animated.View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

// ============================================================
// STYLES
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1622',
  },
  gameContainer: {
    flex: 1,
  },

  // ─── HUD ───
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: FOREST_PALETTE.hudBg,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  hudLeft: { flexDirection: 'row' },
  hudCenter: { flexDirection: 'row', gap: 16 },
  hudRight: { flexDirection: 'row' },
  hudItem: {
    color: FOREST_PALETTE.hudText,
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pauseHudBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },
  pauseHudBtnText: {
    fontSize: 20,
  },

  // ─── Target Word ───
  targetWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    gap: 6,
  },
  targetWordLabel: { fontSize: 16 },
  targetLetterBox: {
    width: 30,
    height: 32,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetLetterCollected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFA000',
  },
  targetLetter: {
    fontSize: 16,
    fontWeight: '900',
    color: '#888',
  },
  targetLetterTextCollected: {
    color: '#5D4037',
  },

  // ─── VIEWPORT ───
  viewport: {
    overflow: 'hidden',
    backgroundColor: '#87CEEB',
    position: 'relative',
  },
  bgLayer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  bgSky: {
    backgroundColor: '#87CEEB',
  },
  bgMountains: {
    position: 'absolute',
    bottom: '30%',
    flexDirection: 'row',
    width: '200%',
  },
  bgMountainEmoji: {
    position: 'absolute',
    fontSize: 50,
    opacity: 0.4,
  },
  bgTreeLine: {
    position: 'absolute',
    bottom: '15%',
    flexDirection: 'row',
    width: '200%',
  },
  bgTreeEmoji: {
    position: 'absolute',
    fontSize: 35,
    opacity: 0.35,
  },
  cloudEmoji: {
    position: 'absolute',
    fontSize: 28,
    opacity: 0.5,
  },

  // ─── TILES ───
  tile: {
    position: 'absolute',
    overflow: 'hidden',
  },
  tileInner: {
    position: 'absolute',
    left: '20%', right: '20%',
    top: 0, bottom: 0,
  },
  tileEmoji: {
    fontSize: PHYSICS.TILE * 0.7,
    textAlign: 'center',
  },
  groundGrassTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 4,
    borderRadius: 0,
  },
  groundDirtPattern: {
    position: 'absolute',
    bottom: 2, left: 4,
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  questionMarkText: {
    fontSize: PHYSICS.TILE * 0.55,
    textAlign: 'center',
    lineHeight: PHYSICS.TILE,
  },
  emptyBlockPattern: {
    position: 'absolute',
    top: 2, left: 2, right: 2, bottom: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
  },
  brickPattern: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  brickLine1: {
    position: 'absolute',
    top: '45%', left: 0, right: 0,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  brickLine2: {
    position: 'absolute',
    top: 0, bottom: 0,
    left: '50%',
    width: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  pipeHighlight: {
    position: 'absolute',
    top: 2, left: 2,
    width: 4,
    bottom: 2,
    borderRadius: 2,
  },
  bridgePattern: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bridgePlank: {
    width: '90%',
    height: 3,
    borderRadius: 1,
  },
  waterWave: {
    fontSize: PHYSICS.TILE * 0.5,
    textAlign: 'center',
    color: '#B3E5FC',
    fontWeight: '900',
    lineHeight: PHYSICS.TILE,
  },

  // ─── COLLECTIBLES ───
  collectible: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectibleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectibleEmoji: {
    fontSize: PHYSICS.TILE * 0.55,
  },
  letterEmoji: {
    fontSize: PHYSICS.TILE * 0.5,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  collectibleGlow: {
    position: 'absolute',
    top: -4, left: -4, right: -4, bottom: -4,
    borderRadius: 20,
  },

  // ─── ENEMIES ───
  enemy: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  enemyEmoji: {
    fontSize: PHYSICS.TILE * 0.7,
  },
  enemySquished: {
    fontSize: PHYSICS.TILE * 0.4,
  },
  bossEnemyContainer: {
    alignItems: 'center',
  },
  bossEnemyEmoji: {
    fontSize: PHYSICS.TILE * 1.6,
  },
  bossEnemyHealthBar: {
    width: PHYSICS.TILE * 2,
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  bossEnemyHealthFill: {
    height: '100%',
    backgroundColor: '#FF4757',
    borderRadius: 3,
  },

  // ─── PLAYER ───
  player: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerBody: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerEmoji: {
    fontSize: PHYSICS.TILE * 0.85,
  },
  playerShadow: {
    position: 'absolute',
    bottom: -3,
    width: '60%',
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
  },

  // ─── EXIT FLAG ───
  exitFlag: {
    position: 'absolute',
    alignItems: 'center',
  },
  exitFlagPole: {
    fontSize: 24,
    color: '#5D4037',
    lineHeight: 20,
  },
  exitFlagEmoji: {
    fontSize: 28,
    marginTop: -5,
  },

  // ─── PARTICLES ───
  particle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particleEmoji: {
    fontSize: 10,
  },

  // ─── CONTROLS ───
  controls: {
    flexDirection: 'row',
    flex: 1,
    maxHeight: 130,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  // ── Vùng trượt di chuyển (nửa trái) ──
  swipeZoneLeft: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  // ── Vùng vuốt nhảy (nửa phải) ──
  swipeZoneRight: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
    overflow: 'hidden',
  },
  swipeHint: {
    opacity: 0.35,
  },
  swipeHintText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // ── Floating Joystick ──
  joystickBase: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joystickThumb: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  // ── Jump Ripple ──
  ripple: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(100,220,255,0.55)',
    borderWidth: 2,
    borderColor: 'rgba(100,220,255,0.8)',
  },
  // ── Gợi ý điều khiển toàn màn hình ──
  fullscreenSwipeHint: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fullscreenSwipeHintText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  // ── Old D-Pad (kept for style ref) ──
  dpadBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadText: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: '900',
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  jumpBtn: {
    backgroundColor: 'rgba(76,175,80,0.3)',
    borderColor: '#4CAF50',
  },
  runBtn: {
    backgroundColor: 'rgba(255,152,0,0.3)',
    borderColor: '#FF9800',
  },
  actionBtnText: {
    fontSize: 22,
  },
  actionBtnLabel: {
    fontSize: 8,
    color: '#FFF',
    fontWeight: '700',
    marginTop: -2,
  },

  // ─── WORLD MAP ───
  worldMapContainer: {
    flex: 1,
    backgroundColor: '#1A3A1A',
    padding: 16,
  },
  worldMapBg: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    opacity: 0.3,
  },
  worldMapMountain: {
    fontSize: 40,
    textAlign: 'center',
    letterSpacing: 8,
  },
  worldMapTrees: {
    fontSize: 30,
    textAlign: 'center',
    letterSpacing: 4,
  },
  worldMapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  worldMapTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  worldMapTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  worldMapSubtitle: {
    color: '#A5D6A7',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  worldMapStats: {
    flexDirection: 'row',
    gap: 12,
  },
  worldMapStatText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
  },
  charSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    gap: 8,
    marginBottom: 12,
  },
  charSelectEmoji: {
    fontSize: 24,
  },
  charSelectName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // ─── Level Nodes ───
  levelNodesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
    zIndex: 2,
  },
  levelNode: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: 'rgba(76,175,80,0.3)',
    borderWidth: 3,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  levelNodeLocked: {
    backgroundColor: 'rgba(100,100,100,0.3)',
    borderColor: '#555',
    opacity: 0.6,
  },
  levelNodeCompleted: {
    backgroundColor: 'rgba(76,175,80,0.5)',
    borderColor: '#FFD700',
  },
  levelNodeBoss: {
    borderColor: '#FF4757',
    backgroundColor: 'rgba(255,71,87,0.2)',
    width: 100,
    height: 100,
    borderWidth: 3,
  },
  levelNodeLockEmoji: {
    fontSize: 30,
  },
  levelNodeNumber: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '900',
  },
  levelNodeName: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  levelNodeStars: {
    fontSize: 10,
    marginTop: 2,
  },
  levelPathContainer: {
    position: 'absolute',
    top: '55%',
    left: '15%',
    right: '15%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  levelPath: {
    height: 4,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 20,
    borderRadius: 2,
  },
  levelPathActive: {
    backgroundColor: '#FFD700',
  },

  // ─── CHARACTER SELECT ───
  charScreenContainer: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    padding: 16,
  },
  charScreenTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  charGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  charCard: {
    width: '30%',
    minWidth: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  charCardLocked: {
    opacity: 0.5,
  },
  charCardEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  charCardName: {
    fontSize: 14,
    fontWeight: '800',
  },
  charCardAbility: {
    fontSize: 10,
    color: '#A5D6A7',
    marginTop: 4,
    textAlign: 'center',
  },
  charCardLockText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },
  charConfirmBtn: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    alignSelf: 'center',
  },
  charConfirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },

  // ─── LEVEL INTRO ───
  levelIntroContainer: {
    flex: 1,
    backgroundColor: '#0B3D0B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  levelIntroBg: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  levelIntroWorldEmoji: {
    fontSize: 28,
    letterSpacing: 8,
    marginBottom: 8,
  },
  levelIntroTitle: {
    color: '#FFD700',
    fontSize: 36,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  levelIntroName: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  levelIntroDivider: {
    width: '80%',
    height: 2,
    backgroundColor: '#4CAF50',
    marginVertical: 16,
    borderRadius: 1,
  },
  levelIntroStory: {
    color: '#C8E6C9',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  levelIntroGoal: {
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  levelIntroGoalLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '800',
  },
  levelIntroGoalText: {
    color: '#FFF',
    fontSize: 13,
    marginTop: 4,
  },
  levelIntroWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  levelIntroWordLabel: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '700',
  },
  levelIntroLetterBox: {
    width: 28,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  levelIntroLetter: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  levelIntroCharPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  levelIntroCharEmoji: {
    fontSize: 40,
  },
  levelIntroCharName: {
    color: '#A5D6A7',
    fontSize: 16,
    fontWeight: '700',
  },
  levelIntroCountdown: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    opacity: 0.7,
  },

  // ─── QUIZ ───
  quizContainer: {
    flex: 1,
    backgroundColor: 'rgba(13,71,13,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bossQuizContainer: {
    backgroundColor: 'rgba(40,10,10,0.95)',
  },
  bossHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bossEmoji: {
    fontSize: 60,
  },
  bossTitle: {
    color: '#FF6B35',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  bossHealthBar: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  bossHealthHeart: {
    fontSize: 20,
  },
  quizCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 450,
    borderWidth: 2,
    borderColor: 'rgba(255,215,0,0.4)',
  },
  quizTypeTag: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  quizTypeText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '700',
  },
  quizQuestion: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 30,
  },
  quizOptions: {
    gap: 10,
  },
  quizOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: 12,
  },
  quizOptionCorrect: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76,175,80,0.3)',
  },
  quizOptionWrong: {
    borderColor: '#FF4757',
    backgroundColor: 'rgba(255,71,87,0.15)',
    opacity: 0.6,
  },
  quizOptionEmoji: {
    fontSize: 28,
  },
  quizOptionLabel: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  quizResultBanner: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  quizResultCorrect: {
    backgroundColor: 'rgba(76,175,80,0.3)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  quizResultWrong: {
    backgroundColor: 'rgba(255,71,87,0.2)',
    borderWidth: 1,
    borderColor: '#FF4757',
  },
  quizResultText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  hintContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderRadius: 10,
  },
  hintText: {
    color: '#FFD700',
    fontSize: 14,
    textAlign: 'center',
  },
  hintBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  hintBtnText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '600',
  },

  // ─── LEVEL COMPLETE ───
  levelCompleteContainer: {
    flex: 1,
    backgroundColor: '#0B3D0B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  levelCompleteTitle: {
    color: '#FFD700',
    fontSize: 36,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  levelCompleteLevelName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  levelCompleteStarsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  levelCompleteStar: {
    fontSize: 40,
  },
  levelCompleteStats: {
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  levelCompleteStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelCompleteStatLabel: {
    color: '#C8E6C9',
    fontSize: 15,
  },
  levelCompleteStatValue: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '800',
  },
  levelCompleteBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  levelCompleteBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  levelCompleteNextBtn: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  levelCompleteBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // ─── GAME OVER ───
  gameOverContainer: {
    flex: 1,
    backgroundColor: '#1A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  gameOverEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  gameOverTitle: {
    color: '#FF4757',
    fontSize: 32,
    fontWeight: '900',
  },
  gameOverSubtitle: {
    color: '#FFA7A7',
    fontSize: 16,
    marginTop: 8,
  },
  gameOverScore: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  gameOverBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  gameOverBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 14,
  },
  gameOverMapBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  gameOverBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // ─── PAUSE ───
  pauseContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  pauseTitle: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 20,
  },
  pauseBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(76,175,80,0.3)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#4CAF50',
    width: 200,
    alignItems: 'center',
  },
  pauseExitBtn: {
    backgroundColor: 'rgba(255,71,87,0.2)',
    borderColor: '#FF4757',
  },
  pauseBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
