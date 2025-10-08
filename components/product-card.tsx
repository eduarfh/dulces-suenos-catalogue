//components/product-card.tsx
"use client"

import type React from "react"

import type { Product } from "@/lib/products"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Share2, MessageCircle } from "lucide-react"
import Link from "next/link"
import { ImageCarousel } from "@/components/image-carousel"

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Ropa: "bg-[#BEE4E7] text-gray-800",
      Juguetes: "bg-[#F49F51] text-gray-800",
      Alimentación: "bg-[#FFD4E5] text-gray-800",
      Higiene: "bg-[#95C7C3] text-gray-800",
      Accesorios: "bg-[#F490B9] text-gray-800",
      Muebles: "bg-[#F7CCAD] text-gray-800",
    }
    return colors[category] || "bg-gray-200 text-gray-800"
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    const url = `${window.location.origin}/product/${product.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: url,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url)
      alert("¡Enlace copiado al portapapeles!")
    }
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    const phoneNumber = "5355550301"
    const message = `Hola, estoy interesado/a en ${product.name}`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:scale-[1.02] bg-card ${compact ? "h-full" : ""
        }`}
    >
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#FFD4E5]/20 to-[#BEE4E7]/20 dark:from-[#FFD4E5]/10 dark:to-[#BEE4E7]/10 ${compact ? "aspect-square" : "aspect-square"
          }`}
      >
        <ImageCarousel
          images={product.images}
          alt={product.name}
          autoRotate={true}
          interval={3000}
          className="w-full h-full"
        />
        <Badge
          className={`absolute ${compact ? "top-2 right-2 text-[10px] px-1.5 py-0.5" : "top-3 right-3"} ${getCategoryColor(product.category)} font-medium z-10`}
        >
          {product.category}
        </Badge>
      </div>
      <CardContent className={compact ? "p-2 md:p-3" : "p-4"}>
        <h3
          className={`font-semibold ${compact ? "text-sm md:text-base mb-1" : "text-lg mb-2"} text-foreground line-clamp-1`}
        >
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
        {/* --- BLOQUE DE BOTONES: Ver Detalles ARRIBA, WhatsApp + Compartir debajo --- */}
        <div className={`flex flex-col ${compact ? "gap-1.5" : "gap-2"} items-stretch`}>
          {/* Ver Detalles - arriba, ancho completo */}
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

          {/* Row: WhatsApp + Compartir (centrados, con separación del borde) */}
          <div className="mt-2 flex justify-center px-3">
            {/* contenedor con ancho máximo para centrar los botones dentro del card */}
            <div className="flex gap-3 w-full max-w-[420px] justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleWhatsApp}
                className="flex items-center gap-2 border-[#F49F51] text-[#F49F51] hover:bg-[#F49F51] hover:text-white bg-transparent py-2 md:py-1 md:px-4 md:text-xs flex-1 max-w-[220px]"
                aria-label={`Contactar por WhatsApp sobre ${product.name}`}
              >
                <MessageCircle className="h-4 w-4 md:h-3 md:w-3" />
                <span className="text-sm md:text-xs whitespace-nowrap">WhatsApp</span>
              </Button>

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
