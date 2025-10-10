"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { AuthButton } from "@/components/auth-button"
import { ShoppingCart } from "lucide-react"
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
  const { state } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-medium tracking-tight">
            <Image 
              src="/ChatGPT Image Oct 10, 2025, 04_12_17 PM.png" 
              alt="savis candles logo" 
              width={32} 
              height={32}
              className="w-8 h-8"
            />
            <span className="font-serif italic">savis</span>
            <span className="font-sans font-normal ml-1">candles</span>
          </Link>

          {/* Navigation Links */}
          <ul className="flex items-center gap-8">
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
            
            {/* Auth Button */}
            <li>
              <AuthButton />
            </li>
            
            {/* Cart Icon */}
            <li>
              <Link
                href="/checkout"
                className="relative flex items-center justify-center w-8 h-8 text-foreground/60 hover:text-foreground transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {isClient && state.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
