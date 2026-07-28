"use server"

import { auth } from "@/lib/auth"
import { eventService } from "@/services/event-service"

export async function getEventsAction() {
  const session = await auth()
  if (!session?.user?.churchId) return []

  return eventService.getEvents(session.user.churchId)
}

export async function createEventAction(data: {
  title: string
  description?: string
  date: string
  location?: string
}) {
  const session = await auth()
  if (!session?.user?.churchId) throw new Error("Não autorizado")
  if (!data.title?.trim()) throw new Error("Título é obrigatório")
  if (!data.date) throw new Error("Data é obrigatória")

  const eventDate = new Date(data.date)
  if (eventDate < new Date()) {
    throw new Error("Não é possível criar eventos em datas passadas")
  }

  return eventService.createEvent({
    ...data,
    churchId: session.user.churchId,
  })
}

export async function updateEventAction(
  id: string,
  data: {
    title: string
    description?: string
    date: string
    location?: string
  }
) {
  const session = await auth()
  if (!session?.user?.churchId) throw new Error("Não autorizado")

  return eventService.updateEvent(id, data)
}

export async function deleteEventAction(id: string) {
  const session = await auth()
  if (!session?.user?.churchId) throw new Error("Não autorizado")

  return eventService.deleteEvent(id)
}
