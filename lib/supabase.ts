import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yzjvywcplllhsqqcfsyb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6anZ5d2NwbGxsaHNxcWNmc3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Mjc1NjUsImV4cCI6MjA3MTUwMzU2NX0.SmLV_qnp5xK80kIM_Bb02UP2RyE6VAZOEjgJaNYmf8k'; // Reemplaza con tu clave anónima de Supabase

export const supabase = createClient(supabaseUrl, supabaseKey);