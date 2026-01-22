"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { CategoryFilter } from "@/components/category-filter"
import { SearchBar } from "@/components/search-bar"
import AvailabilityFilter from "./availability-filter."

interface CatalogClientProps {
  products: Product[]
}

type ListingState = {
  filters?: {
    category?: string | null
    q?: string | null
    available?: boolean | null
  }
  scrollY?: number
}

/**
 * CatalogClient
 * - restaura filtros + scroll desde history.state / sessionStorage
 * - guarda estado antes de navegar
 * - evita nested <a> usando wrappers no-anchor
 * - mantiene navegación sin animación (pero restaura scroll al volver)
 */

export function CatalogClient({ products }: CatalogClientProps) {
  const router = useRouter()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [availableOnly, setAvailableOnly] = useState<boolean>(false)

  const rafRef = useRef<number | null>(null)
  const isAnimatingRef = useRef(false)

  // easing (solo para restaurar scroll)
  const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t)

  // Helper: animate from current scroll to targetY over duration (ms)
  function animateScrollTo(targetY: number, duration = 350) {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true

    const startY = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const boundedTarget = Math.min(Math.max(0, Math.round(targetY)), Math.max(0, Math.round(maxScroll)))
    const startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / duration)
      const eased = easeOutQuad(t)
      const newY = Math.round(startY + (boundedTarget - startY) * eased)
      window.scrollTo(0, newY)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        rafRef.current = null
        isAnimatingRef.current = false
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }

  // Persist filters + scrollY to history.state and sessionStorage
  function saveListingState(scrollY?: number) {
    try {
      const state: ListingState = {
        filters: { category: selectedCategory, q: searchQuery, available: availableOnly },
        scrollY: typeof scrollY === "number" ? scrollY : typeof window !== "undefined" ? window.scrollY : 0,
      }
      history.replaceState({ ...(history.state || {}), listingState: state }, "")
      sessionStorage.setItem("catalogListingState", JSON.stringify(state))
    } catch (e) {
      console.error("Error saving listing state:", e)
    }
  }

  // ---------- CAMBIO: eliminar la animación previa a la navegación ----------
  // Guardamos estado y navegamos inmediatamente sin desplazar la página.
  function animateScrollDownAndNavigate(id: string) {
    if (isAnimatingRef.current) return
    // marcamos para evitar clicks repetidos
    isAnimatingRef.current = true

    // Guardar filtros + scroll actual
    saveListingState()

    // Navegar en el siguiente frame (no hay animación)
    requestAnimationFrame(() => {
      router.push(`/product/${encodeURIComponent(id)}`)
    })
  }
  // -----------------------------------------------------------------------

  // Accessible wrapper props (avoid nested anchors)
  function makeClickableProps(id: string) {
    return {
      role: "link",
      tabIndex: 0,
      onClick: () => animateScrollDownAndNavigate(id),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          animateScrollDownAndNavigate(id)
        }
      },
      className: "block cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#95C7C3]/40",
      "aria-label": `Ver ${id}`,
    } as React.HTMLAttributes<HTMLElement>
  }

  // Restore filters + scroll on mount. If we detect a saved scrollY, animate to it.
  useEffect(() => {
    try {
      const hs = (history.state && (history.state as any).listingState) as ListingState | undefined
      const ssRaw = typeof window !== "undefined" ? sessionStorage.getItem("catalogListingState") : null
      const ss = ssRaw ? (JSON.parse(ssRaw) as ListingState) : undefined
      const saved = hs ?? ss

      if (saved && saved.filters) {
        if (typeof saved.filters.category !== "undefined") setSelectedCategory(saved.filters.category ?? null)
        if (typeof saved.filters.q !== "undefined") setSearchQuery(saved.filters.q ?? "")
        if (typeof saved.filters.available !== "undefined") setAvailableOnly(Boolean(saved.filters.available))
      } else {
        const params = new URLSearchParams(window.location.search)
        const c = params.get("category")
        const q = params.get("q")
        const a = params.get("available")
        if (c) setSelectedCategory(c)
        if (q) setSearchQuery(q)
        if (a === "1") setAvailableOnly(true)
      }

      if (saved && typeof saved.scrollY === "number") {
        // extrae el valor fuera de la closure para que TypeScript sepa que es number
        const savedScrollY = saved.scrollY
        // animate to the saved scroll position for a smoother return transition
        // do this after a frame so layout is ready
        requestAnimationFrame(() => {
          // if current position is already close, just jump
          const delta = Math.abs(window.scrollY - savedScrollY)
          if (delta < 4) {
            window.scrollTo(0, savedScrollY)
          } else {
            animateScrollTo(savedScrollY, 420)
          }
        })
      }
    } catch (e) {
      console.error("Error restoring catalog listing state:", e)
    }

    // cleanup on unmount
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen for popstate so if user uses Back (from /product/:id) we animate to the saved position
  useEffect(() => {
    function onPopState() {
      try {
        const hs = (history.state && (history.state as any).listingState) as ListingState | undefined
        const ssRaw = typeof window !== "undefined" ? sessionStorage.getItem("catalogListingState") : null
        const ss = ssRaw ? (JSON.parse(ssRaw) as ListingState) : undefined
        const saved = hs ?? ss

        if (saved) {
          // restore filters if present
          if (saved.filters) {
            if (typeof saved.filters.category !== "undefined") setSelectedCategory(saved.filters.category ?? null)
            if (typeof saved.filters.q !== "undefined") setSearchQuery(saved.filters.q ?? "")
            if (typeof saved.filters.available !== "undefined") setAvailableOnly(Boolean(saved.filters.available))
          }
          // animate to saved scrollY (only if present)
          if (typeof saved.scrollY === "number") {
            const savedScrollY = saved.scrollY
            // small delay to allow render/paint of server content
            requestAnimationFrame(() => {
              animateScrollTo(savedScrollY, 420)
            })
          }
        }
      } catch (e) {
        console.error("Error handling popstate for catalog:", e)
      } finally {
        // permitir nuevas interacciones
        isAnimatingRef.current = false
      }
    }

    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  // Keep querystring in sync when filters change (no push)
  useEffect(() => {
    try {
      const listingState: ListingState = { filters: { category: selectedCategory, q: searchQuery, available: availableOnly } }
      const newState = { ...(history.state || {}), listingState }
      const params = new URLSearchParams()
      if (selectedCategory) params.set("category", selectedCategory)
      if (searchQuery) params.set("q", searchQuery)
      if (availableOnly) params.set("available", "1")
      const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname
      history.replaceState(newState, "", newUrl)
      sessionStorage.setItem("catalogListingState", JSON.stringify(listingState))
    } catch (e) {
      console.error("Error syncing filters to history:", e)
    }
  }, [selectedCategory, searchQuery, availableOnly])

  // Filtering logic
  const filteredProducts = useMemo(() => {
    let filtered = products

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description ?? "").toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (availableOnly) {
      filtered = filtered.filter((p) => p.available)
    }

    return filtered
  }, [products, searchQuery, selectedCategory, availableOnly])

  // Group by category for mobile layout
  const productsByCategory = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = []
      acc[product.category].push(product)
      return acc
    }, {} as Record<string, Product[]>)
  }, [filteredProducts])

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Catálogo de Productos</h2>
        <p className="text-muted-foreground">Los mejores productos para el cuidado de tu bebé</p>
      </div>

      {/* Search + AvailableFilter in a single row */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="flex-shrink-0">
          {/* Usa el nuevo AvailableFilter; pasamos `availableOnly` como `active` */}
          <AvailabilityFilter active={availableOnly} onChange={setAvailableOnly} />
        </div>
      </div>

      <div className="mb-8">
        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} products={products} />
      </div>

      {/* Desktop View - 4 columns */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <article key={product.id} {...makeClickableProps(String(product.id))}>
            <ProductCard product={product} />
          </article>
        ))}
      </div>

      {/* Mobile/Tablet View - 2 columns */}
      <div className="lg:hidden grid grid-cols-2 gap-3 md:gap-4">
        {selectedCategory ? (
          <>
            {filteredProducts.map((product) => (
              <article key={product.id} {...makeClickableProps(String(product.id))}>
                <ProductCard product={product} compact />
              </article>
            ))}
          </>
        ) : (
          <>
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <div key={category} className="col-span-2">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 px-1">{category}</h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                  {categoryProducts.map((product) => (
                    <article key={product.id} {...makeClickableProps(String(product.id))}>
                      <ProductCard product={product} compact />
                    </article>
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

export default CatalogClient
