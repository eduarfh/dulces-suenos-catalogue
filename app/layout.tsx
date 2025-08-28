// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ProductsProvider } from "@/contexts/products-context"
import { ThemeProvider } from "@/components/theme-provider"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

const SITE_URL = "https://v0-electrodomesticoscatalogue.vercel.app/"
const OG_IMAGE =
  "https://yzjvywcplllhsqqcfsyb.supabase.co/storage/v1/object/public/Fotos%20Catalogo/Imagen%20de%20WhatsApp%202025-08-28%20a%20las%2001.31.16_e81b24b7.jpg"

export const metadata: Metadata = {
  title: "Catálogo de Electrodomésticos",
  description: "Date la oportunidad de mejorar tu estilo de vida con nuestros electrodomésticos de calidad.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Catálogo de Electrodomésticos",
    description: "Date la oportunidad de mejorar tu estilo de vida con nuestros electrodomésticos de calidad.",
    url: SITE_URL,
    siteName: "Catálogo de Electrodomésticos",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Catálogo de Electrodomésticos - Miniatura",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catálogo de Electrodomésticos",
    description: "Date la oportunidad de mejorar tu estilo de vida con nuestros electrodomésticos de calidad.",
    images: [OG_IMAGE],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <body className="font-mono">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ProductsProvider>{children}</ProductsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
