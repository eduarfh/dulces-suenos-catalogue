"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { SortAsc, SortDesc } from "lucide-react"
import { useProducts } from "@/contexts/products-context"

type Props = {
  onActiveChange?: (active: boolean) => void
}

export default function SortByPrice({ onActiveChange }: Props) {
  const { electrodomesticos, setElectrodomesticos } = useProducts()
  const [direction, setDirection] = useState<"none" | "asc" | "desc">("none")
  const originalRef = useRef<typeof electrodomesticos | null>(null)

  useEffect(() => {
    if (!originalRef.current && electrodomesticos && electrodomesticos.length > 0) {
      originalRef.current = [...electrodomesticos]
    }
  }, [electrodomesticos])

  useEffect(() => {
    onActiveChange?.(direction !== "none")
  }, [direction, onActiveChange])

  const sortAsc = () => {
    const sorted = [...electrodomesticos].sort((a, b) => (a.precioMinorista || 0) - (b.precioMinorista || 0))
    setElectrodomesticos(sorted)
    setDirection("asc")
  }

  const sortDesc = () => {
    const sorted = [...electrodomesticos].sort((a, b) => (b.precioMinorista || 0) - (a.precioMinorista || 0))
    setElectrodomesticos(sorted)
    setDirection("desc")
  }

  const resetOrder = () => {
    if (originalRef.current) {
      setElectrodomesticos([...originalRef.current])
    }
    setDirection("none")
  }

  const handleAscClick = () => (direction === "asc" ? resetOrder() : sortAsc())
  const handleDescClick = () => (direction === "desc" ? resetOrder() : sortDesc())

  return (
    <div className="flex items-center gap-2">
      {/* Etiqueta para escritorio */}
      <div className="hidden sm:flex flex-col">
        <span className="text-sm text-muted-foreground">Ordenar</span>
        <span className="text-xs text-muted-foreground/70">por precio</span>
      </div>

      {/* Mobile: etiqueta encima (centro) */}
      <div className="sm:hidden flex flex-col items-center mb-1">
        <span className="text-[10px] text-muted-foreground">Ordenar</span>
        <span className="text-[9px] text-muted-foreground/80">por precio</span>
      </div>

      <div className="flex items-center gap-1 bg-card/50 p-1 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform-gpu">
        <Button
          variant={direction === "asc" ? "default" : "ghost"}
          size="sm"
          onClick={handleAscClick}
          aria-pressed={direction === "asc"}
          title={direction === "asc" ? "Click para restablecer" : "Precio ascendente"}
          className={`h-8 w-8 transition-transform duration-150 ${direction === "asc" ? "scale-105 shadow-md" : ""}`}
        >
          <SortAsc className="h-4 w-4" />
        </Button>

        <Button
          variant={direction === "desc" ? "default" : "ghost"}
          size="sm"
          onClick={handleDescClick}
          aria-pressed={direction === "desc"}
          title={direction === "desc" ? "Click para restablecer" : "Precio descendente"}
          className={`h-8 w-8 transition-transform duration-150 ${direction === "desc" ? "scale-105 shadow-md" : ""}`}
        >
          <SortDesc className="h-4 w-4" />
        </Button>
      </div>

      <div className="ml-2">
        {direction === "asc" && <span className="text-sm text-muted-foreground">Min → Max</span>}
        {direction === "desc" && <span className="text-sm text-muted-foreground">Max → Min</span>}
      </div>
    </div>
  )
}
