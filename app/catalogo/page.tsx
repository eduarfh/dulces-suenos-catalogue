"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Lavadora {
  id: number
  nombre: string
  marca: string
  capacidad: string
  precio: number
  imagen: string
  disponible: boolean
}

export default function CatalogoPublico() {
  const [lavadoras] = useState<Lavadora[]>([
    {
      id: 1,
      nombre: "EcoWash Pro 8kg",
      marca: "Samsung",
      capacidad: "8 kg",
      precio: 599,
      imagen: "/placeholder-4g5p3.png",
      disponible: true,
    },
    {
      id: 2,
      nombre: "TurboClean Max",
      marca: "LG",
      capacidad: "10 kg",
      precio: 749,
      imagen: "/silver-front-load-washer.png",
      disponible: true,
    },
    {
      id: 3,
      nombre: "QuickWash 6kg",
      marca: "Whirlpool",
      capacidad: "6 kg",
      precio: 449,
      imagen: "/compact-white-washing-machine.png",
      disponible: false,
    },
  ])

  const [busqueda, setBusqueda] = useState("")

  const lavadorasFiltradas = lavadoras.filter(
    (lavadora) =>
      lavadora.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      lavadora.marca.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground font-sans">Catálogo de Lavadoras</h1>
          <p className="text-muted-foreground mt-2">Explora nuestros productos disponibles</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre o marca..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lavadorasFiltradas.map((lavadora) => (
            <Card key={lavadora.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={lavadora.imagen || "/placeholder.svg?height=200&width=300&query=washing machine"}
                  alt={lavadora.nombre}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={lavadora.disponible ? "default" : "secondary"}>
                    {lavadora.disponible ? "Disponible" : "Agotado"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="font-sans">{lavadora.nombre}</CardTitle>
                <CardDescription>
                  {lavadora.marca} • {lavadora.capacidad}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary font-sans">€{lavadora.precio}</p>
                {lavadora.disponible && (
                  <p className="text-sm text-muted-foreground mt-2">Contacta con nosotros para más información</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {lavadorasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No se encontraron lavadoras que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
