"use client"
import { SearchResultCard } from "@/components/search-result-card"
import { Beer } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  abv: number
  image: string
}

interface SearchResultsProps {
  products: Product[]
}

export function SearchResults({ products }: SearchResultsProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Beer className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="font-serif text-xl text-foreground mb-2">No se encontraron resultados</h3>
        <p className="text-muted-foreground max-w-md">
          Intenta ajustar tus filtros o buscar con otros términos para encontrar la cerveza perfecta.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <SearchResultCard key={product.id} product={product} />
      ))}
    </div>
  )
}
