// app/admin/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Plus, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import FiltersBar from "@/components/shared/filtersBar"
import ProductGrid from "@/components/shared/productGrid"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProducts } from "@/contexts/products-context"
import { Badge } from "@/components/ui/badge"
import type { Electrodomestico } from "@/contexts/products-context"

type NuevoElectrodomesticoState = {
  nombre: string
  marca: string
  categoria: string
  precio?: number | string
  precioMinorista?: number | string
  precioMayorista?: number | string
  cantidadMinimaMayorista?: number | string
  imagen?: string
  descripcion?: string
  disponible?: boolean
}

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [nuevoElectrodomestico, setNuevoElectrodomestico] = useState<NuevoElectrodomesticoState>({
    nombre: "",
    marca: "",
    categoria: "",
    precio: 0,
    precioMinorista: 0,
    precioMayorista: 0,
    cantidadMinimaMayorista: 0,
    imagen: "",
    descripcion: "",
    disponible: true,
  })
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState(false)

  // filtros
  const [availableOnly, setAvailableOnly] = useState(true)
  const [nameSortActive, setNameSortActive] = useState(false)
  const [priceSortActive, setPriceSortActive] = useState(false)
  const [categorySelected, setCategorySelected] = useState<string | null>(null)
  const [brandSelected, setBrandSelected] = useState<string | null>(null)

  const [isMobile, setIsMobile] = useState<boolean>(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, loading, router])

  const electrodomesticosFiltrados = electrodomesticos
    .filter((e) => {
      if (availableOnly && !e.disponible) return false
      if (categorySelected && e.categoria !== categorySelected) return false
      if (brandSelected && e.marca !== brandSelected) return false
      const q = busqueda.toLowerCase().trim()
      if (!q) return true
      return (
        e.nombre.toLowerCase().includes(q) ||
        e.marca.toLowerCase().includes(q) ||
        e.categoria.toLowerCase().includes(q)
      )
    })

  const iniciarEdicion = (electrodomestico: any) => {
    setNuevoElectrodomestico({
      nombre: electrodomestico.nombre ?? "",
      marca: electrodomestico.marca ?? "",
      categoria: electrodomestico.categoria ?? "",
      precio: electrodomestico.precio ?? 0,
      imagen: electrodomestico.imagenURL || electrodomestico.imagen || "",
      precioMinorista: electrodomestico.precioMinorista ?? 0,
      precioMayorista: electrodomestico.precioMayorista ?? 0,
      cantidadMinimaMayorista: electrodomestico.cantidadMinimaMayorista ?? 0,
      descripcion: electrodomestico.descripcion || "",
      disponible: electrodomestico.disponible ?? true,
    })
    setEditandoId(electrodomestico.id)
    setDialogAbierto(true)
  }

  const handleAgregarElectrodomestico = async () => {
    try {
      setIsSubmitting(true)
      const payload = {
        ...nuevoElectrodomestico,
        precioMinorista:
          nuevoElectrodomestico.precioMinorista === "" || nuevoElectrodomestico.precioMinorista === undefined
            ? 0
            : Number(nuevoElectrodomestico.precioMinorista),
        precioMayorista:
          nuevoElectrodomestico.precioMayorista === "" || nuevoElectrodomestico.precioMayorista === undefined
            ? 0
            : Number(nuevoElectrodomestico.precioMayorista),
        cantidadMinimaMayorista:
          nuevoElectrodomestico.cantidadMinimaMayorista === "" ||
            nuevoElectrodomestico.cantidadMinimaMayorista === undefined
            ? 0
            : Number(nuevoElectrodomestico.cantidadMinimaMayorista),
        disponible: nuevoElectrodomestico.disponible ?? true,
      } as any

      await agregarElectrodomestico(payload)
      setNuevoElectrodomestico({
        nombre: "",
        marca: "",
        categoria: "",
        precio: 0,
        precioMinorista: 0,
        precioMayorista: 0,
        cantidadMinimaMayorista: 0,
        imagen: "",
        descripcion: "",
        disponible: true,
      })
      setDialogAbierto(false)
      alert("Producto agregado correctamente")
    } catch (err) {
      console.error(err)
      alert("Error al agregar producto")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditarElectrodomestico = async () => {
    if (editandoId === null) return
    try {
      setIsSubmitting(true)
      const payload = {
        ...nuevoElectrodomestico,
        precioMinorista:
          nuevoElectrodomestico.precioMinorista === "" || nuevoElectrodomestico.precioMinorista === undefined
            ? 0
            : Number(nuevoElectrodomestico.precioMinorista),
        precioMayorista:
          nuevoElectrodomestico.precioMayorista === "" || nuevoElectrodomestico.precioMayorista === undefined
            ? 0
            : Number(nuevoElectrodomestico.precioMayorista),
        cantidadMinimaMayorista:
          nuevoElectrodomestico.cantidadMinimaMayorista === "" ||
            nuevoElectrodomestico.cantidadMinimaMayorista === undefined
            ? 0
            : Number(nuevoElectrodomestico.cantidadMinimaMayorista),
        disponible: nuevoElectrodomestico.disponible ?? true,
      } as any

      await editarElectrodomestico(editandoId, payload)
      setEditandoId(null)
      setDialogAbierto(false)
      alert("Producto actualizado correctamente")
    } catch (err) {
      console.error("Error guardando cambios:", err)
      alert("No se pudo actualizar el producto: " + (err instanceof Error ? err.message : "error desconocido"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEliminarElectrodomestico = (id: number) => {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return
    eliminarElectrodomestico(id)
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

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Panel de Administración</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <FiltersBar
          id="admin-search"
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre, marca o categoría..."
          onFocusChange={() => { }}
          enlarged={true}
          expandOnFocus={true}
          availableOnly={availableOnly}
          setAvailableOnly={setAvailableOnly}
          onNameActiveChange={(a) => setNameSortActive(a)}
          onPriceActiveChange={(a) => setPriceSortActive(a)}
          isMobile={isMobile}
          showAddButton={true}
          onAddClick={() => {
            setEditandoId(null)
            setNuevoElectrodomestico({
              nombre: "",
              marca: "",
              categoria: "",
              precio: 0,
              precioMinorista: 0,
              precioMayorista: 0,
              cantidadMinimaMayorista: 0,
              imagen: "",
              descripcion: "",
              disponible: true,
            })
            setDialogAbierto(true)
          }}
          brandSelected={brandSelected}
          setBrand={setBrandSelected}
        />

        <ProductGrid
          items={electrodomesticosFiltrados}
          admin={true}
          onEdit={(p) => iniciarEdicion(p)}
          onToggleDisponibilidad={(id) => handleToggleDisponibilidad(id)}
          onDelete={(id) => handleEliminarElectrodomestico(id)}
        />

        {electrodomesticosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        )}

        {/* Dialog (agregar/editar) */}
        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogContent className="sm:max-w-[640px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editandoId ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
              <DialogDescription className="text-gray-600">
                {editandoId ? "Modifica los datos del electrodoméstico." : "Completa los datos para agregar un nuevo producto al catálogo."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Campos (idénticos a tu versión previa) */}
              <div className="grid gap-2">
                <Label htmlFor="nombre" className="text-gray-700">Nombre</Label>
                <Input id="nombre" value={nuevoElectrodomestico.nombre} onChange={(e) => setNuevoElectrodomestico({ ...nuevoElectrodomestico, nombre: e.target.value })} placeholder="Ej: EcoWash Pro 8kg" className="border-gray-200" />
              </div>

              <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="marca" className="text-gray-700">Marca</Label>
                  <Input id="marca" value={nuevoElectrodomestico.marca} onChange={(e) => setNuevoElectrodomestico({ ...nuevoElectrodomestico, marca: e.target.value })} placeholder="Ej: Samsung" className="border-gray-200" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoria" className="text-gray-700">Categoría</Label>
                  <Input id="categoria" value={nuevoElectrodomestico.categoria} onChange={(e) => setNuevoElectrodomestico({ ...nuevoElectrodomestico, categoria: e.target.value })} placeholder="Ej: Lavadora" className="border-gray-200" />
                </div>
              </div>

              {/* Resto de campos: precios, cantidad, imagen, descripcion, disponible */}
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="precioMinorista" className="text-gray-700">Precio Minorista ($)</Label>
                  <Input id="precioMinorista" type="text" inputMode="decimal" pattern="[0-9]*([.,][0-9]+)?" value={String(nuevoElectrodomestico.precioMinorista ?? "")} onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d.,]/g, "")
                    const normalized = raw.replace(",", ".")
                    setNuevoElectrodomestico({ ...nuevoElectrodomestico, precioMinorista: normalized === "" ? "" : Number(normalized) } as any)
                  }} placeholder="599" className="border-gray-200" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="precioMayorista" className="text-gray-700">Precio Mayorista ($)</Label>
                  <Input id="precioMayorista" type="text" inputMode="decimal" pattern="[0-9]*([.,][0-9]+)?" value={String(nuevoElectrodomestico.precioMayorista ?? "")} onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d.,]/g, "")
                    const normalized = raw.replace(",", ".")
                    setNuevoElectrodomestico({ ...nuevoElectrodomestico, precioMayorista: normalized === "" ? "" : Number(normalized) } as any)
                  }} placeholder="499" className="border-gray-200" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cantidadMinimaMayorista" className="text-gray-700">Cantidad Mínima Mayorista</Label>
                <Input id="cantidadMinimaMayorista" type="text" inputMode="numeric" pattern="\d*" value={String(nuevoElectrodomestico.cantidadMinimaMayorista ?? "")} onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "")
                  setNuevoElectrodomestico({ ...nuevoElectrodomestico, cantidadMinimaMayorista: digits === "" ? "" : Number(digits) } as any)
                }} placeholder="5" className="border-gray-200" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imagen" className="text-gray-700">URL de Imagen (opcional)</Label>
                <Input id="imagen" value={nuevoElectrodomestico.imagen} onChange={(e) => setNuevoElectrodomestico({ ...nuevoElectrodomestico, imagen: e.target.value })} placeholder="https://ejemplo.com/imagen.jpg" className="border-gray-200" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="descripcion" className="text-gray-700">Descripción</Label>
                <Input id="descripcion" value={nuevoElectrodomestico.descripcion} onChange={(e) => setNuevoElectrodomestico({ ...nuevoElectrodomestico, descripcion: e.target.value })} placeholder="Descripción detallada del producto" className="border-gray-200" />
              </div>

              <div className="flex items-center gap-3 mt-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={!!nuevoElectrodomestico.disponible} onChange={(e) => setNuevoElectrodomestico({ ...nuevoElectrodomestico, disponible: e.target.checked })} className="form-checkbox h-4 w-4 text-gray-600" />
                  <span className="ml-2 text-gray-700">Disponible</span>
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={editandoId ? handleEditarElectrodomestico : handleAgregarElectrodomestico} className="h-8 px-3 rounded-md text-muted-foreground text-white" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : editandoId ? "Guardar Cambios" : "Agregar Producto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
