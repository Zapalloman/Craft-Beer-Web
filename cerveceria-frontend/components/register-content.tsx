"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ShieldCheck,
  Zap,
  Heart,
  Phone,
  Calendar,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"

export function RegisterContent() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Password validation requirements
  const passwordRequirements = useMemo(() => {
    const password = formData.password
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
  }, [formData.password])

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0

  const isFormValid =
    formData.nombre.trim() &&
    formData.email.trim() &&
    formData.telefono.trim() &&
    formData.fechaNacimiento &&
    isPasswordValid &&
    passwordsMatch &&
    acceptTerms

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)
    setError("")
    
    try {
      await register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
      })
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      {/* Registration Card */}
      <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-8 text-center relative overflow-hidden">
          {/* Decorative dots */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-2 h-2 bg-white rounded-full" />
            <div className="absolute top-12 right-12 w-3 h-3 bg-white rounded-full" />
            <div className="absolute bottom-6 left-1/4 w-1.5 h-1.5 bg-white rounded-full" />
            <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-white rounded-full" />
          </div>
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserPlus className="h-8 w-8 text-primary-foreground" />
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-primary-foreground italic">
                Crear Cuenta
              </h1>
            </div>
            <p className="text-primary-foreground/80 text-sm">Únete a nuestra comunidad cervecera</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              Nombre Completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="nombre"
                type="text"
                placeholder="Juan Pérez"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className="pl-11 h-12 bg-muted/30 border-muted focus:bg-background"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Correo Electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.cl"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-11 h-12 bg-muted/30 border-muted focus:bg-background"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="telefono" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Teléfono
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="telefono"
                type="tel"
                placeholder="+56 9 1234 5678"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                className="pl-11 h-12 bg-muted/30 border-muted focus:bg-background"
              />
            </div>
          </div>

          {/* Fecha de Nacimiento */}
          <div className="space-y-2">
            <Label htmlFor="fechaNacimiento" className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Fecha de Nacimiento
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                className="pl-11 h-12 bg-muted/30 border-muted focus:bg-background"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-muted-foreground" />
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-11 pr-11 h-12 bg-muted/30 border-muted focus:bg-background"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.password.length > 0 && (
              <div className="mt-3 p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-3">La contraseña debe contener:</p>
                <div className="space-y-2">
                  <RequirementItem valid={passwordRequirements.minLength} text="Mínimo 8 caracteres" />
                  <RequirementItem valid={passwordRequirements.hasUppercase} text="Una letra mayúscula" />
                  <RequirementItem valid={passwordRequirements.hasNumber} text="Un número" />
                  <RequirementItem valid={passwordRequirements.hasSpecial} text="Un carácter especial (@$!%*?&)" />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-muted-foreground" />
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`pl-11 pr-11 h-12 bg-muted/30 border-muted focus:bg-background ${
                  formData.confirmPassword.length > 0
                    ? passwordsMatch
                      ? "border-green-500 focus:border-green-500"
                      : "border-destructive focus:border-destructive"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {formData.confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-sm text-destructive mt-1">Las contraseñas no coinciden</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                Acepto los{" "}
                <Link href="#" className="text-primary hover:underline font-medium">
                  Términos y Condiciones
                </Link>{" "}
                y la{" "}
                <Link href="#" className="text-primary hover:underline font-medium">
                  Política de Privacidad
                </Link>
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base gap-2"
            size="lg"
            disabled={!isFormValid || isSubmitting}
          >
            <UserPlus className="h-5 w-5" />
            {isSubmitting ? "CREANDO CUENTA..." : "CREAR CUENTA"}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Iniciar Sesión
            </Link>
          </p>
        </form>
      </div>

      {/* Feature Icons */}
      <div className="mt-10 grid grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
            <ShieldCheck className="h-7 w-7 text-green-600" />
          </div>
          <p className="text-sm font-medium">Registro 100%</p>
          <p className="text-sm text-muted-foreground">seguro</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-3">
            <Zap className="h-7 w-7 text-yellow-600" />
          </div>
          <p className="text-sm font-medium">Proceso rápido y</p>
          <p className="text-sm text-muted-foreground">fácil</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
            <Heart className="h-7 w-7 text-red-500" />
          </div>
          <p className="text-sm font-medium">Beneficios</p>
          <p className="text-sm text-muted-foreground">exclusivos</p>
        </div>
      </div>
    </div>
  )
}

function RequirementItem({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {valid ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-destructive" />}
      <span className={valid ? "text-green-600 font-medium" : "text-muted-foreground"}>{text}</span>
    </div>
  )
}
