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
                    {/* contenedor de filtros: una sola línea, altura fija de referencia y no recorta verticalmente */}
                    <div
                        className="flex gap-2 px-2 py-2 overflow-x-auto overflow-y-visible flex-nowrap items-center whitespace-nowrap min-h-[40px]"
                        style={{ WebkitOverflowScrolling: "touch" }}
                    >
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

                        {!isMobile && showAddButton && (
                            <div className="flex-shrink-0">
                                <div className="bg-card/50 p-1 rounded-lg">
                                    <Button onClick={onAddClick} variant="default" className="btn-add h-8 px-3 rounded-md">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar Producto
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {isMobile && showAddButton && (
                    <div className="w-full flex justify-center mt-2">
                        <div className="w-full px-4 sm:w-auto">
                            <div className="bg-card/50 p-1 rounded-lg">
                                <Button onClick={onAddClick} className="btn-add w-full h-8 px-3 rounded-md">
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
