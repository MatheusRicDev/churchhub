"use client"

import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Church, Mail, User, Shield } from "lucide-react"

export function SettingsContent() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Configurações" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Configurações
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Gerencie sua conta e igreja
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-neutral-400" />
            Perfil
          </h3>
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={session?.user?.name || "U"} size="lg" />
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {session?.user?.name}
              </p>
              <p className="text-sm text-neutral-500 capitalize">
                {session?.user?.role?.toLowerCase()}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-neutral-400" />
              <span className="text-neutral-600 dark:text-neutral-400">
                {session?.user?.email}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-neutral-400" />
              <span className="text-neutral-600 dark:text-neutral-400 capitalize">
                {session?.user?.role?.toLowerCase()}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <Church className="h-4 w-4 text-neutral-400" />
            Igreja
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Church className="h-4 w-4 text-neutral-400" />
              <span className="text-neutral-600 dark:text-neutral-400">
                {session?.user?.churchName}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
