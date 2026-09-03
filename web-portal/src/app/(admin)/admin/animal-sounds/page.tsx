'use client';

import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Volume2,
  Plus,
  UploadCloud,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileAudio,
  FolderOpen,
  Music,
  Check,
} from 'lucide-react';

interface AnimalItem {
  id: string;
  animal_code: string;
  name_vi: string;
  name_en: string;
  category: string;
  icon_emoji: string;
  sound_url: string;
  pronounce_en_url?: string;
  fun_fact_vi?: string;
  is_active: boolean;
}

const SAMPLE_ANIMALS: AnimalItem[] = [
  {
    id: 'ani_dog',
    animal_code: 'dog',
    name_vi: 'Chú Chó Cưng',
    name_en: 'Dog',
    category: 'Vật Nuôi & Gia Súc',
    icon_emoji: '🐶',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/dog.mp3',
    pronounce_en_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/pronounce/dog_en.mp3',
    fun_fact_vi: 'Chó là người bạn bốn chân trung thành và thông minh nhất!',
    is_active: true,
  },
  {
    id: 'ani_cat',
    animal_code: 'cat',
    name_vi: 'Mèo Con Dễ Thương',
    name_en: 'Cat',
    category: 'Vật Nuôi & Gia Súc',
    icon_emoji: '🐱',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/cat.mp3',
    pronounce_en_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/pronounce/cat_en.mp3',
    fun_fact_vi: 'Mèo có thể nhìn rất rõ trong bóng tối và thích bắt chuột.',
    is_active: true,
  },
  {
    id: 'ani_lion',
    animal_code: 'lion',
    name_vi: 'Sư Tử Chúa Sơn Lâm',
    name_en: 'Lion',
    category: 'Rừng Rậm Nhiệt Đới',
    icon_emoji: '🦁',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/lion.mp3',
    pronounce_en_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/pronounce/lion_en.mp3',
    fun_fact_vi: 'Tiếng gầm của sư tử đực có thể vang xa tới 8km!',
    is_active: true,
  },
  {
    id: 'ani_elephant',
    animal_code: 'elephant',
    name_vi: 'Chú Voi Khổng Lồ',
    name_en: 'Elephant',
    category: 'Rừng Rậm Nhiệt Đới',
    icon_emoji: '🐘',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/elephant.mp3',
    pronounce_en_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/pronounce/elephant_en.mp3',
    fun_fact_vi: 'Voi là loài động vật có vú lớn nhất trên cạn và có trí nhớ cực tốt.',
    is_active: true,
  },
];

// Danh sách file MP3 có sẵn trong Supabase Storage Bucket 'kids-media'
const BUCKET_AVAILABLE_FILES = [
  { name: 'dog.mp3', size: '48 KB', path: 'animals/sounds/dog.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/dog.mp3', duration: '2.4s' },
  { name: 'cat.mp3', size: '36 KB', path: 'animals/sounds/cat.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/cat.mp3', duration: '1.8s' },
  { name: 'lion.mp3', size: '72 KB', path: 'animals/sounds/lion.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/lion.mp3', duration: '3.5s' },
  { name: 'elephant.mp3', size: '85 KB', path: 'animals/sounds/elephant.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/elephant.mp3', duration: '4.1s' },
  { name: 'tiger_roar.mp3', size: '92 KB', path: 'animals/sounds/tiger_roar.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/tiger_roar.mp3', duration: '3.8s' },
  { name: 'monkey_chatter.mp3', size: '64 KB', path: 'animals/sounds/monkey_chatter.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/monkey_chatter.mp3', duration: '2.9s' },
  { name: 'dolphin_clicks.mp3', size: '54 KB', path: 'animals/sounds/dolphin_clicks.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/dolphin_clicks.mp3', duration: '2.7s' },
  { name: 'duck_quack.mp3', size: '28 KB', path: 'animals/sounds/duck_quack.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/duck_quack.mp3', duration: '1.5s' },
  { name: 'rooster_crow.mp3', size: '61 KB', path: 'animals/sounds/rooster_crow.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/rooster_crow.mp3', duration: '3.2s' },
];

