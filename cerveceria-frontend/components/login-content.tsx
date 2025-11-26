"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, Zap, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"

export function LoginContent() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login({
        email: formData.email,
        password: formData.password,
      })
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Card de Login */}
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
          {/* Header azul */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-8 text-center relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-8 w-2 h-2 bg-white rounded-full" />
              <div className="absolute top-12 right-12 w-3 h-3 bg-white rounded-full" />
              <div className="absolute bottom-8 left-16 w-2 h-2 bg-white rounded-full" />
            </div>
            <div className="flex items-center justify-center gap-2 text-white mb-2">
              <LogIn className="h-6 w-6" />
              <h1 className="font-serif text-2xl font-bold">Iniciar Sesión</h1>
            </div>
            <p className="text-blue-100 text-sm">Accede a tu cuenta cervecera</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="tu@email.cl"
                  className="pl-10 h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  className="pl-10 pr-10 h-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Recordarme
                </label>
              </div>
              <Link href="/recuperar-password" className="text-sm text-blue-600 hover:underline">
                Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  INICIAR SESIÓN
                </span>
              )}
            </Button>

            {/* Link a registro */}
            <p className="text-center text-sm text-muted-foreground">
              No tienes una cuenta?{" "}
              <Link href="/registro" className="text-blue-600 font-medium hover:underline">
                Regístrate
              </Link>
            </p>
          </form>
        </div>

        {/* Beneficios */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground">Acceso 100% seguro</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-xs text-muted-foreground">Proceso rápido</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Gift className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground">Ofertas exclusivas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
