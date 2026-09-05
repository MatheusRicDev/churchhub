import bcrypt from "bcryptjs"
import { userRepository } from "@/repositories/user-repository"
import { churchRepository } from "@/repositories/church-repository"
import { AuthValidationError } from "@/lib/auth-validation"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50) + "-" + Date.now().toString(36)
}

export const authService = {
  async register(data: {
    name: string
    churchName: string
    email: string
    password: string
  }) {
    const existingUser = await userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new AuthValidationError("email", "Este email já está em uso. Tente fazer login.")
    }

    const slug = generateSlug(data.churchName)
    const church = await churchRepository.create({
      name: data.churchName,
      slug,
    })

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await userRepository.create({
      churchId: church.id,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "ADMIN",
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      churchId: user.churchId,
      role: user.role,
      churchName: church.name,
      churchSlug: church.slug,
    }
  },
}
