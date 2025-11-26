"use client"

import Link from "next/link"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  abv: number
  image: string
}

interface SearchResultCardProps {
  product: Product
}

const categoryColors: Record<string, string> = {
  Lager: "bg-amber-500/90 text-white",
  Ale: "bg-cyan-600/90 text-white",
  IPA: "bg-emerald-600/90 text-white",
  Stout: "bg-zinc-800 text-white",
  Porter: "bg-stone-700 text-white",
}

export function SearchResultCard({ product }: SearchResultCardProps) {
  const formattedPrice = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(product.price)

  return (
    <article className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link href={`/producto/${product.id}`}>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-card text-foreground hover:bg-primary hover:text-primary-foreground h-12 w-12 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
            >
              <Eye className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <Link href={`/producto/${product.id}`} className="group/title">
          <h3 className="font-serif text-xl font-medium text-foreground group-hover/title:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Category Badge and ABV */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className={categoryColors[product.category] || "bg-muted text-muted-foreground"}>
            {product.category}
          </Badge>
          <span className="text-sm text-muted-foreground">{product.abv}% ABV</span>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">{product.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xl font-semibold text-primary">{formattedPrice}</span>
          <Link href={`/producto/${product.id}`}>
            <Button variant="default" size="sm">
              Ver Detalles
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
