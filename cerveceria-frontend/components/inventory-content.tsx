"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Boxes,
  ClipboardList,
  Beer,
  Loader2,
  LogOut,
  PieChart,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api-client"
import type { Producto } from "@/lib/types"

const tiposCerveza = ["Lager", "Ale", "IPA", "Stout", "Porter"]

export function InventoryContent() {
  const router = useRouter()
  const [products, setProducts] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"todos" | "activo" | "inactivo">("todos")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const itemsPerPage = 5

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated")
    sessionStorage.removeItem("admin_login_time")
    sessionStorage.removeItem("admin_user")
    // Forzar recarga completa para limpiar estado de React
    window.location.href = "/admin"
  }

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "Lager",
    precio: "",
    stock: "",
    estado: "activo" as "activo" | "inactivo",
    descripcion: "",
    abv: "",
    ibu: "",
    imagen: "",
  })

  const [isUploading, setIsUploading] = useState(false)

  // Manejar subida de imagen al servidor
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen es muy grande. Máximo 5MB.")
        return
      }
      
      setIsUploading(true)
      try {
        const result = await api.uploadImagenProducto(file)
        setFormData({ ...formData, imagen: result.url })
      } catch (error) {
        console.error("Error subiendo imagen:", error)
        alert("Error al subir la imagen")
      } finally {
        setIsUploading(false)
      }
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const data = await api.getProductos()
        // Transformar activo (boolean) a estado (string)
        const productsWithEstado = data.map(p => ({
          ...p,
          estado: p.activo ? "activo" as const : "inactivo" as const
        }))
        setProducts(productsWithEstado)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || product.estado === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const openNewProductModal = () => {
    setEditingProduct(null)
    setFormData({
      nombre: "",
      tipo: "Lager",
      precio: "",
      stock: "",
      estado: "activo",
      descripcion: "",
      abv: "",
      ibu: "",
      imagen: "",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (product: Producto) => {
    setEditingProduct(product)
    setFormData({
      nombre: product.nombre,
      tipo: product.tipo,
      precio: product.precio.toString(),
      stock: product.stock.toString(),
      estado: product.estado,
      descripcion: product.descripcion,
      abv: product.abv.toString(),
      ibu: product.ibu.toString(),
      imagen: product.imagen || "",
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const productData: any = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        activo: formData.estado === "activo",
        descripcion: formData.descripcion,
        abv: Number(formData.abv),
        ibu: Number(formData.ibu),
      }
      
      // Solo incluir imagen si hay una
      if (formData.imagen) {
        productData.imagen = formData.imagen
      }

      if (editingProduct) {
        const updated = await api.actualizarProducto(editingProduct._id, productData)
        setProducts(products.map((p) => (p._id === editingProduct._id ? { ...updated, estado: updated.activo ? "activo" : "inactivo" } : p)))
      } else {
        const newProduct = await api.crearProducto(productData)
        setProducts([...products, { ...newProduct, estado: newProduct.activo ? "activo" : "inactivo" }])
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error al guardar el producto")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleStatus = async (id: string) => {
    const product = products.find((p) => p._id === id)
    if (!product) return
    
    try {
      const newActivo = product.estado !== "activo"
      const updated = await api.actualizarProducto(id, { activo: newActivo })
      setProducts(products.map((p) => (p._id === id ? { ...updated, estado: updated.activo ? "activo" : "inactivo" } : p)))
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return
    
    try {
      await api.eliminarProducto(id)
      setProducts(products.filter((p) => p._id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error al eliminar el producto")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando inventario...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Catálogo
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Admin - Inventario</span>
      </nav>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-xl w-fit">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="gap-2 rounded-lg">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Button className="gap-2 rounded-lg bg-primary text-primary-foreground">
            <Boxes className="h-4 w-4" />
            Inventario
          </Button>
          <Link href="/admin/pedidos">
            <Button variant="ghost" className="gap-2 rounded-lg">
              <ClipboardList className="h-4 w-4" />
              Pedidos
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant="ghost" className="gap-2 rounded-lg">
              <PieChart className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Package className="h-7 w-7 text-primary" />
            </div>
            Gestión de Inventario
          </h1>
          <p className="text-muted-foreground mt-1">Administra productos, stock y estado (activo/inactivo)</p>
        </div>
        <Button
          onClick={openNewProductModal}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" />
          Agregar Nuevo Producto
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre de producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
            {(["todos", "activo", "inactivo"] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={`capitalize ${
                  statusFilter === status
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {status === "todos" ? "Todos" : status === "activo" ? "Activos" : "Inactivos"}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Boxes className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Productos</p>
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Productos Activos</p>
              <p className="text-2xl font-bold text-foreground">
                {products.filter((p) => p.estado === "activo").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Beer className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock Total</p>
              <p className="text-2xl font-bold text-foreground">{products.reduce((acc, p) => acc + p.stock, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">ID</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">Producto</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">Tipo</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">Precio</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">Stock</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">Estado</th>
                <th className="text-center py-4 px-4 font-semibold text-sm text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className={`border-b border-border hover:bg-muted/30 transition-colors ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/10"
                  }`}
                >
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-muted-foreground">#{product._id.slice(-6)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted border border-border">
                        <img
                          src={product.imagen || "/placeholder.svg"}
                          alt={product.nombre}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{product.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.abv}% ABV · {product.ibu} IBU
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant="secondary"
                      className={`${
                        product.tipo === "IPA"
                          ? "bg-orange-100 text-orange-700"
                          : product.tipo === "Stout"
                            ? "bg-gray-800 text-white"
                            : product.tipo === "Ale"
                              ? "bg-amber-100 text-amber-700"
                              : product.tipo === "Porter"
                                ? "bg-stone-700 text-white"
                                : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {product.tipo}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-primary">{formatPrice(product.precio)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          product.stock === 0
                            ? "text-destructive"
                            : product.stock < 30
                              ? "text-amber-600"
                              : "text-foreground"
                        }`}
                      >
                        {product.stock}
                      </span>
                      {product.stock === 0 && (
                        <Badge variant="destructive" className="text-xs">
                          Sin stock
                        </Badge>
                      )}
                      {product.stock > 0 && product.stock < 30 && (
                        <Badge className="text-xs bg-amber-100 text-amber-700">Stock bajo</Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      className={`${
                        product.estado === "activo"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {product.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(product)}
                        className="gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(product._id)}
                        className={`${
                          product.estado === "activo"
                            ? "text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                            : "text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
                        }`}
                      >
                        {product.estado === "activo" ? "Desactivar" : "Activar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProduct(product._id)}
                        className="text-destructive border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} productos
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">Backoffice - Craft & Beer</p>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre del producto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposCerveza.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio (CLP)</Label>
              <Input
                id="precio"
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abv">ABV (%)</Label>
              <Input
                id="abv"
                type="number"
                step="0.1"
                value={formData.abv}
                onChange={(e) => setFormData({ ...formData, abv: e.target.value })}
                placeholder="4.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ibu">IBU</Label>
              <Input
                id="ibu"
                type="number"
                value={formData.ibu}
                onChange={(e) => setFormData({ ...formData, ibu: e.target.value })}
                placeholder="22"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value: "activo" | "inactivo") => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagen">Imagen</Label>
              <div className="space-y-2">
                <Input
                  id="imagenUrl"
                  type="text"
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  placeholder="URL de la imagen o sube un archivo"
                  readOnly={isUploading}
                />
                <div className="flex items-center gap-2">
                  <Input 
                    id="imagenFile" 
                    type="file" 
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="flex-1" 
                    disabled={isUploading}
                  />
                  {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                {formData.imagen && (
                  <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border">
                    <img 
                      src={formData.imagen} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-full space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción del producto"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : editingProduct ? "Guardar Cambios" : "Agregar Producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
