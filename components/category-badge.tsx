"use client"

import React from "react"
import { getCategoryColor } from "@/lib/category-colors"

interface CategoryBadgeProps {
  category: string
  className?: string
}

export default function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  const { background, textClass } = getCategoryColor(category || "")

  return (
    <div
      className={`${className} absolute top-4 right-4 ${textClass} px-3 py-1 rounded-full text-sm font-medium z-10`}
      style={{ backgroundColor: background }}
      role="status"
      aria-label={`Categoría: ${category}`}
    >
      {category}
    </div>
  )
}
