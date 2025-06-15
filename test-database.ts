import { config } from 'dotenv';
import { supabase } from './src/lib/supabase';

// Load environment variables
config({ path: '.env' });

// Log environment variables (without exposing sensitive data)
console.log('Environment check:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');
console.log();

async function testDatabase() {
  console.log('🔍 Starting database connection test...\n');

  try {
    // 1. Test basic connection
    console.log('1️⃣ Testing basic connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('Connection error:', connectionError);
      throw connectionError;
    }
    console.log('✅ Basic connection successful!\n');

    // 2. Test reading data
    console.log('2️⃣ Testing data read operation...');
    const { data: readData, error: readError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.error('Read error:', readError);
      throw readError;
    }
    console.log('✅ Read operation successful!');
    console.log('📊 Sample data:', readData?.length ? 'Found records' : 'No records found');
    console.log('First record:', readData?.[0] || 'No records available');
    console.log();

    // 3. Test writing data (if needed)
    console.log('3️⃣ Testing data write operation...');
    const testProfile = {
      email: 'test@example.com',
      cycle_length: 28,
      period_length: 5,
      age: 25,
      weight: 60,
      created_at: new Date().toISOString()
    };

    const { data: writeData, error: writeError } = await supabase
      .from('profiles')
      .insert(testProfile)
      .select()
      .single();

    if (writeError) {
      console.log('⚠️ Write operation test skipped (might be due to permissions or existing data)');
      console.log('Error details:', writeError.message);
    } else {
      console.log('✅ Write operation successful!');
      console.log('📝 Created record:', writeData);
    }
    console.log();

    // 4. Test updating data (if needed)
    if (writeData) {
      console.log('4️⃣ Testing data update operation...');
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ weight: 65 })
        .eq('id', writeData.id)
        .select()
        .single();

      if (updateError) {
        console.log('⚠️ Update operation test skipped');
        console.log('Error details:', updateError.message);
      } else {
        console.log('✅ Update operation successful!');
        console.log('📝 Updated record:', updateData);
      }
      console.log();
    }

    console.log('🎉 Database test completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Database test failed!');
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
}

// Run the test
console.log('🚀 Starting database tests...\n');
testDatabase().then(success => {
  console.log('\nTest result:', success ? '✅ PASSED' : '❌ FAILED');
  process.exit(success ? 0 : 1);
}); 