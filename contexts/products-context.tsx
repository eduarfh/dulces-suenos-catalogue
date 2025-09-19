//contexts/products-context.tsx
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Electrodomestico {
  id: number
  nombre: string
  marca: string
  precioMinorista: number
  precioMayorista: number
  cantidadMinimaMayorista: number
  imagenURL?: string
  categoria: string
  disponible: boolean
  descripcion: string
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
          // No llamar a guardarProductos que hace POST al mismo endpoint en forma inconsistente.
          localStorage.setItem("electrodomesticos", JSON.stringify(productosIniciales))
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
      // Evitamos POST ambiguo al endpoint /api/products que está diseñado para crear 1 producto.
      // Solo guardamos en localStorage aquí. Si quieres subir todo a la BD, crea un endpoint distinto.
      localStorage.setItem("electrodomesticos", JSON.stringify(productos))
    } catch (error) {
      console.error("Error guardando productos localmente:", error)
      localStorage.setItem("electrodomesticos", JSON.stringify(productos))
    }
  }

  const setElectrodomesticos = (productos: Electrodomestico[]) => {
    setElectrodomesticosState(productos)
    guardarProductos(productos)
  }

  // contexts/products-context.tsx -> en agregarElectrodomestico
  const agregarElectrodomestico = async (producto: Omit<Electrodomestico, "id">) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      const text = await response.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        console.error("Respuesta del servidor no es JSON:", text);
        throw new Error("Respuesta inválida del servidor");
      }

      if (!response.ok) {
        const msg = (data && (data.error || data.message)) || `HTTP ${response.status}`;
        throw new Error(`Error al agregar el producto: ${msg}`);
      }

      if (data === null) {
        throw new Error("Respuesta vacía del servidor");
      }

      // Buscar el nuevo producto en varias formas posibles
      let nuevoProducto: Electrodomestico | undefined;

      if (data.product) {
        nuevoProducto = Array.isArray(data.product) ? data.product[0] : data.product;
      } else if (data.products) {
        nuevoProducto = Array.isArray(data.products) ? data.products[0] : data.products;
      } else if (Array.isArray(data)) {
        nuevoProducto = data[0];
      } else if (data[0]) {
        nuevoProducto = data[0];
      } else if (typeof data === "object") {
        // fallback: si el objeto parece producto
        // ej. { id: ..., nombre: ... }
        if (data.id) nuevoProducto = data as Electrodomestico;
      }

      if (!nuevoProducto || !nuevoProducto.id) {
        console.error("Respuesta inválida al crear producto:", data);
        throw new Error("No se obtuvo el producto creado del servidor");
      }

      const nuevosProductos = [...electrodomesticos, nuevoProducto];
      setElectrodomesticos(nuevosProductos);
    } catch (error) {
      console.error("Error agregando producto:", error);
      // Aquí podrías re-lanzar para que el caller muestre el error,
      // o retornar un booleano para indicar fallo. Ahora solo lo logueamos.
    }
  };


  const editarElectrodomestico = async (id: number, producto: Partial<Electrodomestico>) => {
    try {
      // Llamada al backend
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...producto }),
      });

      const text = await response.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        console.error("Respuesta del servidor no es JSON:", text);
        throw new Error("Respuesta inválida del servidor");
      }

      if (!response.ok) {
        const msg = (data && (data.error || data.message)) || `HTTP ${response.status}`;
        throw new Error(msg);
      }

      // Interpretar posible formato de respuesta
      let updatedProduct: Electrodomestico | undefined;
      if (data?.product) {
        updatedProduct = Array.isArray(data.product) ? data.product[0] : data.product;
      } else if (Array.isArray(data)) {
        updatedProduct = data[0];
      } else if (data && data[0]) {
        updatedProduct = data[0];
      } else if (typeof data === "object" && data !== null) {
        updatedProduct = data as Electrodomestico;
      }

      if (updatedProduct && updatedProduct.id) {
        // Reemplazar el producto con la versión que venga del servidor
        const nuevosProductos = electrodomesticos.map((e) => (e.id === id ? { ...e, ...updatedProduct } : e));
        setElectrodomesticosState(nuevosProductos);
        guardarProductos(nuevosProductos);
        return;
      }

      // Fallback: actualización optimista local si la respuesta no trae el producto
      const nuevosProductos = electrodomesticos.map((e) => (e.id === id ? { ...e, ...producto } : e));
      setElectrodomesticosState(nuevosProductos);
      guardarProductos(nuevosProductos);
    } catch (error) {
      console.error("Error actualizando producto:", error);
      // Re-lanzar si quieres que el componente que llamó lo maneje
      throw error;
    }
  }


  const eliminarElectrodomestico = async (id: number) => {
    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Error al eliminar producto: ${text || response.status}`)
      }

      const nuevosProductos = electrodomesticos.filter((e) => e.id !== id)
      setElectrodomesticos(nuevosProductos)
    } catch (error) {
      console.error("Error eliminando producto:", error)
    }
  }

  const toggleDisponibilidad = async (id: number) => {
    const producto = electrodomesticos.find((e) => e.id === id)
    if (!producto) return

    const nuevoEstado = !producto.disponible

    try {
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, disponible: nuevoEstado }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Error al actualizar la disponibilidad: ${text || response.status}`)
      }

      const nuevosProductos = electrodomesticos.map((e) => (e.id === id ? { ...e, disponible: nuevoEstado } : e))
      setElectrodomesticos(nuevosProductos)
    } catch (error) {
      console.error("Error actualizando disponibilidad:", error)
    }
  }

  if (isLoading) {
    return (
      <ProductsContext.Provider
        value={{
          electrodomesticos: [],
          setElectrodomesticos: () => { },
          agregarElectrodomestico: () => { },
          editarElectrodomestico: () => { },
          eliminarElectrodomestico: () => { },
          toggleDisponibilidad: () => { },
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
