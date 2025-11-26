"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  BarChart3,
  Beer,
  PieChart,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"

interface Estadisticas {
  totalPedidos: number
  pedidosHoy: number
  pedidosSemana: number
  pedidosMes: number
  pedidosPorEstado: Record<string, number>
  ventasTotales: number
  ticketPromedio: number
}

interface ProductoStats {
  productoId: string
  nombreProducto: string
  unidadesVendidas: number
  ingresoTotal: number
}

export function DashboardContent() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [productosMasVendidos, setProductosMasVendidos] = useState<ProductoStats[]>([])
  const [totalProductos, setTotalProductos] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [stats, productos, todosProductos] = await Promise.all([
          api.getEstadisticasPedidos(),
          api.getProductosMasVendidos(5).catch(() => ({ productos: [] })),
          api.getProductos(),
        ])
        
        setEstadisticas(stats)
        setProductosMasVendidos(productos.productos || [])
        setTotalProductos(todosProductos.length)
      } catch (error) {
        console.error("Error cargando dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando dashboard...</span>
      </div>
    )
  }

  const estadosPedido = [
    { estado: "Procesando", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { estado: "Confirmado", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { estado: "Enviado", icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10" },
    { estado: "Entregado", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { estado: "Cancelado", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ]

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Resumen general de tu tienda Craft & Beer
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit">
          <Link href="/admin/dashboard">
            <Button variant="default" size="sm" className="rounded-lg gap-2">
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
            <Button variant="ghost" size="sm" className="rounded-lg gap-2">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Ventas Totales */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
              <TrendingUp className="h-3 w-3" />
              Activo
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Ventas Totales</p>
          <p className="text-2xl font-bold">{formatCurrency(estadisticas?.ventasTotales || 0)}</p>
        </div>

        {/* Pedidos Hoy */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Hoy</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Pedidos Hoy</p>
          <p className="text-2xl font-bold">{estadisticas?.pedidosHoy || 0}</p>
        </div>

        {/* Pedidos Semana */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <BarChart3 className="h-6 w-6 text-purple-500" />
            </div>
            <span className="text-sm text-muted-foreground">Esta semana</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Pedidos Semana</p>
          <p className="text-2xl font-bold">{estadisticas?.pedidosSemana || 0}</p>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Ticket Promedio</p>
          <p className="text-2xl font-bold">{formatCurrency(estadisticas?.ticketPromedio || 0)}</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estados de Pedidos */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Estado de Pedidos
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {estadosPedido.map(({ estado, icon: Icon, color, bg }) => (
              <div key={estado} className={`${bg} rounded-xl p-4 text-center`}>
                <Icon className={`h-6 w-6 ${color} mx-auto mb-2`} />
                <p className="text-2xl font-bold">
                  {estadisticas?.pedidosPorEstado?.[estado] || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{estado}</p>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{estadisticas?.totalPedidos || 0}</p>
              <p className="text-sm text-muted-foreground">Total Pedidos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{estadisticas?.pedidosMes || 0}</p>
              <p className="text-sm text-muted-foreground">Este Mes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">{totalProductos}</p>
              <p className="text-sm text-muted-foreground">Productos</p>
            </div>
          </div>
        </div>

        {/* Productos Más Vendidos */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Beer className="h-5 w-5 text-primary" />
            Top Productos
          </h2>
          
          {productosMasVendidos.length > 0 ? (
            <div className="space-y-3">
              {productosMasVendidos.map((producto, index) => (
                <div 
                  key={producto.productoId} 
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    index === 0 ? "bg-yellow-500/20 text-yellow-600" :
                    index === 1 ? "bg-gray-300/30 text-gray-600" :
                    index === 2 ? "bg-orange-500/20 text-orange-600" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{producto.nombreProducto}</p>
                    <p className="text-xs text-muted-foreground">
                      {producto.unidadesVendidas} unidades
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {formatCurrency(producto.ingresoTotal)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Beer className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Aún no hay datos de ventas
              </p>
            </div>
          )}

          <Link href="/admin/inventario">
            <Button variant="outline" className="w-full mt-4 gap-2">
              Ver Inventario
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-primary/5 to-amber-500/5 rounded-2xl border border-primary/10 p-6">
        <h2 className="font-semibold text-lg mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/inventario">
            <Button variant="outline" className="gap-2">
              <Package className="h-4 w-4" />
              Gestionar Inventario
            </Button>
          </Link>
          <Link href="/admin/pedidos">
            <Button variant="outline" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Ver Pedidos
            </Button>
          </Link>
          <Link href="/admin/inventario">
            <Button className="gap-2">
              <Beer className="h-4 w-4" />
              Agregar Producto
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
