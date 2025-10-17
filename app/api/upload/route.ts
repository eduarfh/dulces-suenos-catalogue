// app/api/upload/route.ts
import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | undefined

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      console.error("Missing BLOB_READ_WRITE_TOKEN environment variable")
      return NextResponse.json(
        { error: "Server misconfiguration: missing BLOB_READ_WRITE_TOKEN" },
        { status: 500 },
      )
    }

    const blob = await put(file.name, file, { access: "public", token, allowOverwrite: true })

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error: any) {
    console.error("Upload error:", error)
   
    return NextResponse.json({ error: error?.message ?? String(error) }, { status: 500 })
  }
}
