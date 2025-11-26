import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoginContent } from "@/components/login-content"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <LoginContent />
      </main>
      <Footer />
    </div>
  )
}
