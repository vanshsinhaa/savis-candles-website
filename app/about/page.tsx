import Image from "next/image"
import { FooterGradient } from "@/components/footer-gradient"

export default function AboutPage() {
  return (
    <main className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24">
        {/* Hero Section */}
        <div className="mb-16 sm:mb-28 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl font-light tracking-wide lg:text-6xl">About Savis Candles</h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl font-body text-base sm:text-lg leading-relaxed text-foreground/70">
            Crafting moments of tranquility through the art of candlemaking
          </p>
        </div>

        {/* Story Section */}
        <div className="mx-auto mb-16 sm:mb-28 max-w-4xl space-y-8">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl font-light tracking-wide">Our Story</h2>
              <p className="font-body leading-relaxed text-foreground/70">
                Founded in 2020, Savis Candles began with a simple mission: to create luxury candles that transform any
                space into a sanctuary. Each candle is hand-poured in small batches using only the finest natural
                ingredients.
              </p>
              <p className="font-body leading-relaxed text-foreground/70">
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
        <div className="mx-auto mb-16 sm:mb-28 max-w-4xl">
          <h2 className="mb-10 sm:mb-16 text-center font-heading text-2xl sm:text-3xl font-light tracking-wide">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <span className="text-2xl">🌿</span>
                </div>
              </div>
              <h3 className="mb-2 font-heading text-xl font-normal">Sustainable</h3>
              <p className="font-body text-sm leading-relaxed text-foreground/60">
                100% natural soy wax and eco-friendly packaging materials
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
              <h3 className="mb-2 font-heading text-xl font-normal">Handcrafted</h3>
              <p className="font-body text-sm leading-relaxed text-foreground/60">
                Every candle is carefully hand-poured in small batches
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <span className="text-2xl">💎</span>
                </div>
              </div>
              <h3 className="mb-2 font-heading text-xl font-normal">Premium</h3>
              <p className="font-body text-sm leading-relaxed text-foreground/60">Only the finest fragrance oils and materials</p>
            </div>
          </div>
        </div>

        {/* Craftsmanship Section */}
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-secondary p-8 sm:p-16 text-center">
            <h2 className="mb-4 sm:mb-6 font-heading text-2xl sm:text-3xl font-light tracking-wide">The Art of Candlemaking</h2>
            <p className="font-body mx-auto max-w-2xl leading-relaxed text-foreground/70 text-sm sm:text-base">
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
