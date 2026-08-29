/**
 * Animal Sound & Bilingual Learning Service
 * Cloud-Powered with Supabase & Offline-First Cache (MMKV/Memory)
 */
import { storage } from './storage';
import { supabaseClient } from './supabaseClient';
import { soundManager } from '../components/SoundPlayer';

export type LanguageMode = 'vi' | 'en' | 'bilingual';
export type QuizType = 'sound' | 'color' | 'habitat';

export interface KidsColor {
  id: string;
  name_vi: string;
  name_en: string;
  phonetic_en?: string;
  hex_code: string;
  text_color?: string;
  example_item_vi?: string;
  example_item_en?: string;
  voice_vi_url?: string;
  voice_en_url?: string;
  display_order?: number;
}

export interface KidsHabitat {
  id: string;
  emoji: string;
  name_vi: string;
  name_en: string;
  bg_gradient?: string[];
}

export interface KidsAnimal {
  id: string;
  emoji: string;
  category: 'farm' | 'wild' | 'ocean' | 'birds';
  primary_color_id: string;
  habitat_id: string;
  
  // Tiếng Việt
  name_vi: string;
  sound_text_vi: string;
  sound_desc_vi: string;
  fun_fact_vi: string;
  favorite_food_vi?: string;

  // Tiếng Anh
  name_en: string;
  phonetic_en: string;
  sound_text_en: string;
  sound_desc_en: string;
  fun_fact_en: string;
  favorite_food_en?: string;

  // Media
  sound_mp3_url?: string;
  voice_vi_url?: string;
  voice_en_url?: string;
  image_url?: string;

  // Styling & Config
  color_hex: string;
  difficulty: number;
}

export interface KidsLearningLog {
  id?: string;
  device_id: string;
  profile_name?: string;
  language_mode: LanguageMode;
  quiz_type: QuizType;
  game_mode: 'quiz' | 'explorer';
  score: number;
  total_questions: number;
  correct_animals: string[];
  wrong_animals: Array<{ target: string; chosen: string }>;
  duration_seconds: number;
  created_at?: string;
}

const STORAGE_KEYS = {
  LANGUAGE_MODE: 'KIDS_ANIMAL_LANG_MODE',
  ANIMALS_CACHE: 'KIDS_ANIMALS_CACHE_V2',
  COLORS_CACHE: 'KIDS_COLORS_CACHE_V2',
  HABITATS_CACHE: 'KIDS_HABITATS_CACHE_V2',
  LEARNING_LOGS: 'KIDS_ANIMAL_LEARNING_LOGS_CACHE',
};

