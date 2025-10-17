"use client"

import React from "react"
import type { Product } from "@/lib/products"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Share2, MessageCircle } from "lucide-react"
import Link from "next/link"
import { ImageCarousel } from "@/components/image-carousel"
import WhatsAppChooser from "@/components/WhatsAppChooser"
import CategoryBadge from "@/components/category-badge"

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const url = `${origin}/product/${encodeURIComponent(product.id)}`

    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: product.name,
          text: product.name,
          url,
        })
      } catch (err) {
        // ignore user cancel
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        alert("¡Enlace copiado al portapapeles!")
      } catch {
        // fallback silent
      }
    } else {
      // último recurso
      alert(url)
    }
  }

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:scale-[1.02] bg-card ${compact ? "h-full" : ""}`}
    >
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#FFD4E5]/20 to-[#BEE4E7]/20 dark:from-[#FFD4E5]/10 dark:to-[#BEE4E7]/10 ${compact ? "aspect-square" : "aspect-square"}`}
      >
        <ImageCarousel images={product.images} alt={product.name} autoRotate={true} interval={3000} className="w-full h-full" />

        {/* Centralized category badge */}
        <CategoryBadge
          category={product.category}
          className={`${compact ? "top-2 right-2 text-[10px] px-1.5 py-0.5" : "top-3 right-3"} font-medium z-10`}
        />
      </div>

      <CardContent className={compact ? "p-2 md:p-3" : "p-4"}>
        <h3 className={`font-semibold ${compact ? "text-sm md:text-base mb-1" : "text-lg mb-2"} text-foreground line-clamp-1`}>
          {product.name}
        </h3>

        <p className={`text-xs ${compact ? "md:text-sm mb-2" : "mb-3"} text-muted-foreground line-clamp-2`}>
          {product.description}
        </p>

        <div className={`flex items-center justify-between ${compact ? "mb-2" : "mb-3"}`}>
          <span className={`${compact ? "text-lg md:text-xl" : "text-2xl"} font-bold text-[#95C7C3]`}>
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
        </div>

        <div className={`flex flex-col ${compact ? "gap-1.5" : "gap-2"} items-stretch`}>
          <Link href={`/product/${product.id}`} className="w-full">
            <Button
              className={`w-full bg-[#95C7C3] hover:bg-[#95C7C3]/90 text-white ${compact ? "h-8 text-xs" : ""} py-2 md:py-1 md:text-sm`}
              size={compact ? "sm" : "default"}
              aria-label={`Ver detalles de ${product.name}`}
            >
              <Eye className={`${compact ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2"} md:h-3 md:w-3 md:mr-1`} />
              <span className={`${compact ? "text-xs" : "text-sm"} md:text-xs`}>Ver Detalles</span>
            </Button>
          </Link>

          <div className="mt-2 flex justify-center px-3">
            <div className="flex gap-3 w-full max-w-[420px] justify-center">
              <WhatsAppChooser
                product={product}
                phoneList={[
                  { label: "Principal", number: "+53 59158599" },
                ]}
                defaultIndex={0}
                openOnSingle={true}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-[#F49F51] text-[#F49F51] hover:bg-[#F49F51] hover:text-white bg-transparent py-2 md:py-1 md:px-4 md:text-xs flex-1 max-w-[220px]"
                  aria-label={`Contactar por WhatsApp sobre ${product.name}`}
                >
                  <MessageCircle className="h-4 w-4 md:h-3 md:w-3" />
                  <span className="text-sm md:text-xs whitespace-nowrap">WhatsApp</span>
                </Button>
              </WhatsAppChooser>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center justify-center gap-2 border-[#F490B9] text-[#F490B9] hover:bg-[#F490B9] hover:text-white bg-transparent py-2 md:py-1 md:px-3 md:text-xs flex-1 max-w-[140px]"
                aria-label={`Compartir ${product.name}`}
              >
                <Share2 className="h-4 w-4 md:h-3 md:w-3" />
                <span className="hidden md:inline md:text-xs">Compartir</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
