"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Electrodomestico {
  id: number
  nombre: string
  marca: string
  precio: number // Mantenemos para compatibilidad
  precioMinorista: number
  precioMayorista: number
  cantidadMinimaMayorista: number
  imagen: string
  categoria: "lavadora" | "refrigerador" | "microondas"
  disponible: boolean
  descripcion: string
  caracteristicas?: string[]
}

interface ProductsContextType {
  electrodomesticos: Electrodomestico[]
  setElectrodomesticos: (productos: Electrodomestico[]) => void
  agregarElectrodomestico: (producto: Omit<Electrodomestico, "id">) => void
  editarElectrodomestico: (id: number, producto: Partial<Electrodomestico>) => void
  eliminarElectrodomestico: (id: number) => void
  toggleDisponibilidad: (id: number) => void
  isLoading: boolean
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const productosIniciales: Electrodomestico[] = []

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [electrodomesticos, setElectrodomesticosState] = useState<Electrodomestico[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()

        if (data.products) {
          setElectrodomesticosState(data.products)
        } else {
          setElectrodomesticosState(productosIniciales)
          await guardarProductos(productosIniciales)
        }
      } catch (error) {
        console.error("Error cargando productos:", error)
        const productosGuardados = localStorage.getItem("electrodomesticos")
        if (productosGuardados) {
          setElectrodomesticosState(JSON.parse(productosGuardados))
        } else {
          setElectrodomesticosState(productosIniciales)
        }
      } finally {
        setIsLoading(false)
      }
    }

    cargarProductos()
  }, [])

  const guardarProductos = async (productos: Electrodomestico[]) => {
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: productos }),
      })
      localStorage.setItem("electrodomesticos", JSON.stringify(productos))
    } catch (error) {
      console.error("Error guardando productos:", error)
      localStorage.setItem("electrodomesticos", JSON.stringify(productos))
    }
  }

  const setElectrodomesticos = (productos: Electrodomestico[]) => {
    setElectrodomesticosState(productos)
    guardarProductos(productos)
  }

  const agregarElectrodomestico = (producto: Omit<Electrodomestico, "id">) => {
    const nuevoId = Math.max(...electrodomesticos.map((e) => e.id), 0) + 1
    const nuevoProducto = { ...producto, id: nuevoId }
    const nuevosProductos = [...electrodomesticos, nuevoProducto]
    setElectrodomesticos(nuevosProductos)
  }

  const editarElectrodomestico = (id: number, producto: Partial<Electrodomestico>) => {
    const nuevosProductos = electrodomesticos.map((e) => (e.id === id ? { ...e, ...producto } : e))
    setElectrodomesticos(nuevosProductos)
  }

  const eliminarElectrodomestico = (id: number) => {
    const nuevosProductos = electrodomesticos.filter((e) => e.id !== id)
    setElectrodomesticos(nuevosProductos)
  }

  const toggleDisponibilidad = (id: number) => {
    const nuevosProductos = electrodomesticos.map((e) => (e.id === id ? { ...e, disponible: !e.disponible } : e))
    setElectrodomesticos(nuevosProductos)
  }

  if (isLoading) {
    return (
      <ProductsContext.Provider
        value={{
          electrodomesticos: [],
          setElectrodomesticos: () => {},
          agregarElectrodomestico: () => {},
          editarElectrodomestico: () => {},
          eliminarElectrodomestico: () => {},
          toggleDisponibilidad: () => {},
          isLoading: true,
        }}
      >
        {children}
      </ProductsContext.Provider>
    )
  }

  return (
    <ProductsContext.Provider
      value={{
        electrodomesticos,
        setElectrodomesticos,
        agregarElectrodomestico,
        editarElectrodomestico,
        eliminarElectrodomestico,
        toggleDisponibilidad,
        isLoading: false,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
