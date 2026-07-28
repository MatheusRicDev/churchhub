import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MembersContent } from "./members-content"

export default async function MembersPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return <MembersContent />
}
