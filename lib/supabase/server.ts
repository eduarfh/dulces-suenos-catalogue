// lib/supabase/server.ts
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Variables de entorno soportadas:
 * - SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_URL (fallback)
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY (opcional, lectura pública)
 * - SUPABASE_SERVICE_ROLE_KEY (server-only, para writes seguros)
 * - SUPABASE_SERVICE_KEY / ADMIN_API_KEY (aliases posibles)
 */

/* --- resolver variables de entorno con fallbacks --- */
const ENV_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const ENV_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const ENV_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? process.env.ADMIN_API_KEY;

function ensureEnv(name: string, value?: string): asserts value is string {
  if (!value) {
    throw new Error(`Missing env var ${name}`);
  }
}

/** Cliente "admin" — usa la service role key. SOLO server-side. */
export function getSupabaseAdminClient(): SupabaseClient {
  ensureEnv("SUPABASE_URL", ENV_URL);
  ensureEnv("SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY / ADMIN_API_KEY)", ENV_SERVICE_KEY);

  return createSupabaseClient(ENV_URL, ENV_SERVICE_KEY, {
    auth: { persistSession: false },
    global: { fetch },
  });
}

/** Cliente de solo-lectura: usa anon key si existe, si no hace fallback a service key (solo server). */
export function getSupabaseReadClient(): SupabaseClient {
  ensureEnv("SUPABASE_URL", ENV_URL);

  const key = ENV_ANON_KEY ?? ENV_SERVICE_KEY;
  if (!key) {
    throw new Error("No Supabase key available for read client (neither anon nor service key).");
  }

  return createSupabaseClient(ENV_URL, key, {
    auth: { persistSession: false },
    global: { fetch },
  });
}

/**
 * Compatibilidad: createClient() devuelve un cliente de lectura (igual que getSupabaseReadClient).
 * Algunas partes del código podrían usar `import { createClient } from "@/lib/supabase/server"`.
 */
export function createClient(): SupabaseClient {
  return getSupabaseReadClient();
}

export default createClient;
