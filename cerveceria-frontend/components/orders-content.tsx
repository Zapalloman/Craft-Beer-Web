"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Home,
  ShoppingCart,
  ChevronRight,
  Package,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  Download,
  Eye,
  MapPin,
  RefreshCw,
  MoreHorizontal,
  Truck,
  Loader2,
  XCircle,
  HelpCircle,
  MessageCircle,
  ChevronLeft,
  User,
  X,
  Beer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api-client"
import type { Pedido } from "@/lib/types"

type OrderStatus = "Procesando" | "Confirmado" | "Enviado" | "Entregado" | "Cancelado"

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; bgColor: string; textColor: string }
> = {
  Procesando: {
    label: "PROCESANDO",
    icon: Clock,
    bgColor: "bg-yellow-500",
    textColor: "text-white",
  },
  Confirmado: {
    label: "CONFIRMADO",
    icon: CheckCircle2,
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
  Enviado: {
    label: "ENVIADO",
    icon: Truck,
    bgColor: "bg-purple-500",
    textColor: "text-white",
  },
  Entregado: {
    label: "ENTREGADO",
    icon: CheckCircle2,
    bgColor: "bg-emerald-500",
    textColor: "text-white",
  },
  Cancelado: {
    label: "CANCELADO",
    icon: XCircle,
    bgColor: "bg-red-500",
    textColor: "text-white",
  },
}

export function OrdersContent() {
  const { usuario, isAuthenticated, isLoading: authLoading } = useAuth()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState<string>("todos")
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
  const itemsPerPage = 5

  const fetchPedidos = async () => {
    if (usuario?._id) {
      setIsLoading(true)
      try {
        const data = await api.getPedidos(usuario._id)
        setPedidos(data)
      } catch (error) {
        console.error("Error al cargar pedidos:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchPedidos()
  }, [usuario])

  // Resetear página cuando cambia el filtro - DEBE estar antes de cualquier return
  useEffect(() => {
    setCurrentPage(1)
  }, [filterStatus])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Filtrar y paginar pedidos
  const filteredPedidos = filterStatus === "todos" 
    ? pedidos 
    : pedidos.filter(p => p.estado === filterStatus)

  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage)
  const paginatedPedidos = filteredPedidos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = {
    total: pedidos.length,
    delivered: pedidos.filter(p => p.estado === "Entregado").length,
    inProcess: pedidos.filter(p => ["Procesando", "Confirmado"].includes(p.estado)).length,
    shipped: pedidos.filter(p => p.estado === "Enviado").length,
    totalSpent: pedidos.filter(p => p.estado !== "Cancelado").reduce((sum, p) => sum + p.total, 0),
  }

  // Requiere autenticación
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="text-center py-20">
        <div className="bg-card border border-dashed border-border rounded-3xl p-12 max-w-lg mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-3">Inicia sesión</h2>
          <p className="text-muted-foreground mb-8">
            Debes iniciar sesión para ver tus pedidos.
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

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando pedidos...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8 bg-card rounded-xl p-4 shadow-sm">
        <Link href="/" className="flex items-center gap-1 text-primary hover:underline">
          <Home className="h-4 w-4" />
          Catálogo
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="flex items-center gap-1 text-muted-foreground">
          <ShoppingCart className="h-4 w-4" />
          Mis Pedidos
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-primary" />
            Mis Pedidos
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Revisa el estado y detalles de todos tus pedidos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                {filterStatus === "todos" ? "Filtrar por" : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus("todos")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Procesando")}>Procesando</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Confirmado")}>Confirmado</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Enviado")}>Enviado</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Entregado")}>Entregado</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Cancelado")}>Cancelado</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={fetchPedidos}>
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-card rounded-xl p-6 shadow-sm border-t-4 border-t-primary hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <Package className="h-8 w-8 text-primary mb-2" />
            <span className="text-3xl font-bold text-foreground">{stats.total}</span>
            <span className="text-sm text-muted-foreground">Total Pedidos</span>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm border-t-4 border-t-yellow-500 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <Clock className="h-8 w-8 text-yellow-500 mb-2" />
            <span className="text-3xl font-bold text-foreground">{stats.inProcess}</span>
            <span className="text-sm text-muted-foreground">En Proceso</span>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm border-t-4 border-t-purple-500 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <Truck className="h-8 w-8 text-purple-500 mb-2" />
            <span className="text-3xl font-bold text-foreground">{stats.shipped}</span>
            <span className="text-sm text-muted-foreground">Enviados</span>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm border-t-4 border-t-emerald-500 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
            <span className="text-3xl font-bold text-foreground">{stats.delivered}</span>
            <span className="text-sm text-muted-foreground">Entregados</span>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm border-t-4 border-t-primary hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <DollarSign className="h-8 w-8 text-primary mb-2" />
            <span className="text-2xl lg:text-3xl font-bold text-foreground">{formatPrice(stats.totalSpent)}</span>
            <span className="text-sm text-muted-foreground">Total Gastado</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4 mb-8">
        {filteredPedidos.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold mb-2">No hay pedidos</h3>
            <p className="text-muted-foreground mb-6">
              {filterStatus === "todos" 
                ? "Aún no has realizado ningún pedido." 
                : `No tienes pedidos con estado "${filterStatus}".`}
            </p>
            <Link href="/">
              <Button>Ver Catálogo</Button>
            </Link>
          </div>
        ) : (
          paginatedPedidos.map((pedido) => {
            const status = statusConfig[pedido.estado as OrderStatus] || statusConfig.Procesando
            const StatusIcon = status.icon
            const itemCount = pedido.items.reduce((sum, item) => sum + item.cantidad, 0)
            const productNames = pedido.items.map(item => 
              `${item.nombreProducto || 'Producto'} x${item.cantidad}`
            ).join(", ")
            const fecha = new Date(pedido.fechaPedido || pedido.createdAt || Date.now()).toLocaleDateString("es-CL", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })

            return (
              <div
                key={pedido._id}
                className={`bg-card rounded-xl shadow-sm border-l-4 hover:shadow-md transition-all hover:translate-x-1 ${
                  pedido.estado === "Cancelado"
                    ? "border-l-red-500 opacity-70"
                    : pedido.estado === "Entregado"
                      ? "border-l-emerald-500"
                      : pedido.estado === "Enviado"
                        ? "border-l-purple-500"
                        : pedido.estado === "Confirmado"
                          ? "border-l-blue-500"
                          : "border-l-yellow-500"
                }`}
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Order Number & Date */}
                    <div className="md:col-span-2">
                      <h3 className="font-bold text-primary text-lg">#{pedido.numeroOrden}</h3>
                      <p className="text-sm text-muted-foreground">{fecha}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="md:col-span-2 flex md:justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${status.bgColor} ${status.textColor}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </div>

                    {/* Order Details */}
                    <div className="md:col-span-4">
                      <p className="font-medium text-foreground line-clamp-1">{productNames}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Package className="h-3.5 w-3.5" />
                        {itemCount} items
                      </p>
                    </div>

                    {/* Total & Payment */}
                    <div className="md:col-span-2 text-center">
                      <p className="text-xl font-bold text-foreground">{formatPrice(pedido.total)}</p>
                      <p className="text-sm flex items-center justify-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {pedido.metodoPago}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <Button className="w-full gap-2" onClick={() => setSelectedPedido(pedido)}>
                        <Eye className="h-4 w-4" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mb-12">
          <Button 
            variant="outline" 
            size="icon" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <span className="text-sm text-muted-foreground ml-2">
            Página {currentPage} de {totalPages}
          </span>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-100">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
              <HelpCircle className="h-6 w-6 text-cyan-600" />
              ¿Necesitas ayuda con tu pedido?
            </h3>
            <p className="text-muted-foreground">
              Estamos aquí para ayudarte. Puedes rastrear tus pedidos en tiempo real, descargar facturas o contactar a
              nuestro equipo de soporte.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <HelpCircle className="h-4 w-4" />
              Preguntas Frecuentes
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <MessageCircle className="h-4 w-4" />
              Contactar Soporte
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Detalles del Pedido */}
      {selectedPedido && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPedido(null)}>
          <div 
            className="bg-card rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">Pedido #{selectedPedido.numeroOrden}</h3>
              <button 
                onClick={() => setSelectedPedido(null)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Productos */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {selectedPedido.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Beer className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.nombreProducto}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.cantidad}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(selectedPedido.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA (19%)</span>
                  <span>{formatPrice(selectedPedido.iva)}</span>
                </div>
                {selectedPedido.costoEnvio !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span className={selectedPedido.costoEnvio === 0 ? "text-green-600" : ""}>
                      {selectedPedido.costoEnvio === 0 ? "Gratis" : formatPrice(selectedPedido.costoEnvio)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(selectedPedido.total)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <Button className="w-full" onClick={() => setSelectedPedido(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
