import { eventRepository } from "@/repositories/event-repository"

export const eventService = {
  async getEvents(churchId: string) {
    return eventRepository.findByChurchId(churchId)
  },

  async getUpcomingEvents(churchId: string) {
    return eventRepository.findUpcoming(churchId)
  },

  async getStats(churchId: string) {
    const total = await eventRepository.countByChurchId(churchId)
    return { total }
  },

  async createEvent(data: {
    churchId: string
    title: string
    description?: string
    date: string
    location?: string
  }) {
    const eventDate = new Date(data.date)
    if (eventDate < new Date()) {
      throw new Error("Não é possível criar eventos em datas passadas")
    }
    return eventRepository.create({
      church: { connect: { id: data.churchId } },
      title: data.title,
      description: data.description || null,
      date: eventDate,
      location: data.location || null,
    })
  },

  async updateEvent(
    id: string,
    data: {
      title: string
      description?: string
      date: string
      location?: string
    }
  ) {
    return eventRepository.update(id, {
      title: data.title,
      description: data.description || null,
      date: new Date(data.date),
      location: data.location || null,
    })
  },

  async deleteEvent(id: string) {
    return eventRepository.delete(id)
  },
}
