import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey);
  throw new Error('❌ Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for Supabase tables
export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  age?: number;
  weight?: number;
  last_period_date?: string;
  cycle_length: number;
  period_length: number;
  tracking_goal: 'period_tracking' | 'pregnancy_planning';
  partner_code?: string;
  partner_id?: string;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
};

export type MoodEntry = {
  id: string;
  user_id: string;
  date: string;
  mood: 'excellent' | 'good' | 'okay' | 'low' | 'terrible';
  pain_level: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type PartnerConnection = {
  id: string;
  user_id: string;
  partner_email: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
};

export type IntercourseLog = {
  id: string;
  user_id: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};
