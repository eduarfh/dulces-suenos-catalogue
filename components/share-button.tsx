// components/share-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import type { Product } from "@/lib/products"

interface ShareButtonProps {
  product: Product
}

export function ShareButton({ product }: ShareButtonProps) {
  const handleShare = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || ""
    const url = `${origin}/product/${encodeURIComponent(product.id)}`
    const shareTitle = product.name
    const shareText = product.name ?? ""

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url,
        })
        return
      } catch (err) {
        // fallback
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
        alert("¡Enlace copiado al portapapeles!")
      } else {
        const ta = document.createElement("textarea")
        ta.value = url
        ta.style.position = "fixed"
        ta.style.left = "-9999px"
        document.body.appendChild(ta)
        ta.select()
        document.execCommand("copy")
        document.body.removeChild(ta)
        alert("¡Enlace copiado al portapapeles!")
      }
    } catch (err) {
      window.open(url, "_blank")
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

export default ShareButton
