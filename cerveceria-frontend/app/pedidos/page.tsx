import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OrdersContent } from "@/components/orders-content"

export default function PedidosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <OrdersContent />
      </main>
      <Footer />
    </div>
  )
}
