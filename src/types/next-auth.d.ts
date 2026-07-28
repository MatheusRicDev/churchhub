import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      churchId: string
      role: string
      churchName: string
      churchSlug: string
    } & DefaultSession["user"]
  }

  interface User {
    churchId?: string
    role?: string
    churchName?: string
    churchSlug?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    churchId: string
    role: string
    churchName: string
    churchSlug: string
  }
}
