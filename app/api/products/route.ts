// app/api/products/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE env vars for products route")
}

const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

async function parseBodySafely(request: Request) {
    const contentType = (request.headers.get("content-type") || "").toLowerCase()
    // If JSON, parse normally
    if (contentType.includes("application/json")) {
        return request.json()
    }

    // Otherwise read raw text and try several strategies
    const text = await request.text()
    console.log("Raw request body:", text)

    // 1) Try to parse text as JSON directly (maybe quotes lost but still JSON)
    try {
        return JSON.parse(text)
    } catch { }

    // 2) Try parse as urlencoded (e.g. product=%7B...%7D)
    try {
        const params = new URLSearchParams(text)
        if (params.has("product")) {
            const productStr = params.get("product")!
            const imageUrlsStr = params.get("imageUrls") || "[]"
            // product may be JSON stringified
            const product = JSON.parse(productStr)
            try {
                const imageUrls = JSON.parse(imageUrlsStr)
                return { product, imageUrls }
            } catch {
                return { product, imageUrls: [] }
            }
        }
    } catch (e) {
        // noop
    }

    // 3) As last resort, throw a clear error
    throw new Error("Unsupported request body format")
}

export async function POST(request: Request) {
    try {
        const body = await request.json() // asume application/json
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

            // Remove existing images and insert the new set
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

        // Insert images (if any)
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
