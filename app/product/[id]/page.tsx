// app/product/[id]/page.tsx
import { createClient } from "@/lib/supabase/server"
import type { Product, DbProduct, DbProductImage } from "@/lib/products"
import { CatalogHeader } from "@/components/catalog-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Package, DollarSign, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ImageCarousel } from "@/components/image-carousel"
import { ShareButton } from "@/components/share-button"
import WhatsAppChooser from "@/components/WhatsAppChooser"

export const dynamic = "force-dynamic"

// Asegúrate de definir NEXT_PUBLIC_SITE_URL en el entorno de producción
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://your-site.com"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient()

  const { data: dbProduct } = await supabase
    .from("products")
    .select("id, name, description")
    .eq("id", id)
    .single()

  if (!dbProduct) {
    return { title: "Producto no encontrado" }
  }

  const { data: dbImages } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", id)
    .order("display_order", { ascending: true })
    .limit(1)

  const firstImage = dbImages && dbImages.length > 0 ? dbImages[0].image_url : "/placeholder.svg"

  const absoluteImage =
    firstImage?.startsWith("http") || firstImage?.startsWith("https")
      ? firstImage
      : `${SITE_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`

  const productUrl = `${SITE_URL}/product/${encodeURIComponent(id)}`

  return {
    title: dbProduct.name,
    description: dbProduct.description ?? "",
    openGraph: {
      title: dbProduct.name,
      description: dbProduct.description ?? "",
      url: productUrl,
      images: [absoluteImage],
      siteName: "Catálogo Baby",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dbProduct.name,
      description: dbProduct.description ?? "",
      images: [absoluteImage],
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: dbProduct, error: productError } = await supabase.from("products").select("*").eq("id", id).single()

  if (productError || !dbProduct) {
    notFound()
  }

  const { data: dbImages } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("display_order", { ascending: true })

  const product: Product = {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    price: dbProduct.price,
    description: dbProduct.description,
    stock: dbProduct.stock,
    images: (dbImages || []).map((img: DbProductImage) => img.image_url),
    created_at: dbProduct.created_at,
    updated_at: dbProduct.updated_at,
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Ropa: "bg-[#BEE4E7] text-gray-800 dark:text-gray-900",
      Juguetes: "bg-[#F49F51] text-gray-800 dark:text-gray-900",
      Alimentación: "bg-[#FFD4E5] text-gray-800 dark:text-gray-900",
      Higiene: "bg-[#95C7C3] text-gray-800 dark:text-gray-900",
      Accesorios: "bg-[#F490B9] text-gray-800 dark:text-gray-900",
      Muebles: "bg-[#F7CCAD] text-gray-800 dark:text-gray-900",
    }
    return colors[category] || "bg-gray-200 text-gray-800 dark:text-gray-900"
  }

  const { data: relatedDbProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4)

  const relatedProducts: Product[] = await Promise.all(
    (relatedDbProducts || []).map(async (rp: DbProduct) => {
      const { data: rpImages } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", rp.id)
        .order("display_order", { ascending: true })
        .limit(1)

      return {
        id: rp.id,
        name: rp.name,
        category: rp.category,
        price: rp.price,
        description: rp.description,
        stock: rp.stock,
        images: rpImages && rpImages.length > 0 ? [rpImages[0].image_url] : ["/placeholder.svg"],
      }
    }),
  )

  const formatPrice = (price: number) =>
    price.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // Reutilizable: tamaño de texto responsivo (mismo para precio y stock para mantener consistencia)
  const responsiveNumberStyle: React.CSSProperties = { fontSize: "clamp(1.25rem, 3.2vw, 2.25rem)" }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD4E5]/10 via-[#BEE4E7]/10 to-[#F7CCAD]/10 dark:from-[#FFD4E5]/5 dark:via-[#BEE4E7]/5 dark:to-[#F7CCAD]/5">
      <CatalogHeader />

      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Images Carousel */}
          <div className="relative">
            <ImageCarousel
              images={product.images.length > 0 ? product.images : ["/placeholder.svg"]}
              alt={product.name}
              autoRotate={true}
              interval={4000}
              className="aspect-square rounded-lg overflow-hidden"
            />
            <div
              className={`absolute top-4 right-4 ${getCategoryColor(product.category)} px-3 py-1 rounded-full text-sm font-medium z-10`}
            >
              {product.category}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{product.name}</h1>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            {/* Responsive: stack on xs, two columns from sm upwards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* PRICE CARD */}
              <Card className="border-2">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-[#95C7C3]/20 p-3 rounded-lg shrink-0">
                    <DollarSign className="h-6 w-6 text-[#95C7C3]" />
                  </div>

                  {/* min-w-0 permite truncado dentro de flex */}
                  <div className="min-w-0 w-full">
                    <p className="text-sm text-muted-foreground">Precio</p>

                    {/* ahora el signo $ forma parte del número grande (se eliminó el símbolo mini) */}
                    <div className="flex items-baseline gap-2">
                      <p
                        className="font-extrabold text-[#95C7C3] leading-tight min-w-0"
                        style={responsiveNumberStyle}
                        aria-label={`Precio ${formatPrice(product.price)}`}
                        title={`${formatPrice(product.price)}`}
                      >
                        <span className="inline-block max-w-[14ch] truncate">
                          {"$" + formatPrice(product.price)}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* STOCK CARD (mismo diseño/responsividad que precio) */}
              <Card className="border-2">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-[#F490B9]/20 p-3 rounded-lg shrink-0">
                    <Package className="h-6 w-6 text-[#F490B9]" />
                  </div>

                  <div className="min-w-0 w-full">
                    <p className="text-sm text-muted-foreground">Stock</p>

                    <div className="flex items-baseline gap-2">
                      <p
                        className="font-extrabold text-[#F490B9] leading-tight min-w-0"
                        style={responsiveNumberStyle}
                        aria-label={`Stock ${product.stock}`}
                        title={`${product.stock}`}
                      >
                        <span className="inline-block max-w-[14ch] truncate">{product.stock}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <WhatsAppChooser
                product={product}
                phoneList={[
                  { label: "Principal", number: "+53 59158599" },
                  { label: "Ventas", number: "+53 58561582" },
                  { label: "Soporte", number: "+53 55550301" },
                ]}
                defaultIndex={0}
                openOnSingle={true}
              >
                <Button size="lg" className="w-full bg-[#F49F51] hover:bg-[#F49F51]/90 text-white text-lg h-14">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Consultar por WhatsApp
                </Button>
              </WhatsAppChooser>

              <ShareButton product={product} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:scale-[1.02] bg-card cursor-pointer">
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#FFD4E5]/20 to-[#BEE4E7]/20 dark:from-[#FFD4E5]/10 dark:to-[#BEE4E7]/10">
                      <Image
                        src={relatedProduct.images[0] || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-1">{relatedProduct.name}</h3>
                      <p className="text-xl font-bold text-[#95C7C3]">${relatedProduct.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
