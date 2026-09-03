'use client';

import React, { useState } from 'react';
import { Layers, Plus, ShieldCheck, Search, Check, Ban } from 'lucide-react';

const DEFAULT_APPS = [
  { id: '1', name: 'YouTube Kids An Toàn', pkg: 'com.google.android.apps.youtube.kids', category: 'Giải trí an toàn', minAge: 3, status: 'ALLOWED' },
  { id: '2', name: 'Duolingo ABC - Học Chữ', pkg: 'com.duolingo.abc', category: 'Học tập', minAge: 4, status: 'ALLOWED' },
  { id: '3', name: 'Khan Academy Kids', pkg: 'org.khankids.android', category: 'Học tập', minAge: 3, status: 'ALLOWED' },
  { id: '4', name: 'ScratchJr Lập Trình Nhí', pkg: 'org.scratchjr.android', category: 'Tư duy sáng tạo', minAge: 5, status: 'ALLOWED' },
  { id: '5', name: 'TikTok (Cấm)', pkg: 'com.zhiliaoapp.musically', category: 'Mạng xã hội', minAge: 16, status: 'BLOCKED' },
  { id: '6', name: 'Facebook (Cấm)', pkg: 'com.facebook.katana', category: 'Mạng xã hội', minAge: 16, status: 'BLOCKED' },
];

export default function AppCatalogPage() {
  const [apps, setApps] = useState(DEFAULT_APPS);
  const [search, setSearch] = useState('');

  const filteredApps = apps.filter(
    (a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.pkg.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Layers className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
            Kho Ứng Dụng & Danh Mục An Toàn (App Catalog)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Thiết lập danh mục ứng dụng gợi ý cho trẻ em, phân loại theo độ tuổi và đánh dấu ứng dụng cấm.
          </p>
        </div>

        <button
          onClick={() => alert('Mở popup thêm app mới vào Catalog')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 self-start sm:self-auto transition"
        >
          <Plus className="w-4 h-4" /> Thêm Ứng Dụng Mới
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên app hoặc Package Name (VD: com.google.android.youtube)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-indigo-500 outline-none shadow-sm transition"
        />
      </div>

      {/* APPS TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Tên Ứng Dụng</th>
                <th className="px-6 py-4">Package Name</th>
                <th className="px-6 py-4">Thể Loại</th>
                <th className="px-6 py-4">Độ Tuổi</th>
                <th className="px-6 py-4">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm">
                      📱
                    </div>
                    {app.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{app.pkg}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {app.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">{app.minAge}+ tuổi</td>
                  <td className="px-6 py-4">
                    {app.status === 'ALLOWED' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        <Check className="w-3.5 h-3.5" /> An toàn
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                        <Ban className="w-3.5 h-3.5" /> Cấm tuyệt đối
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
