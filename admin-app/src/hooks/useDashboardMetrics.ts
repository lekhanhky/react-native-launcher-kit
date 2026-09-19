import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DashboardMetrics, AnimalItem } from '../types';

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalApps: 12,
    totalChannels: 17,
    totalAnimals: 15,
    totalMathQuestions: 50,
    activeDevices: 3,
  });

  const [recentAnimals, setRecentAnimals] = useState<AnimalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);

      const [mathRes, channelRes, animalsRes, appRes] = await Promise.all([
        supabase.from('math_questions').select('*', { count: 'exact', head: true }),
        supabase.from('kids_youtube_channels').select('*', { count: 'exact', head: true }),
        supabase.from('kids_animals').select('*').limit(6),
        supabase.from('app_catalog').select('*', { count: 'exact', head: true }),
      ]);

      setMetrics((prev) => ({
        ...prev,
        totalMathQuestions: mathRes.count ?? prev.totalMathQuestions,
        totalChannels: channelRes.count ?? prev.totalChannels,
        totalApps: appRes.count ?? prev.totalApps,
        totalAnimals: animalsRes.data?.length ? animalsRes.data.length : prev.totalAnimals,
      }));

      if (animalsRes.data && animalsRes.data.length > 0) {
        setRecentAnimals(animalsRes.data as AnimalItem[]);
      } else {
        // Fallback demo animals
        setRecentAnimals([
          {
            id: '1',
            animal_code: 'DOG',
            name_vi: 'Chú Chó Cưng',
            name_en: 'Dog',
            icon_emoji: '🐶',
            category: 'Vật Nuôi',
            sound_url:
              'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/dog.mp3',
            is_active: true,
          },
          {
            id: '2',
            animal_code: 'CAT',
            name_vi: 'Mèo Con Dễ Thương',
            name_en: 'Cat',
            icon_emoji: '🐱',
            category: 'Vật Nuôi',
            sound_url:
              'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/cat.mp3',
            is_active: true,
          },
          {
            id: '3',
            animal_code: 'LION',
            name_vi: 'Sư Tử Chúa Sơn Lâm',
            name_en: 'Lion',
            icon_emoji: '🦁',
            category: 'Rừng Rậm',
            sound_url:
              'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/lion.mp3',
            is_active: true,
          },
          {
            id: '4',
            animal_code: 'ELEPHANT',
            name_vi: 'Chú Voi Khổng Lồ',
            name_en: 'Elephant',
            icon_emoji: '🐘',
            category: 'Rừng Rậm',
            sound_url:
              'https://jlfemayqttjcfjualfsv.supabase.co/storage/v1/object/public/kids-media/animals/sounds/elephant.mp3',
            is_active: true,
          },
        ]);
      }
    } catch (e) {
      console.warn('Could not fetch Supabase dashboard data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { metrics, recentAnimals, isLoading, refetch: fetchMetrics };
};
