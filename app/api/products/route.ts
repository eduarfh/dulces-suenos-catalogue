// app/api/products/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type IncomingImage = { url?: string; size?: number } | string;
type IncomingProduct = {
  id?: string | null;
  name?: string | null;
  category?: string | null;
  price?: number | string | null;
  description?: string | null;
  stock?: number | string | null;
  available?: boolean | string | null; // <-- allow string "true"/"false"
};

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

function normalizeNumber(value: any): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeBoolean(value: any): boolean {
  if (value === undefined || value === null) return true; // default true
  if (typeof value === "boolean") return value;
  const s = String(value).toLowerCase().trim();
  if (s === "false" || s === "0" || s === "no" || s === "n") return false;
  return true; // anything else -> true
}

export async function POST(request: Request) {
  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdminClient();
  } catch (err: any) {
    console.error("Supabase init error:", err);
    return NextResponse.json({ error: "Supabase init error", details: err?.message || String(err) }, { status: 500 });
  }

  try {
    const body = await request.json().catch((e) => {
      throw new Error("Invalid JSON body");
    });

    const product: IncomingProduct = body?.product;
    const imageFiles: IncomingImage[] = Array.isArray(body?.imageFiles) ? body.imageFiles : [];

    if (!product) {
      return NextResponse.json({ error: "Missing product in request body" }, { status: 400 });
    }
    if (!product.name || String(product.name).trim() === "") {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }
    if (!product.category || String(product.category).trim() === "") {
      return NextResponse.json({ error: "Product category is required" }, { status: 400 });
    }

    const price = normalizeNumber(product.price);
    if (price === null) {
      return NextResponse.json({ error: "Invalid price; must be a number" }, { status: 400 });
    }

    const stock = normalizeNumber(product.stock); // allow null for stock
    const available = normalizeBoolean(product.available); // <-- normalize availability

    // Decide update vs insert
    let productId = product.id ?? null;
    let savedProduct: any = null;

    if (productId) {
      // Update
      const { data: updated, error: updateError } = await supabaseAdmin
        .from("products")
        .update({
          name: String(product.name).trim(),
          category: String(product.category).trim(),
          price,
          description: product.description ?? null,
          stock,
          available,                      // <-- update
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating product:", updateError);
        return NextResponse.json({ error: "Error updating product", details: updateError }, { status: 500 });
      }

      savedProduct = updated;

      // clear previous images (reinsert below)
      const { error: deleteImgsError } = await supabaseAdmin.from("product_images").delete().eq("product_id", productId);
      if (deleteImgsError) {
        console.error("Error deleting old product_images:", deleteImgsError);
        return NextResponse.json({ error: "Error deleting old images", details: deleteImgsError }, { status: 500 });
      }
    } else {
      // Insert
      const { data: inserted, error: insertError } = await supabaseAdmin
        .from("products")
        .insert({
          name: String(product.name).trim(),
          category: String(product.category).trim(),
          price,
          description: product.description ?? null,
          stock,
          available,                     // <-- insert
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting product:", insertError);
        return NextResponse.json({ error: "Error inserting product", details: insertError }, { status: 500 });
      }

      productId = inserted.id;
      savedProduct = inserted;
    }

    // Insert images...
    if (Array.isArray(imageFiles) && imageFiles.length > 0) {
      const imageRecords = imageFiles.map((it: any, idx: number) => {
        if (typeof it === "string") {
          return {
            product_id: productId,
            image_url: it,
            display_order: idx,
            size: null,
          };
        } else {
          return {
            product_id: productId,
            image_url: it?.url ?? null,
            display_order: idx,
            size: it?.size ?? null,
          };
        }
      });

      const okImageRecords = imageRecords.filter((r) => r.image_url);

      if (okImageRecords.length > 0) {
        const { error: imagesError } = await supabaseAdmin.from("product_images").insert(okImageRecords);
        if (imagesError) {
          console.error("Error inserting product_images:", imagesError);
          return NextResponse.json({ error: "Error inserting product images", details: imagesError }, { status: 500 });
        }
      }
    }

    // Fetch final product (with images)
    const { data: productFinal, error: fetchErr } = await supabaseAdmin
      .from("products")
      .select(`*, product_images(*)`)
      .eq("id", productId)
      .single();

    if (fetchErr) {
      console.error("Error fetching final product:", fetchErr);
      return NextResponse.json({ success: true, product_id: productId }, { status: 200 });
    }

    return NextResponse.json({ success: true, product: productFinal }, { status: 200 });
  } catch (error: any) {
    console.error("Products route error:", error);
    const message = error?.message ?? String(error) ?? "Unknown error";
    const details = error?.details ?? error;
    return NextResponse.json({ error: message, details }, { status: 500 });
  }
}
