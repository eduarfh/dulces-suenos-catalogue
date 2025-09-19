// components/ui/category-filter.tsx
"use client"
import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { useProducts } from "@/contexts/products-context"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  selected?: string | null
  onChange: (c: string | null) => void
  searchId?: string
  isMobile?: boolean // se mantiene la prop por compatibilidad, pero ya no condiciona el portal
}

export default function CategoryFilter({ selected = null, onChange, searchId }: Props) {
  const { electrodomesticos } = useProducts()
  const categories = useMemo(() => {
    const set = new Set<string>()
    electrodomesticos.forEach((p) => {
      if (p.categoria) set.add(p.categoria)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [electrodomesticos])

  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; width: number } | null>(null)

  // Calcula posición (se ejecuta al abrir y cuando cambian scroll/resize)
  useLayoutEffect(() => {
    if (!open) return
    const compute = () => {
      const btn = buttonRef.current
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      setMenuStyle({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
    compute()
    window.addEventListener("resize", compute)
    window.addEventListener("scroll", compute, true)
    return () => {
      window.removeEventListener("resize", compute)
      window.removeEventListener("scroll", compute, true)
    }
  }, [open])

  // cerrar al click fuera (detecta tanto el botón como el menú en portal)
  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      const t = e.target as Node | null
      if (!t) return
      if (buttonRef.current?.contains(t)) return
      if (menuRef.current?.contains(t)) return
      setOpen(false)
    }
    if (open) {
      document.addEventListener("mousedown", handleOutside)
      document.addEventListener("touchstart", handleOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside)
      document.removeEventListener("touchstart", handleOutside)
    }
  }, [open])

  // Escape para cerrar
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const handleSelect = (c: string | null) => {
    onChange(c)
    setOpen(false)
    buttonRef.current?.focus()
  }

  // Menu (siempre en portal para evitar clipping)
  const portalMenu = (
    <div
      ref={menuRef}
      role="listbox"
      aria-label="Seleccionar categoría"
      className="rounded-lg shadow-lg bg-popover border border-gray-200 p-1 max-h-[60vh] overflow-auto"
      style={
        menuStyle
          ? {
              position: "absolute",
              top: menuStyle.top,
              left: menuStyle.left,
              width: menuStyle.width,
              zIndex: 99999,
              pointerEvents: "auto",
            }
          : { position: "absolute", visibility: "hidden", zIndex: 99999 }
      }
    >
      <button
        onClick={() => handleSelect(null)}
        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-150 ${selected === null ? "bg-accent/20 font-medium shadow-md" : "hover:bg-muted/40 hover:shadow-md"}`}
      >
        Todas
      </button>

      {categories.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">Sin categorías</div>}

      {categories.map((c) => (
        <button
          key={c}
          onClick={() => handleSelect(c)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-150 ${selected === c ? "bg-accent/20 font-medium shadow-md" : "hover:bg-muted/40 hover:shadow-md"}`}
        >
          {c}
        </button>
      ))}
    </div>
  )

  return (
    <div id={searchId ? `${searchId}-category` : undefined} className="relative inline-block">
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col">
        <span className="text-sm text-muted-foreground">Filtrar por</span>
        <span className="text-xs text-muted-foreground/70">categoría</span>
      </div>

        <div className="flex items-center gap-1 bg-card/50 p-1 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform-gpu">
          <Button
            ref={buttonRef}
            variant={selected ? "default" : "ghost"}
            size="sm"
            onClick={() => setOpen((s) => !s)}
            className={`h-8 px-3 min-w-[140px] flex items-center justify-between text-sm ${selected ? "scale-105 shadow-md" : ""}`}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="truncate max-w-[9rem]">{selected ?? "Categoría"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Siempre portal (desktop + móvil) para evitar quedar detrás de otros contenedores */}
      {open && typeof document !== "undefined" && createPortal(portalMenu, document.body)}
    </div>
  )
}
