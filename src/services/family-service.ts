import { familyRepository } from "@/repositories/family-repository"
import { prisma } from "@/lib/prisma"

export const familyService = {
  async getRelations(memberId: string) {
    return familyRepository.findByMemberId(memberId)
  },

  async createRelation(data: {
    churchId: string
    fromId: string
    toId: string
    type: string
  }) {
    const relation = await familyRepository.create(data)

    if (data.type !== "spouse") {
      const spouseRels = await prisma.familyRelation.findMany({
        where: {
          churchId: data.churchId,
          type: "spouse",
          OR: [
            { fromId: data.fromId },
            { toId: data.fromId },
          ],
        },
      })

      for (const rel of spouseRels) {
        const spouseId = rel.fromId === data.fromId ? rel.toId : rel.fromId

        const existing = await prisma.familyRelation.findFirst({
          where: {
            churchId: data.churchId,
            fromId: spouseId,
            toId: data.toId,
            type: data.type,
          },
        })

        if (!existing) {
          await familyRepository.create({
            churchId: data.churchId,
            fromId: spouseId,
            toId: data.toId,
            type: data.type,
          })
        }
      }
    }

    return relation
  },

  async deleteRelation(id: string) {
    return familyRepository.delete(id)
  },
}
