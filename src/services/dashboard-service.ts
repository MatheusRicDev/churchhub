import { memberService } from "./member-service"
import { visitorService } from "./visitor-service"
import { eventService } from "./event-service"
import { memberRepository } from "@/repositories/member-repository"
import type { DashboardStats, GrowthDataPoint, UpcomingEvent } from "@/types"

export const dashboardService = {
  async getStats(churchId: string): Promise<DashboardStats> {
    const [memberStats, visitorStats, eventStats] = await Promise.all([
      memberService.getStats(churchId),
      visitorService.getStats(churchId),
      eventService.getStats(churchId),
    ])

    const calcGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    return {
      totalMembers: memberStats.total,
      totalVisitors: visitorStats.total,
      totalEvents: eventStats.total,
      newMembersThisMonth: memberStats.thisMonth,
      membersGrowth: calcGrowth(memberStats.thisMonth, memberStats.lastMonth),
      visitorsGrowth: calcGrowth(visitorStats.thisMonth, visitorStats.lastMonth),
      eventsGrowth: 0,
      newMembersGrowth: calcGrowth(memberStats.thisMonth, memberStats.lastMonth),
    }
  },

  async getGrowthData(churchId: string): Promise<GrowthDataPoint[]> {
    const members = await memberRepository.countByMonth(churchId)

    const monthMap = new Map<string, number>()
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ]

    for (const member of members) {
      const key = `${months[member.createdAt.getMonth()]} ${member.createdAt.getFullYear()}`
      monthMap.set(key, (monthMap.get(key) || 0) + 1)
    }

    const now = new Date()
    const result: GrowthDataPoint[] = []
    let cumulative = 0

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`
      cumulative += monthMap.get(key) || 0
      result.push({ month: key, members: cumulative })
    }

    return result
  },

  async getUpcomingEvents(churchId: string): Promise<UpcomingEvent[]> {
    const events = await eventService.getUpcomingEvents(churchId)
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location,
    }))
  },

  async getBirthdays(churchId: string) {
    const members = await memberService.getMembers(churchId)
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentDay = today.getDate()

    return members
      .filter((m) => {
        if (!m.birthDate) return false
        const bd = new Date(m.birthDate)
        return bd.getMonth() === currentMonth && bd.getDate() >= currentDay
      })
      .slice(0, 5)
      .map((m) => ({
        id: m.id,
        name: m.name,
        birthDate: m.birthDate,
      }))
      .sort((a, b) => {
        if (!a.birthDate || !b.birthDate) return 0
        return a.birthDate.getDate() - b.birthDate.getDate()
      })
  },
}
