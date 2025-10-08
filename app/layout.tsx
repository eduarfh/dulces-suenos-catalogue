// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

const SITE_URL = "https://sweet-dreams-catalogue.vercel.app"

// Imagen que quieres que aparezca como miniatura cuando se comparta el catálogo (OpenGraph)
const SHARED_OG_IMAGE =
  "https://bypjbkhezrokhksjxfri.supabase.co/storage/v1/object/public/catalogo/logo.jpg"

// Imagen que quieres usar como favicon (la versión recortada)
const FAVICON_URL =
  "https://bypjbkhezrokhksjxfri.supabase.co/storage/v1/object/public/catalogo/logo%20recortado.jpg"

export const metadata: Metadata = {
  title: "Dulces Sueños - Catálogo de Productos para Bebés",
  description: "Los mejores productos para el cuidado de tu bebé",
  metadataBase: new URL(SITE_URL),
  // favicon / icons (usa la imagen recortada como favicon)
  icons: {
    icon: FAVICON_URL,
    shortcut: FAVICON_URL,
    apple: FAVICON_URL,
  },
  openGraph: {
    title: "Dulces Sueños - Catálogo de Productos para Bebés",
    description: "Los mejores productos para el cuidado de tu bebé",
    url: SITE_URL,
    siteName: "Dulces Sueños",
    images: [
      {
        url: SHARED_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Dulces Sueños - Miniatura del catálogo",
        type: "image/jpeg",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dulces Sueños - Catálogo de Productos para Bebés",
    description: "Los mejores productos para el cuidado de tu bebé",
    images: [SHARED_OG_IMAGE],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
