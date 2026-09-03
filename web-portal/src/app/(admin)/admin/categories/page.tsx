'use client';

import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import {
  FolderTree,
  Plus,
  Layers,
  Smartphone,
  Youtube,
  Calculator,
  Trash2,
  Edit2,
  CheckCircle2,
  Volume2,
  Play,
  Pause,
  FolderOpen,
  Music,
  Check,
  Search,
  Sparkles,
  LayoutGrid,
  List,
} from 'lucide-react';

type TabType = 'ANIMAL_CATEGORIES' | 'ANIMALS' | 'APP' | 'YOUTUBE' | 'MATH';

interface CategoryItem {
  id: string;
  type: 'ANIMAL' | 'APP' | 'YOUTUBE' | 'MATH';
  name_vi: string;
  name_en: string;
  icon: string;
  color: string;
  item_count: number;
}

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

const INITIAL_CATEGORIES: CategoryItem[] = [
  // Animal Categories
  { id: 'ani_1', type: 'ANIMAL', name_vi: 'Vật Nuôi & Gia Súc', name_en: 'Pets & Farm', icon: '🐶', color: '#10B981', item_count: 15 },
  { id: 'ani_2', type: 'ANIMAL', name_vi: 'Rừng Rậm Nhiệt Đới', name_en: 'Jungle & Safari', icon: '🦁', color: '#F59E0B', item_count: 20 },
  { id: 'ani_3', type: 'ANIMAL', name_vi: 'Đại Dương & Thủy Sinh', name_en: 'Ocean & Sea', icon: '🐬', color: '#06B6D4', item_count: 14 },
  { id: 'ani_4', type: 'ANIMAL', name_vi: 'Thế Giới Loài Chim', name_en: 'Birds', icon: '🦜', color: '#84CC16', item_count: 10 },

  // App Categories
  { id: 'app_1', type: 'APP', name_vi: 'Học Tập & Tri Thức', name_en: 'Education', icon: '📚', color: '#3B82F6', item_count: 12 },
  { id: 'app_2', type: 'APP', name_vi: 'Giải Trí Lành Mạnh', name_en: 'Entertainment', icon: '🎮', color: '#EC4899', item_count: 8 },
  { id: 'app_3', type: 'APP', name_vi: 'Sáng Tạo & Vẽ Tranh', name_en: 'Creative', icon: '🎨', color: '#8B5CF6', item_count: 5 },
  { id: 'app_4', type: 'APP', name_vi: 'Mạng Xã Hội (Cấm)', name_en: 'Social Media', icon: '🚫', color: '#EF4444', item_count: 4 },

  // YouTube Categories
  { id: 'yt_1', type: 'YOUTUBE', name_vi: 'Tiếng Anh Mầm Non', name_en: 'Kids English', icon: '🔤', color: '#6366F1', item_count: 6 },
  { id: 'yt_2', type: 'YOUTUBE', name_vi: 'Kể Chuyện Cổ Tích', name_en: 'Fairy Tales', icon: '📖', color: '#D946EF', item_count: 8 },
  { id: 'yt_3', type: 'YOUTUBE', name_vi: 'Khoa Học Kỳ Thú', name_en: 'Kids Science', icon: '🔬', color: '#14B8A6', item_count: 4 },

  // Math Topics
  { id: 'math_1', type: 'MATH', name_vi: 'Đếm Hình 1-10 (Mầm Non)', name_en: 'Counting', icon: '🍎', color: '#F43F5E', item_count: 50 },
  { id: 'math_2', type: 'MATH', name_vi: 'Cộng Trừ 20 (Lớp 1)', name_en: 'Add & Subtract', icon: '➕', color: '#10B981', item_count: 100 },
  { id: 'math_3', type: 'MATH', name_vi: 'Bảng Nhân 2-5 (Lớp 2)', name_en: 'Multiplication', icon: '✖️', color: '#3B82F6', item_count: 80 },
];

