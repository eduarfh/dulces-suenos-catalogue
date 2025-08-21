import { put, head } from "@vercel/blob"
import { NextResponse } from "next/server"

const PRODUCTS_BLOB_NAME = "products.json"

export async function GET() {
  try {
    try {
      const blobInfo = await head(PRODUCTS_BLOB_NAME)
      const response = await fetch(blobInfo.url)
      const products = await response.json()
      return NextResponse.json({ products })
    } catch (error) {
      // Si no existe el archivo, devolver productos iniciales
      return NextResponse.json({ products: null })
    }
  } catch (error) {
    console.error("Error getting products:", error)
    return NextResponse.json({ error: "Failed to get products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { products } = await request.json()

    const blob = await put(PRODUCTS_BLOB_NAME, JSON.stringify(products, null, 2), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    })

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    console.error("Error saving products:", error)
    return NextResponse.json({ error: "Failed to save products" }, { status: 500 })
  }
}
