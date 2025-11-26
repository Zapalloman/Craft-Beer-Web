import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CatalogPageContent } from "@/components/catalog-page-content"
import { Footer } from "@/components/footer"

export default function CatalogoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CatalogPageContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
