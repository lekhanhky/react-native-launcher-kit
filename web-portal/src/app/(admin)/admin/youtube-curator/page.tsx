'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Youtube, Plus, CheckCircle, Search, Sparkles, ExternalLink } from 'lucide-react';

export default function YouTubeCuratorPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadChannels() {
      try {
        const { data } = await supabase
          .from('kids_youtube_channels')
          .select('*')
          .limit(20);
        if (data && data.length > 0) {
          setChannels(data);
        } else {
          // Fallback sample data
          setChannels([
            { id: '1', channel_title: 'Vui Học Tiếng Anh Trẻ Em', category: 'Tiếng Anh', subscriber_count_text: '1.2M sub', is_active: true },
            { id: '2', name: 'Khoa Học Vui Cho Bé', category: 'Khoa học', subscriber_count_text: '850K sub', is_active: true },
            { id: '3', name: 'Kể Chuyện Cổ Tích Bé Ngủ Ngon', category: 'Cổ tích', subscriber_count_text: '2.1M sub', is_active: true },
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadChannels();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Youtube className="w-8 h-8 text-rose-600 dark:text-rose-400 shrink-0" />
            Kiểm Duyệt YouTube Kids (Whitelist Curator)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Chỉ những kênh và video được duyệt ở đây mới được phép hiển thị trên màn hình Kids YouTube của bé.
          </p>
        </div>

        <button
          onClick={() => alert('Nhập Link Kênh / ID YouTube để kiểm duyệt an toàn')}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-2 self-start sm:self-auto transition"
        >
          <Plus className="w-4 h-4" /> Duyệt Kênh YouTube Mới
        </button>
      </div>

      {/* CHANNELS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channels.map((ch, idx) => (
          <div
            key={ch.id || idx}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl font-bold">
                  📺
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Đã duyệt
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {ch.channel_title || ch.name || 'Kênh Bé Vui Học'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                {ch.description || 'Kênh video thiếu nhi chọn lọc, nội dung giáo dục lành mạnh.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-rose-600 dark:text-rose-400">{ch.category || 'Giáo Dục'}</span>
              <span>{ch.subscriber_count_text || 'Đã kiểm duyệt'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
