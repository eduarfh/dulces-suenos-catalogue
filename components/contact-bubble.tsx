// components/contact-bubble.tsx
"use client"

import React from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info, Phone, MapPin, Clock, ExternalLink } from "lucide-react"

export default function ContactBubble() {
  // Números: ajusté el formato para los enlaces (sin espacios ni símbolos).
  const phone1 = "+53 54499134"
  const phone2 = "+53 55550301"
  const telLink1 = "tel:+5354499134"
  const telLink2 = "tel:+5355550301"
  const waLink1 = "https://wa.me/5354499134"
  const waLink2 = "https://wa.me/5355550301"

  const address = "Monte y Romay 1069, Monte, Cerro"
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  const hours = "9:00 AM - 5:00 PM"

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              aria-label="Contactar"
              className="rounded-full h-14 w-14 p-0 flex items-center justify-center shadow-lg bg-primary hover:brightness-95 focus:ring-2 focus:ring-offset-2"
              title="Información de contacto"
            >
              <Info className="h-6 w-6 text-primary-foreground" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Contáctanos</DialogTitle>
              <DialogDescription>Información rápida para comunicarte o visitarnos.</DialogDescription>
            </DialogHeader>

            <div className="mt-2 space-y-4">
              {/* Teléfonos */}
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Teléfonos / WhatsApp</p>
                  <div className="flex flex-col sm:flex-row sm:gap-3 mt-1">
                    <a href={telLink1} className="text-sm font-medium hover:underline">
                      {phone1}
                    </a>
                    <a
                      href={waLink1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline flex items-center gap-2"
                    >
                      WhatsApp
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="hidden sm:inline">•</span>
                    <a href={telLink2} className="text-sm font-medium hover:underline">
                      {phone2}
                    </a>
                    <a
                      href={waLink2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline flex items-center gap-2"
                    >
                      WhatsApp
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline flex items-center gap-2"
                  >
                    {address}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Horario */}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Horario</p>
                  <p className="text-sm font-medium">{hours}</p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button asChild>
                <Link href={mapsLink} target="_blank" rel="noopener noreferrer">
                  Ir a Google Maps
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
