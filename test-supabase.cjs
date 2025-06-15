require('dotenv').config({ path: '.env' });
console.log('URL:', process.env.VITE_SUPABASE_URL);
console.log('KEY:', process.env.VITE_SUPABASE_ANON_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (error) throw error;
    console.log('Successfully connected to Supabase!');
    console.log('Data:', data);
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
  }
}

testConnection(); 