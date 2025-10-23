// components/image-carousel.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProductImage } from "@/lib/products"

interface ImageItemLike {
  image_url?: string
  url?: string
}

interface ImageCarouselProps {
  images: Array<string | ImageItemLike | ProductImage>
  alt: string
  autoRotate?: boolean
  interval?: number
  className?: string
}

export function ImageCarousel({
  images,
  alt,
  autoRotate = true,
  interval = 3000,
  className = "",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // normalizar a URLs
  const urls = (images || []).map((it) => {
    if (!it) return ""
    if (typeof it === "string") return it
    // ProductImage and ImageItemLike have image_url or url
    return (it as any).image_url ?? (it as any).url ?? ""
  }).filter(Boolean)

  useEffect(() => {
    if (!autoRotate || urls.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % urls.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoRotate, urls.length, interval])

  useEffect(() => {
    // Si se reduce el número de imágenes, asegurar index válido
    if (currentIndex >= urls.length) {
      setCurrentIndex(Math.max(0, urls.length - 1))
    }
  }, [urls.length, currentIndex])

  const goToPrevious = () => {
    if (urls.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + urls.length) % urls.length)
  }

  const goToNext = () => {
    if (urls.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % urls.length)
  }

  // Container classes: ensure relative so Image with `fill` works
  const containerClass = `relative group ${className}`

  if (urls.length === 0) {
    return (
      <div className={`${containerClass} bg-muted/10`}>
        <div className="relative w-full h-full min-h-[160px]">
          <Image src="/placeholder.svg?height=300&width=300" alt={alt} fill className="object-cover" />
        </div>
      </div>
    )
  }

  if (urls.length === 1) {
    return (
      <div className={containerClass}>
        <div className="relative w-full h-full min-h-[160px]">
          <Image src={urls[0] || "/placeholder.svg"} alt={alt} fill className="object-cover" />
        </div>
      </div>
    )
  }

  return (
    <div className={containerClass}>
      <div className="relative w-full h-full min-h-[160px]">
        <Image
          src={urls[currentIndex] || "/placeholder.svg"}
          alt={`${alt} - imagen ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-500"
        />
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 dark:bg-black/80 dark:hover:bg-black/90"
        onClick={goToPrevious}
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 dark:bg-black/80 dark:hover:bg-black/90"
        onClick={goToNext}
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {urls.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
