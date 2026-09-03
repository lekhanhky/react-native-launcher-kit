'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import {
  ShieldCheck,
  Clock,
  Gamepad2,
  Sparkles,
  Layers,
  BarChart3,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Lock,
  Star,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-pink-500 selection:text-white">
      {/* HEADER / NAVBAR */}
      <header className="border-b border-slate-800 backdrop-blur sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/20">
              🚀
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-pink-400 to-indigo-300 bg-clip-text text-transparent">
                KidsLauncher Kit
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                Cloud Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link
              href="/admin/dashboard"
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Role: Admin
            </Link>

            <Link
              href="/parent/dashboard"
              className="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg shadow-pink-500/25 transition flex items-center gap-1.5"
            >
              <Smartphone className="w-4 h-4" />
              Customer (Phụ Huynh)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
          {/* Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> Hệ Sinh Thái Giáo Dục & Quản Lý Tablet Toàn Diện
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto mb-6">
              Bảo Vệ & Đồng Hành Cùng Bé Trong{' '}
              <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                Môi Trường Số An Toàn
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Tích hợp 10 Mini Games giáo dục song ngữ đám mây, ngân hàng đề toán tự động sinh, khóa máy từ xa tức thì và báo cáo thời gian sử dụng chi tiết cho cha mẹ.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <Link
                href="/parent/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-base shadow-xl shadow-pink-500/20 transition flex items-center justify-center gap-3 group"
              >
                <span>Trải Nghiệm Parent Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/math-generator"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-base border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-5 h-5 text-indigo-400" />
                Sinh Đề Toán Tự Động
              </Link>
            </div>
          </div>
        </section>

        {/* 3 CORE PILLARS */}
        <section className="py-16 bg-slate-950/60 border-y border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 transition group relative">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3">
                  Khóa Kiosk & Chống Gỡ Bỏ
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Ngăn trẻ thoát ra ngoài màn hình chính, cấm truy cập ứng dụng không được phép và khóa khẩn cấp tức thì qua Web Portal.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition group relative">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3">
                  Game Động & Sinh Đề Toán
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Ngân hàng 10,000+ đề toán tự động sinh theo 4 cấp lớp. Thêm màn chơi Tangram, Mê cung không cần cài đặt lại app.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition group relative">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3">
                  Thống Kê Screen Time Chi Tiết
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Biểu đồ trực quan theo dõi thời lượng bé học toán, chơi game hay xem YouTube. Tự động cảnh báo khi có vi phạm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ACCESS SECTIONS */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">Chọn Phân Hệ Để Truy Cập</h2>
            <p className="text-slate-400 mt-2">Dành cho Quản trị viên hệ thống hoặc Phụ huynh quản lý thiết bị</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Admin Role Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs border border-indigo-500/30">
                    ROLE 1: ADMIN (QUẢN TRỊ HỆ THỐNG)
                  </div>
                  <ShieldCheck className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Dashboard Quản Trị Hệ Thống</h3>
                <ul className="space-y-3 mb-8 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sinh hàng loạt đề toán động đẩy lên Cloud
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Quản lý danh mục App Whitelist & Giới hạn tuổi
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Kiểm duyệt kênh/video Kids YouTube an toàn
                  </li>
                </ul>
              </div>
              <Link
                href="/admin/dashboard"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center transition"
              >
                Vào Admin Dashboard ➔
              </Link>
            </div>

            {/* Customer Role Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-pink-950/40 border border-pink-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-semibold text-xs border border-pink-500/30">
                    ROLE 2: CUSTOMER (PHỤ HUYNH BÉ)
                  </div>
                  <Users className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Dashboard Phụ Huynh Quản Lý Bé</h3>
                <ul className="space-y-3 mb-8 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-400" /> Ghép nối máy tính bảng bé qua mã QR 6 số
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-400" /> Cài đặt Giờ chơi hàng ngày & Giờ đi ngủ
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-400" /> Nút Khóa khẩn cấp tức thì & Biểu đồ Screen Time
                  </li>
                </ul>
              </div>
              <Link
                href="/parent/dashboard"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-center transition shadow-lg shadow-pink-500/20"
              >
                Vào Customer Dashboard (Phụ Huynh) ➔
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 bg-slate-950 text-center text-xs text-slate-500">
        <p>© 2026 KidsLauncher Kit Ecosystem. Powered by Next.js & Supabase Cloud.</p>
      </footer>
    </div>
  );
}
