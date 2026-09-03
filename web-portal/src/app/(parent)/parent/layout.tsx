'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Smartphone,
  Sliders,
  BarChart3,
  Users,
  ShieldCheck,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const PARENT_NAV = [
  { href: '/parent/dashboard', label: 'Bảng Điều Khiển', icon: Smartphone },
  { href: '/parent/rules', label: 'Cài Đặt Giờ & App', icon: Sliders },
  { href: '/parent/analytics', label: 'Báo Cáo Screen Time', icon: BarChart3 },
  { href: '/parent/children', label: 'Hồ Sơ Bé & Ghép Nối', icon: Users },
];

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* HEADER / NAVIGATION BAR */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/parent/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-lg shadow-md shadow-pink-500/20 text-white">
                👨‍👩‍👧
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Parent Control Center
                </span>
                <span className="block text-[10px] text-pink-500 dark:text-pink-400 font-bold uppercase tracking-wider">
                  Gia Đình VIP
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {PARENT_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === '/parent/dashboard' && pathname === '/customer/dashboard');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link
              href="/"
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 dark:border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Trang Chủ
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 overflow-x-auto gap-1 bg-white dark:bg-slate-900">
          {PARENT_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/parent/dashboard' && pathname === '/customer/dashboard');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
