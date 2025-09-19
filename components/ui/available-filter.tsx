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
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Desktop label (Orden/por) */}
      <div className="hidden sm:flex flex-col">
        <span className="text-sm text-muted-foreground">Filtrar por</span>
        <span className="text-xs text-muted-foreground/70">disponibles</span>
      </div>

      {/* Mobile small label (para identificar) */}
      <div className="sm:hidden flex flex-col justify-center items-start">
        <span className="text-[10px] text-muted-foreground">Filtrar por</span>
        <span className="text-[9px] text-muted-foreground/80">disponibles</span>
      </div>

      {/* Contenedor: botones + estado inline en desktop + estado debajo solo en móvil */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1">
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

          {/* Estado inline visible en desktop */}
          <div className="hidden sm:block ml-2">
            {active ? (
              <span className="text-sm text-muted-foreground">Disponibles</span>
            ) : (
              <span className="text-sm text-muted-foreground">Todos</span>
            )}
          </div>
        </div>

        {/* Estado debajo solo en móvil */}
        <div className="mt-1 text-center sm:hidden">
          {active ? (
            <span className="text-sm text-muted-foreground">Disponibles</span>
          ) : (
            <span className="text-sm text-muted-foreground">Todos</span>
          )}
        </div>
      </div>
    </div>
  )
}
