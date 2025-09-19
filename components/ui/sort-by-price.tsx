// components/ui/sort-by-price.tsx
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

  const labelRef = useRef<HTMLDivElement | null>(null)
  const [hideLabel, setHideLabel] = useState(false)

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

  useEffect(() => {
    const checkOverlap = () => {
      try {
        const searchEl = document.getElementById("site-search")
        const labelEl = labelRef.current
        if (!searchEl || !labelEl) {
          setHideLabel(false)
          return
        }
        const r1 = searchEl.getBoundingClientRect()
        const r2 = labelEl.getBoundingClientRect()
        const overlap = !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom)
        setHideLabel(overlap)
      } catch {
        setHideLabel(false)
      }
    }

    checkOverlap()
    window.addEventListener("resize", checkOverlap)
    window.addEventListener("orientationchange", checkOverlap)
    const t = setTimeout(checkOverlap, 300)
    return () => {
      window.removeEventListener("resize", checkOverlap)
      window.removeEventListener("orientationchange", checkOverlap)
      clearTimeout(t)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      {/* Etiqueta para escritorio */}
      <div className="hidden sm:flex flex-col">
        <span className="text-sm text-muted-foreground">Ordenar</span>
        <span className="text-xs text-muted-foreground/70">por precio</span>
      </div>

      {/* Mobile: inline a la izquierda y centrada verticalmente (oculto si hideLabel) */}
      {!hideLabel && (
        <div ref={labelRef} className="sm:hidden flex flex-col justify-center items-start">
          <span className="text-[10px] text-muted-foreground">Ordenar</span>
          <span className="text-[9px] text-muted-foreground/80">por precio</span>
        </div>
      )}

      {/* Botones + estado inline en desktop + estado debajo solo en móvil */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1">
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

          {/* Estado inline visible en desktop */}
          <div className="hidden sm:block ml-2">
            {direction === "asc" && <span className="text-sm text-muted-foreground">Min → Max</span>}
            {direction === "desc" && <span className="text-sm text-muted-foreground">Max → Min</span>}
            {direction === "none" && <span className="text-sm text-muted-foreground">Original</span>}
          </div>
        </div>

        {/* Estado debajo solo en móvil */}
        <div className="mt-1 text-center sm:hidden">
          {direction === "asc" && <span className="text-sm text-muted-foreground">Min → Max</span>}
          {direction === "desc" && <span className="text-sm text-muted-foreground">Max → Min</span>}
          {direction === "none" && <span className="text-sm text-muted-foreground">Original</span>}
        </div>
      </div>
    </div>
  )
}
