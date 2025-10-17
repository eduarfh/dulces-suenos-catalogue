//components/image-carousel.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageCarouselProps {
  images: string[]
  alt: string
  autoRotate?: boolean
  interval?: number
  className?: string
}

export function ImageCarousel({ images, alt, autoRotate = true, interval = 3000, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoRotate || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoRotate, images.length, interval])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  if (images.length === 0) {
    return (
      <div className={`relative bg-muted ${className}`}>
        <Image src="/placeholder.svg?height=300&width=300" alt={alt} fill className="object-cover" />
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <Image src={images[0] || "/placeholder.svg"} alt={alt} fill className="object-cover" />
      </div>
    )
  }

  return (
    <div className={`relative group ${className}`}>
      <Image
        src={images[currentIndex] || "/placeholder.svg"}
        alt={`${alt} - imagen ${currentIndex + 1}`}
        fill
        className="object-cover transition-opacity duration-500"
      />

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 dark:bg-black/80 dark:hover:bg-black/90"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 dark:bg-black/80 dark:hover:bg-black/90"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
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
