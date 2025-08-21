"use client"

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
import { Search, Plus, Trash2, Edit, ArrowLeft } from "lucide-react"
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

export default function AdminPanel() {
  const [lavadoras, setLavadoras] = useState<Lavadora[]>([
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
  const [nuevaLavadora, setNuevaLavadora] = useState({
    nombre: "",
    marca: "",
    capacidad: "",
    precio: 0,
    imagen: "",
    disponible: true,
  })
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState(false)

  const lavadorasFiltradas = lavadoras.filter(
    (lavadora) =>
      lavadora.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      lavadora.marca.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const agregarLavadora = () => {
    const id = Math.max(...lavadoras.map((l) => l.id), 0) + 1
    setLavadoras([...lavadoras, { ...nuevaLavadora, id }])
    setNuevaLavadora({ nombre: "", marca: "", capacidad: "", precio: 0, imagen: "", disponible: true })
    setDialogAbierto(false)
  }

  const editarLavadora = () => {
    if (editandoId) {
      setLavadoras(lavadoras.map((l) => (l.id === editandoId ? { ...nuevaLavadora, id: editandoId } : l)))
      setEditandoId(null)
      setNuevaLavadora({ nombre: "", marca: "", capacidad: "", precio: 0, imagen: "", disponible: true })
      setDialogAbierto(false)
    }
  }

  const eliminarLavadora = (id: number) => {
    setLavadoras(lavadoras.filter((l) => l.id !== id))
  }

  const iniciarEdicion = (lavadora: Lavadora) => {
    setNuevaLavadora({
      nombre: lavadora.nombre,
      marca: lavadora.marca,
      capacidad: lavadora.capacidad,
      precio: lavadora.precio,
      imagen: lavadora.imagen,
      disponible: lavadora.disponible,
    })
    setEditandoId(lavadora.id)
    setDialogAbierto(true)
  }

  const toggleDisponibilidad = (id: number) => {
    setLavadoras(lavadoras.map((l) => (l.id === id ? { ...l, disponible: !l.disponible } : l)))
  }

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
          <h1 className="text-3xl font-bold text-foreground font-sans">Panel de Administración</h1>
          <p className="text-muted-foreground mt-2">Gestiona tu inventario de lavadoras</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Barra de búsqueda y botón agregar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nombre o marca..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditandoId(null)
                  setNuevaLavadora({ nombre: "", marca: "", capacidad: "", precio: 0, imagen: "", disponible: true })
                }}
                className="font-sans"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Lavadora
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-sans">
                  {editandoId ? "Editar Lavadora" : "Agregar Nueva Lavadora"}
                </DialogTitle>
                <DialogDescription>
                  {editandoId
                    ? "Modifica los datos de la lavadora."
                    : "Completa los datos para agregar una nueva lavadora al catálogo."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={nuevaLavadora.nombre}
                    onChange={(e) => setNuevaLavadora({ ...nuevaLavadora, nombre: e.target.value })}
                    placeholder="Ej: EcoWash Pro 8kg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    value={nuevaLavadora.marca}
                    onChange={(e) => setNuevaLavadora({ ...nuevaLavadora, marca: e.target.value })}
                    placeholder="Ej: Samsung"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacidad">Capacidad</Label>
                  <Input
                    id="capacidad"
                    value={nuevaLavadora.capacidad}
                    onChange={(e) => setNuevaLavadora({ ...nuevaLavadora, capacidad: e.target.value })}
                    placeholder="Ej: 8 kg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="precio">Precio (€)</Label>
                  <Input
                    id="precio"
                    type="number"
                    value={nuevaLavadora.precio}
                    onChange={(e) => setNuevaLavadora({ ...nuevaLavadora, precio: Number(e.target.value) })}
                    placeholder="599"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imagen">URL de Imagen (opcional)</Label>
                  <Input
                    id="imagen"
                    value={nuevaLavadora.imagen}
                    onChange={(e) => setNuevaLavadora({ ...nuevaLavadora, imagen: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={editandoId ? editarLavadora : agregarLavadora} className="font-sans">
                  {editandoId ? "Guardar Cambios" : "Agregar Lavadora"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid de lavadoras */}
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
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => iniciarEdicion(lavadora)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant={lavadora.disponible ? "secondary" : "default"}
                  size="sm"
                  onClick={() => toggleDisponibilidad(lavadora.id)}
                  className="flex-1"
                >
                  {lavadora.disponible ? "Marcar Agotado" : "Marcar Disponible"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => eliminarLavadora(lavadora.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
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
