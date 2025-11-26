"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, ShieldCheck, Lock, ArrowLeft, CheckCircle2, Wallet, Info, MapPin, Loader2, ShoppingBag, Home, Star, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api-client"
import type { Direccion } from "@/lib/types"

const regiones = [
  "Región Metropolitana",
  "Valparaíso",
  "Biobío",
  "La Araucanía",
  "Los Lagos",
  "Maule",
  "O'Higgins",
  "Coquimbo",
  "Antofagasta",
  "Atacama",
  "Tarapacá",
  "Arica y Parinacota",
  "Los Ríos",
  "Aysén",
  "Magallanes",
]

export function CheckoutContent() {
  const router = useRouter()
  const { carrito, isLoading: cartLoading, vaciarCarrito } = useCart()
  const { usuario, isAuthenticated } = useAuth()
  
  const [paymentMethod, setPaymentMethod] = useState("flow")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [saveAddress, setSaveAddress] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [selectedDireccion, setSelectedDireccion] = useState<string>("")
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    calle: "",
    numero: "",
    comuna: "",
    ciudad: "",
    region: "",
    codigoPostal: "",
    pais: "Chile",
    notas: "",
  })

  useEffect(() => {
    const fetchDirecciones = async () => {
      if (usuario?._id) {
        try {
          const dirs = await api.getDirecciones(usuario._id)
          setDirecciones(dirs)
          // Si hay direcciones, seleccionar la principal o la primera
          if (dirs.length > 0) {
            const principal = dirs.find(d => d.esPrincipal)
            setSelectedDireccion(principal?._id || dirs[0]._id)
            setShowNewAddressForm(false)
          } else {
            // Si no hay direcciones, mostrar el formulario
            setShowNewAddressForm(true)
          }
        } catch (error) {
          console.error("Error al cargar direcciones:", error)
          setShowNewAddressForm(true)
        }
      }
    }
    fetchDirecciones()
  }, [usuario])

  const items = carrito?.items || []
  const subtotal = carrito?.subtotal || 0
  const iva = carrito?.iva || 0
  const total = carrito?.total || 0
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0)
  const shippingThreshold = 15000
  const shipping = subtotal >= shippingThreshold ? 0 : 2500
  const finalTotal = total + shipping

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)

  const handleConfirmOrder = async () => {
    if (!acceptTerms || !usuario) return
    setIsSubmitting(true)
    
    try {
      // Determinar dirección a usar
      let direccionId = selectedDireccion
      
      // Si está mostrando formulario de nueva dirección o no hay direcciones guardadas
      if (showNewAddressForm || direcciones.length === 0) {
        // Validar campos requeridos
        if (!formData.calle || !formData.numero || !formData.comuna || !formData.ciudad || !formData.region) {
          alert("Por favor completa todos los campos requeridos de la dirección")
          setIsSubmitting(false)
          return
        }
        
        // Crear nueva dirección si se debe guardar o si no hay ninguna
        if (saveAddress || direcciones.length === 0) {
          const nuevaDireccion = await api.crearDireccion(usuario._id, {
            ...formData,
            esPrincipal: direcciones.length === 0,
          })
          direccionId = nuevaDireccion._id
        } else {
          // Usar dirección temporal (sin guardar) - crear igual pero marcar para no guardar
          const nuevaDireccion = await api.crearDireccion(usuario._id, {
            ...formData,
            esPrincipal: false,
            alias: "Temporal",
          })
          direccionId = nuevaDireccion._id
        }
      }
      
      if (!direccionId) {
        alert("Debes seleccionar o ingresar una dirección de envío")
        setIsSubmitting(false)
        return
      }

      // Crear pedido
      const pedido = await api.crearPedido({
        usuarioId: usuario._id,
        direccionId,
        metodoPago: paymentMethod,
      })

      // Redirigir según método de pago
      if (paymentMethod === "flow") {
        // Iniciar pago con Flow
        const pagoResult = await api.iniciarPago({
          pedidoId: pedido._id,
          numeroOrden: pedido.numeroOrden,
          monto: finalTotal,
          email: usuario.email,
        })
        
        if (pagoResult.flowUrl) {
          window.location.href = pagoResult.flowUrl
          return
        }
      } else if (paymentMethod === "card") {
        // Redirigir a página de pago con tarjeta
        router.push(`/checkout/pago?pedido=${pedido._id}&monto=${finalTotal}&metodo=card`)
        return
      }

      // Redirigir a confirmación
      router.push(`/checkout/confirmacion?pedido=${pedido._id}`)
    } catch (error) {
      console.error("Error al crear pedido:", error)
      alert("Error al procesar el pedido. Por favor intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Requiere autenticación
  if (!isAuthenticated) {
    return (
      <div className="text-center py-20">
        <div className="bg-card border border-dashed border-border rounded-3xl p-12 max-w-lg mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-3">Inicia sesión</h2>
          <p className="text-muted-foreground mb-8">
            Debes iniciar sesión para continuar con la compra.
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Estado de carga
  if (cartLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando...</span>
      </div>
    )
  }

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-card border border-dashed border-border rounded-3xl p-12 max-w-lg mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-3">Carrito vacío</h2>
          <p className="text-muted-foreground mb-8">
            No hay productos en tu carrito para continuar con la compra.
          </p>
          <Link href="/">
            <Button size="lg" className="gap-2">
              Ver Catálogo
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Catálogo
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/carrito" className="hover:text-primary transition-colors">
              Carrito
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium">Checkout</li>
        </ol>
      </nav>

      {/* Title */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold flex items-center gap-3 mb-2">
          <CreditCard className="h-8 w-8 text-primary" />
          Finalizar Compra
        </h1>
        <p className="text-muted-foreground">
          Completa los datos de envío y elige tu método de pago para finalizar tu pedido.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {/* Step 1 - Completed */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <span className="text-sm mt-2 font-semibold text-green-600">Carrito</span>
          </div>

          {/* Line */}
          <div className="flex-1 h-1 bg-green-500 mx-2" />

          {/* Step 2 - Current */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-primary/20">
              <span className="font-bold">2</span>
            </div>
            <span className="text-sm mt-2 font-semibold text-primary">Checkout</span>
          </div>

          {/* Line */}
          <div className="flex-1 h-1 bg-muted mx-2" />

          {/* Step 3 - Pending */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              <span className="font-bold">3</span>
            </div>
            <span className="text-sm mt-2 text-muted-foreground">Confirmación</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Dirección de Envío
            </h2>

            {/* Direcciones guardadas */}
            {direcciones.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-4">Selecciona una dirección guardada:</p>
                <div className="grid grid-cols-1 gap-3">
                  {direcciones.map((direccion) => (
                    <label
                      key={direccion._id}
                      className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedDireccion === direccion._id && !showNewAddressForm
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="direccion"
                        value={direccion._id}
                        checked={selectedDireccion === direccion._id && !showNewAddressForm}
                        onChange={() => {
                          setSelectedDireccion(direccion._id)
                          setShowNewAddressForm(false)
                        }}
                        className="mt-1 w-4 h-4 text-primary accent-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{direccion.alias || "Dirección"}</span>
                          {direccion.esPrincipal && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              Principal
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {direccion.calle} {direccion.numero}
                          {direccion.depto && `, ${direccion.depto}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {direccion.comuna}, {direccion.ciudad} - {direccion.region}
                        </p>
                      </div>
                    </label>
                  ))}

                  {/* Opción para agregar nueva dirección */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                      showNewAddressForm
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="direccion"
                      checked={showNewAddressForm}
                      onChange={() => {
                        setShowNewAddressForm(true)
                        setSelectedDireccion("")
                      }}
                      className="w-4 h-4 text-primary accent-primary"
                    />
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-primary" />
                      <span className="font-medium">Usar otra dirección</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Formulario de nueva dirección */}
            {(showNewAddressForm || direcciones.length === 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {direcciones.length > 0 && (
                  <div className="md:col-span-2 pb-4 border-b border-border mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Nueva dirección de envío:</p>
                  </div>
                )}
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="calle">
                    Calle <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="calle" 
                    placeholder="Calle Principal" 
                    className="h-11"
                    value={formData.calle}
                    onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero">
                    Número <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="numero" 
                    placeholder="123" 
                    className="h-11"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comuna">
                    Comuna <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="comuna" 
                    placeholder="Las Condes" 
                    className="h-11"
                    value={formData.comuna}
                    onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">
                    Región <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.region}
                    onValueChange={(value) => setFormData({ ...formData, region: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona una región..." />
                    </SelectTrigger>
                    <SelectContent>
                      {regiones.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudad">
                    Ciudad <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="ciudad" 
                    placeholder="Santiago" 
                    className="h-11"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigoPostal">Código Postal</Label>
                  <Input 
                    id="codigoPostal" 
                    placeholder="8320000" 
                    className="h-11"
                    value={formData.codigoPostal}
                    onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notas">Notas de entrega (opcional)</Label>
                  <Textarea
                    id="notas"
                    placeholder="Ej: Dejar con portero, tocar timbre 2 veces..."
                    className="resize-none"
                    rows={3}
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="saveAddress"
                      checked={saveAddress}
                      onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                    />
                    <Label htmlFor="saveAddress" className="text-sm font-normal cursor-pointer">
                      Guardar esta dirección para futuros pedidos
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Card */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Método de Pago
            </h2>

            <div className="space-y-4">
              {/* Card Payment */}
              <label
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-primary accent-primary"
                  />
                  <div>
                    <p className="font-semibold">Tarjeta de crédito / débito</p>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                  </div>
                </div>
                <CreditCard className="h-7 w-7 text-primary" />
              </label>

              {/* Flow Payment - Replaced Transbank with Flow */}
              <label
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "flow"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="payment"
                    value="flow"
                    checked={paymentMethod === "flow"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-primary accent-primary"
                  />
                  <div>
                    <p className="font-semibold">Flow</p>
                    <p className="text-sm text-muted-foreground">Pago seguro con Flow</p>
                  </div>
                </div>
                <ShieldCheck className="h-7 w-7 text-green-500" />
              </label>
            </div>

            {/* Security Alert */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-3 text-blue-700 dark:text-blue-400 text-sm">
                <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p>Todos los pagos son procesados de forma segura. No almacenamos información de tarjetas.</p>
              </div>
            </div>
          </div>

          {/* Terms Card */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                Acepto los{" "}
                <Link href="#" className="text-primary hover:underline font-medium">
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link href="#" className="text-primary hover:underline font-medium">
                  política de privacidad
                </Link>{" "}
                <span className="text-destructive">*</span>
              </Label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm sticky top-24">
            <h2 className="font-serif text-xl font-semibold mb-6 pb-4 border-b border-border flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Resumen del Pedido
            </h2>

            {/* Products List */}
            <div className="mb-6">
              <h3 className="text-sm text-muted-foreground mb-4">Productos ({totalItems} items)</h3>
              <div className="space-y-3">
                {items.map((item) => {
                  const producto = typeof item.productoId === 'string' ? null : item.productoId
                  return (
                    <div key={item._id} className="flex justify-between items-start">
                      <div className="text-sm">
                        <span className="font-medium">{producto?.nombre || 'Producto'}</span>
                        <span className="text-muted-foreground"> x{item.cantidad}</span>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(item.subtotal)}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-4 border-t border-border mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (19%)</span>
                <span>{formatPrice(iva)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 mb-6 border-t border-border">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(finalTotal)}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full gap-2"
                size="lg"
                disabled={!acceptTerms || isSubmitting}
                onClick={handleConfirmOrder}
              >
                <CheckCircle2 className="h-5 w-5" />
                {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
              </Button>
              <Link href="/carrito" className="block">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al Carrito
                </Button>
              </Link>
            </div>

            {/* Security Badges */}
            <div className="mt-6 pt-4 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-3">Pago seguro garantizado</p>
              <div className="flex items-center justify-center gap-4 text-muted-foreground">
                <ShieldCheck className="h-6 w-6" />
                <Lock className="h-6 w-6" />
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
