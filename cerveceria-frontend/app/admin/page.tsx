"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, Eye, EyeOff, Loader2, Beer, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api-client"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Verificar si ya está autenticado como admin
  useEffect(() => {
    const isAdmin = sessionStorage.getItem("admin_authenticated")
    if (isAdmin === "true") {
      router.push("/admin/inventario")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Usar la API real de autenticación
      const response = await api.login({ email, password })
      
      // Verificar que el usuario tenga rol de admin
      if (response.usuario.rol !== "admin") {
        setError("No tienes permisos de administrador")
        // Limpiar el token si no es admin
        localStorage.removeItem("access_token")
        localStorage.removeItem("usuario")
        setIsLoading(false)
        return
      }

      // Guardar autenticación de admin en sessionStorage
      sessionStorage.setItem("admin_authenticated", "true")
      sessionStorage.setItem("admin_login_time", Date.now().toString())
      sessionStorage.setItem("admin_user", JSON.stringify(response.usuario))
      
      router.push("/admin/inventario")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Beer className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-bold">Craft & Beer</h1>
          <p className="text-muted-foreground mt-1">Panel de Administración</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl border shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Acceso Restringido</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@craftbeer.com"
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  className="pl-10 pr-10 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verificando...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Solo personal autorizado
        </p>
      </div>
    </div>
  )
}
