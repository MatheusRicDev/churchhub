import { prisma } from "@/lib/prisma"
import type { Prisma } from "@db/client"

export const eventRepository = {
  async findByChurchId(churchId: string) {
    return prisma.event.findMany({
      where: { churchId },
      orderBy: { date: "desc" },
    })
  },

  async findUpcoming(churchId: string, limit = 5) {
    return prisma.event.findMany({
      where: {
        churchId,
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      take: limit,
    })
  },

  async countByChurchId(churchId: string) {
    return prisma.event.count({ where: { churchId } })
  },

  async create(data: Prisma.EventCreateInput) {
    return prisma.event.create({ data })
  },

  async update(id: string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.event.delete({ where: { id } })
  },
}
