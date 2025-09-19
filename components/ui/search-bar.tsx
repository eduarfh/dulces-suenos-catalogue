"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

type SearchBarProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
  onEnter?: () => void
  onFocusChange?: (focused: boolean) => void
  enlarged?: boolean
  // nueva prop: si está false, el foco NO hará que la barra se expanda
  expandOnFocus?: boolean
}

export default function SearchBar({
  id,
  value,
  onChange,
  placeholder = " Buscar producto ",
  className = "",
  autoFocus = false,
  onEnter,
  onFocusChange,
  enlarged = false,
  expandOnFocus = true, // por defecto mantenemos el comportamiento anterior
}: SearchBarProps) {
  const [focused, setFocused] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onEnter?.()
  }

  const handleFocus = () => {
    setFocused(true)
    onFocusChange?.(true)
  }
  const handleBlur = () => {
    setFocused(false)
    onFocusChange?.(false)
  }

  // Ahora solo nos expandimos por foco si expandOnFocus === true
  const shouldExpand = enlarged || (focused && expandOnFocus)
  const expandedClass = shouldExpand ? "max-w-full mb-2" : "max-w-sm mb-0"

  return (
    <div
      id={id}
      className={`relative w-full ${className} transition-all duration-200 ease-in-out ${expandedClass} min-w-0 z-10`}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />

      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        className={
          "pl-10 w-full bg-card/50 dark:bg-transparent border-transparent rounded-lg outline-none transition-all duration-200 placeholder:text-muted-foreground text-foreground " +
          "ring-1 ring-gray-200 dark:ring-slate-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-slate-600 " +
          "shadow-sm focus:shadow-md"
        }
      />

      {value && (
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onChange("")}
            aria-label="Limpiar búsqueda"
            className="h-8 w-8"
            title="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
