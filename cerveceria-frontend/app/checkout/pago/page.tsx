import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { PagoContent } from "@/components/pago-content"

function PagoLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-muted-foreground">Cargando formulario de pago...</span>
      </div>
    </div>
  )
}

export default function PagoPage() {
  return (
    <Suspense fallback={<PagoLoading />}>
      <PagoContent />
    </Suspense>
  )
}
