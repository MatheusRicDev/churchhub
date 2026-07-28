"use server"

import { auth } from "@/lib/auth"
import { visitorService } from "@/services/visitor-service"

export async function getVisitorsAction() {
  const session = await auth()
  if (!session?.user?.churchId) return []

  return visitorService.getVisitors(session.user.churchId)
}

export async function getVisitorAction(id: string) {
  const session = await auth()
  if (!session?.user?.churchId) return null

  return visitorService.getVisitor(id)
}

export async function createVisitorAction(data: {
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
  const session = await auth()
  if (!session?.user?.churchId) throw new Error("Não autorizado")
  if (!data.name?.trim()) throw new Error("Nome é obrigatório")

  return visitorService.createVisitor({
    ...data,
    churchId: session.user.churchId,
  })
}

export async function updateVisitorAction(
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
  const session = await auth()
  if (!session?.user?.churchId) throw new Error("Não autorizado")

  return visitorService.updateVisitor(id, data)
}

export async function deleteVisitorAction(id: string) {
  const session = await auth()
  if (!session?.user?.churchId) throw new Error("Não autorizado")

  return visitorService.deleteVisitor(id)
}
