// components/ui/brand-filter.tsx
"use client"
import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { useProducts } from "@/contexts/products-context"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
    selected?: string | null
    onChange: (b: string | null) => void
    searchId?: string
    isMobile?: boolean
}

export default function BrandFilter({ selected = null, onChange, searchId }: Props) {
    const { electrodomesticos } = useProducts()
    const brands = useMemo(() => {
        const set = new Set<string>()
        electrodomesticos.forEach((p) => {
            if (p.marca) set.add(p.marca)
        })
        return Array.from(set).sort((a, b) => a.localeCompare(b))
    }, [electrodomesticos])

    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; width: number } | null>(null)

    // --- mobile label / overlap logic (nuevo) ---
    const labelRef = useRef<HTMLDivElement | null>(null)
    const [hideLabel, setHideLabel] = useState(false)
    const effectiveSearchId = searchId ?? "site-search"

    useEffect(() => {
        const checkOverlap = () => {
            try {
                const searchEl = document.getElementById(effectiveSearchId)
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
    }, [effectiveSearchId])

    // --- posicionamiento del portal (existente) ---
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

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false)
        }
        if (open) document.addEventListener("keydown", onKey)
        return () => document.removeEventListener("keydown", onKey)
    }, [open])

    const handleSelect = (b: string | null) => {
        onChange(b)
        setOpen(false)
        buttonRef.current?.focus()
    }

    const portalMenu = (
        <div
            ref={menuRef}
            role="listbox"
            aria-label="Seleccionar marca"
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

            {brands.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">Sin marcas</div>}

            {brands.map((b) => (
                <button
                    key={b}
                    onClick={() => handleSelect(b)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-150 ${selected === b ? "bg-accent/20 font-medium shadow-md" : "hover:bg-muted/40 hover:shadow-md"}`}
                >
                    {b}
                </button>
            ))}
        </div>
    )

    return (
        <div id={searchId ? `${searchId}-brand` : undefined} className="relative inline-block">
            <div className="flex items-center gap-3">
                {/* Desktop label (se mantiene) */}
                <div className="hidden sm:flex flex-col">
                    <span className="text-sm text-muted-foreground ">Filtrar por</span>
                    <span className="text-xs text-muted-foreground/70">marca</span>
                </div>

                {/* Mobile label (nuevo) */}
                {!hideLabel && (
                    <div ref={labelRef} className="sm:hidden flex flex-col justify-center items-start">
                        <span className="text-[12px] text-muted-foreground/80">Filtrar por</span>
                        <span className="text-[12px] text-muted-foreground">marca</span>
                    </div>
                )}

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
                        <span className="truncate max-w-[9rem]">{selected ?? "Marca"}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                    </Button>
                </div>
            </div>

            {open && typeof document !== "undefined" && createPortal(portalMenu, document.body)}
        </div>
    )
}
