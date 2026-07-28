"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  Settings,
  Church,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members", label: "Membros", icon: Users },
  { href: "/visitors", label: "Visitantes", icon: UserPlus },
  { href: "/events", label: "Eventos", icon: Calendar },
  { href: "/settings", label: "Configurações", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex-col transition-all duration-300 z-40 hidden lg:flex">
      <div className="flex items-center gap-3 px-4 h-16 border-b border-neutral-200 dark:border-neutral-800">
        <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center flex-shrink-0">
          <Church className="h-4 w-4 text-white dark:text-neutral-900" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            ChurchHub
          </p>
          <p className="text-xs text-neutral-500 truncate">
            Gestão que edifica
          </p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
