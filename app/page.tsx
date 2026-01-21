// app/page.tsx
import { createClient } from "@/lib/supabase/server"
import type { Product, DbProduct, DbProductImage } from "@/lib/products"
import { CatalogHeader } from "@/components/catalog-header"
import { CatalogClient } from "@/components/catalog-client"
import StoreInfo from "@/components/store-info"


export const dynamic = "force-dynamic"


export default async function HomePage() {
  const supabase = await createClient()


  let products: Product[] = []
  let errorMessage: string | null = null


  try {
    const { data: dbProducts, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })


    if (productsError) {
      console.error("[v0] Error fetching products:", productsError)
      errorMessage = productsError.message
      throw productsError
    }


    const { data: dbImages, error: imagesError } = await supabase
      .from("product_images")
      .select("*")
      .order("display_order", { ascending: true })


    if (imagesError) {
      console.error("[v0] Error fetching images:", imagesError)
    }


    products = (dbProducts || []).map((product: DbProduct) => {
      const productImages = (dbImages || [])
        .filter((img: DbProductImage) => img.product_id === product.id)
        .map((img: DbProductImage) => img.image_url)


      // Normalizar price a number (si viene string), y proteger contra NaN
      const rawPrice = product.price
      const parsedPrice =
        typeof rawPrice === "string" ? parseFloat(rawPrice as string) : (rawPrice as number | undefined)
      const price = Number.isFinite(parsedPrice) ? (parsedPrice as number) : 0


      // Normalizar available a boolean: si hay campo explicit use it, otherwise infer from stock
      const explicitAvailable = (product as any).available
      const available =
        typeof explicitAvailable === "boolean" ? explicitAvailable : (product.stock ?? 0) > 0


      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price,
        description: product.description,
        stock: product.stock,
        images: productImages.length > 0 ? productImages : ["/placeholder.svg?height=300&width=300"],
        created_at: product.created_at,
        updated_at: product.updated_at,
        available,
      } as Product
    })
  } catch (error) {
    console.error("Failed to load products:", error)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD4E5]/10 via-[#BEE4E7]/10 to-[#F7CCAD]/10 dark:from-[#FFD4E5]/5 dark:via-[#BEE4E7]/5 dark:to-[#F7CCAD]/5">
      <CatalogHeader />
      {/* CatalogClient ahora es un componente cliente que recuerda filtros y la posición */}
      <CatalogClient products={products} />
      {/* Footer: StoreInfo */}
      <footer>
        <StoreInfo />
      </footer>
    </div>
  )
}