export const DEFAULT_COLORS: KidsColor[] = [
  {
    id: 'yellow',
    name_vi: 'Màu Vàng',
    name_en: 'Yellow',
    phonetic_en: '/ˈjel.oʊ/',
    hex_code: '#FDE047',
    text_color: '#854D0E',
    example_item_vi: 'Vàng như quả chuối',
    example_item_en: 'Yellow like a banana',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/yellow--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Màu%20vàng&tl=vi&client=tw-ob',
  },
  {
    id: 'pink',
    name_vi: 'Màu Hồng',
    name_en: 'Pink',
    phonetic_en: '/pɪŋk/',
    hex_code: '#F472B6',
    text_color: '#831843',
    example_item_vi: 'Hồng như cánh sen',
    example_item_en: 'Pink like a lotus',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/pink--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Màu%20hồng&tl=vi&client=tw-ob',
  },
  {
    id: 'red',
    name_vi: 'Màu Đỏ',
    name_en: 'Red',
    phonetic_en: '/red/',
    hex_code: '#EF4444',
    text_color: '#FFFFFF',
    example_item_vi: 'Đỏ như quả táo',
    example_item_en: 'Red like an apple',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/red--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Màu%20đỏ&tl=vi&client=tw-ob',
  },
  {
    id: 'blue',
    name_vi: 'Màu Xanh Dương',
    name_en: 'Blue',
    phonetic_en: '/bluː/',
    hex_code: '#38BDF8',
    text_color: '#075985',
    example_item_vi: 'Xanh như bầu trời',
    example_item_en: 'Blue like the sky',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/blue--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Màu%20xanh%20dương&tl=vi&client=tw-ob',
  },
  {
    id: 'green',
    name_vi: 'Màu Xanh Lá',
    name_en: 'Green',
    phonetic_en: '/ɡriːn/',
    hex_code: '#4ADE80',
    text_color: '#14532D',
    example_item_vi: 'Xanh như chiếc lá',
    example_item_en: 'Green like a leaf',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/green--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Màu%20xanh%20lá&tl=vi&client=tw-ob',
  },
  {
    id: 'orange',
    name_vi: 'Màu Cam',
    name_en: 'Orange',
    phonetic_en: '/ˈɔːr.ɪndʒ/',
    hex_code: '#FB923C',
    text_color: '#7C2D12',
    example_item_vi: 'Cam như quả cam',
    example_item_en: 'Orange like an orange',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/orange--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Màu%20cam&tl=vi&client=tw-ob',
  },
  {
    id: 'purple',
    name_vi: 'Màu Tím',
    name_en: 'Purple',
    phonetic_en: '/ˈpɝː.pəl/',
    hex_code: '#C084FC',
    text_color: '#581C87',
    example_item_vi: 'Tím như quả cà',
    example_item_en: 'Purple like grapes',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/purple--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Màu%20tím&tl=vi&client=tw-ob',
  },
  {
    id: 'white',
    name_vi: 'Màu Trắng',
    name_en: 'White',
    phonetic_en: '/waɪt/',
    hex_code: '#F8FAFC',
    text_color: '#334155',
    example_item_vi: 'Trắng như đám mây',
    example_item_en: 'White like clouds',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/white--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Màu%20trắng&tl=vi&client=tw-ob',
  },
  {
    id: 'brown',
    name_vi: 'Màu Nâu',
    name_en: 'Brown',
    phonetic_en: '/braʊn/',
    hex_code: '#B45309',
    text_color: '#FFFFFF',
    example_item_vi: 'Nâu như hạt dẻ',
    example_item_en: 'Brown like chestnut',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/brown--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Màu%20nâu&tl=vi&client=tw-ob',
  },
  {
    id: 'gray',
    name_vi: 'Màu Xám',
    name_en: 'Gray',
    phonetic_en: '/ɡreɪ/',
    hex_code: '#94A3B8',
    text_color: '#0F172A',
    example_item_vi: 'Xám như chú voi',
    example_item_en: 'Gray like an elephant',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/gray--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Màu%20xám&tl=vi&client=tw-ob',
  },
];

export const DEFAULT_HABITATS: KidsHabitat[] = [
  { id: 'farm', emoji: '🚜', name_vi: 'Nông Trại', name_en: 'Farm', bg_gradient: ['#FEF08A', '#FDE047'] },
  { id: 'wild', emoji: '🌲', name_vi: 'Rừng Xanh', name_en: 'Wild Jungle', bg_gradient: ['#BBF7D0', '#86EFAC'] },
  { id: 'ocean', emoji: '🌊', name_vi: 'Đại Dương', name_en: 'Deep Ocean', bg_gradient: ['#BAE6FD', '#7DD3FC'] },
  { id: 'birds', emoji: '☁️', name_vi: 'Bầu Trời', name_en: 'Sky & Trees', bg_gradient: ['#E0E7FF', '#C7D2FE'] },
];

