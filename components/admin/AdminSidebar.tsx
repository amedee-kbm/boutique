'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageCircle, Package, Tag } from 'lucide-react'

import { cn } from '@/lib/utils'
import { LogoutButton } from '@/components/logout-button'
import { ThemeToggle } from '@/components/admin/ThemeToggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/chat', label: 'Chat', icon: MessageCircle },
]

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="bg-background fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r md:flex">
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-lg font-bold">Zita Boutique</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive(href, exact)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3">
        <Separator className="mb-3" />
        <div className="mb-2 flex items-center gap-2 px-3 py-1">
          <Avatar className="size-7">
            <AvatarFallback className="text-xs">
              {userEmail.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground truncate text-xs">{userEmail}</span>
        </div>
        <ThemeToggle />
        <LogoutButton />
      </div>
    </aside>
  )
}
