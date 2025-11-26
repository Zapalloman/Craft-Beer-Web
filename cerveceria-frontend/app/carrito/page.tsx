import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartContent } from "@/components/cart-content"

export const metadata = {
  title: "Tu Carrito — Craft & Beer",
  description: "Revisa y gestiona los productos en tu carrito de compras de cervezas artesanales premium.",
}

export default function CarritoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CartContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
