import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jlfemayqttjcfjualfsv.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZmVtYXlxdHRqY2ZqdWFsZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3Mzc0NzEsImV4cCI6MjEwMzMxMzQ3MX0.rUNun-PUw_e0Mg1WBUvMmoEJbG8GkagIn8QRP4ZGsRk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
