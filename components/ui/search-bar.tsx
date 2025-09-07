"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
  onEnter?: () => void
  onFocusChange?: (focused: boolean) => void
  enlarged?: boolean
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar productos...",
  className = "",
  autoFocus = false,
  onEnter,
  onFocusChange,
  enlarged = false,
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

  // si focused || enlarged -> scale-105 (ahora se mantiene también en desktop)
  const scaleClass = focused || enlarged ? "scale-105" : "scale-100"
  // si enlarged -> full width incluso en sm+ (ya no vuelve a sm:max-w-sm)
  const maxWidthClass = enlarged ? "max-w-full" : "max-w-sm"

  return (
    <div
      className={`relative w-full ${className} transition-all duration-200 ease-in-out transform ${scaleClass} ${maxWidthClass}`}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        className="pl-10 w-full border-gray-200 focus:border-gray-300 focus:ring-0 transition-all duration-200"
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
