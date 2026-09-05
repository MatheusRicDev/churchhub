import { prisma } from "@/lib/prisma"
import type { Prisma } from "@db/client"

export const visitorRepository = {
  async findByChurchId(churchId: string) {
    return prisma.visitor.findMany({
      where: { churchId },
      orderBy: { firstVisit: "desc" },
    })
  },

  async countByChurchId(churchId: string) {
    return prisma.visitor.count({ where: { churchId } })
  },

  async countCreatedAfter(churchId: string, date: Date) {
    return prisma.visitor.count({
      where: { churchId, firstVisit: { gte: date } },
    })
  },

  async create(data: Prisma.VisitorCreateInput) {
    return prisma.visitor.create({ data })
  },

  async update(id: string, data: Prisma.VisitorUpdateInput) {
    return prisma.visitor.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.visitor.delete({ where: { id } })
  },
}
