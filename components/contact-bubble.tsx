// components/contact-bubble.tsx
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info, Phone, MapPin, Clock, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactBubble() {
  const phone1 = "+53 54499134"
  const phone2 = "+53 55550301"
  const telLink1 = "tel:+5354499134"
  const telLink2 = "tel:+5355550301"
  const waLink1 = "https://wa.me/5354499134"
  const waLink2 = "https://wa.me/5355550301"

  const lat = 23.119
  const lng = -82.369028
  const coords = `${lat},${lng}`

  const getMapLink = () => {
    if (typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
      return `maps://?q=${lat},${lng}`
    } else if (typeof navigator !== "undefined" && /Android/.test(navigator.userAgent)) {
      return `geo:${lat},${lng}?q=${lat},${lng}`
    } else {
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    }
  }

  const mapsLink = getMapLink()
  const address = "Monte y Romay #1069, Monte, Cerro"
  const hours = "Lunes/Sábado: 9:00 AM - 5:00 PM"

  const [open, setOpen] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (typeof window === "undefined") return;

    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--sb-offset", `${scrollbarWidth}px`);
    } else {
      document.documentElement.style.removeProperty("--sb-offset");
      setTimeout(() => {
        try {
          (document.activeElement as HTMLElement | null)?.blur();
        } catch { }
      }, 0);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).visualViewport) {
      const onResize = () => {
        const vv = (window as any).visualViewport
        const bottom = window.innerHeight - vv.height - vv.offsetTop
      }
      (window as any).visualViewport.addEventListener('resize', onResize)
      return () => (window as any).visualViewport.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <div
        className="fixed right-6 bottom-6 z-50"
        style={{
          transition: "none",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <motion.button
              className={
                "rounded-full h-14 w-14 p-0 flex items-center justify-center " +
                "bg-primary hover:brightness-95 " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
                "transition-shadow motion-safe:transform-gpu"
              }
              title="Información de contacto"
              aria-label="Contactar"
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 28, duration: 0.12 }}
            >
              <Info className="h-6 w-6 text-primary-foreground" />
            </motion.button>
          </DialogTrigger>


          {/* Nota: quité `overflow-hidden` para evitar recortes inesperados en desktop */}
          <DialogContent className="w-full sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Contáctanos</DialogTitle>
              <DialogDescription>Información rápida para comunicarte o visitarnos.</DialogDescription>
            </DialogHeader>

            <div className="mt-2 space-y-4">
              <div className="flex items-start gap-3 min-w-0">
                <Phone className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Teléfonos / WhatsApp</p>

                  {/* Contenedor ahora permite wrap en espacios pequeños y en desktop se mantienen en línea si hay espacio */}
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 gap-2">
                    {/* Primer par */}
                    <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
                      <a
                        href={telLink1}
                        className="text-sm font-medium hover:underline break-words"
                      >
                        {phone1}
                      </a>

                      <a
                        href={waLink1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                      >
                        WhatsApp
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                   

                    {/* Segundo par */}
                    <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
                      <a
                        href={telLink2}
                        className="text-sm font-medium hover:underline break-words"
                      >
                        {phone2}
                      </a>

                      <a
                        href={waLink2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                      >
                        WhatsApp
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline inline-flex items-center gap-2 break-words whitespace-normal">
                    {address}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Coordenadas: {coords}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 min-w-0">
                <Clock className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Horario</p>
                  <p className="text-sm font-medium">{hours}</p>
                </div>
              </div>
            </div>

            {/* Footer: se centra en móvil y en desktop se alinea a la derecha */}
            <DialogFooter className="mt-4 flex justify-center sm:justify-end">
              <Button asChild className="w-full sm:w-auto">
                <Link href={mapsLink} target="_blank" rel="noopener noreferrer">
                  Ir al Mapa
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
