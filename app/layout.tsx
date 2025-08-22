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

export const metadata: Metadata = {
  title: "Catálogo de Electrodomésticos",
  description: "Date la oportunidad de mejorar tu estilo de vida con nuestros electrodomésticos de calidad.",
  generator: "v0.app",
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
