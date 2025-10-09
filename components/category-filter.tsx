// components/category-filter.tsx
"use client"

import { useMemo } from "react"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  products: Product[] // Added products prop to generate categories dynamically
}

export function CategoryFilter({ selectedCategory, onSelectCategory, products }: CategoryFilterProps) {
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)))
    return uniqueCategories.sort()
  }, [products])

  const getCategoryColor = (category: string) => {
    const commonDarkNeutral = "dark:bg-transparent dark:text-muted-foreground dark:border-[color:var(--color-border)]"
    const colors: Record<string, string> = {
      Ropa: `bg-[#BEE4E7] hover:bg-[#BEE4E7]/80 text-gray-800 ${commonDarkNeutral}`,
      Juguetes: `bg-[#F49F51] hover:bg-[#F49F51]/80 text-gray-800 ${commonDarkNeutral}`,
      Alimentación: `bg-[#FFD4E5] hover:bg-[#FFD4E5]/80 text-gray-800 ${commonDarkNeutral}`,
      Higiene: `bg-[#95C7C3] hover:bg-[#95C7C3]/80 text-gray-800 ${commonDarkNeutral}`,
      Accesorios: `bg-[#F490B9] hover:bg-[#F490B9]/80 text-gray-800 ${commonDarkNeutral}`,
      Muebles: `bg-[#F7CCAD] hover:bg-[#F7CCAD]/80 text-gray-800 ${commonDarkNeutral}`,
    }
    return colors[category] || `bg-gray-200 hover:bg-gray-300 text-gray-800 ${commonDarkNeutral}`
  }

  // clases aplicadas cuando un botón (cualquiera) está seleccionado en dark mode:
  // usamos el mismo fondo que "Todos" (verde-azulado #95C7C3) y texto blanco
  const darkSelected = "dark:bg-[#95C7C3] dark:text-white"

  return (
    <div className="w-full overflow-x-auto pb-2 pt-1">
      <div className="flex gap-2 min-w-max px-4 md:px-0 md:flex-wrap md:justify-center">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onSelectCategory(null)}
          className={
            selectedCategory === null
              ? // "Todos" seleccionado: mismo look en light; en dark también usa bg #95C7C3
                "bg-[#95C7C3] hover:bg-[#95C7C3]/90 text-white shadow-sm ring-1 ring-offset-1 ring-[#95C7C3]/40 dark:bg-[#95C7C3] dark:text-white rounded-lg px-4 py-2"
              : // "Todos" no seleccionado
                "bg-transparent outline outline-[color:var(--color-border)] dark:outline-[color:var(--color-border)] text-muted-foreground rounded-lg px-4 py-2"
          }
        >
          Todos
        </Button>

        {categories.map((category) => {
          const isSelected = selectedCategory === category
          const base = getCategoryColor(category)

          return (
            <Button
              key={category}
              variant="outline"
              onClick={() => onSelectCategory(category)}
              className={
                // Mantén color por categoría en light (base),
                // si está seleccionado se agrega ring/shadow y forzamos el fondo en dark al mismo que "Todos"
                `${base} outline-2 rounded-lg px-4 py-2  duration-150 ${
                  isSelected
                    ? `ring-2 ring-offset-2 ring-[#95C7C3] shadow-lg text-gray-800 ${darkSelected}`
                    : "opacity-95 md:hover:scale-[1.02]"
                }`
              }
            >
              {category}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
