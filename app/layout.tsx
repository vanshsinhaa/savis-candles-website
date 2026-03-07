import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Providers } from "@/components/providers"
import { EmberChat } from "@/components/ember-chat"
import { Suspense } from "react"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "savis candles",
  description: "Luxury handcrafted candles",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${inter.variable} font-body antialiased`}>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            {children}
            <EmberChat />
            <Analytics />
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
