// app/page.tsx  (o donde tengas tu HomePage)
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Settings } from "lucide-react"
import Link from "next/link"
import { useProducts } from "@/contexts/products-context"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProductPreviewModal } from "@/components/product-preview-modal"
import type { Electrodomestico } from "@/contexts/products-context"
import ContactBubble from "@/components/contact-bubble"

export default function HomePage() {
  const { electrodomesticos } = useProducts()
  const [busqueda, setBusqueda] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Electrodomestico | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 border-gray-200 focus:border-gray-300 focus:ring-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {electrodomesticosFiltrados.map((electrodomestico) => (
            <Card
              key={electrodomestico.id}
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
          ))}
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
