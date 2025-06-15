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
  cycle_length: number;
  period_length: number;
  age: number;
  weight: number;
  partner_email?: string;
  last_period_start?: string;
  created_at: string;
};

export type MoodEntry = {
  id: string;
  user_id: string;
  mood: string;
  pain_level: number;
  notes?: string;
  created_at: string;
};

export type PartnerConnection = {
  id: string;
  user_id: string;
  partner_email: string;
  status: 'pending' | 'accepted';
  created_at: string;
};
