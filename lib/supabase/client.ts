// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente para ejecutarse en el navegador (usando las vars NEXT_PUBLIC_...)
 * - No debe usar keys de servicio aquí (jamás expongas SERVICE_ROLE_KEY al cliente).
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "These environment variables are required for the browser Supabase client."
    );
  }

  // createBrowserClient viene de @supabase/ssr y crea un cliente orientado al navegador
  return createBrowserClient(url, anonKey);
}

export default createClient;
