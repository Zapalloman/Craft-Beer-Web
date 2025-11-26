"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Lock, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api-client"

export function PagoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pedidoId = searchParams.get("pedido")
  const monto = searchParams.get("monto")
  const metodo = searchParams.get("metodo")

  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    if (!pedidoId || !monto || !metodo) {
      router.push("/")
    }
  }, [pedidoId, monto, metodo, router])

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const chunks = cleaned.match(/.{1,4}/g)
    return chunks ? chunks.join(" ") : cleaned
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pedidoId || !monto || !metodo) return

    // Validaciones básicas
    if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Número de tarjeta inválido")
      return
    }

    if (formData.cvv.length !== 3) {
      alert("CVV inválido")
      return
    }

    setIsProcessing(true)

    try {
      // Simular delay de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular pago
      await api.simularPago({
        pedidoId,
        metodo,
        monto: parseFloat(monto),
      })

      // Redirigir a confirmación
      router.push(`/checkout/confirmacion?pedido=${pedidoId}`)
    } catch (error) {
      console.error("Error al procesar pago:", error)
      alert("Error al procesar el pago. Por favor intenta nuevamente.")
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: string) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(parseFloat(price))

  if (!pedidoId || !monto) {
    return null
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="gap-2 mb-4"
            onClick={() => router.back()}
            disabled={isProcessing}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="font-serif text-3xl font-semibold flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            Pago con Tarjeta
          </h1>
          <p className="text-muted-foreground mt-2">
            Ingresa los datos de tu tarjeta de crédito o débito
          </p>
        </div>

        {/* Security Banner */}
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
            <Lock className="h-5 w-5" />
            <div className="text-sm">
              <p className="font-semibold">Transacción segura</p>
              <p>Tus datos están protegidos con encriptación SSL</p>
            </div>
          </div>
        </div>

        {/* Payment Amount */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total a pagar</span>
            <span className="text-3xl font-bold text-primary">{formatPrice(monto)}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">
              Número de tarjeta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={formData.cardNumber}
              onChange={(e) =>
                setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })
              }
              disabled={isProcessing}
              className="h-12 text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">
              Nombre en la tarjeta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cardName"
              placeholder="JUAN PÉREZ"
              value={formData.cardName}
              onChange={(e) =>
                setFormData({ ...formData, cardName: e.target.value.toUpperCase() })
              }
              disabled={isProcessing}
              className="h-12"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">
                Fecha de vencimiento <span className="text-destructive">*</span>
              </Label>
              <Input
                id="expiryDate"
                placeholder="MM/AA"
                maxLength={5}
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: formatExpiryDate(e.target.value) })
                }
                disabled={isProcessing}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">
                CVV <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cvv"
                type="password"
                placeholder="123"
                maxLength={3}
                value={formData.cvv}
                onChange={(e) =>
                  setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") })
                }
                disabled={isProcessing}
                className="h-12"
                required
              />
            </div>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-2">
              🔹 Datos de prueba (simulación):
            </p>
            <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
              <li>• Tarjeta: 4111 1111 1111 1111</li>
              <li>• Nombre: Cualquier nombre</li>
              <li>• Vencimiento: Cualquier fecha futura (ej: 12/25)</li>
              <li>• CVV: Cualquier 3 dígitos (ej: 123)</li>
            </ul>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Procesando pago...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                Pagar {formatPrice(monto)}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
