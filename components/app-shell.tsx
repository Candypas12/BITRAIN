"use client"

import { useState } from "react"
import { Sidebar, type View, type Conversation } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { ProfileView } from "@/components/profile-view"

export function AppShell() {
  const [view, setView] = useState<View>("chat")
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  // Frontend-only conversation store; empty for a new user. Ready for dynamic additions later.
  const [conversations] = useState<Conversation[]>([])

  const handleNavigate = (next: View) => {
    setView(next)
    setMobileOpen(false)
  }

  const handleNewChat = () => {
    setView("chat")
    setMobileOpen(false)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar
        activeView={view}
        onNavigate={handleNavigate}
        onNewChat={handleNewChat}
        conversations={conversations}
        onSelectConversation={() => handleNavigate("chat")}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      {view === "chat" && <ChatArea onOpenSidebar={() => setMobileOpen(true)} sidebarCollapsed={collapsed} />}
      {view === "profile" && <ProfileView onOpenSidebar={() => setMobileOpen(true)} />}
    </div>
  )
}
