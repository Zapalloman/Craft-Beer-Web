"use client"

import Link from "next/link"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Producto } from "@/lib/types"

interface ProductCardProps {
  product: Producto
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(product.precio)

  return (
    <article className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
      {/* Image Container */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.imagen || "/placeholder.svg?height=300&width=300"}
          alt={product.nombre}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link href={`/producto/${product._id}`}>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-card text-foreground hover:bg-primary hover:text-primary-foreground h-12 w-12 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
            >
              <Eye className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        {/* Category Badge */}
        <Badge className="absolute top-4 left-4 bg-card/90 text-foreground backdrop-blur-sm border-0 font-medium">
          {product.tipo}
        </Badge>
        {/* Stock badge */}
        {product.stock === 0 && (
          <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
            Sin stock
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <Link href={`/producto/${product._id}`} className="group/title">
          <h3 className="font-serif text-xl font-medium text-foreground group-hover/title:text-primary transition-colors mb-2">
            {product.nombre}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">{product.descripcion}</p>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {product.abv}% ABV
          </Badge>
          <Badge variant="outline" className="text-xs">
            {product.ibu} IBU
          </Badge>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xl font-semibold text-primary">{formattedPrice}</span>
          <Link
            href={`/producto/${product._id}`}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  )
}
