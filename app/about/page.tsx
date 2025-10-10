import Image from "next/image"
import { FooterGradient } from "@/components/footer-gradient"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-32">
        {/* Hero Section */}
        <div className="mb-24 text-center">
          <h1 className="text-5xl font-light tracking-tight lg:text-6xl">About Savis Candles</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70">
            Crafting moments of tranquility through the art of candlemaking
          </p>
        </div>

        {/* Story Section */}
        <div className="mx-auto mb-24 max-w-4xl space-y-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-light tracking-tight">Our Story</h2>
              <p className="leading-relaxed text-foreground/70">
                Founded in 2020, Savis Candles began with a simple mission: to create luxury candles that transform any
                space into a sanctuary. Each candle is hand-poured in small batches using only the finest natural
                ingredients.
              </p>
              <p className="leading-relaxed text-foreground/70">
                Our commitment to quality and sustainability drives everything we do. From sourcing eco-friendly
                materials to designing timeless vessels, we believe that luxury and responsibility can coexist
                beautifully.
              </p>
            </div>

            <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
              <Image src="/luxury-candle-making-studio-workspace.jpg" alt="Candle making studio" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mx-auto mb-24 max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-light tracking-tight">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <span className="text-2xl">🌿</span>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-medium">Sustainable</h3>
              <p className="text-sm leading-relaxed text-foreground/60">
                100% natural soy wax and eco-friendly packaging materials
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-medium">Handcrafted</h3>
              <p className="text-sm leading-relaxed text-foreground/60">
                Every candle is carefully hand-poured in small batches
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <span className="text-2xl">💎</span>
                </div>
              </div>
              <h3 className="mb-2 text-xl font-medium">Premium</h3>
              <p className="text-sm leading-relaxed text-foreground/60">Only the finest fragrance oils and materials</p>
            </div>
          </div>
        </div>

        {/* Craftsmanship Section */}
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-secondary p-12 text-center">
            <h2 className="mb-4 text-3xl font-light tracking-tight">The Art of Candlemaking</h2>
            <p className="mx-auto max-w-2xl leading-relaxed text-foreground/70">
              Each Savis candle undergoes a meticulous creation process. From selecting the perfect fragrance blend to
              hand-pouring at the ideal temperature, we ensure every detail meets our exacting standards. The result is
              a candle that burns cleanly, evenly, and beautifully for hours on end.
            </p>
          </div>
        </div>
      </div>

      <FooterGradient />
    </main>
  )
}
