import { prisma } from "@/lib/prisma"

export const churchRepository = {
  async findBySlug(slug: string) {
    return prisma.church.findUnique({ where: { slug } })
  },

  async create(data: { name: string; slug: string }) {
    return prisma.church.create({ data })
  },
}
