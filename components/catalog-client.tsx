"use client"
//components/catalog-client.tsx
import { useState, useMemo } from "react"
import type { Product } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { CategoryFilter } from "@/components/category-filter"
import { SearchBar } from "@/components/search-bar"

interface CatalogClientProps {
  products: Product[]
}

export function CatalogClient({ products }: CatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    return filtered
  }, [products, searchQuery, selectedCategory])

  // Group products by category for mobile view
  const productsByCategory = useMemo(() => {
    return filteredProducts.reduce(
      (acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = []
        }
        acc[product.category].push(product)
        return acc
      },
      {} as Record<string, Product[]>,
    )
  }, [filteredProducts])

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Catálogo de Productos</h2>
        <p className="text-muted-foreground">Los mejores productos para el cuidado de tu bebé</p>
      </div>

      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="mb-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          products={products}
        />
      </div>

      {/* Desktop View - 4 columns */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile/Tablet View - 2 columns */}
      <div className="lg:hidden grid grid-cols-2 gap-3 md:gap-4">
        {selectedCategory ? (
          <>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </>
        ) : (
          <>
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <div key={category} className="col-span-2">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 px-1">{category}</h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} compact />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No se encontraron productos</p>
        </div>
      )}
    </main>
  )
}
