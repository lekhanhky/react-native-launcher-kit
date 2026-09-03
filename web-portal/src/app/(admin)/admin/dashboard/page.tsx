'use client';

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Smartphone,
  Gamepad2,
  TrendingUp,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  Volume2,
  Play,
  Pause,
  FolderTree,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalGames: 6,
    totalMathQuestions: 0,
    totalAnimals: 4,
    totalChannels: 17,
    activeDevices: 3,
  });

  const [recentAnimals, setRecentAnimals] = useState<any[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (url: string, id: string) => {
    if (typeof window === 'undefined') return;
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingId(id);

    audio.play().catch((err) => {
      console.warn('Audio demo simulation:', err);
      setTimeout(() => setPlayingId(null), 1500);
    });

    audio.onended = () => setPlayingId(null);
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { count: mathCount } = await supabase
          .from('math_questions')
          .select('*', { count: 'exact', head: true });

        const { count: channelCount } = await supabase
          .from('kids_youtube_channels')
          .select('*', { count: 'exact', head: true });

        const { data: animalsData, count: animalCount } = await supabase
          .from('kids_animals')
          .select('*', { count: 'exact' })
          .limit(4);

        setMetrics((prev) => ({
          ...prev,
          totalMathQuestions: mathCount || 50,
          totalChannels: channelCount || 17,
          totalAnimals: animalCount || 4,
        }));

        if (animalsData && animalsData.length > 0) {
          setRecentAnimals(animalsData);
        } else {
          // Fallback demo data
          setRecentAnimals([
            { id: '1', name_vi: 'Chú Chó Cưng', name_en: 'Dog', icon_emoji: '🐶', category: 'Vật Nuôi', sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/dog.mp3' },
            { id: '2', name_vi: 'Mèo Con Dễ Thương', name_en: 'Cat', icon_emoji: '🐱', category: 'Vật Nuôi', sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/cat.mp3' },
            { id: '3', name_vi: 'Sư Tử Chúa Sơn Lâm', name_en: 'Lion', icon_emoji: '🦁', category: 'Rừng Rậm', sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/lion.mp3' },
            { id: '4', name_vi: 'Chú Voi Khổng Lồ', name_en: 'Elephant', icon_emoji: '🐘', category: 'Rừng Rậm', sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/elephant.mp3' },
          ]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* GREETING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
            Tổng Quan Hệ Thống (Master Dashboard)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Giám sát trạng thái hoạt động của đám mây, kho con vật MP3, ngân hàng đề toán và thiết bị kết nối.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/admin/animal-sounds"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition"
          >
            <Volume2 className="w-4 h-4" /> Quản Lý MP3 Con Vật
          </Link>
          <Link
            href="/admin/math-generator"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-4 h-4" /> Sinh Đề Toán
          </Link>
        </div>
      </div>

      {/* 5 CORE METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Metric 1: Thiết bị */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{metrics.activeDevices}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Thiết Bị Online</div>
          </div>
        </div>

        {/* Metric 2: Con vật kids_animals */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/30 shadow-sm flex flex-col justify-between transition">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{metrics.totalAnimals} Con Vật</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bảng kids_animals</div>
          </div>
        </div>

        {/* Metric 3: Mini Games */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-500/10 border border-pink-100 dark:border-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{metrics.totalGames} Mini Games</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Game Giáo Dục</div>
          </div>
        </div>

        {/* Metric 4: Đề toán */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{metrics.totalMathQuestions}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Đề Toán Cloud DB</div>
          </div>
        </div>

        {/* Metric 5: Kênh YouTube */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{metrics.totalChannels} Kênh</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">YouTube Kids</div>
          </div>
        </div>
      </div>

      {/* SECTION: THẾ GIỚI ĐỘNG VẬT & ÂM THANH MP3 (kids_animals) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
              🦁
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Thế Giới Động Vật & Âm Thanh MP3 (Bảng kids_animals)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dữ liệu âm thanh tiếng kêu và hình ảnh lưu trữ trên Supabase Storage Bucket</p>
            </div>
          </div>

          <Link
            href="/admin/animal-sounds"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Vào Animal Sound Studio <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Cards con vật kèm nút nghe tiếng MP3 trực tiếp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentAnimals.map((animal) => {
            const isPlaying = playingId === animal.id;
            return (
              <div
                key={animal.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                    {animal.icon_emoji || '🐾'}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{animal.name_vi}</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider truncate">
                      {animal.name_en}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => playAudio(animal.sound_url, animal.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    isPlaying
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 animate-pulse'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                  title="Nghe tiếng kêu MP3"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK ACTIONS & MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Quản Trị Danh Mục */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FolderTree className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Quản Lý Danh Mục</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Master Categories</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Thiết lập các danh mục gốc cho Con vật, Ứng dụng Whitelist, Kênh YouTube và Chủ đề Toán học.
            </p>
          </div>
          <Link
            href="/admin/categories"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs text-center transition shadow-sm"
          >
            Mở Quản Lý Danh Mục ➔
          </Link>
        </div>

        {/* Module 2: Sinh Đề Toán */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                🧮
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Math Generator Studio</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sinh đề toán tự động</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Hỗ trợ đếm hình, phép cộng trừ 20, bảng nhân 2-5 và bảng cửu chương kèm câu giải thích tự động.
            </p>
          </div>
          <Link
            href="/admin/math-generator"
            className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs text-center transition shadow-md shadow-pink-600/20"
          >
            Mở Math Generator ➔
          </Link>
        </div>

        {/* Module 3: YouTube Whitelist */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                📺
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Kiểm Duyệt YouTube Kids</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Whitelist Curator</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Loại bỏ hoàn toàn video độc hại và bình luận xấu, chỉ hiển thị danh sách kênh được phê duyệt.
            </p>
          </div>
          <Link
            href="/admin/youtube-curator"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs text-center transition shadow-sm"
          >
            Mở YouTube Whitelist ➔
          </Link>
        </div>
      </div>
    </div>

  );
}
