import { memberRepository } from "@/repositories/member-repository"

export const memberService = {
  async getMembers(churchId: string) {
    return memberRepository.findByChurchId(churchId)
  },

  async getMember(id: string) {
    return memberRepository.findById(id)
  },

  async getStats(churchId: string) {
    const total = await memberRepository.countByChurchId(churchId)
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const startOfLastMonth = new Date(startOfMonth)
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)

    const thisMonth = await memberRepository.countCreatedAfter(
      churchId,
      startOfMonth
    )
    const lastMonth = await memberRepository.countCreatedAfter(
      churchId,
      startOfLastMonth
    )

    return { total, thisMonth, lastMonth }
  },

  async createMember(data: {
    churchId: string
    name: string
    email?: string
    phone?: string
    phoneWhatsApp?: boolean
    birthDate?: string
    gender?: string
    maritalStatus?: string
    baptized?: boolean
    ministry?: string
    address?: string
    number?: string
    complement?: string
    city?: string
    state?: string
    notes?: string
  }) {
    return memberRepository.create({
      church: { connect: { id: data.churchId } },
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      phoneWhatsApp: data.phoneWhatsApp || false,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      gender: data.gender || null,
      maritalStatus: data.maritalStatus || null,
      baptized: data.baptized || false,
      ministry: data.ministry || null,
      address: data.address || null,
      number: data.number || null,
      complement: data.complement || null,
      city: data.city || null,
      state: data.state || null,
      notes: data.notes || null,
    })
  },

  async updateMember(
    id: string,
    data: {
      name: string
      email?: string
      phone?: string
      phoneWhatsApp?: boolean
      birthDate?: string
      gender?: string
      maritalStatus?: string
      baptized?: boolean
      ministry?: string
      address?: string
      number?: string
      complement?: string
      city?: string
      state?: string
      notes?: string
    }
  ) {
    return memberRepository.update(id, {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      phoneWhatsApp: data.phoneWhatsApp || false,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      gender: data.gender || null,
      maritalStatus: data.maritalStatus || null,
      baptized: data.baptized || false,
      ministry: data.ministry || null,
      address: data.address || null,
      number: data.number || null,
      complement: data.complement || null,
      city: data.city || null,
      state: data.state || null,
      notes: data.notes || null,
    })
  },

  async deleteMember(id: string) {
    return memberRepository.delete(id)
  },
}
