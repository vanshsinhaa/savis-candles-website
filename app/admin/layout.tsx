'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Package, ShoppingBag, BarChart2, Users, LogOut, ExternalLink, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/inventory', label: 'Inventory', icon: BarChart2 },
  { href: '/admin/leads', label: 'Leads', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <>
      <div className="px-4 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">Admin</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">Savi's Candles</p>
        </div>
        {/* Close button — mobile only */}
        <button
          className="md:hidden p-1 text-gray-400 hover:text-gray-600"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors',
              pathname.startsWith(href)
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-gray-100 space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-md text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-md text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log Out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <div>
          <p className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">Admin</p>
          <p className="text-sm font-semibold text-gray-800">Savi's Candles</p>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on md+, slide-in on mobile */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50 w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300',
          'md:translate-x-0 md:top-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
