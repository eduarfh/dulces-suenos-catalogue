// app/api/products/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabaseAdminClient() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    // Lanzamos error controlado aquí para que sea claro durante runtime/build
    throw new Error("Missing SUPABASE env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.")
  }

  // Crear aquí para evitar invocación en tiempo de build
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
}

export async function POST(request: Request) {
  let supabaseAdmin
  try {
    supabaseAdmin = getSupabaseAdminClient()
  } catch (err: any) {
    console.error("Supabase init error:", err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }

  try {
    const body = await request.json()
    const product = body.product
    const imageUrls: string[] = body.imageUrls || []

    if (!product || !product.name) {
      return NextResponse.json({ error: "Missing product data" }, { status: 400 })
    }

    let productId = product.id || null

    if (productId) {
      const { error: updateError } = await supabaseAdmin
        .from("products")
        .update({
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          stock: product.stock,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId)
      if (updateError) throw updateError

      await supabaseAdmin.from("product_images").delete().eq("product_id", productId)
    } else {
      const { data: inserted, error: insertError } = await supabaseAdmin
        .from("products")
        .insert({
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          stock: product.stock,
        })
        .select()
        .single()
      if (insertError) throw insertError
      productId = inserted.id
    }

    if (imageUrls.length > 0) {
      const imageRecords = imageUrls.map((url: string, idx: number) => ({
        product_id: productId,
        image_url: url,
        display_order: idx,
      }))
      const { error: imagesError } = await supabaseAdmin.from("product_images").insert(imageRecords)
      if (imagesError) throw imagesError
    }

    return NextResponse.json({ success: true, product_id: productId }, { status: 200 })
  } catch (error: any) {
    console.error("Products route error:", error)
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
  }
}
