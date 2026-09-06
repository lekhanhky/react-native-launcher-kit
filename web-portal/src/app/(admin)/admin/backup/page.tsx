'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  History,
  Sparkles,
  Clock,
  ArrowRight,
  Lock,
  Check,
  Copy,
  FileText,
  HelpCircle,
  HardDriveDownload,
  Sliders,
  CheckSquare,
  Square,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

interface TableGroup {
  name: string;
  description: string;
  icon: string;
  tables: {
    key: string;
    label: string;
    description: string;
    defaultSelected: boolean;
  }[];
}

const TABLE_GROUPS: TableGroup[] = [
  {
    name: 'Nội Dung Học Tập & Game Giáo Dục',
    description: 'Ngân hàng câu hỏi toán, màn chơi Tangram, Mê cung, Thẻ lật, Âm thanh con vật',
    icon: '🧩',
    tables: [
      { key: 'math_topics', label: 'Chủ Đề Môn Toán', description: 'Các nhóm đề theo khối lớp (preschool, grade 1-3)', defaultSelected: true },
      { key: 'math_questions', label: 'Ngân Hàng Câu Hỏi Toán', description: 'Đề toán động kèm icon emoji, đáp án & lời giải', defaultSelected: true },
      { key: 'puzzle_scenes', label: 'Màn Chơi Tangram & Jigsaw', description: 'Mảnh ghép và tọa độ hình ghép cho bé', defaultSelected: true },
      { key: 'maze_scenes', label: 'Màn Chơi Mê Cung (Maze)', description: 'Lưới ma trận đường đi & chướng ngại vật', defaultSelected: true },
      { key: 'drawing_scenes', label: 'Nối Số & Tô Màu Vector', description: 'Tọa độ điểm nối và đường nét SVG', defaultSelected: true },
      { key: 'memory_card_decks', label: 'Bộ Thẻ Lật Ghi Nhớ', description: 'Danh sách thẻ cặp bài chủ đề trái cây, đồ vật', defaultSelected: true },
      { key: 'spelling_words', label: 'Từ Vựng Đánh Vần Song Ngữ', description: 'Từ ngữ, hình ảnh và chữ cái xáo trộn', defaultSelected: true },
      { key: 'game_catalog', label: 'Danh Mục Game Kiosk', description: 'Cấu hình bật tắt các game trong launcher', defaultSelected: true },
      { key: 'kids_animals', label: 'Con Vật & Âm Thanh MP3', description: 'Dữ liệu phát âm và tiếng kêu động vật', defaultSelected: true },
    ],
  },
  {
    name: 'Kiểm Duyệt YouTube Kids',
    description: 'Kho Kênh & Playlist an toàn cùng danh sách video đã qua kiểm duyệt',
    icon: '🎬',
    tables: [
      { key: 'youtube_catalogs', label: 'Kênh & Playlist Whitelist', description: 'Kênh thiếu nhi an toàn (ID, avatar, mô tả)', defaultSelected: true },
      { key: 'youtube_videos', label: 'Danh Sách Video Đã Duyệt', description: 'Video đã kiểm tra an toàn theo từng kênh', defaultSelected: true },
    ],
  },
  {
    name: 'Thiết Bị Tablet & Cài Đặt Phụ Huynh',
    description: 'Danh sách máy tính bảng, mã PIN phụ huynh, giờ học, giờ ngủ & giới hạn',
    icon: '📱',
    tables: [
      { key: 'devices', label: 'Danh Sách Tablet Bé', description: 'Android ID phần cứng, tên thiết bị, bản quyền', defaultSelected: true },
      { key: 'parental_policies', label: 'Chính Sách Chặn App & PIN', description: 'Mã PIN, khóa tức thì và app cho phép/chặn', defaultSelected: true },
      { key: 'time_schedules', label: 'Lịch Khung Giờ Học/Ngủ', description: 'Giờ mở máy, giờ khóa máy và thông báo', defaultSelected: true },
      { key: 'device_youtube_settings', label: 'Cấu Hình YouTube Cho Thiết Bị', description: 'Thời lượng xem tối đa và kênh được phép xem', defaultSelected: true },
    ],
  },
];

