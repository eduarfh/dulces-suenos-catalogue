"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Electrodomestico } from "@/contexts/products-context"
import Image from "next/image"

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
          <DialogTitle className="text-2xl font-bold">{product.nombre}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image src={product.imagenURL || "/placeholder.svg"} alt={product.nombre} fill className="object-cover" />
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {product.marca}
              </Badge>
              <Badge variant={product.disponible ? "default" : "destructive"} className="text-sm">
                {product.disponible ? "Disponible" : "Agotado"}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">{product.descripcion}</p>
            </div>

            <div className="space-y-3 pt-4 border-t">
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
