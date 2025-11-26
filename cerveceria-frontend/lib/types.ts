// Tipos base de la API

export interface Usuario {
  _id: string
  nombre: string
  email: string
  telefono?: string
  fechaNacimiento?: string
  rol?: string
  avatar?: string
  direcciones?: Direccion[]
  createdAt?: string
}

export interface Direccion {
  _id?: string
  calle: string
  numero: string
  comuna: string
  ciudad: string
  region: string
  codigoPostal?: string
  pais?: string
  esPrincipal?: boolean
}

export interface Producto {
  _id: string
  nombre: string
  tipo: string
  descripcion: string
  precio: number
  stock: number
  abv: number
  ibu: number
  formato: string
  temperatura?: string
  imagen?: string
  ingredientes?: string[]
  valoracionPromedio?: number
  numeroValoraciones?: number
  activo: boolean
  // Campo computado para el frontend
  estado: "activo" | "inactivo"
  createdAt?: string
}

export interface ItemCarrito {
  _id: string
  carritoId: string
  productoId: Producto | string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Carrito {
  _id: string
  usuarioId: string
  items: ItemCarrito[]
  subtotal: number
  iva: number
  total: number
}

export interface Pedido {
  _id: string
  numeroOrden: string
  usuarioId: string
  direccionId: string
  items: {
    productoId: string
    nombreProducto: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }[]
  subtotal: number
  iva: number
  costoEnvio: number
  total: number
  estado: "Procesando" | "Confirmado" | "Enviado" | "Entregado" | "Cancelado"
  metodoPago: string
  fechaPedido: string
  createdAt?: string
}

export interface Valoracion {
  _id: string
  usuarioId: string
  productoId: string
  puntuacion: number
  comentario?: string
  verificado: boolean
  createdAt?: string
}

// Tipos de autenticacion
export interface AuthTokens {
  access_token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  nombre: string
  email: string
  password: string
  telefono?: string
  fechaNacimiento?: string
}

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}
