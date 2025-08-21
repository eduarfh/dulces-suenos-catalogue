"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Electrodomestico {
  id: number
  nombre: string
  marca: string
  precio: number
  imagen: string
  categoria: "lavadora" | "refrigerador" | "microondas"
  disponible: boolean
  descripcion?: string
  caracteristicas?: string[]
}

interface ProductsContextType {
  electrodomesticos: Electrodomestico[]
  setElectrodomesticos: (productos: Electrodomestico[]) => void
  agregarElectrodomestico: (producto: Omit<Electrodomestico, "id">) => void
  editarElectrodomestico: (id: number, producto: Partial<Electrodomestico>) => void
  eliminarElectrodomestico: (id: number) => void
  toggleDisponibilidad: (id: number) => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const productosIniciales: Electrodomestico[] = [
  {
    id: 1,
    nombre: "EcoWash Pro",
    marca: "Samsung",
    precio: 899,
    imagen: "/placeholder-b1p3f.png",
    categoria: "lavadora",
    disponible: true,
    descripcion: "Lavadora de carga frontal con tecnología EcoBubble",
    caracteristicas: ["15 kg de capacidad", "Eficiencia energética A+++", "Tecnología EcoBubble"],
  },
  {
    id: 2,
    nombre: "AquaClean Max",
    marca: "LG",
    precio: 1299,
    imagen: "/placeholder-9mb9b.png",
    categoria: "lavadora",
    disponible: true,
    descripcion: "Lavadora inteligente con conectividad WiFi",
    caracteristicas: ["18 kg de capacidad", "Control por app", "Motor Direct Drive"],
  },
  {
    id: 3,
    nombre: "PowerWash Elite",
    marca: "Whirlpool",
    precio: 749,
    imagen: "/white-whirlpool-washing-machine.png",
    categoria: "lavadora",
    disponible: false,
    descripcion: "Lavadora de alta eficiencia con múltiples programas",
    caracteristicas: ["12 kg de capacidad", "15 programas de lavado", "Sistema antivibración"],
  },
  {
    id: 4,
    nombre: "CoolMax Pro",
    marca: "Samsung",
    precio: 1599,
    imagen: "/stainless-steel-samsung-refrigerator.png",
    categoria: "refrigerador",
    disponible: true,
    descripcion: "Refrigerador de dos puertas con tecnología Twin Cooling",
    caracteristicas: ["500L de capacidad", "No Frost", "Dispensador de agua"],
  },
  {
    id: 5,
    nombre: "FreshKeep Ultra",
    marca: "LG",
    precio: 1899,
    imagen: "/black-lg-refrigerator-icemaker.png",
    categoria: "refrigerador",
    disponible: true,
    descripcion: "Refrigerador inteligente con pantalla táctil",
    caracteristicas: ["600L de capacidad", "Pantalla táctil", "Conectividad WiFi"],
  },
  {
    id: 6,
    nombre: "QuickHeat Pro",
    marca: "Panasonic",
    precio: 299,
    imagen: "/stainless-steel-panasonic-microwave.png",
    categoria: "microondas",
    disponible: true,
    descripcion: "Microondas con grill y función vapor",
    caracteristicas: ["25L de capacidad", "Función grill", "10 programas automáticos"],
  },
]

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [electrodomesticos, setElectrodomesticosState] = useState<Electrodomestico[]>([])

  useEffect(() => {
    const productosGuardados = localStorage.getItem("electrodomesticos")
    if (productosGuardados) {
      setElectrodomesticosState(JSON.parse(productosGuardados))
    } else {
      setElectrodomesticosState(productosIniciales)
      localStorage.setItem("electrodomesticos", JSON.stringify(productosIniciales))
    }
  }, [])

  const setElectrodomesticos = (productos: Electrodomestico[]) => {
    setElectrodomesticosState(productos)
    localStorage.setItem("electrodomesticos", JSON.stringify(productos))
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

  return (
    <ProductsContext.Provider
      value={{
        electrodomesticos,
        setElectrodomesticos,
        agregarElectrodomestico,
        editarElectrodomestico,
        eliminarElectrodomestico,
        toggleDisponibilidad,
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
