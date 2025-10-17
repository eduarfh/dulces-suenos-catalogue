"use client"

import React, { useState } from "react"
import type { Product } from "@/lib/products"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type PhoneEntry = {
  label?: string
  number: string
}

interface Props {
  product: Product
  phoneList?: PhoneEntry[]
  defaultIndex?: number
  /**
   * Si quieres que el componente solo abra el modal incluso si hay 1 número, déjalo true.
   */
  openOnSingle?: boolean
  /**
   * children: usualmente tu Button (se mantiene el diseño)
   */
  children: React.ReactNode
}

export default function WhatsAppChooser({
  product,
  phoneList = [],
  defaultIndex = 0,
  openOnSingle = true,
  children,
}: Props) {
  const normalizedList = phoneList.length > 0 ? phoneList : [{ label: "WhatsApp", number: "5359158599" }]
  const safeDefaultIndex = Math.min(Math.max(defaultIndex, 0), normalizedList.length - 1)

  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(safeDefaultIndex)

  const sanitizePhone = (raw: string) => raw.replace(/[^\d]/g, "")

  const buildProductUrl = () => {
    let productUrl = `/product/${encodeURIComponent(product.id)}`
    try {
      if (typeof window !== "undefined" && window.location?.origin) {
        productUrl = `${window.location.origin}/product/${encodeURIComponent(product.id)}`
      }
    } catch {
      // fallback relativo
    }
    return productUrl
  }

  const openWhatsAppWith = (index: number) => {
    const phoneDigits = sanitizePhone(normalizedList[index].number)
    const productLabel = product.name ?? product.id
    const productUrl = buildProductUrl()
    const message = `Hola, estoy interesad@ en ${productLabel}. ${productUrl}`

    const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setOpen(false)
  }

  // Si solo hay 1 número y no queremos modal, abrimos directo:
  const triggerHandler = (e?: React.MouseEvent) => {
    if (normalizedList.length === 1 && !openOnSingle) {
      e?.preventDefault()
      openWhatsAppWith(0)
      return
    }
    // otherwise: open modal (Radix Dialog controlled via `open`)
    setOpen(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Usamos Portal + Overlay explícito para evitar stacking-context issues en iOS */}
      <DialogTrigger asChild>
        {/* Cambié a button para evitar problemas de focus/scroll en iOS */}
        <button
          type="button"
          onClick={triggerHandler}
          className="p-0 m-0 w-full"
          aria-label={`Abrir selector de WhatsApp para ${product.name}`}
        >
          {children}
        </button>
      </DialogTrigger>

      <DialogPortal>
        {/* Overlay: fixed full screen */}
        <DialogOverlay
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          style={{
            // forzar composición en iOS y evitar artefactos
            WebkitTransform: "translate3d(0,0,0)",
            transform: "translate3d(0,0,0)",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Content centrado y con safe-area handling */}
        <DialogContent
          className="fixed z-50 left-1/2 top-1/2 max-w-sm w-full -translate-x-1/2 -translate-y-1/2 rounded-lg p-4 shadow-lg"
          style={{
            maxHeight: "90vh",
            overflow: "auto",
            // safe-area para no chocar con home indicator en iPhone
            paddingBottom: "env(safe-area-inset-bottom)",
            WebkitTransform: "translate3d(0,0,0)",
            transform: "translate3d(0,0,0)",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        >
          <DialogHeader>
            <DialogTitle>Contactar por WhatsApp</DialogTitle>
            <DialogDescription>Elige con qué número quieres iniciar el chat</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 mt-4">
            {normalizedList.map((p, i) => {
              const isSelected = i === selectedIndex

              // clases para botón seleccionado / no seleccionado
              const selectedButtonClasses =
                "bg-[var(--baby-teal)] text-white border-transparent hover:bg-[var(--baby-teal)]/90"
              const notSelectedButtonClasses =
                "bg-transparent text-foreground hover:bg-[var(--baby-teal)]/8"

              // clases para la badge (indicador)
              const selectedBadgeClasses = "bg-white text-[var(--baby-teal)] border-transparent"
              const notSelectedBadgeClasses = "" // usa el estilo por defecto del badge outline

              return (
                <Button
                  key={i}
                  variant="outline"
                  size="default"
                  className={`w-full justify-between ${isSelected ? selectedButtonClasses : notSelectedButtonClasses}`}
                  onClick={() => {
                    setSelectedIndex(i)
                    openWhatsAppWith(i)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="block font-medium text-sm line-clamp-1">{p.label ?? `Número ${i + 1}`}</span>
                      <span className="block text-xs text-muted-foreground">{p.number}</span>
                    </div>
                  </div>

                  <Badge variant="outline" className={`${isSelected ? selectedBadgeClasses : notSelectedBadgeClasses}`}>
                    {isSelected ? "Seleccionado" : "Usar"}
                  </Badge>
                </Button>
              )
            })}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
