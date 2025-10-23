// app/api/upload/delete/route.ts
import { del } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const urls: string[] = Array.isArray(body.urls) ? body.urls : body.url ? [body.url] : []

    if (!urls || urls.length === 0) {
      return NextResponse.json({ error: "No urls provided" }, { status: 400 })
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      console.error("Missing BLOB_READ_WRITE_TOKEN")
      return NextResponse.json(
        { error: "Server misconfiguration: missing BLOB_READ_WRITE_TOKEN" },
        { status: 500 },
      )
    }

    try {
      await del(urls, { token })
    } catch (err: any) {
      // tratar errores como no fatales si el objeto no existe
      console.error("del() error:", err)
      // devolver success pero con detalle
      return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 200 })
    }

    return NextResponse.json({ success: true, deleted: urls }, { status: 200 })
  } catch (err: any) {
    console.error("Error deleting blobs:", err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