const ALL_TABLE_KEYS = TABLE_GROUPS.flatMap((g) => g.tables.map((t) => t.key));

interface HistoryItem {
  id: string;
  type: 'BACKUP' | 'RESTORE';
  timestamp: string;
  mode?: string;
  format?: string;
  tablesCount: number;
  recordsCount: number;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
  note?: string;
}

export default function BackupRestorePage() {
  const [activeTab, setActiveTab] = useState<'BACKUP' | 'RESTORE' | 'HISTORY' | 'SCHEMA'>('BACKUP');

  // Selected tables for backup
  const [selectedTables, setSelectedTables] = useState<string[]>(ALL_TABLE_KEYS);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [isExporting, setIsExporting] = useState(false);

  // Stats / Live table counts
  const [tableLiveCounts, setTableLiveCounts] = useState<Record<string, number>>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  // Restore states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedPayload, setParsedPayload] = useState<any | null>(null);
  const [restoreSelectedTables, setRestoreSelectedTables] = useState<string[]>([]);
  const [restoreMode, setRestoreMode] = useState<'upsert' | 'clean'>('upsert');
  const [cleanConfirmText, setCleanConfirmText] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState<number>(0);
  const [restoreResults, setRestoreResults] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audit history
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load counts & history on mount
  useEffect(() => {
    loadLiveCounts();
    loadHistory();
  }, []);

  const loadLiveCounts = async () => {
    setIsLoadingCounts(true);
    const counts: Record<string, number> = {};

    try {
      // Gọi song song đếm một số bảng chính
      const promises = ALL_TABLE_KEYS.map(async (table) => {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          if (!error && count !== null) {
            counts[table] = count;
          } else {
            counts[table] = 0;
          }
        } catch {
          counts[table] = 0;
        }
      });

      await Promise.all(promises);
      setTableLiveCounts(counts);
    } catch (e) {
      console.warn('Load counts error:', e);
    } finally {
      setIsLoadingCounts(false);
    }
  };

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('kidslauncher_backup_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const saveHistoryItem = (item: HistoryItem) => {
    try {
      const updated = [item, ...history].slice(0, 30);
      setHistory(updated);
      localStorage.setItem('kidslauncher_backup_history', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Toggle selection for backup
  const toggleTable = (key: string) => {
    setSelectedTables((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const selectAll = () => setSelectedTables(ALL_TABLE_KEYS);
  const deselectAll = () => setSelectedTables([]);

  const selectGroup = (group: TableGroup) => {
    const keys = group.tables.map((t) => t.key);
    setSelectedTables((prev) => Array.from(new Set([...prev, ...keys])));
  };

  const deselectGroup = (group: TableGroup) => {
    const keys = group.tables.map((t) => t.key);
    setSelectedTables((prev) => prev.filter((k) => !keys.includes(k)));
  };

  // EXECUTE BACKUP
  const handleExport = async (customTables?: string[]) => {
    const tablesToExport = customTables || selectedTables;
    if (tablesToExport.length === 0) {
      alert('Vui lòng chọn ít nhất 1 bảng dữ liệu để sao lưu!');
      return;
    }

    setIsExporting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/v1/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables: tablesToExport }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.details || err.error || 'Lỗi sao lưu dữ liệu');
      }

      const data = await res.json();
      const dateStr = new Date().toISOString().slice(0, 10);
      const timeStr = new Date().toTimeString().slice(0, 5).replace(':', '');

      if (exportFormat === 'json') {
        // Tải file JSON
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kidslauncher-backup-${dateStr}-${timeStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Xuất CSV (ghép các bảng vào CSV hoặc tải từng bảng)
        // Tạo file ZIP hoặc file text phân đoạn
        let csvContent = `### KIDSLANCHER EXPORT BACKUP - ${dateStr} ###\n\n`;
        for (const [tbl, rows] of Object.entries(data.tables as Record<string, any[]>)) {
          csvContent += `\n--- TABLE: ${tbl} (${rows.length} rows) ---\n`;
          if (rows.length > 0) {
            const headers = Object.keys(rows[0]);
            csvContent += headers.join(',') + '\n';
            rows.forEach((row) => {
              const rowValues = headers.map((h) => {
                const val = row[h];
                if (val === null || val === undefined) return '';
                if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
                return `"${String(val).replace(/"/g, '""')}"`;
              });
              csvContent += rowValues.join(',') + '\n';
            });
          } else {
            csvContent += '(No data)\n';
          }
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kidslauncher-backup-${dateStr}-${timeStr}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Lưu nhật ký
      saveHistoryItem({
        id: 'bk_' + Date.now(),
        type: 'BACKUP',
        timestamp: new Date().toISOString(),
        format: exportFormat.toUpperCase(),
        tablesCount: data.totalTables,
        recordsCount: data.totalRecords,
        status: 'SUCCESS',
        note: `Xuất thành công ${data.totalTables} bảng (${data.totalRecords} bản ghi)`,
      });
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message);
      saveHistoryItem({
        id: 'bk_' + Date.now(),
        type: 'BACKUP',
        timestamp: new Date().toISOString(),
        format: exportFormat.toUpperCase(),
        tablesCount: tablesToExport.length,
        recordsCount: 0,
        status: 'ERROR',
        note: `Thất bại: ${e.message}`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // FULL ONE-CLICK BACKUP
  const handleFullBackup = () => {
    setSelectedTables(ALL_TABLE_KEYS);
    handleExport(ALL_TABLE_KEYS);
  };

  // HANDLE FILE UPLOAD FOR RESTORE
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('Vui lòng chọn file sao lưu có đuôi .json hợp lệ!');
      return;
    }

    setUploadedFile(file);
    setErrorMessage(null);
    setRestoreResults(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.tables || typeof json.tables !== 'object') {
          throw new Error('File không đúng cấu trúc chuẩn của KidsLauncher Backup (thiếu trường tables)');
        }
        setParsedPayload(json);
        const availableInFile = Object.keys(json.tables);
        setRestoreSelectedTables(availableInFile);
      } catch (err: any) {
        setParsedPayload(null);
        setErrorMessage('Không thể đọc file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // EXECUTE RESTORE
  const handleRestore = async () => {
    if (!parsedPayload || !parsedPayload.tables) {
      alert('Chưa có dữ liệu sao lưu hợp lệ!');
      return;
    }

    if (restoreSelectedTables.length === 0) {
      alert('Vui lòng chọn ít nhất 1 bảng để khôi phục!');
      return;
    }

    if (restoreMode === 'clean' && cleanConfirmText.trim() !== 'RESTORE') {
      alert('Vui lòng nhập chính xác chữ "RESTORE" vào ô xác nhận trước khi tiến hành xóa và khôi phục sạch!');
      return;
    }

    setIsRestoring(true);
    setRestoreProgress(10);
    setErrorMessage(null);
    setRestoreResults(null);

    try {
      setRestoreProgress(30);

      const res = await fetch('/api/v1/admin/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: restoreMode,
          tables: parsedPayload.tables,
          selectedTables: restoreSelectedTables,
        }),
      });

      setRestoreProgress(80);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Lỗi khôi phục dữ liệu');
      }

      setRestoreProgress(100);
      setRestoreResults(data);

      const totalRestored = Object.values(data.results || {}).reduce(
        (sum: number, r: any) => sum + (r.insertedCount || 0),
        0
      );

      saveHistoryItem({
        id: 'res_' + Date.now(),
        type: 'RESTORE',
        timestamp: new Date().toISOString(),
        mode: restoreMode === 'clean' ? 'CLEAN (Ghi đè)' : 'UPSERT (Hợp nhất)',
        tablesCount: restoreSelectedTables.length,
        recordsCount: totalRestored,
        status: data.success ? 'SUCCESS' : 'WARNING',
        note: data.message,
      });

      // Tải lại số liệu đếm
      loadLiveCounts();
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message);
      saveHistoryItem({
        id: 'res_' + Date.now(),
        type: 'RESTORE',
        timestamp: new Date().toISOString(),
        mode: restoreMode,
        tablesCount: restoreSelectedTables.length,
        recordsCount: 0,
        status: 'ERROR',
        note: `Lỗi phục hồi: ${e.message}`,
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const totalCalculatedRecords = selectedTables.reduce(
    (sum, t) => sum + (tableLiveCounts[t] || 0),
    0
  );

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 p-6 md:p-10 border border-indigo-500/20 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Disaster Recovery & Data Vault
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Trung Tâm Sao Lưu & Phục Hồi Dữ Liệu
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Xuất bản sao lưu toàn bộ ngân hàng toán, màn chơi game, kho video YouTube Kids và danh sách thiết bị. Khôi phục nhanh chóng, an toàn tuyệt đối với chế độ Upsert.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleFullBackup}
              disabled={isExporting}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              <HardDriveDownload className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? 'Đang Sao Lưu...' : '1-Click Full Backup'}</span>
            </button>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-8 pt-6 border-t border-indigo-500/20">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-indigo-500/10 backdrop-blur">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Bảng Hỗ Trợ</span>
            <span className="text-xl md:text-2xl font-black text-white">{ALL_TABLE_KEYS.length} Bảng</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-indigo-500/10 backdrop-blur">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Tổng Bản Ghi Ước Tính</span>
            <span className="text-xl md:text-2xl font-black text-indigo-400">
              {isLoadingCounts ? '...' : totalCalculatedRecords.toLocaleString()}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-indigo-500/10 backdrop-blur">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Cơ Sở Dữ Liệu</span>
            <span className="text-xs md:text-sm font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Supabase Cloud
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-indigo-500/10 backdrop-blur">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Lần Backup Gần Nhất</span>
            <span className="text-xs md:text-sm font-bold text-slate-300 mt-1 block truncate">
              {history.length > 0 ? new Date(history[0].timestamp).toLocaleDateString('vi-VN') : 'Chưa có'}
            </span>
          </div>
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="text-sm">
            <strong className="font-bold">Lỗi: </strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* MAIN TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('BACKUP')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'BACKUP'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Sao Lưu Dữ Liệu (Export)</span>
        </button>

        <button
          onClick={() => setActiveTab('RESTORE')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'RESTORE'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Phục Hồi Dữ Liệu (Restore & Import)</span>
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'HISTORY'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Lịch Sử Sao Lưu ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SCHEMA')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'SCHEMA'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Cấu Trúc Bảng (SQL Schema)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SAO LƯU DỮ LIỆU (EXPORT) */}
      {/* ========================================================================= */}
      {activeTab === 'BACKUP' && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={selectAll}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
              >
                <CheckSquare className="w-3.5 h-3.5 text-indigo-500" /> Chọn Tất Cả ({ALL_TABLE_KEYS.length})
              </button>
              <button
                onClick={deselectAll}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 text-slate-400" /> Bỏ Chọn Hết
              </button>

              <button
                onClick={loadLiveCounts}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5 ml-2"
                title="Làm mới số lượng dòng dữ liệu"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoadingCounts ? 'animate-spin' : ''}`} />
                Làm mới số liệu
              </button>
            </div>

            {/* Format & Download button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setExportFormat('json')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    exportFormat === 'json'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5" /> JSON (Khuyên Dùng)
                </button>
                <button
                  onClick={() => setExportFormat('csv')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    exportFormat === 'csv'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> CSV / Excel
                </button>
              </div>

              <button
                onClick={() => handleExport()}
                disabled={isExporting || selectedTables.length === 0}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-md shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
              >
                <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                <span>
                  {isExporting
                    ? 'Đang Trích Xuất...'
                    : `Tải Về (${selectedTables.length} Bảng)`}
                </span>
              </button>
            </div>
          </div>

          {/* Table Groups */}
          <div className="space-y-6">
            {TABLE_GROUPS.map((group) => {
              const allGroupKeys = group.tables.map((t) => t.key);
              const selectedInGroup = allGroupKeys.filter((k) => selectedTables.includes(k));
              const isAllInGroup = selectedInGroup.length === allGroupKeys.length;

              return (
                <div
                  key={group.name}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition"
                >
                  {/* Group Header */}
                  <div className="p-5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-xl">
                        {group.icon}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {group.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {group.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">
                        Đã chọn: <b className="text-indigo-600 dark:text-indigo-400">{selectedInGroup.length}</b>/{allGroupKeys.length}
                      </span>
                      <button
                        onClick={() => (isAllInGroup ? deselectGroup(group) : selectGroup(group))}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      >
                        {isAllInGroup ? 'Bỏ chọn nhóm' : 'Chọn cả nhóm'}
                      </button>
                    </div>
                  </div>

                  {/* Table Items Grid */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {group.tables.map((table) => {
                      const isChecked = selectedTables.includes(table.key);
                      const rowCount = tableLiveCounts[table.key];

                      return (
                        <div
                          key={table.key}
                          onClick={() => toggleTable(table.key)}
                          className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between ${
                            isChecked
                              ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500/40 shadow-sm'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center text-white text-[10px] transition ${
                                    isChecked ? 'bg-indigo-600' : 'border border-slate-400'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span>{table.label}</span>
                              </div>

                              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold shrink-0">
                                {isLoadingCounts ? '...' : `${(rowCount || 0).toLocaleString()} dòng`}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {table.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span>table: {table.key}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PHỤC HỒI DỮ LIỆU (RESTORE & IMPORT) */}
      {/* ========================================================================= */}
      {activeTab === 'RESTORE' && (
        <div className="space-y-6">
          {/* Guide / Warning Alert */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed space-y-1">
              <h4 className="font-bold text-base text-amber-900 dark:text-amber-100">
                Lưu ý quan trọng khi Khôi Phục Dữ Liệu:
              </h4>
              <p>
                • Hệ thống sử dụng cơ chế bảo mật tự động kiểm tra tính hợp lệ của file backup JSON trước khi nạp.
              </p>
              <p>
                • <b>Chế độ Hợp nhất (Upsert)</b> được khuyên dùng để bổ sung dữ liệu mới mà không làm mất thông tin hiện có.
              </p>
              <p>
                • <b>Chế độ Ghi đè sạch (Clean Overwrite)</b> sẽ xóa sạch dữ liệu cũ của bảng được chọn trước khi nạp lại.
              </p>
            </div>
          </div>

          {/* Upload Area */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shadow-inner">
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Tải lên file sao lưu (.json)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                Kéo thả file sao lưu từ máy tính hoặc bấm nút bên dưới để chọn file từ thư mục.
              </p>
            </div>

            <label className="cursor-pointer px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95 inline-flex items-center gap-2">
              <FileJson className="w-4 h-4" />
              <span>{uploadedFile ? 'Chọn File Khác' : 'Chọn File JSON'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {uploadedFile && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>File đã nạp: <b>{uploadedFile.name}</b> ({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          {/* Parsed Payload Preview & Execution */}
          {parsedPayload && (
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Thông Tin Bản Sao Lưu Được Đọc
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {parsedPayload.system || 'KidsLauncher Backup Bundle'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Ngày xuất: {parsedPayload.exportedAt ? new Date(parsedPayload.exportedAt).toLocaleString('vi-VN') : 'Không rõ'} • Phiên bản: {parsedPayload.version || '1.0'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {Object.keys(parsedPayload.tables || {}).length} Bảng trong file
                  </span>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Chọn Chế Độ Khôi Phục:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mode 1: Upsert */}
                  <div
                    onClick={() => setRestoreMode('upsert')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                      restoreMode === 'upsert'
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                        🛡️
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Hợp Nhất & Cập Nhật (Upsert)
                        </h4>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Khuyên dùng • An toàn tuyệt đối
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Chèn bản ghi mới và cập nhật bản ghi trùng khóa chính. Không xóa bất kỳ dữ liệu hiện hữu nào trong hệ thống.
                    </p>
                  </div>

                  {/* Mode 2: Clean Overwrite */}
                  <div
                    onClick={() => setRestoreMode('clean')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                      restoreMode === 'clean'
                        ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                        ⚠️
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Xóa Sạch & Khôi Phục Toàn Diện (Clean Overwrite)
                        </h4>
                        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                          Cẩn trọng • Thay thế toàn bộ
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Xóa trắng dữ liệu của các bảng đã chọn trước khi nạp lại dữ liệu từ file backup. Yêu cầu nhập mã xác nhận.
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation Input for Clean Mode */}
              {restoreMode === 'clean' && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-300 font-bold text-xs">
                    <Lock className="w-4 h-4" />
                    <span>Xác nhận xóa & khôi phục sạch dữ liệu:</span>
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-400">
                    Vui lòng nhập chính xác chữ <b>RESTORE</b> vào ô dưới đây để mở khóa chức năng này:
                  </p>
                  <input
                    type="text"
                    value={cleanConfirmText}
                    onChange={(e) => setCleanConfirmText(e.target.value)}
                    placeholder="Gõ chữ RESTORE vào đây..."
                    className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-rose-500/40 text-sm font-mono font-bold text-rose-600 dark:text-rose-300 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}

              {/* Table Selection for Restore */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Các Bảng Dữ Liệu Sẽ Được Khôi Phục:
                  </label>
                  <span className="text-xs text-slate-500">
                    Đã chọn {restoreSelectedTables.length}/{Object.keys(parsedPayload.tables).length} bảng
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(parsedPayload.tables).map(([tblKey, records]: [string, any]) => {
                    const isSelected = restoreSelectedTables.includes(tblKey);
                    const count = Array.isArray(records) ? records.length : 0;

                    return (
                      <div
                        key={tblKey}
                        onClick={() => {
                          setRestoreSelectedTables((prev) =>
                            prev.includes(tblKey)
                              ? prev.filter((k) => k !== tblKey)
                              : [...prev, tblKey]
                          );
                        }}
                        className={`p-3 rounded-xl border cursor-pointer select-none transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500/40 text-slate-900 dark:text-white'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center text-white text-[9px] ${
                              isSelected ? 'bg-indigo-600' : 'border border-slate-400'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="font-bold text-xs">{tblKey}</span>
                        </div>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {count} dòng
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Bar when restoring */}
              {isRestoring && (
                <div className="space-y-2 pt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Đang tiến hành khôi phục dữ liệu vào Cloud...</span>
                    <span>{restoreProgress}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${restoreProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Execute Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  onClick={handleRestore}
                  disabled={
                    isRestoring ||
                    restoreSelectedTables.length === 0 ||
                    (restoreMode === 'clean' && cleanConfirmText.trim() !== 'RESTORE')
                  }
                  className={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white transition shadow-lg active:scale-95 disabled:opacity-40 flex items-center gap-2 ${
                    restoreMode === 'clean'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
                  <span>
                    {isRestoring
                      ? 'Đang Khôi Phục Dữ Liệu...'
                      : restoreMode === 'clean'
                      ? 'Thực Thi Khôi Phục Sạch (Clean Overwrite)'
                      : 'Bắt Đầu Khôi Phục (Upsert & Merge)'}
                  </span>
                </button>
              </div>

              {/* Restore Results Summary */}
              {restoreResults && (
                <div className="mt-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{restoreResults.message}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(restoreResults.results || {}).map(([table, res]: [string, any]) => (
                      <div
                        key={table}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                          res.success
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/30'
                        }`}
                      >
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {table}
                        </span>
                        <span className="font-bold">
                          {res.success ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              ✓ {res.insertedCount} bản ghi
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400" title={res.error}>
                              Lỗi
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: NHẬT KÝ & LỊCH SỬ THAO TÁC (HISTORY) */}
      {/* ========================================================================= */}
      {activeTab === 'HISTORY' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Nhật Ký Sao Lưu & Phục Hồi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ghi lại các lần Export / Restore được thực hiện trên trình duyệt của Super Admin.
              </p>
            </div>

            {history.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xóa lịch sử thao tác lưu trên trình duyệt?')) {
                    setHistory([]);
                    localStorage.removeItem('kidslauncher_backup_history');
                  }
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-600 dark:text-slate-400 transition"
              >
                Xóa Lịch Sử
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <History className="w-10 h-10 mx-auto opacity-40 mb-3" />
              <p className="text-sm font-semibold">Chưa có lịch sử sao lưu hoặc phục hồi nào.</p>
              <p className="text-xs">Các thao tác Export hoặc Restore của bạn sẽ tự động được ghi lại tại đây.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3">Loại Thao Tác</th>
                    <th className="pb-3">Thời Điểm</th>
                    <th className="pb-3">Định Dạng / Chế Độ</th>
                    <th className="pb-3">Quy Mô</th>
                    <th className="pb-3">Trạng Thái</th>
                    <th className="pb-3">Ghi Chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="py-3.5 font-bold">
                        {item.type === 'BACKUP' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold">
                            <Download className="w-3 h-3" /> Sao Lưu
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Upload className="w-3 h-3" /> Phục Hồi
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
                        {new Date(item.timestamp).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {item.format || item.mode || '—'}
                      </td>
                      <td className="py-3.5 text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">{item.tablesCount} bảng</span>
                        <span className="text-slate-400"> ({item.recordsCount.toLocaleString()} dòng)</span>
                      </td>
                      <td className="py-3.5">
                        {item.status === 'SUCCESS' && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Thành Công
                          </span>
                        )}
                        {item.status === 'WARNING' && (
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Cảnh Báo
                          </span>
                        )}
                        {item.status === 'ERROR' && (
                          <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Thất Bại
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-xs text-slate-500 max-w-xs truncate">
                        {item.note || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SQL SCHEMA & DDL MIGRATION SCRIPTS */}
      {/* ========================================================================= */}
      {activeTab === 'SCHEMA' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Cấu Trúc Bảng Cơ Sở Dữ Liệu (DDL Schemas)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tài liệu tham khảo cấu trúc bảng PostgreSQL / Supabase được định nghĩa trong hệ thống.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl mb-3">
                  📱
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  01. Parental Control & Licensing
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Bảng devices, parental_policies, time_schedules, enums và Realtime triggers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-[11px] font-mono text-slate-400">
                docs/sql/01_parental_control_schema.sql
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl mb-3">
                  🎬
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  02. YouTube Whitelist Management
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Bảng youtube_catalogs, youtube_videos, device_youtube_settings và watch logs.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-[11px] font-mono text-slate-400">
                docs/sql/02_youtube_whitelist_schema.sql
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center text-xl mb-3">
                  🧩
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  03. Dynamic Games & Math Engine
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ngân hàng math_questions, puzzle_scenes, maze_scenes, drawing, stored procedure sinh đề.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-[11px] font-mono text-slate-400">
                docs/sql/03_dynamic_games_and_math_schema.sql
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
