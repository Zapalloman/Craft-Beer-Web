"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  Plus,
  Pencil,
  Trash2,
  Camera,
  Check,
  RotateCcw,
  Key,
  Bell,
  Settings,
  Star,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api-client"
import type { Direccion } from "@/lib/types"

const regiones = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
]

export function ProfileContent() {
  const { usuario, isAuthenticated, isLoading: authLoading } = useAuth()
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [isLoadingDirs, setIsLoadingDirs] = useState(true)
  const [editingAddress, setEditingAddress] = useState<Direccion | null>(null)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
  })
  const [addressForm, setAddressForm] = useState({
    alias: "",
    calle: "",
    numero: "",
    depto: "",
    comuna: "",
    ciudad: "",
    region: "",
    referencia: "",
    esPrincipal: false,
  })

  // Cargar direcciones del usuario
  useEffect(() => {
    const fetchDirecciones = async () => {
      if (usuario?._id) {
        setIsLoadingDirs(true)
        try {
          const dirs = await api.getDirecciones(usuario._id)
          setDirecciones(dirs)
        } catch (error) {
          console.error("Error al cargar direcciones:", error)
        } finally {
          setIsLoadingDirs(false)
        }
      }
    }
    fetchDirecciones()
  }, [usuario])

  // Actualizar formData cuando cambia el usuario
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        fechaNacimiento: usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toISOString().split("T")[0] : "",
      })
    }
  }, [usuario])

  // Requiere autenticación
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="text-center py-20">
        <div className="bg-card border border-dashed border-border rounded-3xl p-12 max-w-lg mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-3">Inicia sesión</h2>
          <p className="text-muted-foreground mb-8">
            Debes iniciar sesión para ver tu perfil.
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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando perfil...</span>
      </div>
    )
  }

  const handleSaveProfile = async () => {
    if (!usuario) return
    try {
      await api.updateUsuario(usuario._id, formData)
      alert("Perfil actualizado correctamente")
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      alert("Error al actualizar el perfil")
    }
  }

  const handleResetProfile = () => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        fechaNacimiento: usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toISOString().split("T")[0] : "",
      })
    }
  }

  const openAddressModal = (address?: Direccion) => {
    if (address) {
      setEditingAddress(address)
      setAddressForm({
        alias: address.alias || "",
        calle: address.calle,
        numero: address.numero,
        depto: address.depto || "",
        comuna: address.comuna,
        ciudad: address.ciudad,
        region: address.region,
        referencia: address.referencia || "",
        esPrincipal: address.esPrincipal || false,
      })
    } else {
      setEditingAddress(null)
      setAddressForm({
        alias: "",
        calle: "",
        numero: "",
        depto: "",
        comuna: "",
        ciudad: "",
        region: "",
        referencia: "",
        esPrincipal: false,
      })
    }
    setIsAddressModalOpen(true)
  }

  const handleSaveAddress = async () => {
    if (!usuario) return
    try {
      if (editingAddress) {
        await api.updateDireccion(usuario._id, editingAddress._id, addressForm)
        setDirecciones(direcciones.map((d) => (d._id === editingAddress._id ? { ...d, ...addressForm } : d)))
      } else {
        const newDir = await api.createDireccion(usuario._id, addressForm)
        setDirecciones([...direcciones, newDir])
      }
      setIsAddressModalOpen(false)
    } catch (error) {
      console.error("Error al guardar dirección:", error)
      alert("Error al guardar la dirección")
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!usuario) return
    if (confirm("¿Estás seguro de eliminar esta dirección?")) {
      try {
        await api.deleteDireccion(usuario._id, id)
        setDirecciones(direcciones.filter((d) => d._id !== id))
      } catch (error) {
        console.error("Error al eliminar dirección:", error)
        alert("Error al eliminar la dirección")
      }
    }
  }

  const setAsPrincipal = async (id: string) => {
    if (!usuario) return
    try {
      await api.updateDireccion(usuario._id, id, { esPrincipal: true })
      setDirecciones(
        direcciones.map((d) => ({
          ...d,
          esPrincipal: d._id === id,
        })),
      )
    } catch (error) {
      console.error("Error al establecer dirección principal:", error)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="h-4 w-4" />
          Catálogo
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground flex items-center gap-1">
          <User className="h-4 w-4" />
          Mi Perfil
        </span>
      </nav>

      {/* Profile Header */}
      <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg bg-primary/10 flex items-center justify-center">
              <User className="h-12 w-12 text-primary" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors border-2 border-background">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-serif text-2xl font-bold text-foreground">{usuario?.nombre}</h1>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center justify-center sm:justify-start gap-1">
                <Mail className="h-4 w-4 text-primary" />
                {usuario?.email}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <Link href="/pedidos" className="text-center px-4 py-2 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
              <p className="text-2xl font-bold text-primary">Ver</p>
              <p className="text-xs text-muted-foreground">Pedidos</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full bg-card border border-border rounded-xl p-1 mb-6">
          <TabsTrigger
            value="personal"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3"
          >
            <User className="h-4 w-4 mr-2" />
            Información Personal
          </TabsTrigger>
          <TabsTrigger
            value="direcciones"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Mis Direcciones
          </TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-6">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-serif text-xl font-semibold">Información Personal</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  Nombre Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="pl-10 h-12 border-2 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12 border-2 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Teléfono
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="pl-10 h-12 border-2 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Fecha de Nacimiento
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                    className="pl-10 h-12 border-2 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button onClick={handleSaveProfile} className="h-12 px-8">
                <Check className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
              <Button variant="outline" onClick={handleResetProfile} className="h-12 px-8 bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Restablecer
              </Button>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-xl font-semibold">Configuración de Cuenta</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="h-12 border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent"
              >
                <Key className="h-4 w-4 mr-2" />
                Cambiar Contraseña
              </Button>
              <Button variant="outline" className="h-12 border-primary text-primary hover:bg-primary/5 bg-transparent">
                <Bell className="h-4 w-4 mr-2" />
                Notificaciones
              </Button>
              <Button
                variant="outline"
                className="h-12 border-destructive text-destructive hover:bg-destructive/5 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Cuenta
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="direcciones" className="space-y-6">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold">Mis Direcciones</h2>
              </div>
              <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openAddressModal()} className="h-10">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Dirección
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-serif">
                      {editingAddress ? "Editar Dirección" : "Nueva Dirección"}
                    </DialogTitle>
                    <DialogDescription>Completa los datos de tu dirección de envío.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Alias *</Label>
                        <Input
                          placeholder="Ej: Casa, Oficina"
                          value={addressForm.alias}
                          onChange={(e) => setAddressForm({ ...addressForm, alias: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Región *</Label>
                        <Select
                          value={addressForm.region}
                          onValueChange={(value) => setAddressForm({ ...addressForm, region: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona región" />
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
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Calle *</Label>
                        <Input
                          placeholder="Nombre de la calle"
                          value={addressForm.calle}
                          onChange={(e) => setAddressForm({ ...addressForm, calle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Número *</Label>
                        <Input
                          placeholder="123"
                          value={addressForm.numero}
                          onChange={(e) => setAddressForm({ ...addressForm, numero: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Depto/Oficina (opcional)</Label>
                      <Input
                        placeholder="Ej: Depto 45, Piso 3"
                        value={addressForm.depto}
                        onChange={(e) => setAddressForm({ ...addressForm, depto: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Comuna *</Label>
                        <Input
                          placeholder="Comuna"
                          value={addressForm.comuna}
                          onChange={(e) => setAddressForm({ ...addressForm, comuna: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ciudad *</Label>
                        <Input
                          placeholder="Ciudad"
                          value={addressForm.ciudad}
                          onChange={(e) => setAddressForm({ ...addressForm, ciudad: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Referencia (opcional)</Label>
                      <Input
                        placeholder="Ej: Edificio azul frente al parque"
                        value={addressForm.referencia}
                        onChange={(e) => setAddressForm({ ...addressForm, referencia: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="principal"
                        checked={addressForm.esPrincipal}
                        onCheckedChange={(checked) =>
                          setAddressForm({ ...addressForm, esPrincipal: checked as boolean })
                        }
                      />
                      <label htmlFor="principal" className="text-sm font-medium leading-none cursor-pointer">
                        Establecer como dirección principal
                      </label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddressModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveAddress}>
                      {editingAddress ? "Guardar Cambios" : "Agregar Dirección"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {direcciones.map((direccion) => (
                <div
                  key={direccion._id}
                  className={`relative p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                    direccion.esPrincipal ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  {direccion.esPrincipal && (
                    <span className="absolute top-3 right-3 text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Principal
                    </span>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Home className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{direccion.alias}</h3>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <p>
                      {direccion.calle} {direccion.numero}
                      {direccion.depto && `, ${direccion.depto}`}
                    </p>
                    <p>
                      {direccion.comuna}, {direccion.ciudad}
                    </p>
                    <p>Región {direccion.region}</p>
                    {direccion.referencia && <p className="text-xs italic mt-2">Ref: {direccion.referencia}</p>}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => openAddressModal(direccion)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Editar
                    </Button>
                    {!direccion.esPrincipal && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => setAsPrincipal(direccion._id)}
                        >
                          <Star className="h-3.5 w-3.5 mr-1" />
                          Principal
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteAddress(direccion._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Eliminar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Add New Address Card */}
              <button
                onClick={() => openAddressModal()}
                className="p-5 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center min-h-[200px] text-muted-foreground hover:text-primary"
              >
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="font-medium">Agregar Nueva Dirección</span>
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
