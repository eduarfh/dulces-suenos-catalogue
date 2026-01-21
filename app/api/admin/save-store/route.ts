// app/api/admin/save-store/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * POST: recibe el payload desde el admin UI (cliente) y realiza upsert server-side
 * usando la clave service-role (server-only).
 *
 * Nota de seguridad: PROTEGER este endpoint con autenticación en producción.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Bad request - invalid body" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdminClient();

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
      console.error("admin/save-store upsert error:", up.error);
      return NextResponse.json({ error: "DB error", details: String(up.error) }, { status: 500 });
    }

    return NextResponse.json(up.data ?? null);
  } catch (err: any) {
    console.error("admin/save-store unexpected:", err);
    return NextResponse.json({ error: "Unexpected error", details: String(err) }, { status: 500 });
  }
}
