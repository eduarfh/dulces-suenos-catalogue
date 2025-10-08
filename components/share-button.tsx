//components/share-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import type { Product } from "@/lib/products"

interface ShareButtonProps {
  product: Product
}

export function ShareButton({ product }: ShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href

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
      await navigator.clipboard.writeText(url)
      alert("¡Enlace copiado al portapapeles!")
    }
  }

  return (
    <Button
      size="lg"
      variant="outline"
      onClick={handleShare}
      className="border-[#F490B9] text-[#F490B9] hover:bg-[#F490B9] hover:text-white h-14 px-6 bg-transparent"
    >
      <Share2 className="h-5 w-5" />
    </Button>
  )
}
