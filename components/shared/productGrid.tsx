// components/shared/ProductGrid.tsx
"use client"
import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import ProductCard from "./productCard"
import type { Electrodomestico } from "@/contexts/products-context"

type Props = {
  items: Electrodomestico[]
  onItemClick?: (p: Electrodomestico) => void
  admin?: boolean
  onEdit?: (p: Electrodomestico) => void
  onToggleDisponibilidad?: (id: number) => void
  onDelete?: (id: number) => void
  animKey?: string
}

export default function ProductGrid({ items, onItemClick, admin = false, onEdit, onToggleDisponibilidad, onDelete, animKey = "" }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence mode="sync">
        {items.map((item) => (
          <motion.div
            key={item.id + animKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ProductCard
              product={item}
              onClick={onItemClick}
              admin={admin}
              onEdit={onEdit}
              onToggleDisponibilidad={onToggleDisponibilidad}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
