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
    <div className={`flex items-center gap-2 h-10 ${className}`}>
      {/* Desktop label */}
      <div className="hidden sm:flex flex-col h-full">
        <span className="text-sm text-muted-foreground">Filtrar por</span>
        <span className="text-xs text-muted-foreground/70">disponibles</span>
      </div>

      {/* Mobile label */}
      <div className="sm:hidden flex flex-col justify-center items-start h-10">
        <span className="text-[12px] text-muted-foreground/80">Filtrar por</span>
        <span className="text-[12px] text-muted-foreground">disponibles</span>
      </div>

      {/* button + estados */}
      <div className="relative h-full overflow-visible">
        <div className="flex items-center gap-1 h-10">
          <div className="flex items-center gap-1 bg-card/50 px-1 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform-gpu h-full">
            <div className="h-full flex items-center">
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
          </div>

          {/* Estado inline visible en desktop */}
          <div className="hidden sm:block ml-2">
            {active ? (
              <span className="text-sm text-muted-foreground">Disponibles</span>
            ) : (
              <span className="text-sm text-muted-foreground"></span>
            )}
          </div>
        </div>

        {/* Estado debajo solo en móvil */}
        {/* <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2 top-full mt-1 w-max text-center">
          {active ? (
            <span className="text-sm text-muted-foreground">Disponibles</span>
          ) : (
            <span className="text-sm text-muted-foreground">Todos</span>
          )}
        </div> */}
      </div>
    </div>
  )
}
