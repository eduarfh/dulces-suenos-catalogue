"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"

interface ProductImageProps {
  product: Product
  getCategoryColor: (category: string) => string
}

export function ProductImage({ product, getCategoryColor }: ProductImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFD4E5]/20 to-[#BEE4E7]/20 dark:from-[#FFD4E5]/10 dark:to-[#BEE4E7]/10">
      <Image
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        fill
        className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setImageLoaded(true)}
        priority
      />
      <Badge className={`absolute top-4 right-4 ${getCategoryColor(product.category)} font-medium text-base px-4 py-2`}>
        {product.category}
      </Badge>
    </div>
  )
}
