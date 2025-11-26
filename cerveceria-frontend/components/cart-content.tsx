"use client"

import Link from "next/link"
import { ShoppingCart, ArrowLeft, CreditCard, Wallet, Building2, Trash2, ShoppingBag, Truck, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/components/cart-item"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

export function CartContent() {
  const { carrito, isLoading, actualizarCantidad, eliminarItem, vaciarCarrito } = useCart()
  const { isAuthenticated } = useAuth()

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)

  // Requiere autenticación
  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <div className="bg-card border border-dashed border-border rounded-3xl p-12 max-w-lg mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-3">Inicia sesión</h2>
          <p className="text-muted-foreground mb-8">
            Debes iniciar sesión para ver tu carrito de compras.
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando carrito...</span>
      </div>
    )
  }

  const items = carrito?.items || []
  const subtotal = carrito?.subtotal || 0
  const iva = carrito?.iva || 0
  const total = carrito?.total || 0
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0)
  const shippingThreshold = 15000
  const shipping = subtotal >= shippingThreshold ? 0 : 2500
  const finalTotal = total + shipping

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-8 text-left">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Catálogo
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">Carrito</li>
          </ol>
        </nav>

        <div className="bg-card border border-dashed border-border rounded-3xl p-12 max-w-lg mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-3">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-8">
            No hay productos en tu carrito. Explora nuestro catálogo y encuentra tus cervezas favoritas.
          </p>
          <Link href="/">
            <Button size="lg" className="gap-2">
              <ShoppingCart className="h-5 w-5" />
              Ver Catálogo
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Catálogo
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium">Carrito</li>
        </ol>
      </nav>

      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          Tu Carrito de Compras
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={vaciarCarrito}
          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Vaciar Carrito
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border">
              <div className="col-span-5">Producto</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-right">Subtotal</div>
              <div className="col-span-1 text-center">Acción</div>
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-border">
              {items.map((item) => {
                const producto = item.productoId as any
                const productoId = typeof producto === 'string' ? producto : producto._id
                return (
                  <CartItem
                    key={item._id}
                    item={{
                      id: productoId,
                      name: producto.nombre || 'Producto',
                      category: producto.tipo || '',
                      format: producto.formato || '',
                      price: item.precioUnitario,
                      quantity: item.cantidad,
                      image: producto.imagen || "/placeholder.svg?height=100&width=100",
                    }}
                    onUpdateQuantity={(id, qty) => actualizarCantidad(productoId, qty)}
                    onRemove={() => eliminarItem(productoId)}
                    formatPrice={formatPrice}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-serif text-xl font-semibold mb-6 pb-4 border-b border-border flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Resumen del Pedido
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems} productos)</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (19%)</span>
                <span>{formatPrice(iva)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            {/* Free Shipping Alert */}
            {subtotal >= shippingThreshold ? (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
                  <Truck className="h-4 w-4" />
                  <span className="font-medium">Envío gratis en compras sobre {formatPrice(shippingThreshold)}</span>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2 text-amber-700 dark:text-amber-400 text-sm">
                  <Info className="h-4 w-4 mt-0.5" />
                  <span>Agrega {formatPrice(shippingThreshold - subtotal)} más para obtener envío gratis</span>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center pt-4 mb-6 border-t border-border">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(finalTotal)}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/checkout" className="block">
                <Button className="w-full gap-2" size="lg">
                  <CreditCard className="h-5 w-5" />
                  Continuar a Checkout
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  Seguir Comprando
                </Button>
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Métodos de pago aceptados</h3>
              <div className="flex items-center gap-4 text-muted-foreground">
                <CreditCard className="h-6 w-6" />
                <Wallet className="h-6 w-6" />
                <Building2 className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
