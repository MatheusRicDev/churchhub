import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import type { NextAuthConfig } from "next-auth"

const config: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { church: true },
        })

        if (!user) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!passwordMatch) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          churchId: user.churchId,
          role: user.role,
          churchName: user.church.name,
          churchSlug: user.church.slug,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.churchId = (user as { churchId?: string }).churchId
        token.role = (user as { role?: string }).role
        token.churchName = (user as { churchName?: string }).churchName
        token.churchSlug = (user as { churchSlug?: string }).churchSlug
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.churchId = token.churchId as string
        session.user.role = token.role as string
        session.user.churchName = token.churchName as string
        session.user.churchSlug = token.churchSlug as string
      }
      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
