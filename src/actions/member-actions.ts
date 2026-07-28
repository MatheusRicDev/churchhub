"use server"

import { auth } from "@/lib/auth"
import { memberService } from "@/services/member-service"

export async function getMembersAction() {
  const session = await auth()
  if (!session?.user?.churchId) return []

  return memberService.getMembers(session.user.churchId)
}

export async function getMemberAction(id: string) {
  const session = await auth()
  if (!session?.user?.churchId) return null

  return memberService.getMember(id)
}

export async function createMemberAction(data: {
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
  const session = await auth()
  if (!session?.user?.churchId) throw new Error("Não autorizado")
  if (!data.name?.trim()) throw new Error("Nome é obrigatório")
  if (!data.address?.trim()) throw new Error("Endereço é obrigatório")

  return memberService.createMember({
    ...data,
    churchId: session.user.churchId,
  })
}

export async function updateMemberAction(
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
  const session = await auth()
  if (!session?.user?.churchId) throw new Error("Não autorizado")
  if (!data.name?.trim()) throw new Error("Nome é obrigatório")
  if (!data.address?.trim()) throw new Error("Endereço é obrigatório")

  return memberService.updateMember(id, data)
}

export async function deleteMemberAction(id: string) {
  const session = await auth()
  if (!session?.user?.churchId) throw new Error("Não autorizado")

  return memberService.deleteMember(id)
}
