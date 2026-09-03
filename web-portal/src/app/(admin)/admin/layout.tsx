'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calculator,
  Layers,
  Youtube,
  FolderTree,
  Volume2,
  ShieldAlert,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Tổng Quan Hệ Thống', icon: LayoutDashboard },
  { href: '/admin/categories', label: 'Quản Lý Danh Mục & Con Vật', icon: FolderTree, badge: 'Mới' },
  { href: '/admin/animal-sounds', label: 'Âm Thanh Con Vật (MP3)', icon: Volume2, badge: 'Bucket' },
  { href: '/admin/math-generator', label: 'Sinh Đề Toán Tự Động', icon: Calculator, badge: 'Hot' },
  { href: '/admin/app-catalog', label: 'Kho App An Toàn', icon: Layers },
  { href: '/admin/youtube-curator', label: 'Duyệt YouTube Kids', icon: Youtube },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 md:p-6 shrink-0 transition-colors duration-200">
        <div>
          {/* Logo & Role Badge */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/20 text-white">
                🛠️
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Admin Studio
                </h2>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Super Admin Role
                </span>
              </div>
            </div>

            {/* Mobile Theme Toggle */}
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-600 dark:text-pink-300 font-bold border border-pink-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Về Trang Chủ
            </Link>

            <ThemeToggle />
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Supabase DB: <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">Connected</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
