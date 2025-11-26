import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ConfirmationContent } from "@/components/confirmation-content"

export default function ConfirmacionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <ConfirmationContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
