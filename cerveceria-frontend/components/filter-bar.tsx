"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categories = [
  { id: "todas", label: "Todas" },
  { id: "lager", label: "Lager" },
  { id: "ale", label: "Ale" },
  { id: "ipa", label: "IPA" },
  { id: "stout", label: "Stout" },
  { id: "porter", label: "Porter" },
]

export function FilterBar() {
  const [activeCategory, setActiveCategory] = useState("todas")

  return (
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
          <Button
            variant="outline"
            className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent"
          >
            <Search className="h-4 w-4 mr-2" />
            Busqueda Avanzada
          </Button>
        </div>
      </div>
    </div>
  )
}
