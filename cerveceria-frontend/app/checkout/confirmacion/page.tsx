import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ConfirmationContent } from "@/components/confirmation-content"
import { Loader2 } from "lucide-react"

function ConfirmationLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      <span className="ml-2 text-muted-foreground">Cargando confirmación...</span>
    </div>
  )
}

export default function ConfirmacionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Suspense fallback={<ConfirmationLoading />}>
            <ConfirmationContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
