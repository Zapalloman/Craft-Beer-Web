"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Eye,
  ChevronDown,
  Loader2,
  Calendar,
  DollarSign,
  MapPin,
  User,
  ShoppingBag,
  X,
  RefreshCw,
  PieChart,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api } from "@/lib/api-client"
import type { Pedido } from "@/lib/types"

const estadosConfig = {
  "Procesando": { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  "Confirmado": { icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  "Enviado": { icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  "Entregado": { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" },
  "Cancelado": { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
} as const

const estadosOrden = ["Procesando", "Confirmado", "Enviado", "Entregado", "Cancelado"]

export function PedidosAdminContent() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null)
  const [actualizandoEstado, setActualizandoEstado] = useState<string | null>(null)

  const cargarPedidos = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (filtroEstado !== "todos") {
        params.estado = filtroEstado
      }
      const data = await api.getTodosPedidos(params)
      setPedidos(data)
    } catch (error) {
      console.error("Error cargando pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarPedidos()
  }, [filtroEstado])

  const actualizarEstado = async (pedidoId: string, nuevoEstado: string) => {
    setActualizandoEstado(pedidoId)
    try {
      await api.actualizarEstadoPedido(pedidoId, nuevoEstado)
      await cargarPedidos()
      if (pedidoDetalle && pedidoDetalle._id === pedidoId) {
        setPedidoDetalle({ ...pedidoDetalle, estado: nuevoEstado })
      }
    } catch (error) {
      console.error("Error actualizando estado:", error)
      alert("Error al actualizar el estado del pedido")
    } finally {
      setActualizandoEstado(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const pedidosFiltrados = pedidos.filter(pedido => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      pedido.numeroOrden?.toLowerCase().includes(search) ||
      pedido._id.toLowerCase().includes(search)
    )
  })

  const getEstadoConfig = (estado: string) => {
    return estadosConfig[estado as keyof typeof estadosConfig] || estadosConfig["Procesando"]
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold">Gestión de Pedidos</h1>
        </div>
        <p className="text-muted-foreground">
          Administra y actualiza el estado de los pedidos
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="rounded-lg gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/inventario">
            <Button variant="ghost" size="sm" className="rounded-lg gap-2">
              <Package className="h-4 w-4" />
              Inventario
            </Button>
          </Link>
          <Link href="/admin/pedidos">
            <Button variant="default" size="sm" className="rounded-lg gap-2">
              <ClipboardList className="h-4 w-4" />
              Pedidos
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant="ghost" size="sm" className="rounded-lg gap-2">
              <PieChart className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            sessionStorage.removeItem("admin_authenticated")
            sessionStorage.removeItem("admin_login_time")
            sessionStorage.removeItem("admin_user")
            window.location.href = "/admin"
          }}
          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número de orden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                {estadosOrden.map(estado => (
                  <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={cargarPedidos} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Pedidos Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Cargando pedidos...</span>
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No hay pedidos</h3>
          <p className="text-muted-foreground">
            {searchTerm || filtroEstado !== "todos" 
              ? "No se encontraron pedidos con los filtros aplicados" 
              : "Aún no hay pedidos registrados"}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground">
            <div className="col-span-2">Orden</div>
            <div className="col-span-2">Fecha</div>
            <div className="col-span-2">Estado</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-2">Items</div>
            <div className="col-span-2 text-right">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {pedidosFiltrados.map((pedido) => {
              const estadoConfig = getEstadoConfig(pedido.estado)
              const IconEstado = estadoConfig.icon

              return (
                <div 
                  key={pedido._id} 
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors"
                >
                  {/* Orden */}
                  <div className="col-span-2">
                    <p className="font-mono font-semibold text-sm">
                      {pedido.numeroOrden || `#${pedido._id.slice(-8)}`}
                    </p>
                    <p className="text-xs text-muted-foreground md:hidden">
                      {formatDate(pedido.fechaPedido)}
                    </p>
                  </div>

                  {/* Fecha */}
                  <div className="hidden md:flex col-span-2 items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(pedido.fechaPedido)}
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="col-span-2">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${estadoConfig.bg} ${estadoConfig.color} ${estadoConfig.border} border`}>
                      <IconEstado className="h-3.5 w-3.5" />
                      {pedido.estado}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-2 flex items-center">
                    <span className="font-semibold">{formatCurrency(pedido.total)}</span>
                  </div>

                  {/* Items */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-muted-foreground">
                      {pedido.items?.length || 0} productos
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setPedidoDetalle(pedido)}
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>

                    <Select
                      value={pedido.estado}
                      onValueChange={(value) => actualizarEstado(pedido._id, value)}
                      disabled={actualizandoEstado === pedido._id}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        {actualizandoEstado === pedido._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {estadosOrden.map(estado => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Resumen */}
      <div className="mt-4 text-sm text-muted-foreground">
        Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
      </div>

      {/* Modal Detalle Pedido */}
      <Dialog open={!!pedidoDetalle} onOpenChange={() => setPedidoDetalle(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Detalle del Pedido
            </DialogTitle>
            <DialogDescription>
              {pedidoDetalle?.numeroOrden || `#${pedidoDetalle?._id.slice(-8)}`}
            </DialogDescription>
          </DialogHeader>

          {pedidoDetalle && (
            <div className="space-y-6">
              {/* Info General */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Fecha</Label>
                  <p className="font-medium">{formatDate(pedidoDetalle.fechaPedido)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Estado</Label>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getEstadoConfig(pedidoDetalle.estado).bg} ${getEstadoConfig(pedidoDetalle.estado).color}`}>
                    {pedidoDetalle.estado}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Método de Pago</Label>
                  <p className="font-medium capitalize">{pedidoDetalle.metodoPago}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">ID Usuario</Label>
                  <p className="font-mono text-sm">{pedidoDetalle.usuarioId}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <Label className="text-muted-foreground text-xs mb-2 block">Productos</Label>
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  {pedidoDetalle.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.nombreProducto}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.cantidad} x {formatCurrency(item.precioUnitario)}
                        </p>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="bg-primary/5 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(pedidoDetalle.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA (19%)</span>
                  <span>{formatCurrency(pedidoDetalle.iva)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{pedidoDetalle.costoEnvio === 0 ? "Gratis" : formatCurrency(pedidoDetalle.costoEnvio)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(pedidoDetalle.total)}</span>
                </div>
              </div>

              {/* Cambiar Estado */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Label className="text-sm">Cambiar estado:</Label>
                <Select
                  value={pedidoDetalle.estado}
                  onValueChange={(value) => actualizarEstado(pedidoDetalle._id, value)}
                  disabled={actualizandoEstado === pedidoDetalle._id}
                >
                  <SelectTrigger className="w-[180px]">
                    {actualizandoEstado === pedidoDetalle._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SelectValue />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {estadosOrden.map(estado => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
