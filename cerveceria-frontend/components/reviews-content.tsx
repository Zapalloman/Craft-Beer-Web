"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronRight,
  Star,
  MessageSquare,
  ThumbsUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  Send,
  AlertCircle,
  CheckCircle,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import type { Producto, Valoracion } from "@/lib/types"

interface ReviewsContentProps {
  productId: string
}

const typeColors: Record<string, string> = {
  Lager: "bg-amber-500 text-white",
  Ale: "bg-orange-500 text-white",
  IPA: "bg-green-600 text-white",
  Stout: "bg-stone-800 text-white",
  Porter: "bg-stone-700 text-white",
}

export function ReviewsContent({ productId }: ReviewsContentProps) {
  const { usuario, isAuthenticated } = useAuth()
  const [product, setProduct] = useState<Producto | null>(null)
  const [reviews, setReviews] = useState<Valoracion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [productData, reviewsData] = await Promise.all([
          api.getProducto(productId),
          api.getValoracionesProducto(productId),
        ])
        setProduct(productData)
        setReviews(reviewsData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [productId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.puntuacion === star).length
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
    return { star, count, percentage }
  })

  const handleSubmitReview = async () => {
    if (rating === 0 || !comment.trim() || !isAuthenticated) return
    setIsSubmitting(true)
    try {
      const newReview = await api.crearValoracion({
        productoId: productId,
        puntuacion: rating,
        comentario: comment,
      })
      setReviews([newReview, ...reviews])
      setRating(0)
      setComment("")
    } catch (error) {
      console.error("Error al crear valoración:", error)
      alert("Error al enviar la valoración")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando valoraciones...</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">Producto no encontrado</p>
        <Link href="/">
          <Button className="mt-4">Volver al catálogo</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Catálogo
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link
              href={`/producto/${product.id}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {product.nombre}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Valoraciones</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Summary Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Product Image */}
            <div className="relative w-32 h-32 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden flex-shrink-0">
              <img
                src={product.imagen || "/placeholder.svg"}
                alt={product.nombre}
                className="absolute inset-0 w-full h-full object-contain p-2"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-serif text-2xl font-bold text-foreground mb-2">{product.nombre}</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.valoracionPromedio)
                          ? "text-primary fill-primary"
                          : i < product.valoracionPromedio
                            ? "text-primary fill-primary/50"
                            : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-foreground">{product.valoracionPromedio}</span>
                <span className="text-muted-foreground">— {product.totalValoraciones} valoraciones</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
                <Badge className={typeColors[product.tipo]}>{product.tipo}</Badge>
                <span>{product.formato}</span>
                <span>—</span>
                <span className="font-semibold text-primary">{formatPrice(product.precio)}</span>
              </div>
            </div>

            {/* Back Button */}
            <Link href={`/producto/${product._id}`}>
              <Button variant="outline" className="gap-2 bg-transparent">
                Volver al producto
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Valoraciones de usuarios
              </h2>
              <span className="text-sm text-muted-foreground">{reviews.length} opiniones</span>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-lg font-semibold mb-2">Sin valoraciones</h3>
                  <p className="text-muted-foreground">
                    Sé el primero en valorar este producto.
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <article
                    key={review._id}
                    className="bg-card rounded-xl border border-border p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold text-lg">
                            {(review.usuarioId as any)?.nombre?.charAt(0) || "U"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-foreground">
                                {(review.usuarioId as any)?.nombre || "Usuario"}
                              </span>
                              {review.verificado && (
                                <Badge variant="outline" className="text-xs gap-1 border-green-500 text-green-600">
                                  <CheckCircle className="h-3 w-3" />
                                  Compra verificada
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.puntuacion ? "text-primary fill-primary" : "text-muted-foreground/30"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(review.createdAt || new Date().toISOString())}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Comment */}
                        <p className="mt-3 text-muted-foreground leading-relaxed">{review.comentario}</p>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rating Distribution */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Resumen de valoraciones</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{product.valoracionPromedio}</div>
                  <div className="flex items-center justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.valoracionPromedio)
                            ? "text-primary fill-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{product.totalValoraciones} opiniones</div>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm w-4 text-muted-foreground">{star}</span>
                      <Star className="h-3 w-3 text-primary fill-primary" />
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-6">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Leave Review Form */}
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Dejar valoración
              </h3>

              {!isAuthenticated ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-amber-800">
                        Debes haber comprado este producto y estar registrado para dejar una valoración.{" "}
                        <Link href="/registro" className="font-semibold text-primary hover:underline">
                          Inicia sesión
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmitReview()
                  }}
                  className="space-y-4"
                >
                  {/* Star Rating */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Puntuación</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors ${
                              star <= (hoverRating || rating) ? "text-primary fill-primary" : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label htmlFor="comment" className="text-sm font-medium text-foreground block mb-2">
                      Comentario
                    </label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Escribe tu opinión sobre esta cerveza..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={rating === 0 || !comment.trim() || isSubmitting}
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Enviando..." : "Enviar Valoración"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
