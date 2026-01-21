// app/api/store-info/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdminClient, getSupabaseReadClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const client = getSupabaseReadClient();
    const res = await client.from("store_info").select("*").limit(1).maybeSingle();

    if (res.error) {
      console.error("GET store_info error:", res.error);
      return NextResponse.json({ error: "DB error", details: String(res.error) }, { status: 500 });
    }

    return NextResponse.json(res.data ?? null);
  } catch (err: any) {
    console.error("GET unexpected:", err);
    return NextResponse.json({ error: "Server error", details: err?.message ?? String(err) }, { status: 500 });
  }
}

/**
 * PUT: escritura protegida por x-admin-secret.
 * En este archivo dejamos la comprobación por compatibilidad con llamadas directas.
 */
export async function PUT(req: Request) {
  try {
    const serverAdminKey = process.env.ADMIN_API_KEY;
    let expectedAdminKey = serverAdminKey;
    if (!expectedAdminKey && process.env.NODE_ENV !== "production") {
      expectedAdminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY ?? undefined;
    }

    const incomingSecret = req.headers.get("x-admin-secret") ?? "";
    if (!expectedAdminKey || incomingSecret !== expectedAdminKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdminClient();

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Bad request - invalid body" }, { status: 400 });
    }

    const allowed = ["id", "label", "phone_display", "whatsapp_number", "address", "lat", "lng", "hours"];
    const payload: Record<string, any> = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, k)) {
        payload[k] = (body as any)[k];
      }
    }
    payload.updated_at = new Date().toISOString();

    const up = await supabaseAdmin.from("store_info").upsert(payload, { onConflict: "id" }).select().limit(1).maybeSingle();
    if (up.error) {
      console.error("PUT upsert error:", up.error);
      return NextResponse.json({ error: "DB error", details: String(up.error) }, { status: 500 });
    }

    return NextResponse.json(up.data ?? null);
  } catch (err: any) {
    console.error("PUT unexpected:", err);
    return NextResponse.json({ error: "Unexpected error", details: String(err) }, { status: 500 });
  }
}
