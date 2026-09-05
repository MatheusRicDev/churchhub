"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  UserPlus,
  Calendar,
  UserCheck,
  Gift,
  Activity,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { StatCard } from "@/components/ui/stat-card"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Loading } from "@/components/ui/loading"
import { getDashboardStatsAction } from "@/actions/dashboard-actions"
import type { DashboardStats, GrowthDataPoint, UpcomingEvent } from "@/types"

export function DashboardContent() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [growthData, setGrowthData] = useState<GrowthDataPoint[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
  const [birthdays, setBirthdays] = useState<{ id: string; name: string; birthDate: Date | null }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const result = await getDashboardStatsAction()
    setStats(result.stats)
    setGrowthData(result.growthData)
    setUpcomingEvents(result.upcomingEvents)
    setBirthdays(result.birthdays)
    setLoading(false)
  }

  if (loading) return <Loading />

  if (!stats || stats.totalMembers === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Dashboard
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Bem-vindo ao ChurchHub!
          </p>
        </div>
        <EmptyState
          title="Nenhum membro cadastrado"
          description="Comece cadastrando o primeiro membro da sua igreja para visualizar as estatísticas."
          action={{
            label: "Cadastrar primeiro membro",
            onClick: () => router.push("/members"),
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Visão geral da sua igreja
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          value={stats.totalMembers}
          label="Total de Membros"
          growth={stats.membersGrowth}
        />
        <StatCard
          icon={<UserPlus className="h-5 w-5" />}
          value={stats.totalVisitors}
          label="Visitantes"
          growth={stats.visitorsGrowth}
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          value={stats.totalEvents}
          label="Eventos"
          growth={stats.eventsGrowth}
        />
        <StatCard
          icon={<UserCheck className="h-5 w-5" />}
          value={stats.newMembersThisMonth}
          label="Novos Cadastros"
          growth={stats.newMembersGrowth}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Crescimento de Membros
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-neutral-300 dark:text-neutral-700"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-neutral-400"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-neutral-400"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    background: "white",
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar
                  dataKey="members"
                  fill="currentColor"
                  className="text-neutral-900 dark:text-white"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Próximos Eventos
          </h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">
              Nenhum evento agendado
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="text-center flex-shrink-0">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {new Date(event.date).toLocaleDateString("pt-BR", {
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-[10px] text-neutral-500 uppercase">
                      {new Date(event.date).toLocaleDateString("pt-BR", {
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {event.title}
                    </p>
                    {event.location && (
                      <p className="text-xs text-neutral-500 truncate">
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <Card>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <Gift className="h-4 w-4 text-neutral-400" />
            Aniversariantes
          </h3>
          {birthdays.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">
              Nenhum aniversário este mês
            </p>
          ) : (
            <div className="space-y-2">
              {birthdays.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {b.birthDate
                      ? new Date(b.birthDate).getDate()
                      : "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {b.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {b.birthDate
                        ? new Date(b.birthDate).toLocaleDateString("pt-BR", {
                            day: "numeric",
                            month: "long",
                          })
                        : "Data não informada"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-neutral-400" />
            Últimas Atividades
          </h3>
          <p className="text-sm text-neutral-400 text-center py-8">
            Em breve
          </p>
        </Card>
      </div>
    </div>
  )
}
