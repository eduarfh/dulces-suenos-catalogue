"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Settings, Eye, Wrench } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground font-sans">Catálogo de Lavadoras</h1>
          <p className="text-muted-foreground mt-2">Selecciona el tipo de acceso que necesitas</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-sans">Para Clientes</CardTitle>
              <CardDescription className="text-base">Explora nuestro catálogo de lavadoras disponibles</CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                <li>• Ver productos disponibles</li>
                <li>• Buscar por marca o modelo</li>
                <li>• Consultar precios y especificaciones</li>
                <li>• Solo visualización</li>
              </ul>
              <Link href="/catalogo">
                <Button size="lg" className="w-full font-sans">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Ver Catálogo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <Wrench className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-sans">Para Administración</CardTitle>
              <CardDescription className="text-base">Gestiona el inventario y productos del catálogo</CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <ul className="text-sm text-muted-foreground mb-6 space-y-2">
                <li>• Agregar nuevos productos</li>
                <li>• Editar información existente</li>
                <li>• Eliminar productos</li>
                <li>• Gestionar disponibilidad</li>
              </ul>
              <Link href="/admin">
                <Button size="lg" variant="destructive" className="w-full font-sans">
                  <Settings className="h-4 w-4 mr-2" />
                  Panel de Administración
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
