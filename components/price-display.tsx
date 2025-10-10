"use client"

import React, { useEffect, useState } from "react"

interface PriceDisplayProps {
  price: number
  locale?: string
  type?: "currency" | "number" // currency = con decimales y separadores, number = entero para stock
  alwaysCompact?: boolean // fuerza compacto (K/M) en cualquier viewport
}

/**
 * PriceDisplay
 * - Por defecto: compacto en desktop, completo en mobile.
 * - alwaysCompact: fuerza compacto siempre (útil para mobile cards).
 * - type="number": formatea enteros (sin decimales) para stock.
 */
export default function PriceDisplay({
  price,
  locale = "es-ES",
  type = "currency",
  alwaysCompact = false,
}: PriceDisplayProps) {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(min-width: 1024px)").matches
  })

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(min-width: 1024px)")

    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktop(e.matches)

    setIsDesktop(mq.matches)

    if ("addEventListener" in mq) {
      mq.addEventListener("change", onChange as any)
    } else {
      // Safari older
      // @ts-ignore
      mq.addListener(onChange)
    }

    return () => {
      if ("removeEventListener" in mq) {
        mq.removeEventListener("change", onChange as any)
      } else {
        // @ts-ignore
        mq.removeListener(onChange)
      }
    }
  }, [])

  // formato completo (moneda con 2 decimales) o entero (stock)
  const fullFormatted =
    type === "currency"
      ? new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)
      : new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(price))

  const compactFormatted = (() => {
    const n = type === "currency" ? Math.abs(Math.round(price * 100) / 100) : Math.abs(Math.round(price))
    if (n >= 1_000_000) {
      const m = n / 1_000_000
      const s = Number.isInteger(m) ? String(m) : m.toFixed(1).replace(/\.0$/, "")
      return `${s}M`
    }
    if (n >= 1000) {
      const k = n / 1000
      if (n >= 10_000) {
        const s = Math.round(k)
        return `${s}K`
      }
      const s = Number.isInteger(k) ? String(k) : k.toFixed(1).replace(/\.0$/, "")
      return `${s}K`
    }
    // menos de 1000
    if (type === "currency") {
      return Number.isInteger(n) ? `${n}` : n.toFixed(2).replace(/\.00$/, "")
    } else {
      return String(Math.round(n))
    }
  })()

  const useCompact = alwaysCompact || isDesktop
  const display = useCompact ? compactFormatted : fullFormatted
  const title = `$${fullFormatted}`

  // currency: añadir prefijo $
  const output = type === "currency" ? `$${display}` : display

  return (
    <span title={title} aria-label={title} className="inline-block">
      {output}
    </span>
  )
}
