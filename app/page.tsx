// app/page.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Settings } from "lucide-react"
import Link from "next/link"
import { useProducts } from "@/contexts/products-context"
import React, { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProductPreviewModal } from "@/components/product-preview-modal"
import type { Electrodomestico } from "@/contexts/products-context"
import ContactBubble from "@/components/contact-bubble"
import SortByName from "@/components/ui/sort-by-name"
import SearchBar from "@/components/ui/search-bar"
import SortByPrice from "@/components/ui/sort-by-price"
import { AnimatePresence, motion } from "framer-motion"

export default function HomePage() {
  const { electrodomesticos } = useProducts()
  const [busqueda, setBusqueda] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Electrodomestico | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  // estados para saber si hay algun sort activo
  const [nameSortActive, setNameSortActive] = useState(false)
  const [priceSortActive, setPriceSortActive] = useState(false)
  const anySortActive = nameSortActive || priceSortActive

  // estado para detectar si estamos en mobile (breakpoint sm = 640px)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640) // sm breakpoint
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // nuevo: si hay texto escrito en la búsqueda
  const hasSearchText = busqueda.trim().length > 0

  const electrodomesticosFiltrados = electrodomesticos.filter(
    (electrodomestico) =>
      electrodomestico.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      electrodomestico.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      electrodomestico.categoria.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const handleProductClick = (product: Electrodomestico) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleSearchFocusChange = (focused: boolean) => {
    if (!focused) {
      window.setTimeout(() => setSearchFocused(false), 160)
    } else {
      setSearchFocused(true)
    }
  }

  // clave que cambia cuando cambia búsqueda o sorts
  const animKey = `${busqueda}-${nameSortActive}-${priceSortActive}`;

  // cuando focused o anySortActive en móvil, usamos column layout
  // ahora también cuando hay texto en la búsqueda (hasSearchText)
  const wrapperClass = `flex flex-wrap ${isMobile && (searchFocused || anySortActive || hasSearchText) ? "flex-col items-stretch" : "flex-row items-center"} gap-3 sm:flex-row`

  // sortsClass: en mobile, si estamos en modo "enlarged" o hay sort activo, que ocupen w-full y se centren
  const sortsClass = `flex items-center gap-2 ${isMobile ? (searchFocused || anySortActive || hasSearchText ? "w-full justify-center" : "flex-none") : (anySortActive ? "w-auto justify-end" : "flex-none")}`

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-foreground">Electrodomésticos</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Todos los productos vienen con factura y 3 meses de garantía
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/admin/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className={wrapperClass}>
            <div className="flex-1 min-w-0 w-full">
              <SearchBar
                id="site-search"
                value={busqueda}
                onChange={(v) => setBusqueda(v)}
                placeholder="Buscar productos"
                onFocusChange={handleSearchFocusChange}
                // ahora ampliamos también cuando hay texto en la búsqueda en móvil
                enlarged={isMobile && (searchFocused || anySortActive || hasSearchText)}
                // permitimos expandirse por foco únicamente en mobile
                expandOnFocus={isMobile}
              />

            </div>

            <div className={sortsClass}>
              <div className={`flex items-center gap-2`}>
                <SortByName onActiveChange={(active) => setNameSortActive(active)} />
                <SortByPrice onActiveChange={(active) => setPriceSortActive(active)} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="sync">
            {electrodomesticosFiltrados.map((electrodomestico) => (
              <motion.div
                key={electrodomestico.id + animKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Card
                  className="border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleProductClick(electrodomestico)}
                >
                  <div className="aspect-square relative bg-gray-50">
                    <img
                      src={electrodomestico.imagenURL || "/placeholder.svg"}
                      alt={electrodomestico.nombre}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={electrodomestico.disponible ? "default" : "secondary"}
                        className={`flex-1 ${electrodomestico.disponible
                          ? "bg-green-100 text-green-800 hover:bg-green-300 border border-green-400"
                          : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          }`}
                      >
                        {electrodomestico.disponible ? "Disponible" : "Agotado"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-foreground">{electrodomestico.nombre}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {electrodomestico.marca} • {electrodomestico.categoria}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      <p className="text-xl font-semibold text-foreground">
                        ${electrodomestico.precioMinorista}
                      </p>
                      <p className="text-lg font-medium text-green-600">
                        ${electrodomestico.precioMayorista}
                        <span className="text-sm text-muted-foreground ml-1">
                          (mínimo {electrodomestico.cantidadMinimaMayorista || 0} unidades)
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>


        {electrodomesticosFiltrados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No se encontraron productos 😪</p>
          </div>
        )}
      </div>

      <ProductPreviewModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Burbuja de contacto */}
      <ContactBubble />
    </div>
  )
}