const INITIAL_ANIMALS: AnimalItem[] = [
  {
    id: 'ani_1',
    animal_code: 'dog',
    name_vi: 'Chú Chó Cưng',
    name_en: 'Dog',
    category: 'Vật Nuôi & Gia Súc',
    icon_emoji: '🐶',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/dog.mp3',
    fun_fact_vi: 'Chó là người bạn bốn chân trung thành và thông minh nhất của con người!',
    is_active: true,
  },
  {
    id: 'ani_2',
    animal_code: 'cat',
    name_vi: 'Mèo Con Dễ Thương',
    name_en: 'Cat',
    category: 'Vật Nuôi & Gia Súc',
    icon_emoji: '🐱',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/cat.mp3',
    fun_fact_vi: 'Mèo có khả năng giữ thăng bằng tuyệt vời và nhảy cao gấp 6 lần chiều dài cơ thể.',
    is_active: true,
  },
  {
    id: 'ani_3',
    animal_code: 'lion',
    name_vi: 'Sư Tử Chúa Sơn Lâm',
    name_en: 'Lion',
    category: 'Rừng Rậm Nhiệt Đới',
    icon_emoji: '🦁',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/lion.mp3',
    fun_fact_vi: 'Tiếng gầm của sư tử đực có thể vang xa tới 8km trong đồng cỏ!',
    is_active: true,
  },
  {
    id: 'ani_4',
    animal_code: 'elephant',
    name_vi: 'Chú Voi Khổng Lồ',
    name_en: 'Elephant',
    category: 'Rừng Rậm Nhiệt Đới',
    icon_emoji: '🐘',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/elephant.mp3',
    fun_fact_vi: 'Voi là loài động vật có vú lớn nhất trên cạn và có trí nhớ phi thường.',
    is_active: true,
  },
  {
    id: 'ani_5',
    animal_code: 'dolphin',
    name_vi: 'Cá Heo Thân Thiện',
    name_en: 'Dolphin',
    category: 'Đại Dương & Thủy Sinh',
    icon_emoji: '🐬',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/dolphin_clicks.mp3',
    fun_fact_vi: 'Cá heo giao tiếp bằng sóng siêu âm và rất thích bơi cùng con người.',
    is_active: true,
  },
  {
    id: 'ani_6',
    animal_code: 'parrot',
    name_vi: 'Vẹt Sặc Sỡ',
    name_en: 'Parrot',
    category: 'Thế Giới Loài Chim',
    icon_emoji: '🦜',
    sound_url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/duck_quack.mp3',
    fun_fact_vi: 'Vẹt có khả năng bắt chước tiếng người và tiếng các loài động vật khác.',
    is_active: true,
  },
];

