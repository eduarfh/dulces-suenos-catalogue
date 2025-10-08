//components/category-filter.tsx
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
    const colors: Record<string, string> = {
      Ropa: "bg-[#BEE4E7] hover:bg-[#BEE4E7]/80 text-gray-800 dark:text-gray-900",
      Juguetes: "bg-[#F49F51] hover:bg-[#F49F51]/80 text-gray-800 dark:text-gray-900",
      Alimentación: "bg-[#FFD4E5] hover:bg-[#FFD4E5]/80 text-gray-800 dark:text-gray-900",
      Higiene: "bg-[#95C7C3] hover:bg-[#95C7C3]/80 text-gray-800 dark:text-gray-900",
      Accesorios: "bg-[#F490B9] hover:bg-[#F490B9]/80 text-gray-800 dark:text-gray-900",
      Muebles: "bg-[#F7CCAD] hover:bg-[#F7CCAD]/80 text-gray-800 dark:text-gray-900",
    }
    return colors[category] || "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:text-gray-900"
  }

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max px-4 md:px-0 md:flex-wrap md:justify-center">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onSelectCategory(null)}
          className={selectedCategory === null ? "bg-[#95C7C3] hover:bg-[#95C7C3]/90 text-white" : ""}
        >
          Todos
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            onClick={() => onSelectCategory(category)}
            className={`${getCategoryColor(category)} border-2 ${
              selectedCategory === category ? "ring-2 ring-offset-2 ring-[#95C7C3]" : ""
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