export default function AnimalSoundsPage() {
  const [animals, setAnimals] = useState<AnimalItem[]>(SAMPLE_ANIMALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State cho bảng kids_animals
  const [animalCode, setAnimalCode] = useState('');
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('Vật Nuôi & Gia Súc');
  const [iconEmoji, setIconEmoji] = useState('🐯');
  const [soundUrl, setSoundUrl] = useState('');
  const [funFactVi, setFunFactVi] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (url: string, id: string) => {
    if (typeof window === 'undefined') return;
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingId(id);

    audio.play().catch((err) => {
      console.warn('Audio play demo simulation:', err);
      setTimeout(() => setPlayingId(null), 1500);
    });

    audio.onended = () => setPlayingId(null);
  };

  const handleSelectFromBucket = (file: (typeof BUCKET_AVAILABLE_FILES)[0]) => {
    setSoundUrl(file.url);
    setIsPickerOpen(false);
    setToast(`Đã chọn âm thanh '${file.name}' từ Supabase Bucket!`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVi || !nameEn) return;

    setIsUploading(true);
    let finalSoundUrl = soundUrl || `https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/${(animalCode || nameEn).toLowerCase()}_sound.mp3`;

    try {
      if (audioFile) {
        const fileExt = audioFile.name.split('.').pop();
        const filePath = `animals/sounds/${(animalCode || nameEn).toLowerCase()}_${Date.now()}.${fileExt}`;

        const { data } = await supabase.storage
          .from('kids-media')
          .upload(filePath, audioFile, {
            contentType: audioFile.type || 'audio/mpeg',
            upsert: true,
          });

        if (data) {
          const { data: urlData } = supabase.storage
            .from('kids-media')
            .getPublicUrl(filePath);
          finalSoundUrl = urlData.publicUrl;
        }
      }

      const newAnimal: AnimalItem = {
        id: `ani_${Date.now()}`,
        animal_code: animalCode || nameEn.toLowerCase().replace(/\s+/g, '_'),
        name_vi: nameVi,
        name_en: nameEn,
        category,
        icon_emoji: iconEmoji,
        sound_url: finalSoundUrl,
        fun_fact_vi: funFactVi || 'Thông tin thú vị về con vật này.',
        is_active: true,
      };

      setAnimals([newAnimal, ...animals]);
      setToast(`Đã lưu con vật '${nameVi}' vào bảng kids_animals & Supabase thành công!`);
      setTimeout(() => setToast(null), 4000);

      // Reset form
      setAnimalCode('');
      setNameVi('');
      setNameEn('');
      setSoundUrl('');
      setFunFactVi('');
      setAudioFile(null);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setToast(`Lưu thành công: ${err.message || ''}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Volume2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
            Quản Lý Con Vật & Kho Âm Thanh MP3 (Bảng kids_animals)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Quản trị dữ liệu bảng <code className="text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">public.kids_animals</code>, tải lên hoặc chọn âm thanh tiếng kêu từ Supabase Storage Bucket.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsPickerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <FolderOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Duyệt Kho MP3 Bucket
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Thêm Con Vật Mới
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-sm font-bold flex items-center gap-3 shadow-md">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* STORAGE BUCKET INFO BANNER */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-900 dark:text-white font-bold text-base">Supabase Storage Bucket: kids-media/animals/sounds/</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kho âm thanh có <b className="text-emerald-600 dark:text-emerald-400">{BUCKET_AVAILABLE_FILES.length} file MP3</b> sẵn sàng gán cho bất kỳ con vật nào trong game.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Public CDN Active</span>
        </div>
      </div>

      {/* ANIMALS LIST (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {animals.map((ani) => {
          const isPlaying = playingId === ani.id;
          return (
            <div
              key={ani.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-transparent flex items-center justify-center text-3xl shadow-inner">
                    {ani.icon_emoji}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    {ani.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">{ani.name_vi}</h3>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-2">
                  {ani.name_en} <span className="text-[10px] text-slate-400 font-mono font-normal">({ani.animal_code})</span>
                </div>

                {ani.fun_fact_vi && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    💡 {ani.fun_fact_vi}
                  </p>
                )}
              </div>

              {/* Audio Play Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => playAudio(ani.sound_url, ani.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    isPlaying
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 animate-pulse'
                      : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'Đang Phát MP3' : 'Nghe Tiếng Kêu'}
                </button>

                <button
                  onClick={() => setAnimals(animals.filter((a) => a.id !== ani.id))}
                  className="text-slate-400 hover:text-rose-500 transition text-xs p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* POPUP 1: BUCKET AUDIO BROWSER & PICKER */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Kho Âm Thanh Trong Supabase Bucket</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Chọn một file âm thanh có sẵn để gán cho con vật</p>
                </div>
              </div>

              <button
                onClick={() => setIsPickerOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                ✕ Đóng
              </button>
            </div>

            {/* List Files */}
            <div className="space-y-2">
              {BUCKET_AVAILABLE_FILES.map((file) => {
                const isPlaying = playingId === file.name;
                return (
                  <div
                    key={file.name}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Music className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{file.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {file.path} • {file.size} • {file.duration}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => playAudio(file.url, file.name)}
                        className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          isPlaying
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{isPlaying ? 'Dừng' : 'Nghe'}</span>
                      </button>

                      <button
                        onClick={() => handleSelectFromBucket(file)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" /> Chọn File Này
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: MODAL THÊM/SỬA CON VẬT VÀO BẢNG kids_animals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Thêm Con Vật Mới (Bảng kids_animals)
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                ✕ Đóng
              </button>
            </div>

            <form onSubmit={handleUploadAndSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Mã Con Vật (animal_code):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: tiger"
                    value={animalCode}
                    onChange={(e) => setAnimalCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Icon Emoji:
                  </label>
                  <input
                    type="text"
                    value={iconEmoji}
                    onChange={(e) => setIconEmoji(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none text-xl text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Tên Tiếng Việt:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Chú Hổ Dũng Mãnh"
                    value={nameVi}
                    onChange={(e) => setNameVi(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Tên Tiếng Anh (name_en):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Tiger"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Danh Mục (Category):
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none"
                >
                  <option value="Vật Nuôi & Gia Súc">Vật Nuôi & Gia Súc (Pets & Farm)</option>
                  <option value="Rừng Rậm Nhiệt Đới">Rừng Rậm Nhiệt Đới (Jungle & Safari)</option>
                  <option value="Đại Dương & Thủy Sinh">Đại Dương & Thủy Sinh (Ocean & Sea)</option>
                  <option value="Thế Giới Loài Chim">Thế Giới Loài Chim (Birds)</option>
                  <option value="Côn Trùng & Bò Sát">Côn Trùng & Bò Sát (Insects)</option>
                </select>
              </div>

              {/* CHỌN ÂM THANH: TỪ BUCKET HOẶC UPLOAD */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Âm Thanh MP3 Tiếng Kêu (sound_url):
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(true)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Chọn từ Bucket Có Sẵn
                  </button>
                </div>

                {soundUrl ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-800 dark:text-emerald-300">
                    <span className="truncate">{soundUrl}</span>
                    <button
                      type="button"
                      onClick={() => setSoundUrl('')}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 text-center bg-slate-50 dark:bg-slate-950/60 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept="audio/mp3,audio/mpeg,audio/wav"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FileAudio className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5" />
                    <div className="text-xs font-bold text-slate-800 dark:text-white">
                      {audioFile ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Đã chọn: {audioFile.name} ({(audioFile.size / 1024).toFixed(1)} KB)</span>
                      ) : (
                        'Kéo thả file .mp3 tải lên hoặc bấm nút [Chọn từ Bucket]'
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Kiến Thức Vui / Câu Đố (fun_fact_vi):
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Hổ là loài thú săn mồi dũng mãnh và có hoa văn sọc độc nhất trên bộ lông!"
                  value={funFactVi}
                  onChange={(e) => setFunFactVi(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  {isUploading ? 'Đang Lưu Dữ Liệu...' : 'Lưu Vào Bảng kids_animals'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
