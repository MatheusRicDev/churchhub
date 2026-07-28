"use server"

import { auth } from "@/lib/auth"
import { familyService } from "@/services/family-service"

export async function getFamilyRelationsAction(memberId: string) {
  const session = await auth()
  if (!session?.user?.churchId) return []

  return familyService.getRelations(memberId)
}

export async function createFamilyRelationAction(data: {
  fromId: string
  toId: string
  type: string
}) {
  const session = await auth()
  if (!session?.user?.churchId) throw new Error("Não autorizado")

  return familyService.createRelation({
    ...data,
    churchId: session.user.churchId,
  })
}

export async function deleteFamilyRelationAction(id: string) {
  const session = await auth()
  if (!session?.user?.churchId) throw new Error("Não autorizado")

  return familyService.deleteRelation(id)
}
