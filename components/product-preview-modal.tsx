"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Electrodomestico } from "@/contexts/products-context"
import Image from "next/image"
import { ShareButton } from "@/components/ui/card" // import del ShareButton creado arriba
import { Fragment } from "react"

interface ProductPreviewModalProps {
  product: Electrodomestico | null
  isOpen: boolean
  onClose: () => void
}

export function ProductPreviewModal({ product, isOpen, onClose }: ProductPreviewModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="pr-4">
              <DialogTitle className="text-2xl font-bold">{product.nombre}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image src={product.imagenURL || "/placeholder.svg"} alt={product.nombre} fill className="object-cover" />
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm hover: bg-orange-100 border border-orange-200 text-orange-800">
                {product.marca}
              </Badge>
              <Badge variant={product.disponible ? "default" : "secondary"} className={`text-sm ${product.disponible
                ? "bg-green-100 text-green-800 hover:bg-green-300 border border-green-400"
                : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                }`}>
                {product.disponible ? "Disponible" : "Agotado"}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">

            <div>
              <span className="text-sm text-muted-foreground">Precio Minorista</span>
              <p className="text-2xl font-bold text-blue-600">${product.precioMinorista}</p>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">
                Precio Mayorista (mín. {product.cantidadMinimaMayorista} unidades)
              </span>
              <p className="text-2xl font-bold text-green-600">${product.precioMayorista}</p>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div>
                <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                <p className="text-muted-foreground leading-relaxed">{product.descripcion}</p>
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
