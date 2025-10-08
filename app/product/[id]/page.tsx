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

export const dynamic = "force-dynamic"

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

  const handleWhatsApp = () => {
    const phoneNumber = "5355550301"
    const message = `Hola, estoy interesado/a en ${product.name}`
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  }

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

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="border-2">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-[#95C7C3]/20 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-[#95C7C3]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Precio</p>
                    <p className="text-3xl font-bold text-[#95C7C3]">${product.price.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-[#F490B9]/20 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-[#F490B9]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <p className="text-3xl font-bold text-[#F490B9]">{product.stock}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <a href={handleWhatsApp()} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="lg" className="w-full bg-[#F49F51] hover:bg-[#F49F51]/90 text-white text-lg h-14">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Consultar por WhatsApp
                </Button>
              </a>
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