export const DEFAULT_ANIMALS: KidsAnimal[] = [
  {
    id: 'dog',
    emoji: '🐶',
    category: 'farm',
    primary_color_id: 'yellow',
    habitat_id: 'farm',
    name_vi: 'Chú Cún Con',
    sound_text_vi: 'Gâu gâu! Gâu gâu!',
    sound_desc_vi: 'Tiếng cún con sủa vui mừng vẫy đuôi',
    fun_fact_vi: 'Cún cưng luôn trung thành và có thính giác tốt gấp 4 lần con người!',
    favorite_food_vi: 'Khúc xương & Thức ăn hạt',
    name_en: 'Puppy (Dog)',
    phonetic_en: '/ˈpʌp.i/',
    sound_text_en: 'Woof! Woof! Bark!',
    sound_desc_en: 'A cheerful dog barking happily',
    fun_fact_en: 'Dogs can understand up to 250 words and gestures!',
    favorite_food_en: 'Bones & Dog treats',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/dog--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Chú%20cún%20con&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop',
    color_hex: '#FDE68A',
    difficulty: 1,
  },
  {
    id: 'cat',
    emoji: '🐱',
    category: 'farm',
    primary_color_id: 'orange',
    habitat_id: 'farm',
    name_vi: 'Mèo Con',
    sound_text_vi: 'Meo meo! Meo meo!',
    sound_desc_vi: 'Tiếng mèo con kêu nũng nịu đòi ăn',
    fun_fact_vi: 'Mèo có thể nhảy cao gấp 6 lần chiều dài cơ thể.',
    favorite_food_vi: 'Cá tươi & Sữa thơm',
    name_en: 'Kitten (Cat)',
    phonetic_en: '/ˈkɪt.ən/',
    sound_text_en: 'Meow! Meow! Purr!',
    sound_desc_en: 'A cute kitten meowing softly',
    fun_fact_en: 'Cats sleep for around 70% of their lives!',
    favorite_food_en: 'Fish & Milk',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/61/61-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/cat--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Mèo%20con&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop',
    color_hex: '#FED7AA',
    difficulty: 1,
  },
  {
    id: 'pig',
    emoji: '🐷',
    category: 'farm',
    primary_color_id: 'pink',
    habitat_id: 'farm',
    name_vi: 'Heo Con',
    sound_text_vi: 'Ủn ỉn! Ủn ỉn!',
    sound_desc_vi: 'Tiếng heo con đòi ăn cám ngon',
    fun_fact_vi: 'Heo rất thông minh và thích tắm bùn để giữ mát cơ thể.',
    favorite_food_vi: 'Cám bắp & Rau muống',
    name_en: 'Piglet (Pig)',
    phonetic_en: '/ˈpɪɡ.lət/',
    sound_text_en: 'Oink! Oink!',
    sound_desc_en: 'A friendly piglet oinking happily',
    fun_fact_en: 'Pigs are very clean animals and love to dream!',
    favorite_food_en: 'Corn & Fresh veggies',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/2877/2877-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/pig--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Heo%20con&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&auto=format&fit=crop',
    color_hex: '#FBCFE8',
    difficulty: 1,
  },
  {
    id: 'rooster',
    emoji: '🐔',
    category: 'farm',
    primary_color_id: 'red',
    habitat_id: 'farm',
    name_vi: 'Gà Trống',
    sound_text_vi: 'Ò ó o o!',
    sound_desc_vi: 'Tiếng gà trống gáy vang đón bình minh',
    fun_fact_vi: 'Tiếng gáy của gà trống giúp đánh thức cả làng quê thức dậy.',
    favorite_food_vi: 'Thóc lúa & Bắp vàng',
    name_en: 'Rooster',
    phonetic_en: '/ˈruː.stɚ/',
    sound_text_en: 'Cock-a-doodle-doo!',
    sound_desc_en: 'A proud rooster crowing in the morning',
    fun_fact_en: 'Roosters crow to announce their territory to other birds.',
    favorite_food_en: 'Grains & Corn',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/2871/2871-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/rooster--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Gà%20trống&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&auto=format&fit=crop',
    color_hex: '#FECDD3',
    difficulty: 1,
  },
  {
    id: 'duck',
    emoji: '🦆',
    category: 'farm',
    primary_color_id: 'yellow',
    habitat_id: 'farm',
    name_vi: 'Vịt Con',
    sound_text_vi: 'Cạp cạp! Cạp cạp!',
    sound_desc_vi: 'Tiếng vịt con tung tăng bơi lội dưới ao',
    fun_fact_vi: 'Lông vịt không bao giờ bị ướt vì có lớp dầu tự nhiên bảo vệ.',
    favorite_food_vi: 'Rong rêu & Tép nhỏ',
    name_en: 'Duckling (Duck)',
    phonetic_en: '/ˈdʌk.lɪŋ/',
    sound_text_en: 'Quack! Quack!',
    sound_desc_en: 'A duck quacking happily in the pond',
    fun_fact_en: 'Duck feathers are completely waterproof!',
    favorite_food_en: 'Aquatic plants & Small fish',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/2875/2875-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/duck--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Vịt%20con&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&auto=format&fit=crop',
    color_hex: '#FEF08A',
    difficulty: 1,
  },
  {
    id: 'cow',
    emoji: '🐮',
    category: 'farm',
    primary_color_id: 'white',
    habitat_id: 'farm',
    name_vi: 'Bò Sữa',
    sound_text_vi: 'Ùm bòoo! Ùm bòoo!',
    sound_desc_vi: 'Tiếng bò sữa thong thả gặm cỏ non',
    fun_fact_vi: 'Bò sữa cho chúng ta nguồn sữa thơm ngon giàu canxi mỗi ngày.',
    favorite_food_vi: 'Cỏ voi & Rơm khô',
    name_en: 'Cow',
    phonetic_en: '/kaʊ/',
    sound_text_en: 'Moo! Mooo!',
    sound_desc_en: 'A gentle cow mooing on the green pasture',
    fun_fact_en: 'Cows have best friends and get stressed when separated!',
    favorite_food_en: 'Fresh grass & Hay',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/cow--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Bò%20sữa&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&auto=format&fit=crop',
    color_hex: '#E9D5FF',
    difficulty: 1,
  },
  {
    id: 'frog',
    emoji: '🐸',
    category: 'wild',
    primary_color_id: 'green',
    habitat_id: 'wild',
    name_vi: 'Chú Ếch Xanh',
    sound_text_vi: 'Ộp ộp! Ộp ộp!',
    sound_desc_vi: 'Tiếng ếch kêu rộn ràng bên bờ ao sau mưa',
    fun_fact_vi: 'Ếch có thể thở bằng cả da và phổi đấy bé!',
    favorite_food_vi: 'Côn trùng & Muỗi',
    name_en: 'Frog',
    phonetic_en: '/frɑːɡ/',
    sound_text_en: 'Ribbit! Croak!',
    sound_desc_en: 'A green frog croaking by the pond',
    fun_fact_en: 'Frogs can absorb water through their skin so they never need to drink!',
    favorite_food_en: 'Flies & Bugs',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/2878/2878-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/frog--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Chú%20ếch&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&auto=format&fit=crop',
    color_hex: '#BBF7D0',
    difficulty: 1,
  },
  {
    id: 'lion',
    emoji: '🦁',
    category: 'wild',
    primary_color_id: 'orange',
    habitat_id: 'wild',
    name_vi: 'Sư Tử',
    sound_text_vi: 'Gaooo! Gầm gừ!',
    sound_desc_vi: 'Tiếng sư tử chúa sơn lâm dũng mãnh',
    fun_fact_vi: 'Sư tử đực có chiếc bờm dày dũng mãnh để bảo vệ bầy đàn.',
    favorite_food_vi: 'Thịt tươi',
    name_en: 'Lion',
    phonetic_en: '/ˈlaɪ.ən/',
    sound_text_en: 'Roar! Roaaar!',
    sound_desc_en: 'A mighty lion roaring across the savanna',
    fun_fact_en: 'A lion’s roar can be heard from 8 kilometers away!',
    favorite_food_en: 'Meat',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/2879/2879-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/lion--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Sư%20tử&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=400&auto=format&fit=crop',
    color_hex: '#FED7AA',
    difficulty: 2,
  },
  {
    id: 'elephant',
    emoji: '🐘',
    category: 'wild',
    primary_color_id: 'gray',
    habitat_id: 'wild',
    name_vi: 'Chú Voi Khổng Lồ',
    sound_text_vi: 'Éc éc! Rống vang!',
    sound_desc_vi: 'Tiếng voi huơ vòi gọi các bạn voi',
    fun_fact_vi: 'Chiếc vòi voi có hơn 40.000 bó cơ bắp vô cùng khéo léo.',
    favorite_food_vi: 'Mía ngọt & Chuối chín',
    name_en: 'Elephant',
    phonetic_en: '/ˈel.ə.fənt/',
    sound_text_en: 'Pawoo! Trumpet!',
    sound_desc_en: 'An elephant trumpeting through its long trunk',
    fun_fact_en: 'Elephants are the only land animals that cannot jump!',
    favorite_food_en: 'Sugarcane & Bananas',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/2880/2880-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/elephant--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Chú%20voi&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&auto=format&fit=crop',
    color_hex: '#CFFAFE',
    difficulty: 2,
  },
  {
    id: 'dolphin',
    emoji: '🐬',
    category: 'ocean',
    primary_color_id: 'blue',
    habitat_id: 'ocean',
    name_vi: 'Cá Heo',
    sound_text_vi: 'Chít chít! Tách tách!',
    sound_desc_vi: 'Tiếng cá heo phát sóng âm trò chuyện dưới biển',
    fun_fact_vi: 'Cá heo là một trong những loài vật thông minh và thân thiện nhất với con người.',
    favorite_food_vi: 'Cá trích & Mực nhỏ',
    name_en: 'Dolphin',
    phonetic_en: '/ˈdɑːl.fɪn/',
    sound_text_en: 'Click! Whistle!',
    sound_desc_en: 'Dolphin clicking and whistling underwater',
    fun_fact_en: 'Dolphins sleep with one eye open to stay alert!',
    favorite_food_en: 'Herring & Squid',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/2882/2882-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/dolphin--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Cá%20heo&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=400&auto=format&fit=crop',
    color_hex: '#BAE6FD',
    difficulty: 2,
  },
  {
    id: 'sheep',
    emoji: '🐑',
    category: 'farm',
    primary_color_id: 'white',
    habitat_id: 'farm',
    name_vi: 'Cừu Bông',
    sound_text_vi: 'Be beee! Be beee!',
    sound_desc_vi: 'Tiếng cừu non ngoan ngoãn gọi mẹ trên đồng cỏ',
    fun_fact_vi: 'Lớp lông cừu mềm mại dùng để dệt nên những chiếc áo ấm tuyệt đẹp.',
    favorite_food_vi: 'Cỏ xanh & Lá non',
    name_en: 'Sheep',
    phonetic_en: '/ʃiːp/',
    sound_text_en: 'Baa! Baaa!',
    sound_desc_en: 'A fluffy sheep bleating on the hill',
    fun_fact_en: 'Sheep have excellent memory and can recognize familiar faces for years!',
    favorite_food_en: 'Fresh pasture & Clovers',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/2876/2876-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/sheep--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Cừu%20bông&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=400&auto=format&fit=crop',
    color_hex: '#DDD6FE',
    difficulty: 1,
  },
  {
    id: 'monkey',
    emoji: '🐵',
    category: 'wild',
    primary_color_id: 'brown',
    habitat_id: 'wild',
    name_vi: 'Khỉ Nhanh Nhẹn',
    sound_text_vi: 'Khẹc khẹc! Chít chít!',
    sound_desc_vi: 'Tiếng khỉ chuyền cành thoăn thoắt trong rừng',
    fun_fact_vi: 'Khỉ dùng chiếc đuôi dài như cánh tay thứ năm để giữ thăng bằng.',
    favorite_food_vi: 'Chuối vàng & Quả rừng',
    name_en: 'Monkey',
    phonetic_en: '/ˈmʌŋ.ki/',
    sound_text_en: 'Ooh-ooh! Aah-aah!',
    sound_desc_en: 'A playful monkey chattering and swinging on trees',
    fun_fact_en: 'Monkeys use vocalizations, facial expressions, and body movements to talk!',
    favorite_food_en: 'Bananas & Berries',
    sound_mp3_url: 'https://assets.mixkit.co/active_storage/sfx/2881/2881-preview.mp3',
    voice_en_url: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/monkey--_us_1.mp3',
    voice_vi_url: 'https://translate.google.com/translate_tts?ie=UTF-8&q=Khỉ%20vàng&tl=vi&client=tw-ob',
    image_url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&auto=format&fit=crop',
    color_hex: '#FFEDD5',
    difficulty: 2,
  },
];

