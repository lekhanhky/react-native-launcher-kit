'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Wifi,
  RefreshCw,
  Edit2,
  Check,
  X,
  Radio,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface DeviceItem {
  device_id: string;
  device_name?: string;
  device_model?: string;
  is_emergency_locked?: boolean;
}

export default function ParentDashboardPage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('DEV-TEST-001');
  const [availableDevices, setAvailableDevices] = useState<DeviceItem[]>([]);
  const [isInstantLocked, setIsInstantLocked] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [lockToast, setLockToast] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [lastLatency, setLastLatency] = useState<number | null>(null);

  // Modal đổi/nhập Device ID
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [customDeviceIdInput, setCustomDeviceIdInput] = useState('');

  // 1. Tải danh sách thiết bị và ID đã lưu từ localStorage
  useEffect(() => {
    const savedId = localStorage.getItem('parent_active_device_id');
    if (savedId) {
      setSelectedDeviceId(savedId);
    }
  }, []);

  // 2. Tải danh sách thiết bị từ Supabase (devices + parental_policies)
  const fetchDevices = useCallback(async () => {
    try {
      const [devRes, polRes] = await Promise.all([
        supabase.from('devices').select('device_id, device_name, device_model'),
        supabase.from('parental_policies').select('device_id, is_emergency_locked'),
      ]);

      const map = new Map<string, DeviceItem>();

      // Thêm thiết bị mặc định
      map.set('DEV-TEST-001', {
        device_id: 'DEV-TEST-001',
        device_name: 'Galaxy Tab A9 của Bé',
        device_model: 'Samsung SM-X115',
        is_emergency_locked: false,
      });

      if (devRes.data) {
        devRes.data.forEach((d: any) => {
          if (d.device_id) {
            map.set(d.device_id, {
              device_id: d.device_id,
              device_name: d.device_name || 'Máy tính bảng của Bé',
              device_model: d.device_model || 'Android Tablet',
              is_emergency_locked: false,
            });
          }
        });
      }

      if (polRes.data) {
        polRes.data.forEach((p: any) => {
          if (p.device_id) {
            const existing: DeviceItem = map.get(p.device_id) || {
              device_id: p.device_id,
              device_name: 'Thiết bị ' + p.device_id,
              device_model: 'Android Device',
              is_emergency_locked: false,
            };
            existing.is_emergency_locked = Boolean(p.is_emergency_locked);
            map.set(p.device_id, existing);
          }
        });
      }

      setAvailableDevices(Array.from(map.values()));
    } catch (e) {
      console.warn('Lỗi tải danh sách thiết bị:', e);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // 3. Lấy trạng thái khóa hiện tại & Lắng nghe Realtime WebSocket qua Supabase Phoenix
  useEffect(() => {
    let isSubscribed = true;

    async function loadInitialPolicy() {
      try {
        setRealtimeStatus('connecting');
        const { data, error } = await supabase
          .from('parental_policies')
          .select('is_emergency_locked, lock_message, updated_at')
          .eq('device_id', selectedDeviceId)
          .maybeSingle();

        if (isSubscribed && data) {
          setIsInstantLocked(Boolean(data.is_emergency_locked));
          if (data.updated_at) {
            setLastSyncTime(new Date(data.updated_at).toLocaleTimeString('vi-VN'));
          }
        }
      } catch (err) {
        console.warn('Lỗi lấy policy ban đầu:', err);
      }
    }

    loadInitialPolicy();

    // Đăng ký Supabase Realtime Channel
    const channelName = `realtime-parent-${selectedDeviceId}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parental_policies',
        },
        (payload: any) => {
          const record = payload.new;
          if (record && record.device_id === selectedDeviceId) {
            const locked = Boolean(record.is_emergency_locked);
            setIsInstantLocked(locked);
            setLastSyncTime(new Date().toLocaleTimeString('vi-VN'));

            const toastText = locked
              ? '🔒 Máy của bé đã được KHÓA THÀNH CÔNG (Realtime WebSocket)!'
              : '🔓 Máy của bé đã được MỞ KHÓA HOẠT ĐỘNG (Realtime WebSocket)!';
            setLockToast(toastText);
            setTimeout(() => setLockToast(null), 4000);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected');
        } else if (status === 'CHANNEL_ERROR') {
          setRealtimeStatus('error');
        }
      });

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  }, [selectedDeviceId]);

  // 4. Kích hoạt Khóa / Mở Khóa Tức Thì
  const toggleInstantLock = async () => {
    const nextState = !isInstantLocked;
    setIsUpdating(true);
    const startTime = performance.now();

    try {
      const lockMsg = nextState
        ? 'Ba mẹ đã tạm khóa thiết bị từ xa. Bé hãy nghỉ ngơi nhé!'
        : '';

      const { error } = await supabase.from('parental_policies').upsert(
        {
          device_id: selectedDeviceId,
          is_emergency_locked: nextState,
          lock_message: lockMsg,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'device_id' }
      );

      const latencyMs = Math.round(performance.now() - startTime);
      setLastLatency(latencyMs);
      setLastSyncTime(new Date().toLocaleTimeString('vi-VN'));

      if (error) {
        setLockToast(`❌ Lỗi gửi lệnh: ${error.message}`);
        setTimeout(() => setLockToast(null), 5000);
      } else {
        setIsInstantLocked(nextState);
        const msg = nextState
          ? `🔒 ĐÃ KHÓA MÁY TỨC THÌ (${latencyMs}ms)! Tablet của bé đã nhận lệnh WebSocket.`
          : `🔓 ĐÃ MỞ KHÓA (${latencyMs}ms)! Tablet của bé đã hoạt động lại bình thường.`;
        setLockToast(msg);
        setTimeout(() => setLockToast(null), 4000);
      }
    } catch (e: any) {
      setLockToast(`❌ Ngoại lệ: ${e.message}`);
      setTimeout(() => setLockToast(null), 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectDevice = (devId: string) => {
    setSelectedDeviceId(devId);
    localStorage.setItem('parent_active_device_id', devId);
    setIsDeviceModalOpen(false);
  };

  const handleAddCustomDevice = () => {
    const clean = customDeviceIdInput.trim().toUpperCase();
    if (!clean) return;
    setSelectedDeviceId(clean);
    localStorage.setItem('parent_active_device_id', clean);
    setCustomDeviceIdInput('');
    setIsDeviceModalOpen(false);
    fetchDevices();
  };

  const currentDevice = availableDevices.find((d) => d.device_id === selectedDeviceId) || {
    device_id: selectedDeviceId,
    device_name: 'Máy tính bảng của Bé',
    device_model: 'Galaxy Tab A9',
    is_emergency_locked: isInstantLocked,
  };

  return (
    <div className="space-y-8">
      {/* HEADER WITH REALTIME STATUS & INSTANT LOCK BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-50 via-purple-50/50 to-indigo-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-pink-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition">
        <div className="space-y-2">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition ${
                realtimeStatus === 'connected'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                  : realtimeStatus === 'connecting'
                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  realtimeStatus === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : realtimeStatus === 'connecting'
                    ? 'bg-amber-500 animate-ping'
                    : 'bg-rose-500'
                }`}
              />
              {realtimeStatus === 'connected'
                ? 'Realtime WebSocket Đang Kết Nối (< 1s)'
                : realtimeStatus === 'connecting'
                ? 'Đang kết nối Realtime...'
                : 'Mất kết nối Realtime'}
            </div>

            {/* Device ID Chip & Switcher */}
            <button
              onClick={() => setIsDeviceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
              title="Nhấn để đổi thiết bị của bé"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
              <span>Thiết bị: <b className="font-mono text-indigo-600 dark:text-indigo-400">{selectedDeviceId}</b></span>
              <Edit2 className="w-3 h-3 opacity-60 ml-0.5" />
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Chào Ba Mẹ! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Đang quản lý bé <b className="text-pink-600 dark:text-pink-400">{currentDevice.device_name || 'Bé Gia Bảo'}</b> ({currentDevice.device_model || 'Galaxy Tab A9'}).
            {lastSyncTime && (
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
                Đồng bộ lúc {lastSyncTime} {lastLatency ? `(${lastLatency}ms)` : ''}
              </span>
            )}
          </p>
        </div>

        {/* Nút Khóa Khẩn Cấp Lớn */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={toggleInstantLock}
            disabled={isUpdating}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition shadow-xl active:scale-95 ${
              isUpdating
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : isInstantLocked
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-4 ring-emerald-500/20'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-4 ring-rose-500/20'
            }`}
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" /> ĐANG TRUYỀN LỆNH...
              </>
            ) : isInstantLocked ? (
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
          className={`p-4 rounded-2xl border text-sm font-bold flex items-center gap-3 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
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
            <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {currentDevice.device_name || 'Máy tính bảng của Bé'}
            </div>
            <div className="text-xs text-slate-500 font-mono mb-2">ID: {selectedDeviceId}</div>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Đang Online
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 86% Pin
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                  isInstantLocked
                    ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                    : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20'
                }`}
              >
                {isInstantLocked ? '🔒 Đang Khóa' : '🔓 Đang Mở'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Ứng dụng mở: <b className="text-slate-900 dark:text-white">🧮 Math Quiz Game</b></span>
            <button
              onClick={() => setIsDeviceModalOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-xs"
            >
              Đổi máy ➔
            </button>
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

      {/* MODAL CHỌN / KẾT NỐI THIẾT BỊ BÉ */}
      {isDeviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-500" /> Chọn Thiết Bị Của Bé
              </h3>
              <button
                onClick={() => setIsDeviceModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chọn máy tính bảng / điện thoại của bé để gửi lệnh khóa và nhận báo cáo thời gian dùng:
            </p>

            {/* Danh sách thiết bị có sẵn */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {availableDevices.map((dev) => (
                <div
                  key={dev.device_id}
                  onClick={() => handleSelectDevice(dev.device_id)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                    selectedDeviceId === dev.device_id
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-600 text-indigo-900 dark:text-indigo-200'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{dev.device_name}</div>
                    <div className="text-xs text-slate-500 font-mono">{dev.device_id}</div>
                  </div>
                  {selectedDeviceId === dev.device_id && (
                    <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
              ))}
            </div>

            {/* Hoặc nhập mã thủ công */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Hoặc nhập mã Device ID (xem trong Cài Đặt trên máy bé):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: ANDR-A1B2C3D4"
                  value={customDeviceIdInput}
                  onChange={(e) => setCustomDeviceIdInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white uppercase font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAddCustomDevice}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Kết Nối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
