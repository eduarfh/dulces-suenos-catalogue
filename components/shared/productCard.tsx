// components/shared/ProductCard.tsx
"use client"
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Electrodomestico } from "@/contexts/products-context"

type Props = {
  product: Electrodomestico
  onClick?: (p: Electrodomestico) => void
  admin?: boolean
  onEdit?: (p: Electrodomestico) => void
  onToggleDisponibilidad?: (id: number) => void
  onDelete?: (id: number) => void
}

export default function ProductCard({
  product,
  onClick,
  admin = false,
  onEdit,
  onToggleDisponibilidad,
  onDelete,
}: Props) {
  return (
    <Card
      className={`overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow ${admin ? "" : "cursor-pointer"}`}
      onClick={() => !admin && onClick?.(product)}
    >
      <div className="aspect-square relative bg-gray-50">
        <img
          src={product.imagenURL || "/public/placeholder-prs7q.png"}
          alt={product.nombre}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          <Badge
            variant={product.disponible ? "default" : "secondary"}
            className={`flex-1 ${product.disponible ? "bg-green-100 text-green-800" : "bg-red-50 text-red-600"}`}
          >
            {product.disponible ? "Disponible" : "Agotado"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-foreground">{product.nombre}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {product.marca} • {product.categoria}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Precio Minorista</div>
          <p className="text-xl font-semibold text-foreground">${product.precioMinorista}</p>
          <div className="text-sm text-muted-foreground">Precio Mayorista</div>
          <p className="text-lg font-medium text-green-600">
            ${product.precioMayorista}
            <span className="text-sm text-muted-foreground ml-1">
              (mínimo {product.cantidadMinimaMayorista || 0} unidades)
            </span>
          </p>
        </div>
      </CardContent>

      {admin ? (
        <CardFooter className="flex items-center justify-evenly gap-2 pt-2 px-6">
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(product)
              }}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 
                 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Edit className="h-4 w-4 mr-1" />
            </Button>

            <Button
              variant={product.disponible ? "destructive" : "default"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleDisponibilidad?.(product.id)
              }}
              className={`px-3 py-1 text-sm ${product.disponible ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 dark:border-green-200"}`}
            >
              {product.disponible ? "Marcar Agotado" : "Marcar Disponible"}
            </Button>
          </div>

          <div className="flex-shrink-0">
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(product.id)
              }}
              className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>


      ) : (
        <CardFooter shareProductId={product.id} viewProductId={product.id} className="pt-2">
        </CardFooter>
      )
      }
    </Card >
  )
}
