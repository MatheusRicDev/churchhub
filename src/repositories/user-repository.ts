import { prisma } from "@/lib/prisma"

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { church: true },
    })
  },

  async create(data: {
    churchId: string
    name: string
    email: string
    password: string
    role: string
  }) {
    return prisma.user.create({ data })
  },
}
