"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { api } from "./api-client"
import { useAuth } from "./auth-context"
import type { Carrito, ItemCarrito } from "./types"

interface CartContextType {
  carrito: Carrito | null
  items: ItemCarrito[]
  itemCount: number
  isLoading: boolean
  agregarItem: (productoId: string, cantidad: number) => Promise<void>
  actualizarCantidad: (productoId: string, cantidad: number) => Promise<void>
  eliminarItem: (productoId: string) => Promise<void>
  vaciarCarrito: () => Promise<void>
  refetch: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { usuario, isAuthenticated } = useAuth()
  const [carrito, setCarrito] = useState<Carrito | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchCarrito = useCallback(async () => {
    if (!usuario?._id) return

    setIsLoading(true)
    try {
      const data = await api.getCarrito(usuario._id)
      setCarrito(data)
    } catch (error) {
      console.error("Error al cargar carrito:", error)
    } finally {
      setIsLoading(false)
    }
  }, [usuario?._id])

  useEffect(() => {
    if (isAuthenticated) {
      fetchCarrito()
    } else {
      setCarrito(null)
    }
  }, [isAuthenticated, fetchCarrito])

  const agregarItem = useCallback(
    async (productoId: string, cantidad: number) => {
      if (!usuario?._id) return

      try {
        const data = await api.agregarAlCarrito({
          usuarioId: usuario._id,
          productoId,
          cantidad,
        })
        setCarrito(data)
      } catch (error) {
        console.error("Error al agregar al carrito:", error)
        throw error
      }
    },
    [usuario?._id],
  )

  const actualizarCantidad = useCallback(
    async (productoId: string, cantidad: number) => {
      if (!usuario?._id) return

      try {
        const data = await api.actualizarItemCarrito(productoId, {
          usuarioId: usuario._id,
          cantidad,
        })
        setCarrito(data)
      } catch (error) {
        console.error("Error al actualizar cantidad:", error)
        throw error
      }
    },
    [usuario?._id],
  )

  const eliminarItem = useCallback(
    async (productoId: string) => {
      if (!usuario?._id) return

      try {
        const data = await api.eliminarItemCarrito(productoId, usuario._id)
        setCarrito(data)
      } catch (error) {
        console.error("Error al eliminar item:", error)
        throw error
      }
    },
    [usuario?._id],
  )

  const vaciarCarrito = useCallback(async () => {
    if (!usuario?._id) return

    try {
      await api.vaciarCarrito(usuario._id)
      setCarrito(null)
    } catch (error) {
      console.error("Error al vaciar carrito:", error)
      throw error
    }
  }, [usuario?._id])

  return (
    <CartContext.Provider
      value={{
        carrito,
        items: carrito?.items || [],
        itemCount: carrito?.items?.reduce((acc, item) => acc + item.cantidad, 0) || 0,
        isLoading,
        agregarItem,
        actualizarCantidad,
        eliminarItem,
        vaciarCarrito,
        refetch: fetchCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart debe usarse dentro de un CartProvider")
  }
  return context
}
