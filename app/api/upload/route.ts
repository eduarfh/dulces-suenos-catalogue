// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

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

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export async function POST(request: NextRequest) {
  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdminClient();
  } catch (err: any) {
    console.error("Supabase init error (upload):", err);
    return NextResponse.json({ error: "Supabase init error", details: err?.message ?? String(err) }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided (form field 'file' missing)" }, { status: 400 });
    }

    // Optional: validate MIME
    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    // Read file bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Safe, unique filename
    const safeName = sanitizeFilename(file.name || "upload");
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const path = `products/${filename}`; // carpeta products/

    // Upload to Supabase storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json({ error: "Upload error", details: uploadError }, { status: 500 });
    }

    // Correct handling of getPublicUrl() return shape
    const getPublicRes = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    // getPublicRes has shape { data: { publicUrl: string } }
    const publicUrl = (getPublicRes && (getPublicRes as any).data && (getPublicRes as any).data.publicUrl) ?? null;
    let url = publicUrl;

    // If bucket is private and you prefer signed URLs, uncomment:
    // const { data: signedData, error: signedError } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
    // if (signedError) { console.error("Error creating signed url:", signedError) }
    // url = signedData?.signedUrl ?? url;

    return NextResponse.json({
      url,
      path,
      filename: file.name,
      size: buffer.length,
      type: file.type,
    }, { status: 200 });
  } catch (err: any) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: err?.message ?? String(err), details: err }, { status: 500 });
  }
}
