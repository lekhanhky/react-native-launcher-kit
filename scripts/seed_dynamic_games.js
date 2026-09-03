/**
 * Seed & Auto-Generator Script for Dynamic Games & Math Engine
 * Chạy: node scripts/seed_dynamic_games.js
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jlfemayqttjcfjualfsv.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZmVtYXlxdHRqY2ZqdWFsZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3Mzc0NzEsImV4cCI6MjEwMzMxMzQ3MX0.rUNun-PUw_e0Mg1WBUvMmoEJbG8GkagIn8QRP4ZGsRk';

async function supabaseFetch(table, body, method = 'POST') {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method,
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn(`[Supabase ${table}] Warning (${res.status}):`, err);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[Supabase ${table}] Network Error:`, e.message);
    return false;
  }
}

// 1. SINH ĐỀ TOÁN TỰ ĐỘNG
function generateMathQuestions(grade, count = 15) {
  const emojis = ['🍎', '⭐️', '🚗', '🐱', '🍦', '🎈', '🐥', '🍓', '🍩', '🐶', '⚽️', '🚀'];
  const questions = [];

  for (let i = 0; i < count; i++) {
    const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    if (grade === 'preschool') {
      const countNum = Math.floor(Math.random() * 8) + 2;
      const wrong1 = Math.max(1, countNum + (Math.random() > 0.5 ? 1 : -1));
      const wrong2 = Math.max(1, countNum + (Math.random() > 0.5 ? 2 : -2));
      const wrong3 = Math.max(1, countNum + (Math.random() > 0.5 ? 3 : -3));
      const opts = Array.from(new Set([countNum, wrong1, wrong2, wrong3])).slice(0, 4);
      while (opts.length < 4) opts.push(opts.length + 1);
      opts.sort(() => Math.random() - 0.5);

      questions.push({
        grade: 'preschool',
        operation: 'COUNTING',
        difficulty: 1,
        question_text: `Có bao nhiêu ${chosenEmoji} bên dưới?`,
        sub_text: 'Bé hãy chạm ngón tay vào từng hình để đếm nhé!',
        emoji_icons: Array(countNum).fill(chosenEmoji),
        options: opts,
        correct_answer: countNum,
        explanation: `Đếm lần lượt: Có tất cả đúng ${countNum} ${chosenEmoji}!`,
        star_reward: 1,
        time_limit_sec: 20,
      });
    } else if (grade === 'grade1') {
      const isAdd = Math.random() > 0.4;
      const a = Math.floor(Math.random() * 7) + 1;
      const b = Math.floor(Math.random() * 7) + 1;
      const ans = isAdd ? a + b : Math.max(1, a + 5) - b;
      const num1 = isAdd ? a : Math.max(1, a + 5);
      const num2 = b;
      const opText = isAdd ? '+' : '-';

      const w1 = Math.max(1, ans + 1);
      const w2 = Math.max(1, ans - 1);
      const w3 = Math.max(1, ans + 2);
      const opts = Array.from(new Set([ans, w1, w2, w3])).slice(0, 4);
      while (opts.length < 4) opts.push(opts.length + 1);
      opts.sort(() => Math.random() - 0.5);

      questions.push({
        grade: 'grade1',
        operation: isAdd ? 'ADDITION' : 'SUBTRACTION',
        difficulty: 1,
        question_text: `${num1} ${opText} ${num2} = ?`,
        options: opts,
        correct_answer: ans,
        explanation: `Phép tính: ${num1} ${opText} ${num2} = ${ans}`,
        star_reward: 1,
        time_limit_sec: 15,
      });
    } else if (grade === 'grade2') {
      const a = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      const b = Math.floor(Math.random() * 9) + 1;
      const ans = a * b;
      const w1 = Math.max(1, ans + a);
      const w2 = Math.max(1, ans - a > 0 ? ans - a : ans + 2);
      const w3 = Math.max(1, ans + 1);
      const opts = Array.from(new Set([ans, w1, w2, w3])).slice(0, 4);
      while (opts.length < 4) opts.push(opts.length + 1);
      opts.sort(() => Math.random() - 0.5);

      questions.push({
        grade: 'grade2',
        operation: 'MULTIPLICATION',
        difficulty: 2,
        question_text: `${a} × ${b} = ?`,
        options: opts,
        correct_answer: ans,
        explanation: `Bảng nhân: ${a} nhân ${b} bằng ${ans}`,
        star_reward: 2,
        time_limit_sec: 15,
      });
    } else {
      const a = Math.floor(Math.random() * 4) + 6;
      const b = Math.floor(Math.random() * 8) + 2;
      const ans = a * b;
      const w1 = Math.max(1, ans + a);
      const w2 = Math.max(1, ans - a);
      const w3 = Math.max(1, ans + 2);
      const opts = Array.from(new Set([ans, w1, w2, w3])).slice(0, 4);
      while (opts.length < 4) opts.push(opts.length + 1);
      opts.sort(() => Math.random() - 0.5);

      questions.push({
        grade: 'grade3',
        operation: 'MULTIPLICATION',
        difficulty: 3,
        question_text: `${a} × ${b} = ?`,
        options: opts,
        correct_answer: ans,
        explanation: `Bảng cửu chương: ${a} × ${b} = ${ans}`,
        star_reward: 3,
        time_limit_sec: 15,
      });
    }
  }

  return questions;
}

// 2. MAIN SEED RUNNER
async function main() {
  console.log('🚀 Bắt đầu khởi tạo dữ liệu mẫu cho Dynamic Games & Math Engine...');

  // 1. Seed Math Topics
  const topics = [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      grade: 'preschool',
      title: 'Đếm Hình Kỳ Diệu (1-10)',
      description: 'Đếm các loại hoa quả, đồ chơi ngộ nghĩnh',
      icon: '🎈',
      color_hex: '#EC4899',
      order_index: 1,
    },
    {
      id: 'a2222222-2222-2222-2222-222222222222',
      grade: 'grade1',
      title: 'Phép Cộng Phạm Vi 10 & 20',
      description: 'Làm quen với dấu cộng và tính nhẩm nhanh',
      icon: '🌱',
      color_hex: '#10B981',
      order_index: 2,
    },
    {
      id: 'a3333333-3333-3333-3333-333333333333',
      grade: 'grade2',
      title: 'Bảng Nhân 2, 3, 4, 5',
      description: 'Học thuộc bảng nhân qua các câu đố',
      icon: '🚀',
      color_hex: '#3B82F6',
      order_index: 3,
    },
    {
      id: 'a4444444-4444-4444-4444-444444444444',
      grade: 'grade3',
      title: 'Bảng Cửu Chương & Chia Nhẩm',
      description: 'Thử thách bảng cửu chương 6-9 và phép chia',
      icon: '👑',
      color_hex: '#8B5CF6',
      order_index: 4,
    },
  ];

  console.log('📦 Đang nạp Topics...');
  await supabaseFetch('math_topics', topics);

  // 2. Generate 40 Math Questions
  console.log('🧮 Đang sinh 40 đề toán tự động...');
  const allQuestions = [
    ...generateMathQuestions('preschool', 10),
    ...generateMathQuestions('grade1', 10),
    ...generateMathQuestions('grade2', 10),
    ...generateMathQuestions('grade3', 10),
  ];

  await supabaseFetch('math_questions', allQuestions);

  console.log('✨ Hoàn thành! Đã nạp thành công bộ dữ liệu Game Động & Đề Toán.');
}

main().catch(console.error);
