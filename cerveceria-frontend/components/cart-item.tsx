"use client"

import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CartItemProps {
  item: {
    id: string
    name: string
    category: string
    format: string
    price: number
    quantity: number
    image: string
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  formatPrice: (price: number) => string
}

const categoryColors: Record<string, string> = {
  Lager: "bg-amber-500/90 text-white",
  Ale: "bg-cyan-600/90 text-white",
  IPA: "bg-emerald-600/90 text-white",
  Stout: "bg-zinc-800 text-white",
  Porter: "bg-stone-700 text-white",
}

export function CartItem({ item, onUpdateQuantity, onRemove, formatPrice }: CartItemProps) {
  return (
    <div className="p-4 md:p-6">
      {/* Mobile Layout */}
      <div className="md:hidden flex gap-4">
        <Link href={`/producto/${item.id}`} className="shrink-0">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted">
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/producto/${item.id}`}>
            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">{item.name}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-1 mb-2">
            <Badge className={`${categoryColors[item.category] || "bg-muted text-muted-foreground"} text-xs`}>
              {item.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{item.format}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary">{formatPrice(item.price)}</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2 text-right">
            <span className="text-sm text-muted-foreground">Subtotal: </span>
            <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
        {/* Product Info */}
        <div className="col-span-5 flex items-center gap-4">
          <Link href={`/producto/${item.id}`} className="shrink-0">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted group">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
          </Link>
          <div>
            <Link href={`/producto/${item.id}`}>
              <h3 className="font-semibold text-foreground hover:text-primary transition-colors">{item.name}</h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${categoryColors[item.category] || "bg-muted text-muted-foreground"} text-xs`}>
                {item.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{item.format}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="col-span-2 text-center">
          <span className="font-medium">{formatPrice(item.price)}</span>
        </div>

        {/* Quantity */}
        <div className="col-span-2 flex justify-center">
          <div className="flex items-center border border-border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-r-none hover:bg-muted"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-l-none hover:bg-muted"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="col-span-2 text-right">
          <span className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</span>
        </div>

        {/* Remove Button */}
        <div className="col-span-1 text-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