export const animalSoundService = {
  /**
   * Phát âm thanh từ đường dẫn URL (Hỗ trợ trình duyệt / React Native Web / Mobile)
   */
  playSound(url?: string, textFallback?: string): void {
    if (!url && !textFallback) return;
    try {
      // 1. Gửi tới SoundPlayer Bridge (WebView / Native)
      soundManager.play(url, textFallback);

      // 2. Fallback cho Web / HTML5 Audio
      const AudioCtor = (globalThis as any)?.Audio;
      if (AudioCtor && url) {
        const audio = new AudioCtor(url);
        audio.play?.().catch?.(() => {});
      }
    } catch {
      // Bỏ qua lỗi audio native
    }
  },

  /**
   * Lấy chế độ ngôn ngữ hiện tại ('vi' | 'en' | 'bilingual')
   */
  getLanguageMode(): LanguageMode {
    const saved = storage.getString(STORAGE_KEYS.LANGUAGE_MODE);
    if (saved === 'vi' || saved === 'en' || saved === 'bilingual') {
      return saved;
    }
    return 'bilingual';
  },

  /**
   * Lưu chế độ ngôn ngữ
   */
  setLanguageMode(mode: LanguageMode): void {
    storage.set(STORAGE_KEYS.LANGUAGE_MODE, mode);
  },

  /**
   * Lấy danh sách màu sắc (Local Cache -> Fallback Default)
   */
  getColors(): KidsColor[] {
    try {
      const cached = storage.getString(STORAGE_KEYS.COLORS_CACHE);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    return DEFAULT_COLORS;
  },

  /**
   * Lấy danh sách con vật (Local Cache -> Fallback Default)
   */
  getAnimals(): KidsAnimal[] {
    try {
      const cached = storage.getString(STORAGE_KEYS.ANIMALS_CACHE);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    return DEFAULT_ANIMALS;
  },

  /**
   * Lấy danh sách môi trường sống (Local Cache -> Fallback Default)
   */
  getHabitats(): KidsHabitat[] {
    try {
      const cached = storage.getString(STORAGE_KEYS.HABITATS_CACHE);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    return DEFAULT_HABITATS;
  },

  /**
   * Đồng bộ dữ liệu động từ Supabase (Animals + Colors + Habitats)
   */
  async syncWithCloud(): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Tải bảng Màu Sắc
      const colorsRes = await supabaseClient.from<KidsColor>('kids_colors', {
        order: { column: 'display_order', ascending: true },
      });
      if (colorsRes.data && colorsRes.data.length > 0) {
        storage.set(STORAGE_KEYS.COLORS_CACHE, JSON.stringify(colorsRes.data));
      }

      // 2. Tải bảng Môi Trường
      const habitatsRes = await supabaseClient.from<KidsHabitat>('kids_habitats');
      if (habitatsRes.data && habitatsRes.data.length > 0) {
        storage.set(STORAGE_KEYS.HABITATS_CACHE, JSON.stringify(habitatsRes.data));
      }

      // 3. Tải bảng Động Vật
      const animalsRes = await supabaseClient.from<KidsAnimal>('kids_animals', {
        order: { column: 'display_order', ascending: true },
      });
      if (animalsRes.data && animalsRes.data.length > 0) {
        storage.set(STORAGE_KEYS.ANIMALS_CACHE, JSON.stringify(animalsRes.data));
        return { success: true, message: `Đã đồng bộ ${animalsRes.data.length} con vật từ Đám mây!` };
      }

      return { success: true, message: 'Dữ liệu cục bộ đã sẵn sàng.' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Không có kết nối mạng, dùng dữ liệu Offline.' };
    }
  },

  /**
   * Lưu kết quả làm bài của bé (Local + Supabase Log)
   */
  async saveLearningLog(log: Omit<KidsLearningLog, 'device_id'>): Promise<void> {
    try {
      const deviceId = storage.getString('DEVICE_ID') || 'DEVICE_DEMO';
      const fullLog: KidsLearningLog = {
        ...log,
        device_id: deviceId,
        created_at: new Date().toISOString(),
      };

      // Lưu Local
      const localLogsStr = storage.getString(STORAGE_KEYS.LEARNING_LOGS);
      const localLogs: KidsLearningLog[] = localLogsStr ? JSON.parse(localLogsStr) : [];
      localLogs.unshift(fullLog);
      // Giữ tối đa 50 log gần nhất
      storage.set(STORAGE_KEYS.LEARNING_LOGS, JSON.stringify(localLogs.slice(0, 50)));

      // Gửi Supabase nền (Non-blocking)
      supabaseClient.upsert('kids_animal_learning_logs', [
        {
          device_id: deviceId,
          profile_name: log.profile_name || 'Bé Yêu',
          language_mode: log.language_mode,
          quiz_type: log.quiz_type,
          game_mode: log.game_mode,
          score: log.score,
          total_questions: log.total_questions,
          correct_animals: log.correct_animals,
          wrong_animals: log.wrong_animals,
          duration_seconds: log.duration_seconds,
        },
      ]).catch(() => {});
    } catch {
      // Silent error for kid UX
    }
  },
};
