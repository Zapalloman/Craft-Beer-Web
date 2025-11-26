export function HeroSection() {
  return (
    <section className="relative pt-16 overflow-hidden">
      <div className="bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-primary text-sm font-medium tracking-[0.3em] uppercase mb-4">
              Coleccion Premium
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-6 text-balance">
              Cervezas Artesanales
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-pretty">
              Descubre nuestra seleccion de cervezas artesanales premium, elaboradas con los mejores ingredientes y
              pasion por la tradicion cervecera.
            </p>
          </div>
        </div>
        {/* Decorative bottom curve */}
        <div className="h-16 bg-background rounded-t-[3rem]"></div>
      </div>
    </section>
  )
}
