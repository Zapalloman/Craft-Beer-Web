"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Beer, ShoppingCart, User, Search, Menu, X, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { usuario, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()

  // Detectar si estamos en el panel de admin
  const isAdminPanel = pathname.startsWith("/admin")

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAdminPanel ? "/admin/dashboard" : "/"} className="flex items-center gap-2 group">
            {isAdminPanel ? (
              <>
                <Shield className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
                <span className="font-serif text-xl font-semibold tracking-wide">Admin Panel</span>
              </>
            ) : (
              <>
                <Beer className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
                <span className="font-serif text-xl font-semibold tracking-wide">Craft & Beer</span>
              </>
            )}
          </Link>

          {/* Navigation - Solo mostrar si NO es admin */}
          {!isAdminPanel && (
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  isActive("/") && !pathname.startsWith("/buscar") && !pathname.startsWith("/producto")
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "text-muted-foreground hover:text-secondary-foreground"
                }`}
              >
                Catálogo
              </Link>
              <Link
                href="/buscar"
                className={`text-sm font-medium transition-colors ${
                  isActive("/buscar")
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "text-muted-foreground hover:text-secondary-foreground"
                }`}
              >
                Buscar
              </Link>
              <Link
                href="/carrito"
                className={`text-sm font-medium transition-colors ${
                  isActive("/carrito")
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "text-muted-foreground hover:text-secondary-foreground"
                }`}
              >
                Carrito
              </Link>
            </nav>
          )}

          {/* Desktop Actions - Solo mostrar si NO es admin */}
          {!isAdminPanel && (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/buscar">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-secondary-foreground hover:bg-secondary"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/carrito">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-secondary-foreground hover:bg-secondary relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-secondary-foreground hover:bg-secondary"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium">{usuario?.nombre}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/perfil">Mi Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/pedidos">Mis Pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Iniciar Sesión</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/registro">Registrarse</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          )}

          {/* Mobile Menu Button - Solo mostrar si NO es admin */}
          {!isAdminPanel && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-secondary-foreground hover:bg-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}
        </div>

        {/* Mobile Menu - Solo mostrar si NO es admin */}
        {!isAdminPanel && mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-muted-foreground/20 mt-2 pt-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className={`text-sm font-medium ${isActive("/") && !pathname.startsWith("/buscar") ? "text-primary" : "text-muted-foreground"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Catálogo
              </Link>
              <Link
                href="/buscar"
                className={`text-sm font-medium ${isActive("/buscar") ? "text-primary" : "text-muted-foreground"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Buscar
              </Link>
              <Link
                href="/carrito"
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Carrito ({itemCount})
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/perfil"
                    className="text-sm font-medium text-muted-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="text-sm font-medium text-red-500 text-left"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
