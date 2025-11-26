import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetailContent } from "@/components/product-detail-content"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductoPage({ params }: ProductPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <ProductDetailContent productId={id} />
      </main>
      <Footer />
    </div>
  )
}
