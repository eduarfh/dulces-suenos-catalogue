"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Edit, LogOut } from "lucide-react"
import { useProducts } from "@/contexts/products-context"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminPanel() {
  const { isAuthenticated, logout, loading } = useAuth()
  const router = useRouter()

  const {
    electrodomesticos,
    agregarElectrodomestico,
    editarElectrodomestico,
    eliminarElectrodomestico,
    toggleDisponibilidad,
  } = useProducts()

  const [busqueda, setBusqueda] = useState("")
  const [nuevoElectrodomestico, setNuevoElectrodomestico] = useState({
    nombre: "",
    marca: "",
    categoria: "",
    precio: 0,
    precioMinorista: 0,
    precioMayorista: 0,
    cantidadMinimaMayorista: 1,
    imagen: "",
    descripcion: "",
    disponible: true,
  })
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, loading, router])

  const electrodomesticosFiltrados = electrodomesticos.filter(
    (electrodomestico) =>
      electrodomestico.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      electrodomestico.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      electrodomestico.categoria.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const handleAgregarElectrodomestico = () => {
    agregarElectrodomestico(nuevoElectrodomestico)
    setNuevoElectrodomestico({
      nombre: "",
      marca: "",
      categoria: "",
      precio: 0,
      precioMinorista: 0,
      precioMayorista: 0,
      cantidadMinimaMayorista: 1,
      imagen: "",
      descripcion: "",
      disponible: true,
    })
    setDialogAbierto(false)
  }

  const handleEditarElectrodomestico = () => {
    if (editandoId) {
      editarElectrodomestico(editandoId, nuevoElectrodomestico)
      setEditandoId(null)
      setNuevoElectrodomestico({
        nombre: "",
        marca: "",
        categoria: "",
        precio: 0,
        precioMinorista: 0,
        precioMayorista: 0,
        cantidadMinimaMayorista: 1,
        imagen: "",
        descripcion: "",
        disponible: true,
      })
      setDialogAbierto(false)
    }
  }

  const handleEliminarElectrodomestico = (id: number) => {
    eliminarElectrodomestico(id)
  }

  const iniciarEdicion = (electrodomestico: any) => {
    setNuevoElectrodomestico({
      nombre: electrodomestico.nombre,
      marca: electrodomestico.marca,
      categoria: electrodomestico.categoria,
      precio: electrodomestico.precio,
      precioMinorista: electrodomestico.precioMinorista || electrodomestico.precio,
      precioMayorista: electrodomestico.precioMayorista || electrodomestico.precio,
      cantidadMinimaMayorista: electrodomestico.cantidadMinimaMayorista || 1,
      imagen: electrodomestico.imagen,
      descripcion: electrodomestico.descripcion || "",
      disponible: electrodomestico.disponible,
    })
    setEditandoId(electrodomestico.id)
    setDialogAbierto(true)
  }

  const handleToggleDisponibilidad = (id: number) => {
    toggleDisponibilidad(id)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Verificando autenticación...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">{/* Botón de volver eliminado */}</div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Panel de Administración</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestiona tu inventario de electrodomésticos</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Barra de búsqueda y botón agregar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, marca o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 border-gray-200 focus:border-gray-400"
            />
          </div>

          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditandoId(null)
                  setNuevoElectrodomestico({
                    nombre: "",
                    marca: "",
                    categoria: "",
                    precio: 0,
                    precioMinorista: 0,
                    precioMayorista: 0,
                    cantidadMinimaMayorista: 1,
                    imagen: "",
                    descripcion: "",
                    disponible: true,
                  })
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editandoId ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
                <DialogDescription className="text-gray-600">
                  {editandoId
                    ? "Modifica los datos del electrodoméstico."
                    : "Completa los datos para agregar un nuevo producto al catálogo."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid gap-2">
                  <Label htmlFor="nombre" className="text-gray-700">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    value={nuevoElectrodomestico.nombre}
                    onChange={(e) => setNuevoElectrodomestico({ ...nuevoElectrodomestico, nombre: e.target.value })}
                    placeholder="Ej: EcoWash Pro 8kg"
                    className="border-gray-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="marca" className="text-gray-700">
                    Marca
                  </Label>
                  <Input
                    id="marca"
                    value={nuevoElectrodomestico.marca}
                    onChange={(e) => setNuevoElectrodomestico({ ...nuevoElectrodomestico, marca: e.target.value })}
                    placeholder="Ej: Samsung"
                    className="border-gray-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoria" className="text-gray-700">
                    Categoría
                  </Label>
                  <Input
                    id="categoria"
                    value={nuevoElectrodomestico.categoria}
                    onChange={(e) => setNuevoElectrodomestico({ ...nuevoElectrodomestico, categoria: e.target.value})}
                    placeholder="Ej: Lavadora, Refrigerador, Microondas"
                    className="border-gray-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="precioMinorista" className="text-gray-700">
                    Precio Minorista ($)
                  </Label>
                  <Input
                    id="precioMinorista"
                    type="number"
                    value={nuevoElectrodomestico.precioMinorista}
                    onChange={(e) =>
                      setNuevoElectrodomestico({ ...nuevoElectrodomestico, precioMinorista: Number(e.target.value) })
                    }
                    placeholder="599"
                    className="border-gray-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="precioMayorista" className="text-gray-700">
                    Precio Mayorista ($)
                  </Label>
                  <Input
                    id="precioMayorista"
                    type="number"
                    value={nuevoElectrodomestico.precioMayorista}
                    onChange={(e) =>
                      setNuevoElectrodomestico({ ...nuevoElectrodomestico, precioMayorista: Number(e.target.value) })
                    }
                    placeholder="499"
                    className="border-gray-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cantidadMinimaMayorista" className="text-gray-700">
                    Cantidad Mínima Mayorista
                  </Label>
                  <Input
                    id="cantidadMinimaMayorista"
                    type="number"
                    value={nuevoElectrodomestico.cantidadMinimaMayorista}
                    onChange={(e) =>
                      setNuevoElectrodomestico({
                        ...nuevoElectrodomestico,
                        cantidadMinimaMayorista: Number(e.target.value),
                      })
                    }
                    placeholder="5"
                    className="border-gray-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imagen" className="text-gray-700">
                    URL de Imagen (opcional)
                  </Label>
                  <Input
                    id="imagen"
                    value={nuevoElectrodomestico.imagen}
                    onChange={(e) => setNuevoElectrodomestico({ ...nuevoElectrodomestico, imagen: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="border-gray-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descripcion" className="text-gray-700">
                    Descripción
                  </Label>
                  <Input
                    id="descripcion"
                    value={nuevoElectrodomestico.descripcion}
                    onChange={(e) =>
                      setNuevoElectrodomestico({ ...nuevoElectrodomestico, descripcion: e.target.value })
                    }
                    placeholder="Descripción detallada del producto"
                    className="border-gray-200"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={editandoId ? handleEditarElectrodomestico : handleAgregarElectrodomestico}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {editandoId ? "Guardar Cambios" : "Agregar Producto"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid de electrodomésticos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {electrodomesticosFiltrados.map((electrodomestico) => (
            <Card
              key={electrodomestico.id}
              className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video relative">
                <img
                  src={electrodomestico.imagen || "/placeholder.svg?height=200&width=300&query=appliance"}
                  alt={electrodomestico.nombre}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={electrodomestico.disponible ? "default" : "secondary"}
                    className={
                      electrodomestico.disponible
                        ? "bg-green-100 text-green-800"
                        : "bg-pink-100 text-red-600"
                    }
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
              <CardContent className="pb-2">
                <div className="space-y-1">
                  <p className="text-xl font-semibold text-foreground">
                    ${electrodomestico.precioMinorista || electrodomestico.precio}
                  </p>
                  <p className="text-lg font-medium text-green-600">
                    ${electrodomestico.precioMayorista || electrodomestico.precio}
                    <span className="text-sm text-gray-500 ml-1">
                      (min. {electrodomestico.cantidadMinimaMayorista || 1})
                    </span>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => iniciarEdicion(electrodomestico)}
                  className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleToggleDisponibilidad(electrodomestico.id)}
                  className={`flex-1 ${
                    electrodomestico.disponible
                      ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                      : "bg-green-100 text-green-800 hover:bg-green-300 border border-green-400"
                  }`}
                >
                  {electrodomestico.disponible ? "Marcar Agotado" : "Marcar Disponible"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleEliminarElectrodomestico(electrodomestico.id)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {electrodomesticosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
