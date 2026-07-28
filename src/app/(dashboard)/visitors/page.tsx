import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { VisitorsContent } from "./visitors-content"

export default async function VisitorsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return <VisitorsContent />
}
