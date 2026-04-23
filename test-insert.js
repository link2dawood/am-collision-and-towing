import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('Testing insert to leads table...');

  const { data, error } = await supabase.from('leads').insert([
    {
      name: 'Test Lead',
      email: 'test@example.com',
      phone: '1234567890',
      service: 'Collision Repair',
      message: 'This is a test message'
    }
  ]);

  if (error) {
    console.error('❌ Insert failed! Error details:', error);
  } else {
    console.log('✅ Insert successful!', data);
  }
}

testInsert();
