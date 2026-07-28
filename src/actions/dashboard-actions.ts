"use server"

import { auth } from "@/lib/auth"
import { dashboardService } from "@/services/dashboard-service"

export async function getDashboardStatsAction() {
  const session = await auth()
  if (!session?.user?.churchId) {
    return {
      stats: null,
      growthData: [],
      upcomingEvents: [],
      birthdays: [],
    }
  }

  const [stats, growthData, upcomingEvents, birthdays] = await Promise.all([
    dashboardService.getStats(session.user.churchId),
    dashboardService.getGrowthData(session.user.churchId),
    dashboardService.getUpcomingEvents(session.user.churchId),
    dashboardService.getBirthdays(session.user.churchId),
  ])

  return { stats, growthData, upcomingEvents, birthdays }
}
