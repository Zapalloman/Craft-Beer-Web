"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api-client"
import type { Producto } from "@/lib/types"
import { ProductCard } from "./product-card"
import Link from "next/link"

const categories = [
  { id: "todas", label: "Todas" },
  { id: "Lager", label: "Lager" },
  { id: "Ale", label: "Ale" },
  { id: "IPA", label: "IPA" },
  { id: "Stout", label: "Stout" },
  { id: "Porter", label: "Porter" },
]

export function CatalogPageContent() {
  const [activeCategory, setActiveCategory] = useState("todas")
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Si es "todas", no enviamos filtro de tipo
        const params = activeCategory !== "todas" ? { tipo: activeCategory } : undefined
        const data = await api.getProductos(params)
        setProductos(data)
      } catch (err) {
        console.error("Error al cargar productos:", err)
        setError("Error al cargar los productos. Verifica que el backend esté corriendo.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductos()
  }, [activeCategory])

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-12">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === category.id
                      ? "bg-secondary text-secondary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Advanced Search */}
            <Link href="/buscar">
              <Button
                variant="outline"
                className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent"
              >
                <Search className="h-4 w-4 mr-2" />
                Busqueda Avanzada
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Cargando productos...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-destructive">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Asegúrate de que el servidor backend esté corriendo en http://localhost:3000
          </p>
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No se encontraron productos en esta categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto._id} product={producto} />
          ))}
        </div>
      )}
    </div>
  )
}
