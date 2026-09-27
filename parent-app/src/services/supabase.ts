import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jlfemayqttjcfjualfsv.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZmVtYXlxdHRqY2ZqdWFsZnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzg3MjYsImV4cCI6MjA1NjgxNDcyNn0.7bF_i51rP69nL0aYyWb7vS3G0pUqJ1eG5M2Xw4y9Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
