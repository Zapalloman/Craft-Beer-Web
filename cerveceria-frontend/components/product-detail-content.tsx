"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronRight,
  ShoppingCart,
  Minus,
  Plus,
  Droplets,
  TrendingUp,
  Wine,
  Thermometer,
  Leaf,
  Palette,
  Info,
  Shield,
  Truck,
  Award,
  ArrowLeft,
  Star,
  Check,
  MessageSquare,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import type { Producto } from "@/lib/types"

interface ProductDetailContentProps {
  productId: string
}

const typeColors: Record<string, string> = {
  Lager: "bg-amber-500 text-white",
  Ale: "bg-orange-500 text-white",
  IPA: "bg-green-600 text-white",
  Stout: "bg-stone-800 text-white",
  Porter: "bg-stone-700 text-white",
}

export function ProductDetailContent({ productId }: ProductDetailContentProps) {
  const [product, setProduct] = useState<Producto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const { agregarItem } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await api.getProducto(productId)
        setProduct(data)
      } catch (err) {
        console.error("Error al cargar producto:", err)
        setError("Error al cargar el producto")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para agregar productos al carrito")
      return
    }
    if (!product) return

    setIsAdding(true)
    try {
      await agregarItem(product._id, quantity)
      alert("Producto agregado al carrito")
    } catch (error) {
      console.error("Error al agregar al carrito:", error)
      alert("Error al agregar al carrito")
    } finally {
      setIsAdding(false)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const incrementQuantity = () => {
    if (product && quantity < product.stock) setQuantity(quantity + 1)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando producto...</span>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">{error || "Producto no encontrado"}</p>
        <Link href="/">
          <Button className="mt-4">Volver al catálogo</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Catálogo
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{product.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 p-8 lg:p-12 flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <img
                  src={product.imagen || "/placeholder.svg"}
                  alt={product.nombre}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 right-4">
                <Badge className={`${typeColors[product.tipo] || "bg-primary"} text-sm px-3 py-1`}>
                  {product.tipo}
                </Badge>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-2">{product.nombre}</h1>
                <p className="text-muted-foreground text-lg">{product.tipo} - {product.formato}</p>

                {/* Rating */}
                <Link
                  href={`/producto/${product._id}/valoraciones`}
                  className="flex items-center gap-2 mt-3 group w-fit"
                >
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.valoracionPromedio || 0) ? "text-primary fill-primary" : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    ({product.numeroValoraciones || 0} valoraciones)
                  </span>
                  <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </div>

              {/* Price & Add to Cart */}
              <div className="bg-muted/50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground block">Precio</span>
                    <span className="text-3xl font-bold text-primary">{formatPrice(product.precio)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Cantidad</span>
                    <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-none"
                        onClick={decrementQuantity}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-none"
                        onClick={incrementQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full h-12 text-base font-medium gap-2"
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {isAdding ? "Agregando..." : product.stock === 0 ? "Sin stock" : "Agregar al Carrito"}
                </Button>
              </div>

              {/* Specifications Grid */}
              <div className="mb-8">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Especificaciones</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Droplets className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">ABV</span>
                      <span className="font-semibold text-foreground">{product.abv}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">IBU</span>
                      <span className="font-semibold text-foreground">{product.ibu}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wine className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Formato</span>
                      <span className="font-semibold text-foreground">{product.formato}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Thermometer className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Temperatura</span>
                      <span className="font-semibold text-foreground">{product.temperatura}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="border-t border-border p-8 lg:p-12">
            <h2 className="font-serif text-2xl font-bold text-primary mb-4">Descripción</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">{product.descripcion}</p>

            {/* Ingredients */}
            {product.ingredientes && product.ingredientes.length > 0 && (
              <div className="mt-10">
                <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground mb-4">
                  <Leaf className="h-5 w-5 text-primary" />
                  Ingredientes
                </h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.ingredientes.map((ingrediente, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500" />
                      {ingrediente}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Info & Back Button */}
            <div className="mt-10 pt-8 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Información Adicional</h4>
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary" />
                    Producto 100% artesanal
                  </span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    Envío refrigerado disponible
                  </span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4 text-primary" />
                    Cerveza artesanal premium
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/producto/${product._id}/valoraciones`}>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <MessageSquare className="h-4 w-4" />
                    Ver Valoraciones
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <ArrowLeft className="h-4 w-4" />
                    Volver al Catálogo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