const BUCKET_AVAILABLE_FILES = [
  { name: 'dog.mp3', path: 'animals/sounds/dog.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/dog.mp3', duration: '2.4s' },
  { name: 'cat.mp3', path: 'animals/sounds/cat.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/cat.mp3', duration: '1.8s' },
  { name: 'lion.mp3', path: 'animals/sounds/lion.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/lion.mp3', duration: '3.5s' },
  { name: 'elephant.mp3', path: 'animals/sounds/elephant.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/elephant.mp3', duration: '4.1s' },
  { name: 'tiger_roar.mp3', path: 'animals/sounds/tiger_roar.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/tiger_roar.mp3', duration: '3.8s' },
  { name: 'dolphin_clicks.mp3', path: 'animals/sounds/dolphin_clicks.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/dolphin_clicks.mp3', duration: '2.7s' },
  { name: 'duck_quack.mp3', path: 'animals/sounds/duck_quack.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/duck_quack.mp3', duration: '1.5s' },
  { name: 'rooster_crow.mp3', path: 'animals/sounds/rooster_crow.mp3', url: 'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/rooster_crow.mp3', duration: '3.2s' },
];

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('ANIMAL_CATEGORIES');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [animals, setAnimals] = useState<AnimalItem[]>(INITIAL_ANIMALS);

  // Audio Playback State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  // Search & Filter for Animals
  const [animalSearch, setAnimalSearch] = useState('');
  const [selectedAnimalCategory, setSelectedAnimalCategory] = useState('ALL');

  // Modal State for Categories
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name_vi: '', name_en: '', icon: '🦁' });

  // Modal State for Animals CRUD (Create & Edit)
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false);
  const [editingAnimalId, setEditingAnimalId] = useState<string | null>(null);
  const [animalForm, setAnimalForm] = useState({
    animal_code: '',
    name_vi: '',
    name_en: '',
    category: 'Vật Nuôi & Gia Súc',
    icon_emoji: '🐯',
    sound_url: '',
    fun_fact_vi: '',
    is_active: true,
  });

  // Bucket Picker Modal
  const [isBucketPickerOpen, setIsBucketPickerOpen] = useState(false);

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
    audio.play().catch(() => setTimeout(() => setPlayingId(null), 1500));
    audio.onended = () => setPlayingId(null);
  };

  // --- CRUD: CATEGORY ---
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name_vi) return;
    const catType = activeTab === 'ANIMAL_CATEGORIES' ? 'ANIMAL' : activeTab;
    const created: CategoryItem = {
      id: `${catType.toLowerCase()}_${Date.now()}`,
      type: catType as any,
      name_vi: newCat.name_vi,
      name_en: newCat.name_en || newCat.name_vi,
      icon: newCat.icon,
      color: '#10B981',
      item_count: 0,
    };
    setCategories([...categories, created]);
    setNewCat({ name_vi: '', name_en: '', icon: '🦁' });
    setIsCatModalOpen(false);
    showToast(`Đã thêm danh mục '${created.name_vi}' thành công!`);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    showToast('Đã xóa danh mục!');
  };

  // --- CRUD: ANIMALS (CREATE, READ, UPDATE, DELETE) ---
  const openCreateAnimalModal = () => {
    setEditingAnimalId(null);
    setAnimalForm({
      animal_code: '',
      name_vi: '',
      name_en: '',
      category: 'Vật Nuôi & Gia Súc',
      icon_emoji: '🐯',
      sound_url: '',
      fun_fact_vi: '',
      is_active: true,
    });
    setIsAnimalModalOpen(true);
  };

  const openEditAnimalModal = (ani: AnimalItem) => {
    setEditingAnimalId(ani.id);
    setAnimalForm({
      animal_code: ani.animal_code,
      name_vi: ani.name_vi,
      name_en: ani.name_en,
      category: ani.category,
      icon_emoji: ani.icon_emoji,
      sound_url: ani.sound_url,
      fun_fact_vi: ani.fun_fact_vi || '',
      is_active: ani.is_active,
    });
    setIsAnimalModalOpen(true);
  };

  const handleSaveAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!animalForm.name_vi || !animalForm.name_en) return;

    const finalSoundUrl =
      animalForm.sound_url ||
      `https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/${(animalForm.animal_code || animalForm.name_en).toLowerCase()}_sound.mp3`;

    if (editingAnimalId) {
      // UPDATE
      setAnimals((prev) =>
        prev.map((a) =>
          a.id === editingAnimalId
            ? {
                ...a,
                animal_code: animalForm.animal_code || animalForm.name_en.toLowerCase(),
                name_vi: animalForm.name_vi,
                name_en: animalForm.name_en,
                category: animalForm.category,
                icon_emoji: animalForm.icon_emoji,
                sound_url: finalSoundUrl,
                fun_fact_vi: animalForm.fun_fact_vi,
                is_active: animalForm.is_active,
              }
            : a
        )
      );
      showToast(`Đã cập nhật thông tin con vật '${animalForm.name_vi}'!`);
    } else {
      // CREATE
      const newAnimal: AnimalItem = {
        id: `ani_${Date.now()}`,
        animal_code: animalForm.animal_code || animalForm.name_en.toLowerCase().replace(/\s+/g, '_'),
        name_vi: animalForm.name_vi,
        name_en: animalForm.name_en,
        category: animalForm.category,
        icon_emoji: animalForm.icon_emoji,
        sound_url: finalSoundUrl,
        fun_fact_vi: animalForm.fun_fact_vi,
        is_active: animalForm.is_active,
      };
      setAnimals([newAnimal, ...animals]);
      showToast(`Đã thêm con vật '${animalForm.name_vi}' vào bảng kids_animals!`);
    }

    setIsAnimalModalOpen(false);
  };

  const handleDeleteAnimal = (id: string) => {
    setAnimals((prev) => prev.filter((a) => a.id !== id));
    showToast('Đã xóa con vật khỏi bảng kids_animals!');
  };

  const toggleAnimalStatus = (id: string) => {
    setAnimals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a))
    );
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Filtered Animals
  const filteredAnimals = animals.filter((ani) => {
    const matchSearch =
      ani.name_vi.toLowerCase().includes(animalSearch.toLowerCase()) ||
      ani.name_en.toLowerCase().includes(animalSearch.toLowerCase()) ||
      ani.animal_code.toLowerCase().includes(animalSearch.toLowerCase());
    const matchCat =
      selectedAnimalCategory === 'ALL' || ani.category === selectedAnimalCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <FolderTree className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
            Quản Lý Danh Mục & Con Vật (Master Studio)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Quản trị danh mục gốc và danh sách con vật bảng <code className="text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">kids_animals</code> với bố cục Grid Item linh hoạt.
          </p>
        </div>

        {activeTab === 'ANIMALS' ? (
          <button
            onClick={openCreateAnimalModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 self-start sm:self-auto transition"
          >
            <Plus className="w-4 h-4" /> Thêm Con Vật Mới
          </button>
        ) : (
          <button
            onClick={() => setIsCatModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 self-start sm:self-auto transition"
          >
            <Plus className="w-4 h-4" /> Thêm Danh Mục Mới
          </button>
        )}
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-sm font-bold flex items-center gap-3 shadow-md">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* 5 TABS: RESPONSIVE GRID LAYOUT (Tự động co giãn 2-5 cột) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {/* Tab 1: Danh Mục Con Vật */}
        <button
          onClick={() => setActiveTab('ANIMAL_CATEGORIES')}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition text-center ${
            activeTab === 'ANIMAL_CATEGORIES'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>🦁 Danh Mục Con Vật</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-950/60 font-mono">
            {categories.filter((c) => c.type === 'ANIMAL').length}
          </span>
        </button>

        {/* Tab 2: CON VẬT (BẢNG kids_animals) */}
        <button
          onClick={() => setActiveTab('ANIMALS')}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-black transition text-center border ${
            activeTab === 'ANIMALS'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/25'
              : 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>🐾 Con Vật (kids_animals)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-slate-950/60 font-mono">
            {animals.length}
          </span>
        </button>

        {/* Tab 3: Thể Loại App */}
        <button
          onClick={() => setActiveTab('APP')}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition text-center ${
            activeTab === 'APP'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>📱 Thể Loại App</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-950/60 font-mono">
            {categories.filter((c) => c.type === 'APP').length}
          </span>
        </button>

        {/* Tab 4: YouTube */}
        <button
          onClick={() => setActiveTab('YOUTUBE')}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition text-center ${
            activeTab === 'YOUTUBE'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>📺 Kênh YouTube Kids</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-950/60 font-mono">
            {categories.filter((c) => c.type === 'YOUTUBE').length}
          </span>
        </button>

        {/* Tab 5: Toán */}
        <button
          onClick={() => setActiveTab('MATH')}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition text-center col-span-2 sm:col-span-1 ${
            activeTab === 'MATH'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <span>🧮 Chủ Đề Toán Học</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-950/60 font-mono">
            {categories.filter((c) => c.type === 'MATH').length}
          </span>
        </button>
      </div>

      {/* VIEW 1: TAB CON VẬT (BẢNG kids_animals - RESPONSIVE GRID ITEMS & CARDS) */}
      {activeTab === 'ANIMALS' && (
        <div className="space-y-6">
          {/* Filter & View Switcher Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên Tiếng Việt, Tiếng Anh, mã code (dog, cat, lion)..."
                  value={animalSearch}
                  onChange={(e) => setAnimalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500 outline-none shadow-sm transition"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedAnimalCategory}
                onChange={(e) => setSelectedAnimalCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-emerald-500 outline-none shadow-sm transition"
              >
                <option value="ALL">Tất cả danh mục ({animals.length})</option>
                <option value="Vật Nuôi & Gia Súc">Vật Nuôi & Gia Súc</option>
                <option value="Rừng Rậm Nhiệt Đới">Rừng Rậm Nhiệt Đới</option>
                <option value="Đại Dương & Thủy Sinh">Đại Dương & Thủy Sinh</option>
                <option value="Thế Giới Loài Chim">Thế Giới Loài Chim</option>
                <option value="Côn Trùng & Bò Sát">Côn Trùng & Bò Sát</option>
              </select>
            </div>

            {/* Switch Grid / Table View */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl self-end sm:self-auto shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('GRID')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  viewMode === 'GRID'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Xem Dạng Lưới Thẻ Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid Item</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('TABLE')}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  viewMode === 'TABLE'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Xem Dạng Bảng Table"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bảng</span>
              </button>
            </div>
          </div>

          {/* 1.1 RESPONSIVE GRID ITEMS VIEW (BỐ CỤC LƯỚI THẺ RESPONSIVE HIỆN ĐẠI) */}
          {viewMode === 'GRID' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredAnimals.length === 0 ? (
                <div className="col-span-full py-12 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  Không tìm thấy con vật nào phù hợp.
                </div>
              ) : (
                filteredAnimals.map((ani) => {
                  const isPlaying = playingId === ani.id;
                  return (
                    <div
                      key={ani.id}
                      className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between group relative shadow-sm"
                    >
                      <div>
                        {/* Header: Icon + Category + Active Toggle */}
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-gradient-to-tr dark:from-slate-950 dark:to-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                            {ani.icon_emoji}
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            <button
                              onClick={() => toggleAnimalStatus(ani.id)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                                ani.is_active
                                  ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {ani.is_active ? '● Đang mở' : '○ Tạm ẩn'}
                            </button>
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                              {ani.category}
                            </span>
                          </div>
                        </div>

                        {/* Title & Info */}
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight">
                          {ani.name_vi}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-3">
                          <span>{ani.name_en}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">
                            ({ani.animal_code})
                          </span>
                        </div>

                        {/* Fun fact */}
                        {ani.fun_fact_vi && (
                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-2">
                            💡 {ani.fun_fact_vi}
                          </div>
                        )}
                      </div>

                      {/* Footer Actions: MP3 Player + Edit + Delete */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => playAudio(ani.sound_url, ani.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-1 justify-center ${
                            isPlaying
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 animate-pulse'
                              : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isPlaying ? 'Đang phát' : 'Nghe MP3'}</span>
                        </button>

                        <button
                          onClick={() => openEditAnimalModal(ani)}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                          title="Chỉnh sửa con vật"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteAnimal(ani.id)}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 transition"
                          title="Xóa con vật"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 1.2 TABLE VIEW (BẢNG DỮ LIỆU NẾU CẦN ĐỐI SOÁT) */}
          {viewMode === 'TABLE' && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Con Vật</th>
                      <th className="px-6 py-4">Mã Code</th>
                      <th className="px-6 py-4">Danh Mục</th>
                      <th className="px-6 py-4">Âm Thanh MP3</th>
                      <th className="px-6 py-4">Kiến Thức Vui</th>
                      <th className="px-6 py-4">Trạng Thái</th>
                      <th className="px-6 py-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredAnimals.map((ani) => {
                      const isPlaying = playingId === ani.id;
                      return (
                        <tr key={ani.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                                {ani.icon_emoji}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm">{ani.name_vi}</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{ani.name_en}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{ani.animal_code}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                              {ani.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => playAudio(ani.sound_url, ani.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                isPlaying
                                  ? 'bg-emerald-600 text-white shadow-sm animate-pulse'
                                  : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                              }`}
                            >
                              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              <span>{isPlaying ? 'Đang phát' : 'Nghe'}</span>
                            </button>
                          </td>
                          <td className="px-6 py-4 max-w-xs text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            {ani.fun_fact_vi || '—'}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleAnimalStatus(ani.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                                ani.is_active
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {ani.is_active ? '● Đang mở' : '○ Tạm ẩn'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditAnimalModal(ani)}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAnimal(ani.id)}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CÁC TAB DANH MỤC KHÁC (ANIMAL_CATEGORIES, APP, YOUTUBE, MATH) */}
      {activeTab !== 'ANIMALS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories
            .filter((c) => {
              if (activeTab === 'ANIMAL_CATEGORIES') return c.type === 'ANIMAL';
              return c.type === activeTab;
            })
            .map((cat) => (
              <div
                key={cat.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-inner">
                      {cat.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                      {cat.item_count} mục
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{cat.name_vi}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{cat.name_en}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đang hoạt động
                  </span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-xs text-slate-400 hover:text-rose-500 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* MODAL 1: THÊM DANH MỤC */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thêm Danh Mục Mới</h3>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Tên Tiếng Việt:
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Côn trùng & Bò sát"
                  value={newCat.name_vi}
                  onChange={(e) => setNewCat({ ...newCat, name_vi: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Tên Tiếng Anh:
                </label>
                <input
                  type="text"
                  placeholder="VD: Insects & Reptiles"
                  value={newCat.name_en}
                  onChange={(e) => setNewCat({ ...newCat, name_en: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Icon Emoji:
                </label>
                <input
                  type="text"
                  value={newCat.icon}
                  onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20"
                >
                  Lưu Danh Mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: THÊM / SỬA CON VẬT (BẢNG kids_animals CRUD) */}
      {isAnimalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {editingAnimalId ? 'Chỉnh Sửa Con Vật' : 'Thêm Con Vật Mới Vào Bảng kids_animals'}
              </h3>
              <button
                onClick={() => setIsAnimalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                ✕ Đóng
              </button>
            </div>

            <form onSubmit={handleSaveAnimal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Mã Con Vật (animal_code):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: tiger"
                    value={animalForm.animal_code}
                    onChange={(e) => setAnimalForm({ ...animalForm, animal_code: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Icon Emoji:
                  </label>
                  <input
                    type="text"
                    value={animalForm.icon_emoji}
                    onChange={(e) => setAnimalForm({ ...animalForm, icon_emoji: e.target.value })}
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
                    value={animalForm.name_vi}
                    onChange={(e) => setAnimalForm({ ...animalForm, name_vi: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Tên Tiếng Anh:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Tiger"
                    value={animalForm.name_en}
                    onChange={(e) => setAnimalForm({ ...animalForm, name_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Danh Mục (Category):
                </label>
                <select
                  value={animalForm.category}
                  onChange={(e) => setAnimalForm({ ...animalForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none"
                >
                  <option value="Vật Nuôi & Gia Súc">Vật Nuôi & Gia Súc</option>
                  <option value="Rừng Rậm Nhiệt Đới">Rừng Rậm Nhiệt Đới</option>
                  <option value="Đại Dương & Thủy Sinh">Đại Dương & Thủy Sinh</option>
                  <option value="Thế Giới Loài Chim">Thế Giới Loài Chim</option>
                  <option value="Côn Trùng & Bò Sát">Côn Trùng & Bò Sát</option>
                </select>
              </div>

              {/* Âm thanh MP3 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    File Âm Thanh MP3 (sound_url):
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsBucketPickerOpen(true)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Chọn từ Bucket Có Sẵn
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL file MP3 hoặc bấm [Chọn từ Bucket Có Sẵn]"
                    value={animalForm.sound_url}
                    onChange={(e) => setAnimalForm({ ...animalForm, sound_url: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:border-emerald-500 outline-none"
                  />
                  {animalForm.sound_url && (
                    <button
                      type="button"
                      onClick={() => playAudio(animalForm.sound_url, 'preview')}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                    >
                      <Play className="w-3 h-3" /> Nghe
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Kiến Thức Vui (fun_fact_vi):
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Hổ là loài thú săn mồi dũng mãnh và có hoa văn sọc độc nhất trên bộ lông!"
                  value={animalForm.fun_fact_vi}
                  onChange={(e) => setAnimalForm({ ...animalForm, fun_fact_vi: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAnimalModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20"
                >
                  {editingAnimalId ? 'Cập Nhật Con Vật' : 'Lưu Vào Bảng kids_animals'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: BUCKET AUDIO PICKER */}
      {isBucketPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Chọn File Âm Thanh MP3 Từ Bucket
              </h3>
              <button
                onClick={() => setIsBucketPickerOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="space-y-2">
              {BUCKET_AVAILABLE_FILES.map((f) => (
                <div
                  key={f.name}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 flex items-center justify-between gap-3 transition"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{f.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{f.duration}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => playAudio(f.url, f.name)}
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-800"
                    >
                      <Play className="w-3 h-3" /> Nghe
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAnimalForm({ ...animalForm, sound_url: f.url });
                        setIsBucketPickerOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3 h-3" /> Chọn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
