"use client"

import { ChatArea } from "@/components/chat-area"

// TEMPORARY: sidebar (recent chats, profile, logout) is disabled for now —
// this renders chat only. See sidebar.tsx / profile-view.tsx to bring it back.
export function AppShell() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <ChatArea />
    </div>
  )
}
