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
    <div className="flex items-center gap-2 h-10">
      {/* Desktop label */}
      <div className="hidden sm:flex flex-col items-center text-center h-full">
        <span className="text-sm text-muted-foreground">Ordenar</span>
        <span className="text-xs text-muted-foreground/70">por precio</span>
      </div>

      {/* Mobile label */}
      {!hideLabel && (
        <div ref={labelRef} className="sm:hidden flex flex-col justify-center items-start h-10">
          <span className="text-[12px] text-muted-foreground/80">Ordenar por</span>
          <span className="text-[12px] text-muted-foreground">precio</span>
        </div>
      )}

      {/* Botones + estado */}
      <div className="relative h-full overflow-visible">
        <div className="flex items-center gap-1 h-10">
          <div className="flex items-center gap-1 bg-card/50 px-1 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform-gpu h-full">
            <div className="h-full flex items-center">
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
          </div>

          {/* Estado inline desktop */}
          <div className="hidden sm:flex ml-2 flex-col justify-center h-full">
            {direction === "asc" && <span className="text-sm text-muted-foreground">Min → Max</span>}
            {direction === "desc" && <span className="text-sm text-muted-foreground">Max → Min</span>}
            {/* {direction === "none" && <span className="text-sm text-muted-foreground">Original</span>} */}
          </div>
        </div>

        {/* Estado debajo solo en móvil */}
        {/* <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2 top-full mt-1 w-max text-center">
          {direction === "asc" && <span className="text-sm text-muted-foreground">Min → Max</span>}
          {direction === "desc" && <span className="text-sm text-muted-foreground">Max → Min</span>}
          {direction === "none" && <span className="text-sm text-muted-foreground">Original</span>}
        </div> */}
      </div>
    </div>
  )
}
