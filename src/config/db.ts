import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'
import dotenv from "dotenv";
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set')
}


export const db = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string,
  {
    auth: { persistSession: false }, 
  }

);
