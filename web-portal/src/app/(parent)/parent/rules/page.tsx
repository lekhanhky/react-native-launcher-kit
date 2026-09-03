'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Clock,
  Moon,
  Shield,
  Check,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function ParentRulesPage() {
  const [dailyMinutes, setDailyMinutes] = useState(120); // 2 tiếng
  const [bedtimeStart, setBedtimeStart] = useState('21:00');
  const [bedtimeEnd, setBedtimeEnd] = useState('06:30');
  const [isBedtimeEnabled, setIsBedtimeEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Danh sách app được phép hoặc bị cấm
  const [apps, setApps] = useState([
    { id: 'app1', name: '🧮 Math Quiz Game', category: 'Giáo dục', allowed: true, limitMin: 60 },
    { id: 'app2', name: '📺 Kids YouTube An Toàn', category: 'Giải trí', allowed: true, limitMin: 30 },
    { id: 'app3', name: '🎨 Coloring Paint Game', category: 'Sáng tạo', allowed: true, limitMin: 45 },
    { id: 'app4', name: '🧩 Tangram Xếp Hình', category: 'Tư duy', allowed: true, limitMin: 45 },
    { id: 'app5', name: '🌐 Trình Duyệt Web Chrome (Cấm)', category: 'Internet', allowed: false, limitMin: 0 },
    { id: 'app6', name: '⚙️ Cài Đặt Hệ Thống (Cấm)', category: 'Hệ thống', allowed: false, limitMin: 0 },
  ]);

  const toggleApp = (id: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, allowed: !a.allowed } : a))
    );
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Sliders className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            Cài Đặt Giới Hạn Giờ & Ứng Dụng Cho Bé
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Thiết lập tổng giờ chơi trong ngày, giờ giới nghiêm đi ngủ và bật/tắt ứng dụng được phép mở.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-pink-500/20 flex items-center gap-2 self-start sm:self-auto transition"
        >
          <Save className="w-4 h-4" /> Lưu Cấu Hình Ngay
        </button>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> Đã đồng bộ quy định mới xuống máy tính bảng của bé tức thì!
        </div>
      )}

      {/* SECTION 1: GIỜ CHƠI HÀNG NGÀY (DAILY SCREEN TIME) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tổng Thời Gian Chơi Mỗi Ngày (Daily Limit)</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Khi hết giờ, Launcher sẽ tự động khóa và hiện thông báo nghỉ ngơi</p>
            </div>
          </div>
          <div className="text-2xl font-black text-pink-600 dark:text-pink-400">
            {Math.floor(dailyMinutes / 60)}h {dailyMinutes % 60 > 0 ? `${dailyMinutes % 60}m` : ''}
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={30}
            max={300}
            step={15}
            value={dailyMinutes}
            onChange={(e) => setDailyMinutes(Number(e.target.value))}
            className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-pink-500 border border-slate-200 dark:border-slate-800"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span>30 phút</span>
            <span>1 tiếng</span>
            <span>2 tiếng (Khuyên dùng)</span>
            <span>3 tiếng</span>
            <span>5 tiếng</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: GIỜ GIỚI NGHIÊM (BEDTIME SCHEDULE) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Giờ Giới Nghiêm Đi Ngủ (Bedtime Lock)</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Tự động khóa tablet trong khung giờ ban đêm giúp bé đi ngủ đúng giờ</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isBedtimeEnabled}
              onChange={() => setIsBedtimeEnabled(!isBedtimeEnabled)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {isBedtimeEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Bắt đầu khóa lúc (Tối):
              </label>
              <input
                type="time"
                value={bedtimeStart}
                onChange={(e) => setBedtimeStart(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Mở khóa lại lúc (Sáng):
              </label>
              <input
                type="time"
                value={bedtimeEnd}
                onChange={(e) => setBedtimeEnd(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: DANH SÁCH ỨNG DỤNG ĐƯỢC PHÉP / BỊ CHẶN */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quản Lý Quyền Mở Từng Ứng Dụng (App Allowlist)</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Bật/tắt để cho phép hoặc cấm bé mở các ứng dụng cụ thể trên tablet</p>
          </div>
        </div>

        <div className="space-y-3">
          {apps.map((app) => (
            <div
              key={app.id}
              className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                app.allowed
                  ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30'
              }`}
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{app.name}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{app.category}</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleApp(app.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    app.allowed
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  {app.allowed ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {app.allowed ? 'Được phép mở' : 'Đang bị khóa'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

