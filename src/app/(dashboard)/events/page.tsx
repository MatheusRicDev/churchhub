import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EventsContent } from "./events-content"

export default async function EventsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return <EventsContent />
}
