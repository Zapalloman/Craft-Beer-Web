"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  Beer,
  Download,
  Printer,
  Loader2,
  ShoppingBag,
  Mail,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import type { Pedido } from "@/lib/types"

export function ConfirmationContent() {
  const searchParams = useSearchParams()
  const pedidoId = searchParams.get("pedido")
  
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPedido = async () => {
      if (!pedidoId) return
      
      try {
        const data = await api.getPedido(pedidoId)
        setPedido(data)
      } catch (error) {
        console.error("Error al cargar pedido:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPedido()
  }, [pedidoId])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getEstimatedDelivery = () => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(start.getDate() + 2)
    const end = new Date(today)
    end.setDate(end.getDate() + 4)
    
    return `${start.getDate()} - ${end.getDate()} de ${start.toLocaleDateString("es-CL", { month: "long" })}, ${start.getFullYear()}`
  }

  const getMetodoPagoLabel = (metodo: string) => {
    const labels: Record<string, string> = {
      flow: "Flow",
      card: "Tarjeta de crédito",
      transfer: "Transferencia bancaria",
    }
    return labels[metodo] || metodo
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando pedido...</span>
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="text-center py-20">
        <div className="bg-card border border-dashed border-border rounded-3xl p-12 max-w-lg mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-3">Pedido no encontrado</h2>
          <p className="text-muted-foreground mb-8">
            No pudimos encontrar el pedido solicitado.
          </p>
          <Link href="/">
            <Button size="lg">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Progress Indicator - Completed */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <span className="text-sm mt-2 font-medium text-green-600">Carrito</span>
          </div>

          <div className="flex-1 h-1 bg-green-500 mx-2" />

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <span className="text-sm mt-2 font-medium text-green-600">Checkout</span>
          </div>

          <div className="flex-1 h-1 bg-green-500 mx-2" />

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30 ring-4 ring-green-500/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <span className="text-sm mt-2 font-semibold text-green-600">Confirmación</span>
          </div>
        </div>
      </div>

      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
          <CheckCircle2 className="h-14 w-14 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">¡Pedido Confirmado!</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Gracias por tu compra. Hemos enviado los detalles de tu pedido a tu correo electrónico.
        </p>
      </div>

      {/* Order Number Card */}
      <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 text-center mb-8">
        <p className="text-sm text-muted-foreground mb-1">Número de pedido</p>
        <p className="text-2xl font-bold text-primary font-mono">{pedido.numeroOrden}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Payment Info */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Método de Pago
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>{getMetodoPagoLabel(pedido.metodoPago)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{pedido.createdAt ? formatDate(pedido.createdAt) : formatDate(pedido.fechaPedido)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Delivery */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Entrega estimada</p>
            <p className="text-lg font-semibold text-amber-800 dark:text-amber-300">{getEstimatedDelivery()}</p>
          </div>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-8">
        <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Detalle del Pedido
        </h2>

        {/* Products */}
        <div className="divide-y divide-border">
          {pedido.items.map((item, index) => (
            <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-amber-100 flex items-center justify-center">
                <Beer className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.nombreProducto}</p>
                <p className="text-sm text-muted-foreground">
                  Cantidad: {item.cantidad}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(item.subtotal)}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(pedido.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">IVA (19%)</span>
            <span>{formatPrice(pedido.iva)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span className={pedido.costoEnvio === 0 ? "text-green-600 font-medium" : ""}>
              {pedido.costoEnvio === 0 ? "Gratis" : formatPrice(pedido.costoEnvio)}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">{formatPrice(pedido.total)}</span>
          </div>
        </div>
      </div>

      {/* Email Notification */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <Mail className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Revisa tu correo electrónico</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Hemos enviado la confirmación del pedido y los detalles de seguimiento a tu email.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/pedidos" className="flex-1">
          <Button className="w-full gap-2" size="lg">
            <Package className="h-5 w-5" />
            Ver Mis Pedidos
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full gap-2 bg-transparent" size="lg">
            Seguir Comprando
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Print/Download Options */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Download className="h-4 w-4" />
          Descargar comprobante
        </button>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Printer className="h-4 w-4" />
          Imprimir
        </button>
      </div>
    </div>
  )
}
