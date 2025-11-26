import Link from "next/link"
import { Beer, Mail, Phone, MapPin, Settings } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      {/* Top decorative curve */}
      <div className="h-16 bg-background rounded-b-[3rem]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Beer className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-semibold">Craft & Beer</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Cervezas artesanales premium desde 2020. Elaboradas con pasion y los mejores ingredientes.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg font-medium mb-4 text-primary">Enlaces</h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="/buscar"
                className="text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
              >
                Buscar
              </Link>
              <Link
                href="/carrito"
                className="text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
              >
                Carrito
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4 text-primary">Contacto</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@craftbeer.cl"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                info@craftbeer.cl
              </a>
              <a
                href="tel:+56912345678"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary-foreground transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                +56 9 1234 5678
              </a>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Santiago, Chile
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-muted-foreground/20 mt-12 pt-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2025 Craft & Beer. Todos los derechos reservados.</p>
            <Link 
              href="/admin" 
              className="text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
              title="Acceso administrativo"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
