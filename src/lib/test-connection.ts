import { supabase } from './supabase';

export async function testConnection() {
  try {
    // Try to fetch something simple from your database, e.g., profiles table
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (error) throw error;
    console.log('Successfully connected to Supabase!', data);
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return false;
  }
} 