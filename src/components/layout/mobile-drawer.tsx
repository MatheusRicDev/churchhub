"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, LayoutDashboard, Users, UserPlus, Calendar, Settings, Church } from "lucide-react"

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members", label: "Membros", icon: Users },
  { href: "/visitors", label: "Visitantes", icon: UserPlus },
  { href: "/events", label: "Eventos", icon: Calendar },
  { href: "/settings", label: "Configurações", icon: Settings },
]

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-pointer animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 z-50 lg:hidden animate-slide-left">
        <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center">
              <Church className="h-4 w-4 text-white dark:text-neutral-900" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                ChurchHub
              </p>
              <p className="text-xs text-neutral-500">Gestão que edifica</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
