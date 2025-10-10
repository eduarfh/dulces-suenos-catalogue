"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Phone, MapPin, Map } from "lucide-react"
import { MessageCircle } from "lucide-react"

export default function StoreInfo() {
  const phoneDisplay = "+53 59158599"
  const whatsappNumber = "5359158599" // wa.me requires no + or spaces
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hola Gabriela, quiero consultar sobre un producto del catálogo"
  )}`

  const telLink = `tel:${phoneDisplay.replace(/\s+/g, "")}`

  const address = "Calle 68 entre 9na y 11na, Miramar, Playa"
  const lat = "23.106806"
  const lng = "-82.431900"
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  const appleMapsUrl = `https://maps.apple.com/?ll=${lat},${lng}`
  const mapsEmbedSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`

  const [isApple, setIsApple] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera || ""
      const isiOS = /iPhone|iPad|iPod/.test(ua)
      const isMac = /Macintosh|Mac OS X/.test(ua)
      const isAndroid = /Android/.test(ua)
      setIsApple((isiOS || (isMac && !isAndroid)) ?? false)
    } catch {
      setIsApple(false)
    }
  }, [])

  const openMaps = () => {
    const url = isApple ? appleMapsUrl : googleMapsUrl
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert("Copiado al portapapeles")
    } catch (e) {
      console.error("Clipboard error", e)
      alert("No se pudo copiar. Selecciona y copia manualmente.")
    }
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">Visítanos o contáctanos</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Horario */}
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FFD4E5]/30 dark:bg-[#FFD4E5]/20">
                <Clock className="h-5 w-5 text-[#F49F51]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horario</p>
                <p className="font-semibold text-foreground">Lun - Sáb · 10:00 — 18:00</p>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#BEE4E7]/30 dark:bg-[#BEE4E7]/20">
                <Phone className="h-5 w-5 text-[#95C7C3]" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Contacto</p>
                <p className="font-semibold text-foreground">Gabriela Silva</p>
                <div className="mt-1 flex items-center gap-2">
                  <a href={telLink} className="text-sm text-muted-foreground underline">
                    {phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                asChild
                variant="outline"
                className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                aria-label="Chatear por WhatsApp con Gabriela"
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  {/* Usamos el mismo icono que en ProductCard (MessageCircle) y lo envolvemos para evitar deformación */}
                  <span className="inline-flex items-center justify-center w-5 h-5 flex-shrink-0">
                    <MessageCircle className="h-4 w-4 md:h-3 md:w-3" />
                  </span>

                  <span className="font-medium">WhatsApp</span>
                </a>
              </Button>

              <Button
                variant="ghost"
                onClick={() => copyToClipboard(phoneDisplay)}
                className="text-sm"
                aria-label="Copiar número"
              >
                Copiar número
              </Button>
            </div>
          </div>

          {/* Dirección + Mapa */}
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F7CCAD]/30 dark:bg-[#F7CCAD]/20">
                <MapPin className="h-5 w-5 text-[#F7CCAD]" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-semibold text-foreground">{address}</p>
                <p className="text-xs text-muted-foreground mt-1">Coordenadas: {lat}, {lng}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={openMaps}
                variant="outline"
                className="flex-1 inline-flex items-center justify-center gap-2"
                aria-label="Abrir en la app de mapas"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 flex-shrink-0">
                  {/* icono condicional: Apple o mapa genérico */}
                  {isApple ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      preserveAspectRatio="xMidYMid meet"
                      className="w-4 h-4"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M16.365 1.43c-.97.02-2.134.66-2.83 1.46-.616.72-1.157 1.91-.95 3.03 1.036.05 2.232-.66 2.846-1.45.616-.79 1.056-2.01.934-3.04zM20.616 7.07c-1.016-1.39-2.59-2.25-4.255-2.25-1.38 0-2.628.53-3.5.53s-2.01-.53-3.5-.53c-1.666 0-3.238.86-4.255 2.25-2.21 3.03-1.258 8.44 1.39 11.22.91.82 1.995 1.36 3.15 1.36 1.149 0 1.48-.73 3.5-.73 2.02 0 2.352.73 3.5.73 1.156 0 2.246-.54 3.155-1.36 2.648-2.78 3.6-8.2 1.39-11.22z" />
                    </svg>
                  ) : (
                    <Map className="w-4 h-4" />
                  )}
                </span>

                <span className="font-medium">
                  Abrir en {isApple === null ? "Maps" : isApple ? "Apple Maps" : "Google Maps"}
                </span>
              </Button>
            </div>

            <div className="mt-2 rounded overflow-hidden border">
              <iframe
                title="Mapa de Dulces Sueños"
                src={mapsEmbedSrc}
                width="100%"
                height="220"
                loading="lazy"
                className="block"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(`${lat}, ${lng}`)}>
                Copiar coordenadas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
