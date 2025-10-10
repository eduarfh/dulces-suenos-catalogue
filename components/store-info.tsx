"use client"

import React, { useEffect, useState, useRef } from "react"
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
  const mapsEmbedSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`

  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | null>(null)

  useEffect(() => {
    try {
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera || ""
      const isiOS = /iPhone|iPad|iPod/.test(ua)
      const isAndroid = /Android/.test(ua)
      if (isiOS) setPlatform("ios")
      else if (isAndroid) setPlatform("android")
      else setPlatform("desktop")
    } catch {
      setPlatform("desktop")
    }
  }, [])

  const buildMapsLink = () => {
    const label = "Dulces Sueños"
    if (platform === "ios") {
      return `maps://?q=${encodeURIComponent(`${lat},${lng}`)}`
    }
    if (platform === "android") {
      return `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`
    }
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  }

  const openMaps = () => {
  const url = buildMapsLink()

  try {
    // Creamos un <a> seguro para forzar que SOLO se abra en una nueva pestaña
    const a = document.createElement("a")
    a.href = url
    a.target = "_blank"
    a.rel = "noopener noreferrer"
    // oculto y temporal en DOM para que click() funcione en todos los navegadores
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    a.remove()
  } catch {
    // fallback: si algo falla, redirigimos la pestaña actual
    window.location.href = url
  }
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

  // --- Developer credit UI ---
  const devName = "Eduardo Enrique Fonseca Heredia"
  const devWhatsRaw = "5355550301"
  const devWhatsDisplay = "+53 55550301"
  const devWhatsLink = `https://wa.me/${devWhatsRaw}?text=${encodeURIComponent("Hola Eduardo, te contacto desde la web.")}`
  const instagramLink = "https://instagram.com/eduar_fh"
  const facebookLink = "https://www.facebook.com/eduardoenrique.fonsecaheredia?mibextid=wwXIfr&mibextid=wwXIfr"
  const mailLink = "mailto:fonsecaeduar136@gmail.com"

  const [showDevContact, setShowDevContact] = useState(false)
  const devRef = useRef<HTMLDivElement | null>(null)

  // Close popover on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!devRef.current) return
      if (!devRef.current.contains(e.target as Node)) {
        setShowDevContact(false)
      }
    }
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [])

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
                <p className="font-semibold text-foreground">Lun → Sáb • 10:00 → 18:00</p>
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
                  {platform === "ios" ? (
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
                  Abrir en {platform === null ? "Maps" : platform === "ios" ? "Apple Maps" : platform === "android" ? "Google Maps" : "Maps"}
                </span>
              </Button>
            </div>

            {/* Small note removed iframe + copy button for compactness */}
          </div>

          {/* Footer / Créditos (single row spanning all columns) */}
          <div className="col-span-full mt-6 pt-4 border-t border-muted/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0" ref={devRef}>
                <div className="text-sm text-muted-foreground">Desarrollado por</div>

                {/* Developer name toggles small popover with WhatsApp number */}
                <button
                  onClick={() => setShowDevContact((s) => !s)}
                  aria-expanded={showDevContact}
                  className="font-medium text-foreground hover:text-foreground/90 underline-offset-2 hover:underline text-left"
                  title="Contactar al desarrollador"
                >
                  {devName}
                </button>

                {/* Popover: muestra número y link a chat */}
                {showDevContact && (
                  <div className="ml-3 mt-2 sm:mt-0 bg-background/90 dark:bg-background rounded-md shadow-lg border px-3 py-2 text-sm flex items-center gap-3">
                    <span className="text-muted-foreground">WhatsApp:</span>
                    <a
                      href={devWhatsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-foreground hover:text-foreground/90 underline"
                    >
                      {devWhatsDisplay}
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(devWhatsDisplay)
                        alert("Número copiado")
                      }}
                      className="ml-2 text-xs px-2 py-1 rounded bg-muted/10 hover:bg-muted/20"
                      aria-label="Copiar número del desarrollador"
                    >
                      Copiar
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor" aria-hidden>
                    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zM18.5 6a1 1 0 11-1 1 1 1 0 011-1z" />
                  </svg>
                  <span className="hidden sm:inline">Instagram</span>
                </a>

                {/* Facebook */}
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor" aria-hidden>
                    <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.3V12h2.3V9.8c0-2.3 1.37-3.6 3.47-3.6.99 0 2.03.18 2.03.18v2.24h-1.15c-1.13 0-1.48.7-1.48 1.42V12h2.52l-.4 2.9h-2.12v7A10 10 0 0022 12z"/>
                  </svg>
                  <span className="hidden sm:inline">Facebook</span>
                </a>

                {/* Email */}
                <a
                  href={mailLink}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor" aria-hidden>
                    <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v.2l-10 6.3-10-6.3V6zm0 2.7v7.3A2 2 0 004 18h16a2 2 0 002-2V8.7l-9.2 5.8a1 1 0 01-1.6 0L2 8.7z"/>
                  </svg>
                  <span className="hidden sm:inline">fonsecaeduar136@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Small copyright line */}
            <div className="mt-3 text-xs text-muted-foreground">
              © {new Date().getFullYear()} Dulces Sueños. Todos los derechos reservados.
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
