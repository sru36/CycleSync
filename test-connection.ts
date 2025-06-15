import { config } from 'dotenv';
import { testConnection } from './src/lib/test-connection';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  console.log('Testing Supabase connection...');
  const isConnected = await testConnection();
  console.log('Connection status:', isConnected ? '✅ Connected' : '❌ Not connected');
}

main().catch(console.error); 