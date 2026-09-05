"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authService } from "@/services/auth-service"
import {
  AuthValidationError,
  hasErrors,
  validateLogin,
  validateRegister,
} from "@/lib/auth-validation"
import type { FieldErrors } from "@/lib/auth-validation"

export interface LoginActionResult {
  success: boolean
  user?: {
    id: string
    email: string
    name: string
    churchId: string
    role: string
    churchName: string
    churchSlug: string
  }
  fieldErrors?: FieldErrors
  error?: string
}

export async function loginAction(
  email: string,
  password: string
): Promise<LoginActionResult> {
  const fieldErrors = validateLogin(email, password)
  if (hasErrors(fieldErrors)) {
    return { success: false, fieldErrors }
  }

  const normalizedEmail = email.trim().toLowerCase()

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { church: true },
    })

    if (!user) {
      return {
        success: false,
        fieldErrors: { email: "Não encontramos uma conta com este email" },
      }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return {
        success: false,
        fieldErrors: { password: "Senha incorreta. Verifique e tente novamente." },
      }
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
    return {
      success: false,
      error: "Erro ao fazer login. Tente novamente em alguns instantes.",
    }
  }
}

export interface RegisterActionResult {
  success: boolean
  user?: {
    email: string
    password: string
  }
  fieldErrors?: FieldErrors
  error?: string
}

export async function registerAction(formData: {
  name: string
  churchName: string
  email: string
  password: string
  confirmPassword: string
}): Promise<RegisterActionResult> {
  const fieldErrors = validateRegister(formData)
  if (hasErrors(fieldErrors)) {
    return { success: false, fieldErrors }
  }

  const email = formData.email.trim().toLowerCase()

  try {
    await authService.register({
      name: formData.name.trim(),
      churchName: formData.churchName.trim(),
      email,
      password: formData.password,
    })

    return {
      success: true,
      user: {
        email,
        password: formData.password,
      },
    }
  } catch (error) {
    if (error instanceof AuthValidationError) {
      return { success: false, fieldErrors: { [error.field]: error.message } }
    }
    return {
      success: false,
      error: "Não foi possível criar sua conta. Tente novamente em alguns instantes.",
    }
  }
}