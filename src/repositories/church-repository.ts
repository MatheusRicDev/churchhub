import { prisma } from "@/lib/prisma"

export const churchRepository = {
  async create(data: { name: string; slug: string }) {
    return prisma.church.create({ data })
  },
}
