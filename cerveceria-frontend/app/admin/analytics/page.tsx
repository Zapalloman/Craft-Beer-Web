"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnalyticsContent } from "@/components/admin/analytics-content"

export default function AnalyticsAdminPage() {
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = sessionStorage.getItem("admin_authenticated")
      
      if (isAdmin === "true") {
        setIsAuthorized(true)
        setIsVerifying(false)
      } else {
        setIsAuthorized(false)
        setIsVerifying(false)
        window.location.href = "/admin"
      }
    }
    
    checkAuth()
  }, [])

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Verificando acceso...</span>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Redirigiendo...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 pb-12">
        <AnalyticsContent />
      </main>
      <Footer />
    </div>
  )
}
