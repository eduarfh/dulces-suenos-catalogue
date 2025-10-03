// app/producto/[id]/page.tsx
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import BackToCatalogButton from "@/components/ui/back-to-catalogue-button"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { ShareButton } from "@/components/ui/card" // componente cliente (use client) - está bien importarlo desde un server component

type Params = { params: { id: string } }

// Forzamos consultas en tiempo real por request (ajusta si quieres caching/ISR)
export const dynamic = "force-dynamic"

// URL base (usa variable de entorno si la defines)
const DEFAULT_SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://v0-electrodomesticoscatalogue.vercel.app"

function absoluteUrl(pathOrUrl?: string) {
    if (!pathOrUrl) return undefined
    try {
        // si ya es absoluta la normalizamos
        const u = new URL(pathOrUrl)
        return u.toString()
    } catch {
        // path relativo -> asegurar leading slash
        const p = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`
        return `${DEFAULT_SITE}${p}`
    }
}

async function getProductoById(id: string) {
    // Supabase server-side (usa el cliente que ya tienes en /lib/supabase)
    const { data, error } = await supabase
        .from("Producto")
        .select("*")
        .eq("id", Number(id))
        .limit(1)
        .maybeSingle()

    if (error) {
        console.error("Supabase error fetching product:", error)
        return null
    }
    return data
}

/**
 * Metadata dinámica para cada producto.
 * IMPORTANTE: usamos openGraph.type = "website" porque Next no acepta "product" en su tipo OpenGraph.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { id } = await params
    const prod: any = await getProductoById(id)
    if (!prod) {
        return {
            title: "Producto no encontrado",
        }
    }

    const title = prod.nombre ?? "Producto"
    const description = prod.descripcion?.slice(0, 160) ?? `${prod.nombre ?? ""} - ${prod.marca ?? ""}`
    const imageUrl = absoluteUrl(prod.imagenURL) ?? absoluteUrl("/placeholder.svg")
    const canonicalUrl = `${DEFAULT_SITE}/producto/${encodeURIComponent(String(prod.id))}`

    return {
        title,
        description,
        // Open Graph (asegúrate que images => URL absoluta)
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            images: imageUrl ? [{ url: imageUrl, alt: `${prod.nombre} • ${prod.marca}`, width: 1200, height: 630 }] : undefined,
            // usar "website" para cumplir con los tipos de Next
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: imageUrl ? [imageUrl] : undefined,
        },
    }
}

export default async function ProductoPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const producto: any = await getProductoById(id)

    // Si no existe el producto: 404
    if (!producto) {
        notFound()
    }

    // Datos útiles
    const imagenAbsoluta = absoluteUrl(producto.imagenURL) ?? absoluteUrl("/placeholder.svg")
    const canonicalUrl = `${DEFAULT_SITE}/producto/${encodeURIComponent(String(producto.id))}`

    // JSON-LD (schema.org/Product)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: producto.nombre,
        image: imagenAbsoluta ? [imagenAbsoluta] : undefined,
        description: producto.descripcion,
        brand: producto.marca ? { "@type": "Brand", name: producto.marca } : undefined,
        sku: producto.sku ?? undefined,
        offers: {
            "@type": "Offer",
            url: canonicalUrl,
            price: producto.precioMinorista != null ? String(producto.precioMinorista) : undefined,
            priceCurrency: producto.moneda ?? "USD",
            availability: producto.disponible ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
    }

    return (
        <main className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{producto.nombre}</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {producto.marca} • {producto.categoria}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <ShareButton productId={String(producto.id)} title={producto.nombre} text={producto.marca} />
                        <BackToCatalogButton />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="rounded-lg overflow-hidden bg-gray-100 relative aspect-square">
                            <Image src={producto.imagenURL || "/placeholder.svg"} alt={producto.nombre} fill className="object-cover" />
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Badge variant="secondary" className="text-sm">
                                {producto.marca}
                            </Badge>
                            <Badge variant={producto.disponible ? "default" : "secondary"} className="text-sm">
                                {producto.disponible ? "Disponible" : "Agotado"}
                            </Badge>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <div className="text-sm text-muted-foreground">Precio Minorista</div>
                            <div className="text-3xl font-bold text-blue-600">${producto.precioMinorista}</div>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground">
                                Precio Mayorista (mín. {producto.cantidadMinimaMayorista} uds.)
                            </div>
                            <div className="text-2xl font-bold text-green-600">${producto.precioMayorista}</div>
                        </div>

                        <section className="pt-4 border-t">
                            <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{producto.descripcion}</p>
                        </section>
                    </div>
                </div>
            </div>

            {/* JSON-LD para mejorar la semántica de producto en buscadores */}
            <script
                type="application/ld+json"
                // dangerouslySetInnerHTML está bien en Server Components para inyectar JSON-LD
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </main>
    )
}
