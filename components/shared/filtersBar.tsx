// components/shared/filtersBar.tsx
"use client"
import React from "react"
import SearchBar from "@/components/ui/search-bar"
import AvailableFilter from "@/components/ui/available-filter"
import SortByName from "@/components/ui/sort-by-name"
import SortByPrice from "@/components/ui/sort-by-price"
import CategoryFilter from "@/components/ui/category-filter"
import BrandFilter from "@/components/ui/brand-filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

type Props = {
    id?: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    onFocusChange?: (f: boolean) => void
    enlarged?: boolean
    expandOnFocus?: boolean
    availableOnly: boolean
    setAvailableOnly: (v: boolean) => void
    onNameActiveChange?: (active: boolean) => void
    onPriceActiveChange?: (active: boolean) => void
    isMobile?: boolean
    showAddButton?: boolean
    onAddClick?: () => void
    // categorías y marcas
    categorySelected?: string | null
    setCategory?: (c: string | null) => void
    brandSelected?: string | null
    setBrand?: (b: string | null) => void
}

export default function FiltersBar({
    id = "site-search",
    value,
    onChange,
    placeholder = "Buscar...",
    onFocusChange,
    enlarged = true,
    expandOnFocus = true,
    availableOnly,
    setAvailableOnly,
    onNameActiveChange,
    onPriceActiveChange,
    isMobile = false,
    showAddButton = false,
    onAddClick,
    categorySelected = null,
    setCategory,
    brandSelected = null,
    setBrand,
}: Props) {
    const wrapperClass = `flex flex-col items-stretch gap-3`
    const sortsClass = `w-full`

    return (
        <div className={wrapperClass + " mb-6"}>
            <div className="flex-1 min-w-0 w-full">
                <SearchBar
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onFocusChange={onFocusChange}
                    enlarged={enlarged}
                    expandOnFocus={expandOnFocus}
                />
            </div>

            <div className={sortsClass}>
                <div className="w-full flex justify-center">
                    <div className="flex gap-2 px-2 py-1 overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                        <div className="flex-shrink-0">
                            <AvailableFilter active={availableOnly} onChange={setAvailableOnly} />
                        </div>

                        <div className="flex-shrink-0">
                            <BrandFilter
                                selected={brandSelected}
                                onChange={(b) => setBrand?.(b ?? null)}
                                searchId={id}
                                isMobile={isMobile}
                            />
                        </div>

                        <div className="flex-shrink-0">
                            <CategoryFilter
                                selected={categorySelected}
                                onChange={(c) => setCategory?.(c ?? null)}
                                searchId={id}
                                isMobile={isMobile}
                            />
                        </div>

                        <div className="flex-shrink-0">
                            <SortByName onActiveChange={(a) => onNameActiveChange?.(a)} />
                        </div>

                        <div className="flex-shrink-0">
                            <SortByPrice onActiveChange={(a) => onPriceActiveChange?.(a)} />
                        </div>

                        {/* Desktop: botón Agregar dentro de un wrapper idéntico al de los sorts (bg + p-1 + rounded + shadow) */}
                        {!isMobile && showAddButton && (
                            <div className="flex-shrink-0">
                                <div className="bg-card/50 p-1 rounded-lg">
                                    <Button
                                        onClick={onAddClick}
                                        className={`
    h-8 px-3 rounded-md
    text-white
    bg-red-600 hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500
    dark:bg-red-900 dark:hover:bg-red-600 dark:focus-visible:ring-red-400
    transition-colors duration-150
    }
  `}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar Producto
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile: botón Agregar debajo, también con el mismo envoltorio visual */}
                {isMobile && showAddButton && (
                    <div className="w-full flex justify-center mt-2">
                        <div className="w-full px-4 sm:w-auto">
                            <div className="bg-card/50 p-1 rounded-lg">
                                <Button
                                    onClick={onAddClick}
                                    className={`
    h-8 px-3 rounded-md
    text-white
    bg-red-600 hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500
    dark:bg-red-900 dark:hover:bg-red-600 dark:focus-visible:ring-red-400
    transition-colors duration-150
    }
  `}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Producto
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
