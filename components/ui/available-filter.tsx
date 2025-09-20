// components/ui/available-filter.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

type Props = {
  active: boolean
  onChange: (active: boolean) => void
  className?: string
}

export default function AvailableFilter({ active, onChange, className = "" }: Props) {
  return (
    // items-center => centra verticalmente todos los elementos (mobile y desktop)
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Desktop label (oculto en móvil) - centrado verticalmente */}
      <div className="hidden sm:flex flex-col items-center text-center">
        <span className="text-sm text-muted-foreground">Filtrar por</span>
        <span className="text-xs text-muted-foreground/70">disponibles</span>
      </div>

      {/* Mobile label (visible solo en móvil) - centrado verticalmente */}
      <div className="sm:hidden flex flex-col items-center text-center">
        <span className="text-[10px] text-muted-foreground">Filtrar por</span>
        <span className="text-[9px] text-muted-foreground/80">disponibles</span>
      </div>

      {/* Control: botón + estado; items-center asegura centrado vertical */}
      <div className="flex flex-col sm:flex-row items-center gap-1">
        <div className="flex items-center gap-1 bg-card/50 p-1 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform-gpu">
          <Button
            aria-pressed={active}
            title={active ? "Mostrar solo disponibles (clic para quitar)" : "Mostrar todos (clic para activar filtro)"}
            size="sm"
            variant={active ? "default" : "ghost"}
            onClick={() => onChange(!active)}
            className={`h-8 w-8 transition-transform duration-150 ${active ? "scale-105 shadow-md" : ""}`}
          >
            {active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>

        {/* Estado — centrado verticalmente respecto al botón */}
        <div className="text-sm text-muted-foreground sm:ml-2">
          {active ? "Disponibles" : "Todos"}
        </div>
      </div>
    </div>
  )
}
