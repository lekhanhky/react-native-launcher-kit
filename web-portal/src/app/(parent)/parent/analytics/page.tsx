'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, AlertTriangle, CheckCircle, TrendingUp, Clock, Trophy } from 'lucide-react';

const WEEKLY_DATA = [
  { day: 'Thứ 2', minutes: 75, limit: 120 },
  { day: 'Thứ 3', minutes: 90, limit: 120 },
  { day: 'Thứ 4', minutes: 60, limit: 120 },
  { day: 'Thứ 5', minutes: 110, limit: 120 },
  { day: 'Thứ 6', minutes: 105, limit: 120 },
  { day: 'Thứ 7', minutes: 150, limit: 180 },
  { day: 'Chủ Nhật', minutes: 140, limit: 180 },
];

const CATEGORY_DATA = [
  { name: 'Toán Học & Game Tư Duy', value: 45, color: '#EC4899' },
  { name: 'Kids YouTube An Toàn', value: 30, color: '#F43F5E' },
  { name: 'Tô Màu & Sáng Tạo', value: 15, color: '#3B82F6' },
  { name: 'Đánh Vần Tiếng Anh', value: 10, color: '#10B981' },
];

export default function ParentAnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-pink-600 dark:text-pink-400" />
          Báo Cáo & Thống Kê Thời Gian Sử Dụng (Screen Time Analytics)
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Theo dõi tổng thời lượng bé sử dụng máy tính bảng, tỷ lệ học tập và cảnh báo vi phạm trong tuần.
        </p>
      </div>

      {/* SUMMARY BADGES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4" /> Trung Bình Mỗi Ngày
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">1h 38m</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">● Đạt mục tiêu dưới 2h/ngày</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4" /> Tiến Độ Học Tập Tuần Này
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">48 Bài Toán ⭐</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Đã giải đúng 45/48 câu</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
            <TrendingUp className="w-4 h-4" /> Tỷ Lệ Giáo Dục / Giải Trí
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">70% Học Tập</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Bé cân bằng rất tốt</div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu Đồ Cột 7 Ngày (Recharts) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">
            Biểu Đồ Thời Lượng Sử Dụng 7 Ngày Gần Nhất (Phút)
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#475569',
                    borderRadius: '16px',
                    color: '#FFF',
                    fontSize: '13px',
                  }}
                  formatter={(value: any) => [`${value} phút`, 'Thời gian chơi']}
                />
                <Bar dataKey="minutes" fill="#EC4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu Đồ Tròn Phân Bổ Danh Mục */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm transition">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Phân Bổ Thể Loại</h2>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#475569',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value}%`, 'Tỷ trọng']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            {CATEGORY_DATA.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CẢNH BÁO VI PHẠM TRONG TUẦN */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" /> Nhật Ký An Toàn & Cảnh Báo Vi Phạm
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Bé hoàn thành giờ học Toán đúng hạn</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Hôm nay lúc 14:30 • Đạt 3 sao</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">An toàn</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                ⚠️
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Bé đã thử mở &apos;Cài Đặt Hệ Thống&apos; 2 lần</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Hôm qua lúc 19:45 • Đã bị chặn an toàn bởi mã PIN</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Đã chặn</span>
          </div>
        </div>
      </div>
    </div>
  );
}

