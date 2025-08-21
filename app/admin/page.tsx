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
import { Search, Plus, Trash2, Edit, ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"

interface Electrodomestico {
  id: number
  nombre: string
  marca: string
  categoria: string
  precio: number
  imagen: string
  disponible: boolean
}

export default function AdminPanel() {
  const { isAuthenticated, logout, loading } = useAuth()
  const router = useRouter()

  const [electrodomesticos, setElectrodomesticos] = useState<Electrodomestico[]>([
    {
      id: 1,
      nombre: "EcoWash Pro 8kg",
      marca: "Samsung",
      categoria: "Lavadora",
      precio: 599,
      imagen: "/placeholder-4g5p3.png",
      disponible: true,
    },
    {
      id: 2,
      nombre: "CoolFresh 300L",
      marca: "LG",
      categoria: "Refrigerador",
      precio: 899,
      imagen: "/modern-refrigerator.png",
      disponible: true,
    },
    {
      id: 3,
      nombre: "QuickHeat 25L",
      marca: "Whirlpool",
      categoria: "Microondas",
      precio: 149,
      imagen: "/placeholder-prs7q.png",
      disponible: false,
    },
  ])

  const [busqueda, setBusqueda] = useState("")
  const [nuevoElectrodomestico, setNuevoElectrodomestico] = useState({
    nombre: "",
    marca: "",
    categoria: "",
    precio: 0,
    imagen: "",
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

  const agregarElectrodomestico = () => {
    const id = Math.max(...electrodomesticos.map((e) => e.id), 0) + 1
    setElectrodomesticos([...electrodomesticos, { ...nuevoElectrodomestico, id }])
    setNuevoElectrodomestico({ nombre: "", marca: "", categoria: "", precio: 0, imagen: "", disponible: true })
    setDialogAbierto(false)
  }

  const editarElectrodomestico = () => {
    if (editandoId) {
      setElectrodomesticos(
        electrodomesticos.map((e) => (e.id === editandoId ? { ...nuevoElectrodomestico, id: editandoId } : e)),
      )
      setEditandoId(null)
      setNuevoElectrodomestico({ nombre: "", marca: "", categoria: "", precio: 0, imagen: "", disponible: true })
      setDialogAbierto(false)
    }
  }

  const eliminarElectrodomestico = (id: number) => {
    setElectrodomesticos(electrodomesticos.filter((e) => e.id !== id))
  }

  const iniciarEdicion = (electrodomestico: Electrodomestico) => {
    setNuevoElectrodomestico({
      nombre: electrodomestico.nombre,
      marca: electrodomestico.marca,
      categoria: electrodomestico.categoria,
      precio: electrodomestico.precio,
      imagen: electrodomestico.imagen,
      disponible: electrodomestico.disponible,
    })
    setEditandoId(electrodomestico.id)
    setDialogAbierto(true)
  }

  const toggleDisponibilidad = (id: number) => {
    setElectrodomesticos(electrodomesticos.map((e) => (e.id === id ? { ...e, disponible: !e.disponible } : e)))
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
            </div>
            {/* Logout button */}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 text-sm mt-1">Gestiona tu inventario de electrodomésticos</p>
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
                    imagen: "",
                    disponible: true,
                  })
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editandoId ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
                <DialogDescription className="text-gray-600">
                  {editandoId
                    ? "Modifica los datos del electrodoméstico."
                    : "Completa los datos para agregar un nuevo producto al catálogo."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                    onChange={(e) => setNuevoElectrodomestico({ ...nuevoElectrodomestico, categoria: e.target.value })}
                    placeholder="Ej: Lavadora, Refrigerador, Microondas"
                    className="border-gray-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="precio" className="text-gray-700">
                    Precio (€)
                  </Label>
                  <Input
                    id="precio"
                    type="number"
                    value={nuevoElectrodomestico.precio}
                    onChange={(e) =>
                      setNuevoElectrodomestico({ ...nuevoElectrodomestico, precio: Number(e.target.value) })
                    }
                    placeholder="599"
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
              </div>
              <DialogFooter>
                <Button
                  onClick={editandoId ? editarElectrodomestico : agregarElectrodomestico}
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
                      electrodomestico.disponible ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }
                  >
                    {electrodomestico.disponible ? "Disponible" : "Agotado"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-900">{electrodomestico.nombre}</CardTitle>
                <CardDescription className="text-gray-600">
                  {electrodomestico.marca} • {electrodomestico.categoria}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-xl font-semibold text-gray-900">€{electrodomestico.precio}</p>
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
                  variant={electrodomestico.disponible ? "secondary" : "default"}
                  size="sm"
                  onClick={() => toggleDisponibilidad(electrodomestico.id)}
                  className={`flex-1 ${
                    electrodomestico.disponible
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {electrodomestico.disponible ? "Marcar Agotado" : "Marcar Disponible"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => eliminarElectrodomestico(electrodomestico.id)}
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
