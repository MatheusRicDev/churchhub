"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { MobileDrawer } from "@/components/layout/mobile-drawer"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PageLoading } from "@/components/ui/loading"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (status === "loading") {
    return <PageLoading />
  }

  if (status === "unauthenticated") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="lg:pl-60 pb-16">
        <Header onMenuClick={() => setDrawerOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>

      <BottomNav />
    </div>
  )
}
