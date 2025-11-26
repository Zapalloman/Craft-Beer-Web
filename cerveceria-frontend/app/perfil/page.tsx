import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileContent } from "@/components/profile-content"

export default function PerfilPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <ProfileContent />
      </main>
      <Footer />
    </div>
  )
}
