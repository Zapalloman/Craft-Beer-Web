import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReviewsContent } from "@/components/reviews-content"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ValoracionesPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <ReviewsContent productId={id} />
      </main>
      <Footer />
    </div>
  )
}
