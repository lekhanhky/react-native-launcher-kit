'use client';

import React, { useState } from 'react';
import { Users, Plus, QrCode, Smartphone, Sparkles, CheckCircle2, Copy } from 'lucide-react';

export default function ParentChildrenPage() {
  const [pairingCode, setPairingCode] = useState('784920');
  const [isCopied, setIsCopied] = useState(false);

  const generateNewCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setPairingCode(newCode);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(pairingCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            Hồ Sơ Bé & Ghép Nối Thiết Bị (Kids & Devices)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Thêm hồ sơ các bé trong gia đình và ghép nối với máy tính bảng qua mã 6 số hoặc QR Code.
          </p>
        </div>

        <button
          onClick={() => alert('Thêm hồ sơ bé mới')}
          className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-600/20 flex items-center gap-2 self-start sm:self-auto transition"
        >
          <Plus className="w-4 h-4" /> Thêm Bé Mới
        </button>
      </div>

      {/* CHILDREN PROFILES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Child 1 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm transition">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-3xl shadow-md">
                👦
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Bé Gia Bảo</h3>
                <span className="text-xs text-pink-600 dark:text-pink-400 font-bold">6 Tuổi • Lớp 1</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mb-6">
              <div>Thiết bị: <b className="text-slate-900 dark:text-slate-200">Samsung Galaxy Tab A9</b></div>
              <div>Trạng thái: <b className="text-emerald-600 dark:text-emerald-400 font-bold">● Đang hoạt động</b></div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Giới hạn: <b className="text-slate-900 dark:text-white">2h 00m / ngày</b></span>
            <span className="text-pink-600 dark:text-pink-400 font-bold">Đã ghép nối ✓</span>
          </div>
        </div>

        {/* Pairing Code Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-purple-50/50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 flex flex-col justify-between shadow-sm transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                <QrCode className="w-4 h-4" /> Ghép Nối Thiết Bị Mới
              </div>
              <button
                onClick={generateNewCode}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Đổi mã mới
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Mở Launcher trên máy tính bảng bé $\rightarrow$ Cài đặt Phụ huynh $\rightarrow$ Chọn &apos;Liên Kết&apos; và nhập mã 6 số này:
            </p>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-500/40 text-center mb-4 shadow-sm">
              <span className="text-3xl font-mono font-black text-indigo-600 dark:text-indigo-300 tracking-[8px]">
                {pairingCode}
              </span>
            </div>
          </div>

          <button
            onClick={copyCode}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
          >
            {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {isCopied ? 'Đã sao chép mã!' : 'Sao chép mã ghép nối'}
          </button>
        </div>
      </div>
    </div>
  );
}

