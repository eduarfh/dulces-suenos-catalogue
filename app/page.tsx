//app/page.tsx
import { createClient } from "@/lib/supabase/server"
import type { Product, DbProduct, DbProductImage } from "@/lib/products"
import { CatalogHeader } from "@/components/catalog-header"
import { CatalogClient } from "@/components/catalog-client"

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

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        stock: product.stock,
        images: productImages.length > 0 ? productImages : ["/placeholder.svg?height=300&width=300"],
        created_at: product.created_at,
        updated_at: product.updated_at,
      }
    })
  } catch (error) {
    console.error("[v0] Failed to load products:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD4E5]/10 via-[#BEE4E7]/10 to-[#F7CCAD]/10 dark:from-[#FFD4E5]/5 dark:via-[#BEE4E7]/5 dark:to-[#F7CCAD]/5">
      <CatalogHeader />
      {errorMessage && errorMessage.includes("Could not find the table") ? (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-[#F49F51]/10 dark:bg-[#F49F51]/20 border-2 border-[#F49F51] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-[#F49F51] mb-4">Base de datos no configurada</h2>
            <p className="text-foreground/80 mb-6">
              La tabla de productos aún no existe en Supabase. Por favor, ejecuta los scripts SQL desde el panel
              lateral:
            </p>
            <ol className="text-left space-y-2 mb-6 text-foreground/70">
              <li>1. Haz clic en el botón de scripts en la barra lateral</li>
              <li>
                2. Ejecuta <code className="bg-background/50 px-2 py-1 rounded">001_create_products_table.sql</code>
              </li>
              <li>
                3. Ejecuta <code className="bg-background/50 px-2 py-1 rounded">002_seed_products.sql</code>
              </li>
              <li>4. Recarga esta página</li>
            </ol>
          </div>
        </div>
      ) : (
        <CatalogClient products={products} />
      )}
    </div>
  )
}
