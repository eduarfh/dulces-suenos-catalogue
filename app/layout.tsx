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
const OG_IMAGE_PATH = "/logo.jpg" // imagen en /public/logo.jpg
const OG_IMAGE_ABSOLUTE = `${SITE_URL}${OG_IMAGE_PATH}`

export const metadata: Metadata = {
  title: "Dulces Sueños - Catálogo de Productos para Bebés",
  description: "Los mejores productos para el cuidado de tu bebé",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Dulces Sueños - Catálogo de Productos para Bebés",
    description: "Los mejores productos para el cuidado de tu bebé",
    url: SITE_URL,
    siteName: "Dulces Sueños",
    images: [
      {
        url: OG_IMAGE_ABSOLUTE,
        width: 1200,
        height: 630,
        alt: "Dulces Sueños - Logo",
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
    images: [OG_IMAGE_ABSOLUTE],
  },
  // Puedes añadir más metadatos si lo deseas
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
