"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authService } from "@/services/auth-service"

export async function loginAction(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { church: true },
    })

    if (!user) {
      return { error: "Email ou senha inválidos" }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return { error: "Email ou senha inválidos" }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        churchId: user.churchId,
        role: user.role,
        churchName: user.church.name,
        churchSlug: user.church.slug,
      },
    }
  } catch {
    return { error: "Erro ao fazer login" }
  }
}

export async function registerAction(formData: {
  name: string
  churchName: string
  email: string
  password: string
}) {
  try {
    const user = await authService.register(formData)

    return {
      success: true,
      user: {
        email: formData.email,
        password: formData.password,
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: "Erro ao criar conta" }
  }
}
