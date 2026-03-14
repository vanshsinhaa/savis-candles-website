"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { AuthButton } from "@/components/auth-button"
import { CartPanel } from "@/components/cart-panel"
import { ShoppingCart, Menu, X, Settings } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
  const adminMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setIsClient(true) }, [])

  // Close cart when navigating
  useEffect(() => {
    setIsCartOpen(false)
    setIsMobileMenuOpen(false)
    setIsAdminMenuOpen(false)
  }, [pathname])

  // Close admin dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target as Node)) {
        setIsAdminMenuOpen(false)
      }
    }
    if (isAdminMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isAdminMenuOpen])

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
      {isClient && state.items.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-body">
          {state.items.length}
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
              {/* Discreet admin hamburger — desktop only */}
              <li ref={adminMenuRef} className="relative">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="flex items-center justify-center w-8 h-8 text-foreground/30 hover:text-foreground/60 transition-colors"
                  aria-label="More options"
                >
                  <Menu className="w-4 h-4" />
                </button>
                {isAdminMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-background/95 backdrop-blur-sm border border-border/30 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href="/admin/login"
                      onClick={() => setIsAdminMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground/60 hover:text-foreground hover:bg-secondary/50 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                  </div>
                )}
              </li>
            </ul>

            {/* Mobile: cart + hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <CartButton />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center w-8 h-8 text-foreground/60 hover:text-foreground transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-border/20 bg-background/95 backdrop-blur-sm rounded-lg">
              <ul className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-2.5 text-sm font-medium tracking-wide transition-colors rounded-md mx-2",
                        pathname === link.href
                          ? "text-foreground bg-secondary/50"
                          : "text-foreground/60 hover:text-foreground hover:bg-secondary/30",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="px-4 py-2 mt-1">
                  <AuthButton />
                </li>
                <li className="mx-2 border-t border-border/20 pt-2 mt-1">
                  <Link
                    href="/admin/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-foreground/40 hover:text-foreground/70 transition-colors rounded-md"
                  >
                    <Settings className="w-3 h-3" />
                    Admin
                  </Link>
                </li>
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
