"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useProducts } from "@/contexts/products-context"
import { useState } from "react"

interface Electrodomestico {
  id: number
  nombre: string
  marca: string
  categoria: string
  precio: number
  imagen: string
  disponible: boolean
}

export default function CatalogoPublico() {
  const { electrodomesticos } = useProducts()
  const [busqueda, setBusqueda] = useState("")

  const electrodomesticosFiltrados = electrodomesticos.filter(
    (electrodomestico) =>
      electrodomestico.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      electrodomestico.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      electrodomestico.categoria.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-medium text-gray-900">Electrodomésticos</h1>
          <p className="text-gray-500 text-sm mt-1">Productos disponibles</p>
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
            <Card key={electrodomestico.id} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square relative bg-gray-50">
                <img
                  src={electrodomestico.imagen || "/placeholder.svg"}
                  alt={electrodomestico.nombre}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={electrodomestico.disponible ? "default" : "secondary"}
                    className={
                      electrodomestico.disponible
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-600"
                    }
                  >
                    {electrodomestico.disponible ? "Disponible" : "Agotado"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-900">{electrodomestico.nombre}</CardTitle>
                <CardDescription className="text-gray-500">
                  {electrodomestico.marca} • {electrodomestico.categoria}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xl font-semibold text-gray-900">€{electrodomestico.precio}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {electrodomesticosFiltrados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No se encontraron productos.</p>
          </div>
        )}
      </div>
    </div>
  )
}
