"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Pagination() {
  const currentPage = 1
  const totalPages = 3

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full border-border hover:border-primary hover:text-primary bg-transparent"
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {[1, 2, 3].map((page) => (
        <Button
          key={page}
          variant="outline"
          className={cn(
            "rounded-full w-10 h-10 border-border",
            page === currentPage
              ? "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90"
              : "hover:border-primary hover:text-primary",
          )}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="rounded-full border-border hover:border-primary hover:text-primary bg-transparent"
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
