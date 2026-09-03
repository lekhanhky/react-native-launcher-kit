'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl transition-all duration-200 ${
        isDark
          ? 'bg-slate-800/90 text-amber-300 hover:bg-slate-700 border border-slate-700/80 shadow-sm'
          : 'bg-slate-100 text-indigo-600 hover:bg-slate-200 border border-slate-300 shadow-sm'
      } ${className}`}
      title={isDark ? 'Chuyển sang giao diện Sáng (Light Mode)' : 'Chuyển sang giao diện Tối (Dark Mode)'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100 text-amber-300" />
        ) : (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100 text-amber-500" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-bold select-none">
          {isDark ? 'Giao Diện Tối' : 'Giao Diện Sáng'}
        </span>
      )}
    </button>
  );
}
