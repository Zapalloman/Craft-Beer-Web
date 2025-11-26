import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchPageContent } from "@/components/search-page-content"

export default function BuscarPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <SearchPageContent />
      </main>
      <Footer />
    </div>
  )
}
