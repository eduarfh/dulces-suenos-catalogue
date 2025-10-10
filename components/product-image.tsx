"use client"

import React from "react"
import type { Product } from "@/lib/products"
import { ImageCarousel } from "@/components/image-carousel"
import CategoryBadge from "@/components/category-badge"

interface ProductImageProps {
  product: Product
  autoRotate?: boolean
  interval?: number
}

export function ProductImage({
  product,
  autoRotate = true,
  interval = 4000,
}: ProductImageProps) {
  // Aseguramos siempre pasar un array de strings al carousel
  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.svg?height=300&width=300"]

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFD4E5]/20 to-[#BEE4E7]/20 dark:from-[#FFD4E5]/10 dark:to-[#BEE4E7]/10">
      <ImageCarousel
        images={images}
        alt={product.name}
        autoRotate={autoRotate}
        interval={interval}
        className="w-full h-full"
      />

      {/* Centralized category badge */}
      <CategoryBadge category={product.category} className="top-4 right-4 font-medium text-base px-4 py-2 z-10" />
    </div>
  )
}

export default ProductImage
