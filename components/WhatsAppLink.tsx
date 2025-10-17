// components/WhatsAppLink.tsx
"use client"

import React, { useState } from "react"
import type { Product } from "@/lib/products"

type PhoneEntry = {
  label?: string
  number: string
}

interface Props {
  product: Product
  /**
   * Lista de números posibles. Si no se provee, se usará `fallbackPhone`.
   * number debe venir en cualquier formato (se limpiará a dígitos).
   */
  phoneList?: PhoneEntry[]
  /**
   * Índice por defecto del teléfono seleccionado en phoneList.
   */
  defaultIndex?: number
  /**
   * Mostrar selector inline (true) o no (false). Si hay más de un número y
   * showSelector = false, el componente usará el número en defaultIndex.
   */
  showSelector?: boolean
  /**
   * Clase aplicada al contenedor <a> que envuelve el botón (para mantener tu estilo).
   */
  className?: string
  /**
   * Teléfono fallback si no hay phoneList.
   */
  fallbackPhone?: string
  children?: React.ReactNode
}

export default function WhatsAppLink({
  product,
  phoneList = [],
  defaultIndex = 0,
  showSelector = true,
  className,
  fallbackPhone = "5359158599",
  children,
}: Props) {
  const normalizedList = phoneList.length > 0 ? phoneList : [{ label: "WhatsApp", number: fallbackPhone }]
  const safeDefaultIndex = Math.min(Math.max(defaultIndex, 0), normalizedList.length - 1)
  const [selectedIndex, setSelectedIndex] = useState<number>(safeDefaultIndex)

  const sanitizePhone = (raw: string) => raw.replace(/[^\d]/g, "")

  const buildProductUrl = () => {
    let productUrl = `/product/${encodeURIComponent(product.id)}`
    try {
      if (typeof window !== "undefined" && window.location?.origin) {
        productUrl = `${window.location.origin}/product/${encodeURIComponent(product.id)}`
      }
    } catch {
      // fallback relativo ya establecido
    }
    return productUrl
  }

  const handleWhatsApp = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()

    const phoneDigits = sanitizePhone(normalizedList[selectedIndex].number)
    const productLabel = product.name ?? product.id
    const productUrl = buildProductUrl()
    const message = `Hola, estoy interesad@ en ${productLabel}. ${productUrl}`

    const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`
    // abrir en nueva pestaña
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="inline-flex items-center gap-2">
      {showSelector && normalizedList.length > 1 && (
        <label className="sr-only" aria-hidden>
          Seleccionar número de WhatsApp
        </label>
      )}

      {showSelector && normalizedList.length > 1 ? (
        // Select accesible, pequeño y sin estilos globales forzados.
        <select
          aria-label="Seleccionar número de WhatsApp"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          className="rounded-md border px-2 py-1 text-sm"
        >
          {normalizedList.map((p, i) => (
            <option key={i} value={i}>
              {p.label ? `${p.label} (${p.number})` : p.number}
            </option>
          ))}
        </select>
      ) : null}

      {/* Envolvemos el children (usualmente tu Button) en un <a> con onClick.
          así preservas el diseño del botón y sólo cambias la lógica. */}
      <a href="#" onClick={handleWhatsApp} className={className} aria-label={`Contactar por WhatsApp sobre ${product.name}`}>
        {children}
      </a>
    </div>
  )
}
