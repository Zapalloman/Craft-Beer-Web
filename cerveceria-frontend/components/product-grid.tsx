"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import type { Producto } from "@/lib/types"
import { ProductCard } from "./product-card"
import { Loader2 } from "lucide-react"

interface ProductGridProps {
  filters?: {
    tipo?: string
    precioMin?: number
    precioMax?: number
  }
}

export function ProductGrid({ filters }: ProductGridProps) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await api.getProductos(filters)
        setProductos(data)
      } catch (err) {
        console.error("Error al cargar productos:", err)
        setError("Error al cargar los productos. Verifica que el backend esté corriendo.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductos()
  }, [filters])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando productos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">{error}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Asegúrate de que el servidor backend esté corriendo en http://localhost:3000
        </p>
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No se encontraron productos</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <ProductCard key={producto._id} product={producto} />
      ))}
    </div>
  )
}
