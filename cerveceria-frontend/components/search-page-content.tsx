"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchFilters } from "@/components/search-filters"
import { SearchResults } from "@/components/search-results"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api-client"
import type { Producto } from "@/lib/types"

export interface FilterState {
  types: string[]
  abvRanges: string[]
  priceRanges: string[]
}

export function SearchPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    abvRanges: [],
    priceRanges: [],
  })
  const [sortBy, setSortBy] = useState("default")

  // Cargar todos los productos al inicio
  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true)
      try {
        const data = await api.getProductos()
        setProductos(data)
      } catch (error) {
        console.error("Error al cargar productos:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProductos()
  }, [])

  // Filter logic
  const filteredProducts = productos.filter((product) => {
    // Search term filter
    if (
      searchTerm &&
      !product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(product.tipo.toLowerCase())) {
      return false
    }

    // ABV filter
    if (filters.abvRanges.length > 0) {
      const matchesAbv = filters.abvRanges.some((range) => {
        if (range === "low") return product.abv < 4.5
        if (range === "medium") return product.abv >= 4.5 && product.abv < 6.5
        if (range === "high") return product.abv >= 6.5
        return true
      })
      if (!matchesAbv) return false
    }

    // Price filter
    if (filters.priceRanges.length > 0) {
      const matchesPrice = filters.priceRanges.some((range) => {
        if (range === "budget") return product.precio >= 3000 && product.precio < 4000
        if (range === "mid") return product.precio >= 4000 && product.precio < 5500
        if (range === "premium") return product.precio >= 5500
        return true
      })
      if (!matchesPrice) return false
    }

    return true
  })

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.nombre.localeCompare(b.nombre)
      case "price-low":
        return a.precio - b.precio
      case "price-high":
        return b.precio - a.precio
      case "abv":
        return b.abv - a.abv
      default:
        return 0
    }
  })

  // Convertir Producto a formato esperado por SearchResults
  const resultsData = sortedProducts.map((p) => ({
    id: p._id,
    name: p.nombre,
    category: p.tipo,
    description: p.descripcion,
    price: p.precio,
    abv: p.abv,
    image: p.imagen || "/placeholder.svg?height=300&width=300",
  }))

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    
    setIsLoading(true)
    try {
      const data = await api.buscarProductos(searchTerm)
      setProductos(data)
    } catch (error) {
      console.error("Error en búsqueda:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearFilters = async () => {
    setFilters({ types: [], abvRanges: [], priceRanges: [] })
    setSearchTerm("")
    // Recargar todos los productos
    setIsLoading(true)
    try {
      const data = await api.getProductos()
      setProductos(data)
    } catch (error) {
      console.error("Error al cargar productos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background">
      {/* Search Header */}
      <section className="py-12 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-center text-foreground mb-8">
            Buscar <span className="text-primary">Cervezas Artesanales</span>
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex gap-2 bg-card p-2 rounded-xl border border-border shadow-lg">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre, tipo o características..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button type="submit" className="px-6">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <SearchFilters
                filters={filters}
                setFilters={setFilters}
                onClear={clearFilters}
                totalResults={resultsData.length}
                productos={productos}
              />
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-card rounded-xl border border-border">
                <div>
                  <h2 className="font-serif text-xl text-foreground">Resultados de Búsqueda</h2>
                  <p className="text-sm text-muted-foreground">
                    Mostrando {resultsData.length} cervezas artesanales
                  </p>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-background">
                    <SelectValue placeholder="Ordenar por..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Ordenar por...</SelectItem>
                    <SelectItem value="name">Nombre A-Z</SelectItem>
                    <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                    <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                    <SelectItem value="abv">Graduación Alcohólica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Product Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Cargando productos...</span>
                </div>
              ) : (
                <SearchResults products={resultsData} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
