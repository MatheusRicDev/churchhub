import { prisma } from "@/lib/prisma"
import type { Prisma } from "@db/client"

export const memberRepository = {
  async findByChurchId(churchId: string) {
    return prisma.member.findMany({
      where: { churchId },
      orderBy: { createdAt: "desc" },
    })
  },

  async countByChurchId(churchId: string) {
    return prisma.member.count({ where: { churchId } })
  },

  async countCreatedAfter(churchId: string, date: Date) {
    return prisma.member.count({
      where: { churchId, createdAt: { gte: date } },
    })
  },

  async countByMonth(churchId: string) {
    const members = await prisma.member.findMany({
      where: { churchId },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    })
    return members
  },

  async create(data: Prisma.MemberCreateInput) {
    return prisma.member.create({ data })
  },

  async update(id: string, data: Prisma.MemberUpdateInput) {
    return prisma.member.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.member.delete({ where: { id } })
  },
}
