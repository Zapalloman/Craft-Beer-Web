"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  BarChart3,
  ShoppingCart,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Users,
  Eye,
  MousePointer,
  CreditCard,
  Truck,
  XCircle,
  HelpCircle,
  Loader2,
  RefreshCw,
  PieChart,
  Activity,
  Target,
  Lightbulb,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"

interface EstadisticasAbandono {
  totalAbandonados: number
  porMotivo: Array<{ _id: string; cantidad: number; promedioTotal: number }>
  porEtapa: Array<{ _id: string; cantidad: number }>
  valorPerdido: { totalPerdido: number; promedioPerdido: number }
}

interface Insight {
  tipo: string
  mensaje: string
  prioridad: string
  datos?: any
}

const motivoLabels: Record<string, string> = {
  PrecioAlto: "Precio muy alto",
  CostoEnvio: "Costo de envío",
  ProcesoComplicado: "Proceso complicado",
  FaltaMetodoPago: "Falta método de pago",
  SoloExplorando: "Solo explorando",
  Desconocido: "Desconocido",
}

const etapaLabels: Record<string, string> = {
  Carrito: "En el carrito",
  Checkout: "En checkout",
  Pago: "En pago",
}

const motivoIcons: Record<string, any> = {
  PrecioAlto: DollarSign,
  CostoEnvio: Truck,
  ProcesoComplicado: HelpCircle,
  FaltaMetodoPago: CreditCard,
  SoloExplorando: Eye,
  Desconocido: HelpCircle,
}

const motivoColors: Record<string, string> = {
  PrecioAlto: "text-red-500 bg-red-500/10",
  CostoEnvio: "text-orange-500 bg-orange-500/10",
  ProcesoComplicado: "text-yellow-500 bg-yellow-500/10",
  FaltaMetodoPago: "text-purple-500 bg-purple-500/10",
  SoloExplorando: "text-blue-500 bg-blue-500/10",
  Desconocido: "text-gray-500 bg-gray-500/10",
}

