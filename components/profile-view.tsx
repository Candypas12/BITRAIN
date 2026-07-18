"use client"

import { Mail, User, Menu } from "lucide-react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ProfileViewProps {
  onOpenSidebar?: () => void
}

function initials(name?: string | null) {
  if (!name) return "?"
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function ProfileView({ onOpenSidebar }: ProfileViewProps) {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="shader-orb shader-orb-1" />
        <div className="shader-orb shader-orb-2" />
      </div>
      <div className="absolute inset-0 opacity-[0.15] grid-background" />

      <header className="relative z-10 flex items-center gap-3 px-6 py-4 border-b border-border/50 backdrop-blur-sm bg-background/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="btn-3d md:hidden h-9 w-9 text-foreground shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground font-[var(--font-heading)] tracking-tight">Profile</h1>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="card-3d w-full max-w-md bg-gradient-to-br from-secondary/70 via-secondary/60 to-secondary/50 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center gap-4">
            <Avatar className="h-24 w-24 border border-border/50 shadow-lg">
              <AvatarImage src={user?.image ?? undefined} alt="Profile picture" />
              <AvatarFallback className="bg-sidebar-accent text-foreground text-2xl font-semibold">
                {initials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-foreground font-[var(--font-heading)]">
                {user?.name ?? "Unknown user"}
              </h2>
              <p className="text-sm text-muted-foreground">BIT Student</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 px-4 py-3">
              <User className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium text-foreground">{user?.name ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 px-4 py-3">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{user?.email ?? "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
