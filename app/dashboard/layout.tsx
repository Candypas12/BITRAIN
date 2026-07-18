import type React from "react"
import { auth } from "@/auth"
import { SessionProvider } from "@/components/session-provider"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return <SessionProvider session={session}>{children}</SessionProvider>
}
