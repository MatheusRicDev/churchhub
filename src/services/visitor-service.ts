import { visitorRepository } from "@/repositories/visitor-repository"

export const visitorService = {
  async getVisitors(churchId: string) {
    return visitorRepository.findByChurchId(churchId)
  },

  async getStats(churchId: string) {
    const total = await visitorRepository.countByChurchId(churchId)
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const startOfLastMonth = new Date(startOfMonth)
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)

    const thisMonth = await visitorRepository.countCreatedAfter(
      churchId,
      startOfMonth
    )
    const lastMonth = await visitorRepository.countCreatedAfter(
      churchId,
      startOfLastMonth
    )

    return { total, thisMonth, lastMonth }
  },

  async createVisitor(data: {
    churchId: string
    name: string
    phone?: string
    phoneWhatsApp?: boolean
    invitedBy?: string
    address?: string
    number?: string
    city?: string
    state?: string
    observations?: string
  }) {
    return visitorRepository.create({
      church: { connect: { id: data.churchId } },
      name: data.name,
      phone: data.phone || null,
      phoneWhatsApp: data.phoneWhatsApp || false,
      invitedBy: data.invitedBy || null,
      address: data.address || null,
      number: data.number || null,
      city: data.city || null,
      state: data.state || null,
      observations: data.observations || null,
    })
  },

  async updateVisitor(
    id: string,
    data: {
      name: string
      phone?: string
      phoneWhatsApp?: boolean
      invitedBy?: string
      address?: string
      number?: string
      city?: string
      state?: string
      observations?: string
    }
  ) {
    return visitorRepository.update(id, {
      name: data.name,
      phone: data.phone || null,
      phoneWhatsApp: data.phoneWhatsApp || false,
      invitedBy: data.invitedBy || null,
      address: data.address || null,
      number: data.number || null,
      city: data.city || null,
      state: data.state || null,
      observations: data.observations || null,
    })
  },

  async deleteVisitor(id: string) {
    return visitorRepository.delete(id)
  },
}
