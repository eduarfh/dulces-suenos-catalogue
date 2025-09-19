//lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { env } from 'process';

export const supabase = createClient(process.env.SUPABASE_URL!, env.SUPABASE_KEY!);