export function AnalyticsContent() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasAbandono | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [resumenEventos, setResumenEventos] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [statsAbandono, insightsData, eventos] = await Promise.all([
        api.getEstadisticasAbandono().catch(() => null),
        api.getInsights().catch(() => ({ insights: [] })),
        api.getResumenEventos().catch(() => null),
      ])
      
      setEstadisticas(statsAbandono)
      setInsights(insightsData?.insights || [])
      setResumenEventos(eventos)
    } catch (error) {
      console.error("Error cargando analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
        <span className="ml-2 text-muted-foreground">Cargando estadísticas...</span>
      </div>
    )
  }

  const totalAbandono = estadisticas?.totalAbandonados || 0
  const valorPerdido = estadisticas?.valorPerdido?.totalPerdido || 0
  const promedioPerdido = estadisticas?.valorPerdido?.promedioPerdido || 0

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold">Analytics & Estadísticas</h1>
        </div>
        <p className="text-muted-foreground">
          Análisis de comportamiento de usuarios y carritos abandonados
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
            <Button variant="ghost" size="sm" className="rounded-lg gap-2">
              <ClipboardList className="h-4 w-4" />
              Pedidos
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant="default" size="sm" className="rounded-lg gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={cargarDatos} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
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
      </div>

      {/* Stats Cards - Abandono */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-2xl border border-red-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-red-500" />
            </div>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Carritos Abandonados</p>
          <p className="text-3xl font-bold">{totalAbandono}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-2xl border border-orange-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <DollarSign className="h-6 w-6 text-orange-500" />
            </div>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Valor Perdido</p>
          <p className="text-2xl font-bold">{formatCurrency(valorPerdido)}</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Target className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Promedio por Carrito</p>
          <p className="text-2xl font-bold">{formatCurrency(promedioPerdido)}</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Motivos de Abandono */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Motivos de Abandono
          </h2>
          
          {estadisticas?.porMotivo && estadisticas.porMotivo.length > 0 ? (
            <div className="space-y-3">
              {estadisticas.porMotivo.map((motivo) => {
                const Icon = motivoIcons[motivo._id] || HelpCircle
                const colorClass = motivoColors[motivo._id] || "text-gray-500 bg-gray-500/10"
                const porcentaje = totalAbandono > 0 
                  ? Math.round((motivo.cantidad / totalAbandono) * 100) 
                  : 0

                return (
                  <div key={motivo._id} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {motivoLabels[motivo._id] || motivo._id}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {motivo.cantidad} ({porcentaje}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${colorClass.includes('red') ? 'bg-red-500' : colorClass.includes('orange') ? 'bg-orange-500' : colorClass.includes('yellow') ? 'bg-yellow-500' : colorClass.includes('purple') ? 'bg-purple-500' : colorClass.includes('blue') ? 'bg-blue-500' : 'bg-gray-500'}`}
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No hay datos de abandono registrados
              </p>
            </div>
          )}
        </div>

        {/* Etapa de Abandono */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Etapa de Abandono
          </h2>
          
          {estadisticas?.porEtapa && estadisticas.porEtapa.length > 0 ? (
            <div className="space-y-4">
              {estadisticas.porEtapa.map((etapa, index) => {
                const porcentaje = totalAbandono > 0 
                  ? Math.round((etapa.cantidad / totalAbandono) * 100) 
                  : 0
                const colors = ["bg-yellow-500", "bg-orange-500", "bg-red-500"]
                
                return (
                  <div key={etapa._id} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-500'}`} />
                        <span className="font-medium">
                          {etapaLabels[etapa._id] || etapa._id}
                        </span>
                      </div>
                      <span className="text-sm font-semibold">{etapa.cantidad}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${colors[index] || 'bg-gray-500'}`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {porcentaje}% de los abandonos
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No hay datos de etapas registradas
              </p>
            </div>
          )}

          {/* Funnel Visual */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Embudo de conversión</p>
            <div className="flex flex-col items-center gap-1">
              <div className="w-full h-8 bg-green-500/20 rounded-t-lg flex items-center justify-center text-xs font-medium text-green-700">
                Visitantes
              </div>
              <div className="w-4/5 h-8 bg-yellow-500/20 flex items-center justify-center text-xs font-medium text-yellow-700">
                Agregan al carrito
              </div>
              <div className="w-3/5 h-8 bg-orange-500/20 flex items-center justify-center text-xs font-medium text-orange-700">
                Inician checkout
              </div>
              <div className="w-2/5 h-8 bg-primary/20 rounded-b-lg flex items-center justify-center text-xs font-medium text-primary">
                Compran ✓
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-primary/5 to-amber-500/5 rounded-2xl border border-primary/10 p-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Insights y Recomendaciones
        </h2>
        
        {insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border ${
                  insight.prioridad === 'alta' 
                    ? 'bg-red-500/5 border-red-500/20' 
                    : insight.prioridad === 'media'
                      ? 'bg-yellow-500/5 border-yellow-500/20'
                      : 'bg-green-500/5 border-green-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.prioridad === 'alta' 
                      ? 'bg-red-500/10 text-red-500' 
                      : insight.prioridad === 'media'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-green-500/10 text-green-500'
                  }`}>
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{insight.tipo}</p>
                    <p className="text-sm text-muted-foreground mt-1">{insight.mensaje}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Los insights se generarán cuando haya más datos de comportamiento
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Tip: Los insights analizan patrones de abandono y sugieren mejoras
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          <span>
            <strong>Nota:</strong> Los datos de abandono se registran automáticamente cuando un usuario 
            deja items en el carrito sin completar la compra. Para mejorar la precisión, 
            el sistema trackea la etapa exacta donde ocurrió el abandono.
          </span>
        </p>
      </div>
    </div>
  )
}
