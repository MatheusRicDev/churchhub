"use server"

import { auth } from "@/lib/auth"
import { memberRepository } from "@/repositories/member-repository"
import { eventRepository } from "@/repositories/event-repository"

export async function getNotificationsAction() {
  const session = await auth()
  if (!session?.user?.churchId) {
    return { birthdays: [], events: [] }
  }

  const churchId = session.user.churchId
  const now = new Date()

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sevenDaysLater = new Date(todayStart)
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

  const [members, upcomingEvents] = await Promise.all([
    memberRepository.findByChurchId(churchId),
    eventRepository.findByChurchId(churchId),
  ])

  const birthdays = members
    .filter((m) => {
      if (!m.birthDate) return false
      const bd = m.birthDate
      return bd.getMonth() === now.getMonth() && bd.getDate() === now.getDate()
    })
    .map((m) => ({ id: m.id, name: m.name }))

  const events = upcomingEvents
    .filter((e) => {
      const d = new Date(e.date)
      return d >= todayStart && d <= sevenDaysLater
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location,
    }))

  return { birthdays, events }
}
