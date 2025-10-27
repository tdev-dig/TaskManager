'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  FileSpreadsheet,
  Settings
} from 'lucide-react'

interface SidebarProps {
  role: 'admin' | 'commercial' | 'client'
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const adminLinks = [
    { href: '/dashboard/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/admin/commandes', label: 'Commandes', icon: ShoppingCart },
    { href: '/dashboard/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
    { href: '/dashboard/admin/stock', label: 'Stock', icon: Package },
    { href: '/dashboard/admin/import', label: 'Import Excel', icon: FileSpreadsheet },
  ]

  const commercialLinks = [
    { href: '/dashboard/commercial', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/commercial/commandes', label: 'Commandes', icon: ShoppingCart },
    { href: '/dashboard/commercial/clients', label: 'Clients', icon: Users },
    { href: '/dashboard/commercial/import', label: 'Import Excel', icon: FileSpreadsheet },
  ]

  const clientLinks = [
    { href: '/dashboard/client', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/client/commandes', label: 'Mes commandes', icon: ShoppingCart },
    { href: '/dashboard/client/nouvelle-commande', label: 'Nouvelle commande', icon: FileSpreadsheet },
  ]

  const links = role === 'admin' ? adminLinks : role === 'commercial' ? commercialLinks : clientLinks

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
