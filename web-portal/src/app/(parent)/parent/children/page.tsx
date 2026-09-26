'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  QrCode,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Copy,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import QrScannerModal, { QrPairingPayload } from '@/components/QrScannerModal';
import { supabase } from '@/lib/supabase';

interface ChildItem {
  id: string;
  name: string;
  age: string;
  avatar: string;
  deviceId: string;
  deviceName: string;
  status: string;
  limitTime: string;
  isPaired: boolean;
}

const DEFAULT_CHILDREN: ChildItem[] = [
  {
    id: 'child_1',
    name: 'Bé Gia Bảo',
    age: '6 Tuổi • Lớp 1',
    avatar: '👦',
    deviceId: 'DEV-TEST-001',
    deviceName: 'Samsung Galaxy Tab A9',
    status: 'Đang hoạt động',
    limitTime: '2h 00m / ngày',
    isPaired: true,
  },
];

export default function ParentChildrenPage() {
  const [pairingCode, setPairingCode] = useState('784920');
  const [isCopied, setIsCopied] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [children, setChildren] = useState<ChildItem[]>(DEFAULT_CHILDREN);

  // Tải danh sách thiết bị từ Supabase khi mở trang
  useEffect(() => {
    async function loadDevices() {
      try {
        const { data } = await supabase
          .from('devices')
          .select('device_id, device_name, device_model, is_paired');

        if (data && data.length > 0) {
          setChildren((prev) => {
            const list = [...prev];
            data.forEach((d: any) => {
              if (d.device_id && !list.some((item) => item.deviceId === d.device_id)) {
                list.push({
                  id: `dev_${d.device_id}`,
                  name: d.device_name || 'Bé Yêu',
                  age: 'Thiết bị đã kết nối',
                  avatar: '📱',
                  deviceId: d.device_id,
                  deviceName: d.device_model || d.device_name || 'Android Device',
                  status: d.is_paired ? 'Đang hoạt động' : 'Chưa kích hoạt',
                  limitTime: '2h 00m / ngày',
                  isPaired: Boolean(d.is_paired),
                });
              }
            });
            return list;
          });
        }
      } catch (e) {
        console.warn('Lỗi tải danh sách thiết bị:', e);
      }
    }
    loadDevices();
  }, []);

  const generateNewCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setPairingCode(newCode);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(pairingCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleScanSuccess = async (payload: QrPairingPayload) => {
    setIsPairing(true);
    try {
      const res = await fetch('/api/v1/device/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: payload.device_id,
          device_name: payload.device_name || 'Máy tính bảng của Bé',
        }),
      });

      const result = await res.json();

      if (result.success) {
        localStorage.setItem('parent_active_device_id', payload.device_id);
        setToastMessage({
          type: 'success',
          text: `🎉 Ghép nối thành công thiết bị ${payload.device_name || payload.device_id}!`,
        });

        // Bổ sung hoặc cập nhật thiết bị trong danh sách
        setChildren((prev) => {
          const index = prev.findIndex((c) => c.deviceId === payload.device_id);
          const newItem: ChildItem = {
            id: `child_${payload.device_id}`,
            name: payload.device_name || 'Bé Mới Ghép Nối',
            age: 'Thiết bị vừa kích hoạt',
            avatar: '✨',
            deviceId: payload.device_id,
            deviceName: payload.device_name || 'Kids Tablet',
            status: 'Đang hoạt động',
            limitTime: '2h 00m / ngày',
            isPaired: true,
          };
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = newItem;
            return updated;
          }
          return [newItem, ...prev];
        });
      } else {
        setToastMessage({
          type: 'error',
          text: result.error || 'Ghép nối thiết bị không thành công.',
        });
      }
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        text: err.message || 'Lỗi kết nối tới máy chủ.',
      });
    } finally {
      setIsPairing(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
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
            Thêm hồ sơ các bé trong gia đình và ghép nối với máy tính bảng qua mã 6 số hoặc quét mã QR.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            disabled={isPairing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition cursor-pointer"
          >
            {isPairing ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
            Quét mã QR máy bé
          </button>

          <button
            type="button"
            onClick={() => alert('Thêm hồ sơ bé mới')}
            className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Thêm Bé Mới
          </button>
        </div>
      </div>

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-500/15 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* CHILDREN PROFILES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Child Cards */}
        {children.map((child) => (
          <div
            key={child.id}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm transition"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-3xl shadow-md">
                  {child.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{child.name}</h3>
                  <span className="text-xs text-pink-600 dark:text-pink-400 font-bold">{child.age}</span>
                </div>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mb-6">
                <div>
                  Thiết bị: <b className="text-slate-900 dark:text-slate-200">{child.deviceName}</b>
                </div>
                <div>
                  Mã thiết bị:{' '}
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {child.deviceId}
                  </span>
                </div>
                <div>
                  Trạng thái:{' '}
                  <b className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ● {child.status}
                  </b>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                Giới hạn: <b className="text-slate-900 dark:text-white">{child.limitTime}</b>
              </span>
              <span className="text-pink-600 dark:text-pink-400 font-bold">
                {child.isPaired ? 'Đã ghép nối ✓' : 'Chờ ghép nối'}
              </span>
            </div>
          </div>
        ))}

        {/* Pairing Code & QR Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-purple-50/50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 flex flex-col justify-between shadow-sm transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                <QrCode className="w-4 h-4" /> Ghép Nối Thiết Bị Mới
              </div>
              <button
                type="button"
                onClick={generateNewCode}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Đổi mã mới
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Mở Launcher trên máy tính bảng bé ? Cài đặt Phụ huynh ? Chọn &apos;Liên Kết&apos; và quét mã QR hoặc nhập mã 6 số này:
            </p>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-500/40 text-center mb-4 shadow-sm">
              <span className="text-3xl font-mono font-black text-indigo-600 dark:text-indigo-300 tracking-[8px]">
                {pairingCode}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              disabled={isPairing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.99] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              {isPairing ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
              Quét mã QR máy bé
            </button>

            <button
              type="button"
              onClick={copyCode}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-2"
            >
              {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {isCopied ? 'Đã sao chép mã 6 số!' : 'Sao chép mã 6 số'}
            </button>
          </div>
        </div>
      </div>

      {/* QR SCANNER MODAL */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
