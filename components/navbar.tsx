"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { AuthButton } from "@/components/auth-button"
import { CartPanel } from "@/components/cart-panel"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
]

export function Navbar() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  const { state } = useCart()
  const [isClient, setIsClient] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => { setIsClient(true) }, [])

  // Close cart when navigating
  useEffect(() => { setIsCartOpen(false) }, [pathname])

  const CartButton = ({ className }: { className?: string }) => (
    <button
      onClick={() => setIsCartOpen(true)}
      className={cn(
        "relative flex items-center justify-center w-8 h-8 text-foreground/60 hover:text-foreground transition-colors",
        className,
      )}
      aria-label="Open cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {isClient && state.itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-body">
          {state.itemCount}
        </span>
      )}
    </button>
  )

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 sm:gap-2 text-lg sm:text-xl font-medium tracking-tight">
              <Image
                src="/ChatGPT Image Oct 10, 2025, 04_12_17 PM.png"
                alt="savis candles logo"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <span className="font-serif italic text-sm sm:text-base">savis</span>
              <span className="font-sans font-normal ml-1 text-sm sm:text-base">candles</span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium tracking-wide underline-from-center transition-colors",
                      pathname === link.href ? "text-foreground" : "text-foreground/60 hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li><AuthButton /></li>
              <li><CartButton /></li>
            </ul>

            {/* Mobile: cart + hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <CartButton />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center w-8 h-8 text-foreground/60 hover:text-foreground transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-border/20 bg-background/95 backdrop-blur-sm rounded-lg">
              <ul className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-2 text-sm font-medium tracking-wide transition-colors",
                        pathname === link.href ? "text-foreground" : "text-foreground/60 hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="px-4 py-2"><AuthButton /></li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Cart panel — rendered at navbar level so it's always available */}
      <CartPanel open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
