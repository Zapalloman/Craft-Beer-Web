import type {
  Usuario,
  Producto,
  Carrito,
  Pedido,
  Valoracion,
  Direccion,
  AuthTokens,
  LoginCredentials,
  RegisterData,
} from "./types"

// URL del backend - Puerto 3000
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    // Obtener token del localStorage (client-side)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token")
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    return headers
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = await this.getHeaders()

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Error de conexión con el servidor",
        statusCode: response.status,
      }))
      throw new Error(error.message || `Error ${response.status}`)
    }

    // Manejar respuestas vacías
    const text = await response.text()
    if (!text) return {} as T
    return JSON.parse(text)
  }

  // ==================== AUTH ====================

  async login(credentials: LoginCredentials): Promise<AuthTokens & { usuario: Usuario }> {
    const response = await this.request<AuthTokens & { usuario: Usuario }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    // Guardar token (el backend devuelve access_token)
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", response.access_token)
      localStorage.setItem("usuario", JSON.stringify(response.usuario))
    }

    return response
  }

  async register(data: RegisterData): Promise<AuthTokens & { usuario: Usuario }> {
    const response = await this.request<AuthTokens & { usuario: Usuario }>("/auth/registro", {
      method: "POST",
      body: JSON.stringify(data),
    })

    // Guardar token después del registro
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", response.access_token)
      localStorage.setItem("usuario", JSON.stringify(response.usuario))
    }

    return response
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("usuario")
    }
  }

  // ==================== PRODUCTOS ====================

  async getProductos(params?: {
    tipo?: string
    precioMin?: number
    precioMax?: number
    abvMin?: number
    abvMax?: number
  }): Promise<Producto[]> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") searchParams.append(key, String(value))
      })
    }
    const query = searchParams.toString()
    return this.request<Producto[]>(`/productos${query ? `?${query}` : ""}`)
  }

  async buscarProductos(q: string): Promise<Producto[]> {
    return this.request<Producto[]>(`/productos/buscar?q=${encodeURIComponent(q)}`)
  }

  async getProducto(id: string): Promise<Producto> {
    return this.request<Producto>(`/productos/${id}`)
  }

  async crearProducto(data: Partial<Producto>): Promise<Producto> {
    return this.request<Producto>("/productos", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async actualizarProducto(id: string, data: Partial<Producto>): Promise<Producto> {
    return this.request<Producto>(`/productos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async eliminarProducto(id: string): Promise<void> {
    return this.request<void>(`/productos/${id}`, {
      method: "DELETE",
    })
  }

  async uploadImagenProducto(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData()
    formData.append("imagen", file)

    const response = await fetch(`${this.baseUrl}/productos/upload-imagen`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Error al subir imagen" }))
      throw new Error(error.message || `Error ${response.status}`)
    }

    return response.json()
  }

  // ==================== CARRITO ====================

  async getCarrito(usuarioId: string): Promise<Carrito> {
    return this.request<Carrito>(`/carrito?usuarioId=${usuarioId}`)
  }

  async agregarAlCarrito(data: {
    usuarioId: string
    productoId: string
    cantidad: number
  }): Promise<Carrito> {
    return this.request<Carrito>("/carrito/items", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async actualizarItemCarrito(productoId: string, data: { usuarioId: string; cantidad: number }): Promise<Carrito> {
    return this.request<Carrito>(`/carrito/items/${productoId}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async eliminarItemCarrito(productoId: string, usuarioId: string): Promise<Carrito> {
    return this.request<Carrito>(`/carrito/items/${productoId}?usuarioId=${usuarioId}`, {
      method: "DELETE",
    })
  }

  async vaciarCarrito(usuarioId: string): Promise<void> {
    return this.request<void>(`/carrito?usuarioId=${usuarioId}`, {
      method: "DELETE",
    })
  }

  // ==================== PEDIDOS ====================

  async getPedidos(usuarioId: string): Promise<Pedido[]> {
    return this.request<Pedido[]>(`/pedidos?usuarioId=${usuarioId}`)
  }

  async getPedido(id: string): Promise<Pedido> {
    return this.request<Pedido>(`/pedidos/${id}`)
  }

  async crearPedido(data: {
    usuarioId: string
    direccionId: string
    metodoPago: string
  }): Promise<Pedido> {
    return this.request<Pedido>("/pedidos", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Admin: Obtener todos los pedidos
  async getTodosPedidos(params?: {
    estado?: string
    fechaInicio?: string
    fechaFin?: string
  }): Promise<Pedido[]> {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value)
      })
    }
    const query = searchParams.toString()
    return this.request<Pedido[]>(`/pedidos/admin/todos${query ? `?${query}` : ""}`)
  }

  // Admin: Obtener estadísticas de pedidos
  async getEstadisticasPedidos(): Promise<any> {
    return this.request<any>("/pedidos/admin/estadisticas")
  }

  // Admin: Actualizar estado de pedido
  async actualizarEstadoPedido(id: string, estado: string): Promise<Pedido> {
    return this.request<Pedido>(`/pedidos/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    })
  }

  // Analytics: Dashboard
  async getDashboard(): Promise<any> {
    return this.request<any>("/analytics/dashboard")
  }

  // Analytics: Productos más vendidos
  async getProductosMasVendidos(limite?: number): Promise<any> {
    return this.request<any>(`/analytics/productos/mas-vendidos${limite ? `?limite=${limite}` : ""}`)
  }

  // Analytics: Estadísticas de abandono de carritos
  async getEstadisticasAbandono(): Promise<any> {
    return this.request<any>("/analytics/carritos-abandonados/estadisticas")
  }

  // Analytics: Carritos abandonados
  async getCarritosAbandonados(): Promise<any> {
    return this.request<any>("/analytics/carritos-abandonados")
  }

  // Analytics: Motivos de abandono
  async getMotivosAbandono(): Promise<any> {
    return this.request<any>("/analytics/carritos-abandonados/motivos")
  }

  // Analytics: Resumen de eventos
  async getResumenEventos(): Promise<any> {
    return this.request<any>("/analytics/eventos/resumen")
  }

  // Analytics: Insights
  async getInsights(): Promise<any> {
    return this.request<any>("/analytics/insights")
  }

  // Analytics: Dashboard completo
  async getAnalyticsDashboard(): Promise<any> {
    return this.request<any>("/analytics/dashboard")
  }

  async iniciarPago(data: {
    pedidoId: string
    numeroOrden: string
    monto: number
    email: string
  }): Promise<{ flowUrl: string; token: string }> {
    return this.request<{ flowUrl: string; token: string }>("/pagos/flow/crear", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async simularPago(data: {
    pedidoId: string
    metodo: string
    monto: number
  }): Promise<{ success: boolean; pagoId: string }> {
    return this.request<{ success: boolean; pagoId: string }>("/pagos/simular", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // ==================== USUARIOS ====================

  async getUsuario(id: string): Promise<Usuario> {
    return this.request<Usuario>(`/usuarios/${id}`)
  }

  async actualizarUsuario(id: string, data: Partial<Usuario>): Promise<Usuario> {
    return this.request<Usuario>(`/usuarios/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  // ==================== DIRECCIONES ====================

  async getDirecciones(usuarioId: string): Promise<Direccion[]> {
    return this.request<Direccion[]>(`/usuarios/${usuarioId}/direcciones`)
  }

  async crearDireccion(usuarioId: string, data: Omit<Direccion, "_id">): Promise<Direccion> {
    return this.request<Direccion>(`/usuarios/${usuarioId}/direcciones`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async eliminarDireccion(usuarioId: string, direccionId: string): Promise<void> {
    return this.request<void>(`/usuarios/${usuarioId}/direcciones/${direccionId}`, {
      method: "DELETE",
    })
  }

  // ==================== VALORACIONES ====================

  async getValoracionesProducto(productoId: string): Promise<Valoracion[]> {
    return this.request<Valoracion[]>(`/valoraciones/producto/${productoId}`)
  }

  async crearValoracion(data: {
    usuarioId: string
    productoId: string
    puntuacion: number
    comentario?: string
  }): Promise<Valoracion> {
    return this.request<Valoracion>("/valoraciones", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async actualizarValoracion(id: string, data: Partial<Valoracion>): Promise<Valoracion> {
    return this.request<Valoracion>(`/valoraciones/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async eliminarValoracion(id: string): Promise<void> {
    return this.request<void>(`/valoraciones/${id}`, {
      method: "DELETE",
    })
  }
}

// Exportar instancia singleton
export const api = new ApiClient(API_URL)
