"use client"

import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { useState, useEffect, useRef } from "react"
import {
  Sun,
  Moon,
  Bell,
  LogOut,
  Menu,
  Search,
  Calendar,
  Cake,
  X,
} from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { getNotificationsAction } from "@/actions/notifications-actions"
import { useMounted } from "@/hooks/use-mounted"

interface HeaderProps {
  onMenuClick: () => void
}

interface NotificationData {
  birthdays: { id: string; name: string }[]
  events: { id: string; title: string; date: Date; location: string | null }[]
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<NotificationData | null>(null)
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  const totalNotifs = (notifications?.birthdays.length ?? 0) + (notifications?.events.length ?? 0)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function toggleNotifications() {
    if (!showNotifications) {
      setLoadingNotifs(true)
      getNotificationsAction().then((data) => {
        setNotifications(data as NotificationData)
        setLoadingNotifs(false)
      })
    }
    setShowNotifications(!showNotifications)
  }

  return (
    <header className="h-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-400 text-sm">
          <Search className="h-4 w-4" />
          <span className="text-neutral-500 dark:text-neutral-400">Pesquisar...</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          {!mounted ? (
            <Sun className="h-5 w-5 opacity-0" />
          ) : theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {totalNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 z-30 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Notificações
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-0.5 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {loadingNotifs ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                </div>
              ) : totalNotifs === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-6">
                  Nenhuma notificação no momento
                </p>
              ) : (
                <div className="space-y-3">
                  {notifications!.birthdays.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-neutral-500 mb-1.5 flex items-center gap-1">
                        <Cake className="h-3 w-3" />
                        Aniversariantes do dia
                      </p>
                      <div className="space-y-1">
                        {notifications!.birthdays.map((b) => (
                          <div
                            key={b.id}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-sm text-neutral-700 dark:text-neutral-300"
                          >
                            <Cake className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
                            {b.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {notifications!.events.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-neutral-500 mb-1.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Próximos eventos (7 dias)
                      </p>
                      <div className="space-y-1">
                        {notifications!.events.map((e) => (
                          <div
                            key={e.id}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-neutral-700 dark:text-neutral-300"
                          >
                            <Calendar className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                            <div>
                              <span>{e.title}</span>
                              <span className="text-xs text-neutral-400 ml-1">
                                {new Date(e.date).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {session?.user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 ml-2 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Avatar name={session.user.name || "U"} size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-tight">
                  {session.user.name}
                </p>
                <p className="text-xs text-neutral-500 capitalize leading-tight">
                  {session.user.role?.toLowerCase()}
                </p>
              </div>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10 cursor-pointer"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 z-20">
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
