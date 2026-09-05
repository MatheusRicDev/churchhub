import { prisma } from "@/lib/prisma"

export const familyRepository = {
  async findByMemberId(memberId: string) {
    return prisma.familyRelation.findMany({
      where: {
        OR: [{ fromId: memberId }, { toId: memberId }],
      },
      include: {
        from: true,
        to: true,
      },
    })
  },

  async create(data: {
    churchId: string
    fromId: string
    toId: string
    type: string
  }) {
    return prisma.familyRelation.create({
      data,
      include: {
        from: true,
        to: true,
      },
    })
  },

  async delete(id: string) {
    return prisma.familyRelation.delete({ where: { id } })
  },
}
