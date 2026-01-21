// app/api/upload/delete/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "catalogo-dulces-suenos";

function getSupabaseAdminClient() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing SUPABASE env vars. Ensure NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY are set."
    );
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(request: Request) {
  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdminClient();
  } catch (err: any) {
    console.error("Supabase init error (delete):", err);
    return NextResponse.json({ error: "Supabase init error", details: err?.message ?? String(err) }, { status: 500 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const urls: string[] = Array.isArray(body.urls) ? body.urls : body.url ? [body.url] : [];

    if (!urls || urls.length === 0) {
      return NextResponse.json({ error: "No urls provided (expected { urls: [...] })" }, { status: 400 });
    }

    // Extract paths from Supabase public URLs like:
    // https://<supabase-url>/storage/v1/object/public/{bucket}/{path}
    const paths = urls
      .map((u) => {
        try {
          const url = new URL(u);
          const marker = `/storage/v1/object/public/${BUCKET}/`;
          const idx = url.pathname.indexOf(marker);
          if (idx >= 0) {
            return decodeURIComponent(url.pathname.slice(idx + marker.length));
          }
          // If user provided full path like "products/abc.jpg"
          if (u.startsWith("products/") || u.startsWith(`${BUCKET}/`)) {
            // If they provided "bucket/path" remove bucket prefix
            if (u.startsWith(`${BUCKET}/`)) return u.slice(BUCKET.length + 1);
            return u;
          }
          return null;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as string[];

    if (!paths.length) {
      return NextResponse.json({ error: "No valid paths could be extracted from provided urls" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.storage.from(BUCKET).remove(paths);

    if (error) {
      console.error("Supabase remove error:", error);
      return NextResponse.json({ error: "Error removing files", details: error }, { status: 500 });
    }

    return NextResponse.json({ success: true, removed: data ?? paths }, { status: 200 });
  } catch (err: any) {
    console.error("Upload delete route error:", err);
    return NextResponse.json({ error: err?.message ?? String(err), details: err }, { status: 500 });
  }
}
