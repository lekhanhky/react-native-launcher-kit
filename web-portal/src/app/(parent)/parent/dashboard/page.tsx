'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  Clock,
  BatteryCharging,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  BarChart3,
  Moon,
  Sparkles,
} from 'lucide-react';

export default function ParentDashboardPage() {
  const [isInstantLocked, setIsInstantLocked] = useState(false);
  const [lockToast, setLockToast] = useState<string | null>(null);

  const toggleInstantLock = () => {
    const nextState = !isInstantLocked;
    setIsInstantLocked(nextState);
    const msg = nextState
      ? '🔒 ĐÃ KHÓA MÁY TỨC THÌ! Tablet của bé đã hiện màn hình khóa.'
      : '🔓 ĐÃ MỞ KHÓA! Tablet của bé đã hoạt động lại bình thường.';
    setLockToast(msg);
    setTimeout(() => setLockToast(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* HEADER WITH INSTANT LOCK BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-50 via-purple-50/50 to-indigo-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-pink-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-500/20 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            1 Thiết Bị Đang Kết Nối Realtime
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Chào Ba Mẹ! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Bé <b className="text-pink-600 dark:text-pink-400">Gia Bảo (6 tuổi)</b> đang sử dụng máy tính bảng Galaxy Tab A9.
          </p>
        </div>

        {/* Nút Khóa Khẩn Cấp Lớn */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={toggleInstantLock}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition shadow-xl ${
              isInstantLocked
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
            }`}
          >
            {isInstantLocked ? (
              <>
                <Unlock className="w-6 h-6" /> MỞ KHÓA MÁY CHO BÉ
              </>
            ) : (
              <>
                <Lock className="w-6 h-6" /> KHÓA MÁY KHẨN CẤP NGAY
              </>
            )}
          </button>
        </div>
      </div>

      {/* TOAST THÔNG BÁO KHÓA REALTIME */}
      {lockToast && (
        <div
          className={`p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 shadow-lg ${
            isInstantLocked
              ? 'bg-rose-50 dark:bg-rose-500/15 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300'
              : 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
          }`}
        >
          {isInstantLocked ? <Lock className="w-5 h-5 shrink-0" /> : <Unlock className="w-5 h-5 shrink-0" />}
          <span>{lockToast}</span>
        </div>
      )}

      {/* TODAY'S SCREEN TIME OVERVIEW CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Thời gian hôm nay */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm transition">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">
              <span>Thời Gian Dùng Hôm Nay</span>
              <Clock className="w-4 h-4 text-pink-500 dark:text-pink-400" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">1h 15m</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Giới hạn hôm nay: <b className="text-pink-600 dark:text-pink-400">2h 00m</b></div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden mt-4 border border-slate-200 dark:border-slate-800">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full" style={{ width: '62%' }} />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Còn lại: <b className="text-emerald-600 dark:text-emerald-400 font-bold">45 phút</b></span>
            <Link href="/parent/rules" className="text-pink-600 dark:text-pink-400 hover:underline font-bold flex items-center gap-1">
              Đổi giờ <Sliders className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 2: Trạng thái máy bé */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm transition">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">
              <span>Trạng Thái Thiết Bị</span>
              <Smartphone className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">Samsung Galaxy Tab A9</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Đang Online
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 86% Pin
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
            Ứng dụng bé đang mở: <b className="text-slate-900 dark:text-white">🧮 Math Quiz Game</b>
          </div>
        </div>

        {/* Card 3: Khung Giờ Giới Nghiêm (Bedtime) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm transition">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">
              <span>Giờ Giới Nghiêm Đi Ngủ</span>
              <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300 mb-1">21:00 - 06:30</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Tự động khóa màn hình chúc bé ngủ ngon khi đến 21:00 tối mỗi ngày.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">● Đang Bật</span>
            <Link href="/parent/rules" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
              Chỉnh giờ ngủ ➔
            </Link>
          </div>
        </div>
      </div>

      {/* TOP APPS USED TODAY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-pink-500 dark:text-pink-400" /> Ứng Dụng Bé Chơi Nhiều Nhất Hôm Nay
          </h2>
          <Link href="/parent/analytics" className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline">
            Xem Báo Cáo Chi Tiết ➔
          </Link>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-lg">
                🧮
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">Bé Vui Học Toán (Math Quiz)</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Đã hoàn thành 15 bài toán ⭐</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900 dark:text-white text-sm">35 phút</div>
              <div className="text-[11px] text-slate-500">Giáo dục</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg">
                📺
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">Kids YouTube (Kênh Tiếng Anh)</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Xem video hoạt hình an toàn</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900 dark:text-white text-sm">25 phút</div>
              <div className="text-[11px] text-slate-500">Giải trí</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
                🧩
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">Xếp Hình Tư Duy Tangram</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Ghép xong 3 bức tranh con vật</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900 dark:text-white text-sm">15 phút</div>
              <div className="text-[11px] text-slate-500">Sáng tạo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

