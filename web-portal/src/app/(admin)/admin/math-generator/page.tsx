'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Calculator,
  Sparkles,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers,
} from 'lucide-react';

type Grade = 'preschool' | 'grade1' | 'grade2' | 'grade3';
type Operation = 'COUNTING' | 'ADDITION' | 'SUBTRACTION' | 'MULTIPLICATION' | 'DIVISION';

export default function MathGeneratorPage() {
  const [selectedGrade, setSelectedGrade] = useState<Grade>('grade1');
  const [selectedOp, setSelectedOp] = useState<Operation>('ADDITION');
  const [count, setCount] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Live questions stats from Supabase
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentQuestions, setRecentQuestions] = useState<any[]>([]);

  // Tải thống kê số câu hỏi trong DB
  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('math_questions')
        .select('grade, id');

      if (data) {
        const counts: Record<string, number> = {
          preschool: 0,
          grade1: 0,
          grade2: 0,
          grade3: 0,
        };
        data.forEach((q) => {
          if (counts[q.grade] !== undefined) counts[q.grade]++;
        });
        setStats(counts);
      }

      // Lấy 5 câu hỏi mới nhất
      const { data: recents } = await supabase
        .from('math_questions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recents) {
        setRecentQuestions(recents);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Thuật toán sinh đề trên Client & Đẩy trực tiếp vào Supabase
  const handleGenerate = async () => {
    setIsGenerating(true);
    setResultMsg(null);

    const emojis = ['🍎', '⭐️', '🚗', '🐱', '🍦', '🎈', '🐥', '🍓', '🍩', '🐶', '⚽️', '🚀'];
    const newQuestions: any[] = [];

    for (let i = 0; i < count; i++) {
      const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      if (selectedGrade === 'preschool') {
        const countNum = Math.floor(Math.random() * 8) + 2;
        const w1 = Math.max(1, countNum + (Math.random() > 0.5 ? 1 : -1));
        const w2 = Math.max(1, countNum + (Math.random() > 0.5 ? 2 : -2));
        const w3 = Math.max(1, countNum + (Math.random() > 0.5 ? 3 : -3));
        const opts = Array.from(new Set([countNum, w1, w2, w3])).slice(0, 4);
        while (opts.length < 4) opts.push(opts.length + 1);
        opts.sort(() => Math.random() - 0.5);

        newQuestions.push({
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
      } else if (selectedGrade === 'grade1') {
        const isAdd = selectedOp === 'ADDITION';
        const a = Math.floor(Math.random() * 8) + 2;
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

        newQuestions.push({
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
      } else if (selectedGrade === 'grade2') {
        const a = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
        const b = Math.floor(Math.random() * 9) + 1;
        const ans = a * b;
        const w1 = Math.max(1, ans + a);
        const w2 = Math.max(1, ans - a > 0 ? ans - a : ans + 2);
        const w3 = Math.max(1, ans + 1);
        const opts = Array.from(new Set([ans, w1, w2, w3])).slice(0, 4);
        while (opts.length < 4) opts.push(opts.length + 1);
        opts.sort(() => Math.random() - 0.5);

        newQuestions.push({
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
        // grade3
        const isMult = selectedOp === 'MULTIPLICATION';
        if (isMult) {
          const a = Math.floor(Math.random() * 4) + 6;
          const b = Math.floor(Math.random() * 8) + 2;
          const ans = a * b;
          const w1 = Math.max(1, ans + a);
          const w2 = Math.max(1, ans - a);
          const w3 = Math.max(1, ans + 2);
          const opts = Array.from(new Set([ans, w1, w2, w3])).slice(0, 4);
          while (opts.length < 4) opts.push(opts.length + 1);
          opts.sort(() => Math.random() - 0.5);

          newQuestions.push({
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
        } else {
          const b = Math.floor(Math.random() * 6) + 3;
          const ans = Math.floor(Math.random() * 7) + 2;
          const a = b * ans;
          const w1 = Math.max(1, ans + 1);
          const w2 = Math.max(1, ans - 1);
          const w3 = Math.max(1, ans + 2);
          const opts = Array.from(new Set([ans, w1, w2, w3])).slice(0, 4);
          while (opts.length < 4) opts.push(opts.length + 1);
          opts.sort(() => Math.random() - 0.5);

          newQuestions.push({
            grade: 'grade3',
            operation: 'DIVISION',
            difficulty: 3,
            question_text: `${a} : ${b} = ?`,
            options: opts,
            correct_answer: ans,
            explanation: `Phép chia: ${a} : ${b} = ${ans}`,
            star_reward: 3,
            time_limit_sec: 15,
          });
        }
      }
    }

    try {
      const { error } = await supabase.from('math_questions').insert(newQuestions);
      if (error) throw error;

      setResultMsg({
        type: 'success',
        text: `Đã sinh thành công ${count} đề toán cho ${selectedGrade.toUpperCase()} và lưu vào Supabase!`,
      });
      await loadStats();
    } catch (err: any) {
      setResultMsg({
        type: 'error',
        text: `Lỗi khi lưu vào Supabase: ${err.message}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Calculator className="w-8 h-8 text-pink-600 dark:text-pink-400 shrink-0" />
            Sinh Đề Toán Tự Động (Math Generator Studio)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Tạo hàng loạt câu hỏi toán học thông minh kèm 3 đáp án nhiễu lưu trực tiếp vào Supabase Cloud.
          </p>
        </div>

        <button
          onClick={loadStats}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-xs font-semibold self-start sm:self-auto shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới dữ liệu
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <span className="text-xs text-pink-600 dark:text-pink-400 font-bold uppercase tracking-wider">🎈 Mầm Non</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.preschool || 0} câu</div>
          <span className="text-[11px] text-slate-500">Đếm hình 1-10</span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">🌱 Lớp 1</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.grade1 || 0} câu</div>
          <span className="text-[11px] text-slate-500">Cộng trừ phạm vi 20</span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">🚀 Lớp 2</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.grade2 || 0} câu</div>
          <span className="text-[11px] text-slate-500">Bảng nhân 2-5</span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">👑 Lớp 3</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.grade3 || 0} câu</div>
          <span className="text-[11px] text-slate-500">Bảng cửu chương & chia</span>
        </div>
      </div>

      {/* GENERATOR CONTROLS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" /> Cấu Hình Sinh Đề Tự Động
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Chọn Khối Lớp */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              1. Khối Lớp / Độ Tuổi
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as Grade)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:border-pink-500 outline-none transition"
            >
              <option value="preschool">🎈 Mầm Non (3-5 tuổi) - Đếm hình</option>
              <option value="grade1">🌱 Lớp 1 (6-7 tuổi) - Cộng trừ 10 & 20</option>
              <option value="grade2">🚀 Lớp 2 (7-8 tuổi) - Bảng nhân 2-5</option>
              <option value="grade3">👑 Lớp 3 (8-9 tuổi) - Cửu chương & Chia</option>
            </select>
          </div>

          {/* Chọn Phép Tính */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              2. Dạng Phép Tính
            </label>
            <select
              value={selectedOp}
              onChange={(e) => setSelectedOp(e.target.value as Operation)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:border-pink-500 outline-none transition"
            >
              {selectedGrade === 'preschool' && <option value="COUNTING">Đếm hình con vật & trái cây</option>}
              {selectedGrade === 'grade1' && (
                <>
                  <option value="ADDITION">Phép Cộng (+)</option>
                  <option value="SUBTRACTION">Phép Trừ (-)</option>
                </>
              )}
              {selectedGrade === 'grade2' && <option value="MULTIPLICATION">Bảng Nhân 2, 3, 4, 5</option>}
              {selectedGrade === 'grade3' && (
                <>
                  <option value="MULTIPLICATION">Bảng Cửu Chương (6-9)</option>
                  <option value="DIVISION">Phép Chia Nhẩm (:)</option>
                </>
              )}
            </select>
          </div>

          {/* Chọn Số Lượng */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              3. Số Lượng Đề Cần Sinh
            </label>
            <div className="flex gap-2">
              {[10, 20, 50, 100].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border transition ${
                    count === num
                      ? 'bg-pink-600 border-pink-500 text-white shadow-md shadow-pink-600/30'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            ⚡ Hệ thống sẽ tự động tạo <span className="text-pink-600 dark:text-pink-400 font-bold">{count} câu hỏi</span> kèm đáp án đúng & 3 đáp án nhiễu.
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-pink-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Đang Sinh Đề...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Bấm Sinh {count} Đề Toán Ngay
              </>
            )}
          </button>
        </div>

        {/* Result Message */}
        {resultMsg && (
          <div
            className={`mt-4 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold border ${
              resultMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400'
            }`}
          >
            {resultMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{resultMsg.text}</span>
          </div>
        )}
      </div>

      {/* RECENT QUESTIONS PREVIEW */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 5 Câu Hỏi Vừa Tạo Gần Nhất Trong DB
        </h3>

        <div className="space-y-3">
          {recentQuestions.length === 0 ? (
            <div className="text-sm text-slate-500 py-4 text-center">Chưa có câu hỏi nào vừa tạo</div>
          ) : (
            recentQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                      {q.grade}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Đáp án đúng: <b className="text-emerald-600 dark:text-emerald-400">{q.correct_answer}</b>
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{q.question_text}</div>
                  {q.emoji_icons && q.emoji_icons.length > 0 && (
                    <div className="text-lg mt-1 tracking-wider">{q.emoji_icons.join(' ')}</div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {q.options?.map((opt: number, idx: number) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        opt === q.correct_answer
                          ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
