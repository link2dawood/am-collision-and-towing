import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing connection to Supabase...');
  console.log(`URL: ${supabaseUrl}`);

  const { data, error } = await supabase.from('leads').select('*').limit(1);

  if (error) {
    console.error('❌ Connection failed! Error details:', error);
  } else {
    console.log('✅ Connection successful! Successfully queried the leads table.');
    console.log('Data returned:', data);
  }
}

testConnection();
