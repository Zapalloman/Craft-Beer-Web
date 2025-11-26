"use client"

import { Filter, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { FilterState } from "@/components/search-page-content"
import type { Producto } from "@/lib/types"

interface SearchFiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  onClear: () => void
  totalResults: number
  productos: Producto[] // Productos para calcular contadores
}

const beerTypeLabels: Record<string, string> = {
  ipa: "IPA",
  stout: "Stout",
  lager: "Lager",
  porter: "Porter",
  ale: "Ale",
}

const abvRangeLabels = [
  { id: "low", label: "Baja (0-4.5%)" },
  { id: "medium", label: "Media (4.5-6.5%)" },
  { id: "high", label: "Alta (6.5%+)" },
]

const priceRangeLabels = [
  { id: "budget", label: "Económica ($3.000-$4.000)" },
  { id: "mid", label: "Media ($4.000-$5.500)" },
  { id: "premium", label: "Premium ($5.500+)" },
]

export function SearchFilters({ filters, setFilters, onClear, totalResults, productos }: SearchFiltersProps) {
  // Calcular contadores dinámicamente basado en los productos
  const typeCounts = productos.reduce((acc, p) => {
    const tipo = p.tipo.toLowerCase()
    acc[tipo] = (acc[tipo] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const abvCounts = {
    low: productos.filter(p => p.abv < 4.5).length,
    medium: productos.filter(p => p.abv >= 4.5 && p.abv < 6.5).length,
    high: productos.filter(p => p.abv >= 6.5).length,
  }

  const priceCounts = {
    budget: productos.filter(p => p.precio >= 3000 && p.precio < 4000).length,
    mid: productos.filter(p => p.precio >= 4000 && p.precio < 5500).length,
    premium: productos.filter(p => p.precio >= 5500).length,
  }

  // Generar tipos de cerveza dinámicamente
  const beerTypes = Object.entries(typeCounts).map(([id, count]) => ({
    id,
    label: beerTypeLabels[id] || id.charAt(0).toUpperCase() + id.slice(1),
    count,
  }))

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const currentValues = filters[category]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    setFilters({ ...filters, [category]: newValues })
  }

  const hasActiveFilters = filters.types.length > 0 || filters.abvRanges.length > 0 || filters.priceRanges.length > 0

  return (
    <div className="bg-card rounded-xl border border-border p-6 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-serif text-lg font-medium text-foreground">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Beer Types */}
      <div className="mb-6 pb-6 border-b border-border">
        <h4 className="font-medium text-foreground mb-4">Tipo de Cerveza</h4>
        <div className="space-y-3">
          {beerTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-3 group">
              <Checkbox
                id={`type-${type.id}`}
                checked={filters.types.includes(type.id)}
                onCheckedChange={() => toggleFilter("types", type.id)}
                className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`type-${type.id}`}
                className="flex-1 text-sm font-normal text-foreground cursor-pointer group-hover:text-primary transition-colors"
              >
                {type.label}
                <span className="text-muted-foreground ml-1">({type.count})</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* ABV Ranges */}
      <div className="mb-6 pb-6 border-b border-border">
        <h4 className="font-medium text-foreground mb-4">Graduación Alcohólica</h4>
        <div className="space-y-3">
          {abvRangeLabels.map((range) => (
            <div key={range.id} className="flex items-center space-x-3 group">
              <Checkbox
                id={`abv-${range.id}`}
                checked={filters.abvRanges.includes(range.id)}
                onCheckedChange={() => toggleFilter("abvRanges", range.id)}
                className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`abv-${range.id}`}
                className="flex-1 text-sm font-normal text-foreground cursor-pointer group-hover:text-primary transition-colors"
              >
                {range.label}
                <span className="text-muted-foreground ml-1">({abvCounts[range.id as keyof typeof abvCounts]})</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Ranges */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-4">Rango de Precio</h4>
        <div className="space-y-3">
          {priceRangeLabels.map((range) => (
            <div key={range.id} className="flex items-center space-x-3 group">
              <Checkbox
                id={`price-${range.id}`}
                checked={filters.priceRanges.includes(range.id)}
                onCheckedChange={() => toggleFilter("priceRanges", range.id)}
                className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`price-${range.id}`}
                className="flex-1 text-sm font-normal text-foreground cursor-pointer group-hover:text-primary transition-colors"
              >
                {range.label}
                <span className="text-muted-foreground ml-1">({priceCounts[range.id as keyof typeof priceCounts]})</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm text-center text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{totalResults}</span> de {productos.length} resultados
        </p>
      </div>
    </div>
  )
}
