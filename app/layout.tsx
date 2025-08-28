// app/layout.tsx
import type { ReactNode } from "react"
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

export const metadata: Metadata = {
  title: "Catálogo de Electrodomésticos",
  description: "Date la oportunidad de mejorar tu estilo de vida con nuestros electrodomésticos de calidad.",
  openGraph: {
    title: "Catálogo de Electrodomésticos",
    description: "Electrodomésticos con factura y 3 meses de garantía.",
    url: "https://v0-electrodomestics-catalogue.vercel.app/", // reemplaza por tu dominio
    siteName: "Catálogo de Electrodomésticos",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "https://yzjvywcplllhsqqcfsyb.supabase.co/storage/v1/object/public/Fotos%20Catalogo/Imagen%20de%20WhatsApp%202025-08-28%20a%20las%2001.31.16_e81b24b7.jpg",
        width: 1200,
        height: 630,
        alt: "Imagen promocional - Catálogo de Electrodomésticos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catálogo de Electrodomésticos",
    description: "Electrodomésticos con factura y 3 meses de garantía.",
    images: [
      "https://yzjvywcplllhsqqcfsyb.supabase.co/storage/v1/object/public/Fotos%20Catalogo/Imagen%20de%20WhatsApp%202025-08-28%20a%20las%2001.31.16_e81b24b7.jpg",
    ],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
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
