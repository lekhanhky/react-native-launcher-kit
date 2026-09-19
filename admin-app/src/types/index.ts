export type TabType = 'ANIMAL_CATEGORIES' | 'ANIMALS' | 'APP' | 'YOUTUBE' | 'MATH';

export interface CategoryItem {
  id: string;
  type: 'ANIMAL' | 'APP' | 'YOUTUBE' | 'MATH';
  name_vi: string;
  name_en: string;
  icon: string;
  color: string;
  item_count?: number;
}

export interface AnimalItem {
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

export interface MathQuestion {
  id: string;
  question_text: string;
  expression: string;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  operand1: number;
  operand2: number;
  correct_answer: number;
  options: number[];
  difficulty_level: number;
  grade_level: number;
  created_at?: string;
}

export interface AppCatalogItem {
  id: string;
  package_name: string;
  app_name: string;
  icon_url?: string;
  category: string;
  age_group?: string;
  is_enabled: boolean;
  description?: string;
}

export interface KidsYouTubeChannel {
  id: string;
  channel_id: string;
  channel_title: string;
  thumbnail_url?: string;
  category: string;
  video_count?: number;
  is_active: boolean;
}

export interface StorageFile {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: {
    size?: number;
    mimetype?: string;
  };
}

export interface DashboardMetrics {
  totalApps: number;
  totalChannels: number;
  totalAnimals: number;
  totalMathQuestions: number;
  activeDevices: number;
}
