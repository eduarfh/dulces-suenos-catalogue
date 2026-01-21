// lib/supabase/server.ts
import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Variables de entorno (usa los nombres que tú tengas en .env.local)
 * - SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY (opcional, para lectura pública)
 * - SUPABASE_SERVICE_ROLE_KEY (server-only, para writes)
 * - ADMIN_API_KEY (alias/también posible key admin)
 */
const ENV_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const ENV_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const ENV_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? process.env.ADMIN_API_KEY;

/**
 * Nota: hacemos checks tempranos para que TypeScript deje de quejarse
 * y para fallar rápidamente si falta algo crítico.
 */
function ensureEnv(name: string, value?: string): asserts value is string {
  if (!value) {
    throw new Error(`Missing env var ${name}`);
  }
}

/** Admin client: usa service role (solo server) */
export function getSupabaseAdminClient(): SupabaseClient {
  ensureEnv("SUPABASE_URL", ENV_URL);
  ensureEnv("SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY / ADMIN_API_KEY)", ENV_SERVICE_KEY);

  return createSupabaseClient(ENV_URL, ENV_SERVICE_KEY, {
    auth: { persistSession: false },
    global: { fetch },
  });
}

/** Read client: usa anon key si existe, si no usa service key como fallback */
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
 * Compatibilidad: createClient() async — devuelve cliente de lectura.
 * (Tu código existente puede usar `await createClient()`).
 */
export async function createClient(): Promise<SupabaseClient> {
  return getSupabaseReadClient();
}

export default createClient;
