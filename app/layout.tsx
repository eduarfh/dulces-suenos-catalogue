// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ProductsProvider } from "@/contexts/products-context"
import { ThemeProvider } from "@/components/theme-provider"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-space-grotesk" })
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" })


const SITE_URL = "https://v0-electrodomesticoscatalogue.vercel.app/"
const OG_IMAGE =
  "https://yzjvywcplllhsqqcfsyb.supabase.co/storage/v1/object/public/Fotos%20Catalogo/Presentation%20Image.jpg"

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get("theme")?.value // 'light' | 'dark' | undefined

  // Forzamos la clase del html para que SSR y cliente coincidan
  const htmlThemeClass = themeCookie === "dark" ? "dark" : themeCookie === "light" ? "light" : ""

  // También inyectamos inline style color-scheme en el servidor para evitar mismatch con la prop CSS
  const colorSchemeStyle = themeCookie === "dark" ? { colorScheme: "dark" } : themeCookie === "light" ? { colorScheme: "light" } : undefined

  // Default theme que pasamos al client; si hay cookie, la fijamos y deshabilitamos enableSystem
  const defaultTheme = themeCookie === "dark" || themeCookie === "light" ? themeCookie : "system"
  const enableSystem = themeCookie ? false : true

  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased ${htmlThemeClass}`} style={colorSchemeStyle}>
      <body className="font-mono">
        <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem={enableSystem} disableTransitionOnChange>
          <AuthProvider>
            <ProductsProvider>{children}</ProductsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
