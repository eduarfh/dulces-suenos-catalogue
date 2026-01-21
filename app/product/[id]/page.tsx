// app/product/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import type { Product, DbProduct, DbProductImage, ProductImage } from "@/lib/products";
import { CatalogHeader } from "@/components/catalog-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, DollarSign, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageCarousel } from "@/components/image-carousel";
import { ShareButton } from "@/components/share-button";
import WhatsAppChooser from "@/components/WhatsAppChooser";
import CategoryBadge from "@/components/category-badge";
import PriceDisplay from "@/components/price-display";
import StoreInfo from "@/components/store-info";
import ScrollToTopClient from "@/components/scroll-to-top-client";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://your-site.com";
const GLOBAL_SHARE_LOGO =
  "https://bypjbkhezrokhksjxfri.supabase.co/storage/v1/object/public/catalogo/logo.jpg";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: dbProduct } = await supabase
    .from("products")
    .select("id, name, description")
    .eq("id", id)
    .single();

  if (!dbProduct) {
    return { title: "Producto no encontrado" };
  }

  const { data: dbImages } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", id)
    .order("display_order", { ascending: true })
    .limit(1);

  const firstImage = dbImages && dbImages.length > 0 ? dbImages[0].image_url : null;

  const absoluteProductImage =
    firstImage && (firstImage.startsWith("http") || firstImage.startsWith("https"))
      ? firstImage
      : firstImage
      ? `${SITE_URL}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
      : null;

  const imagesForMeta: string[] = [];
  if (absoluteProductImage) imagesForMeta.push(absoluteProductImage);
  imagesForMeta.push(GLOBAL_SHARE_LOGO);

  const productUrl = `${SITE_URL}/product/${encodeURIComponent(id)}`;

  return {
    title: dbProduct.name,
    description: dbProduct.description ?? "",
    openGraph: {
      title: dbProduct.name,
      description: dbProduct.description ?? "",
      url: productUrl,
      images: imagesForMeta,
      siteName: "Catálogo Baby",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dbProduct.name,
      description: dbProduct.description ?? "",
      images: imagesForMeta,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: dbProduct, error: productError } = await supabase.from("products").select("*").eq("id", id).single();

  if (productError || !dbProduct) {
    notFound();
  }

  const { data: dbImages } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("display_order", { ascending: true });

  // Normalizar tipos: price -> number, stock -> number|null, images -> (ProductImage | string)[]
  const safePrice = typeof (dbProduct as any).price === "number"
    ? (dbProduct as any).price
    : Number((dbProduct as any).price ?? 0) || 0;

  const product: Product = {
    id: dbProduct.id,
    name: dbProduct.name ?? "",
    category: dbProduct.category ?? "",
    price: safePrice,
    description: dbProduct.description ?? null,
    stock: dbProduct.stock == null ? null : Number(dbProduct.stock) || 0,
    images: (dbImages || []).map((img: DbProductImage) => img.image_url),
    created_at: dbProduct.created_at,
    updated_at: dbProduct.updated_at,
    available: Boolean((dbProduct as any).available ?? true),
  };

  const { data: relatedDbProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  const relatedProducts: Product[] = await Promise.all(
    (relatedDbProducts || []).map(async (rp: DbProduct) => {
      const { data: rpImages } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", rp.id)
        .order("display_order", { ascending: true })
        .limit(1);

      const rpSafePrice = typeof (rp as any).price === "number" ? (rp as any).price : Number((rp as any).price ?? 0) || 0;
      const rpSafeStock = rp.stock == null ? null : Number(rp.stock) || 0;

      return {
        id: rp.id,
        name: rp.name ?? "",
        category: rp.category ?? "",
        price: rpSafePrice,
        description: rp.description ?? null,
        stock: rpSafeStock,
        images: rpImages && rpImages.length > 0 ? [rpImages[0].image_url] : ["/placeholder.svg"],
        created_at: rp.created_at,
        updated_at: rp.updated_at,
        available: Boolean((rp as any).available ?? true),
      };
    }),
  );

  const formatPrice = (price: number) =>
    price.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const imagesAsStrings = (imgs: Array<ProductImage | string>) =>
    (imgs || []).map((i) => (typeof i === "string" ? i : (i.image_url ?? "/placeholder.svg")));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD4E5]/10 via-[#BEE4E7]/10 to-[#F7CCAD]/10 dark:from-[#FFD4E5]/5 dark:via-[#BEE4E7]/5 dark:to-[#F7CCAD]/5">
      {/* Client component that forces scroll to top on mount */}
      <ScrollToTopClient />

      <CatalogHeader />

      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="relative">
            <ImageCarousel
              images={imagesAsStrings(product.images).length > 0 ? imagesAsStrings(product.images) : ["/placeholder.svg"]}
              alt={product.name}
              autoRotate={true}
              interval={8000}
              className="aspect-square rounded-lg overflow-hidden"
            />

            <CategoryBadge category={product.category} />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{product.name}</h1>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

            <div className="mb-8">
              <Card className="border-2">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-[#95C7C3]/20 p-3 rounded-lg shrink-0">
                    <DollarSign className="h-6 w-6 text-[#95C7C3]" />
                  </div>

                  <div className="min-w-0 w-full">
                    <p className="text-sm text-muted-foreground">Precio</p>

                    <div className="flex items-baseline gap-2">
                      <p
                        className="font-extrabold text-[#95C7C3] leading-tight min-w-0"
                        style={{
                          fontSize: "clamp(18px, 2.2vw, 36px)",
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        aria-label={`Precio ${formatPrice(product.price)}`}
                        title={`${formatPrice(product.price)}`}
                      >
                        <span className="inline-block max-w-[20ch] truncate">
                          ${formatPrice(product.price ?? 0)} CUP
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3 flex-col ">
              <WhatsAppChooser
                product={product}
                phoneList={[{ label: "Principal", number: "+53 59158599" }]}
                defaultIndex={0}
                openOnSingle={true}
              >
                <Button variant="outline" size="lg" className="w-full border-[#F49F51] text-[#F49F51] hover:bg-[#F49F51] hover:text-white bg-transparent text-lg h-14">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Consultar por WhatsApp
                </Button>
              </WhatsAppChooser>

              <ShareButton product={product} />
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const firstImg =
                  relatedProduct.images && relatedProduct.images.length > 0
                    ? typeof relatedProduct.images[0] === "string"
                      ? relatedProduct.images[0]
                      : (relatedProduct.images[0] as ProductImage).image_url
                    : "/placeholder.svg";

                return (
                  <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:scale-[1.02] bg-card cursor-pointer">
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#FFD4E5]/20 to-[#BEE4E7]/20 dark:from-[#FFD4E5]/10 dark:to-[#BEE4E7]/10">
                        <Image src={firstImg || "/placeholder.svg"} alt={relatedProduct.name} fill className="object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-1">{relatedProduct.name}</h3>
                        <p className="text-xl font-bold text-[#95C7C3]">${(relatedProduct.price ?? 0).toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <footer>
        <StoreInfo />
      </footer>
    </div>
  );
}
