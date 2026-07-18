"use client"

import { MessageSquare, User, LogOut, PanelLeftClose, PanelLeft, X } from "lucide-react"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type View = "chat" | "profile"

export interface Conversation {
  id: string
  title: string
}

interface SidebarProps {
  activeView: View
  onNavigate: (view: View) => void
  conversations: Conversation[]
  onSelectConversation: (id: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({
  activeView,
  onNavigate,
  conversations,
  onSelectConversation,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "z-40 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
          "fixed inset-y-0 left-0 w-72 md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "md:w-20" : "md:w-80",
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          {/* BITRAIN logo — shown here only when the sidebar is expanded */}
          <div className={cn("flex items-center gap-2 overflow-hidden", collapsed && "md:hidden")}>
            <div className="w-8 h-8 shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-primary/10">
              <Image src="/LOGO-DARK.svg" alt="BITRAIN logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground font-[var(--font-heading)] tracking-tight whitespace-nowrap">
              BITRAIN
            </span>
          </div>

          {/* Desktop collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className={cn("btn-3d hidden md:flex h-8 w-8 text-sidebar-foreground shrink-0", collapsed && "md:hidden")}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>

          {/* Mobile close toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            className="btn-3d md:hidden h-8 w-8 text-sidebar-foreground shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Expand toggle when collapsed (desktop) */}
        {collapsed && (
          <div className="hidden md:flex px-3 pt-3 justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="btn-3d h-9 w-9 text-sidebar-foreground"
              aria-label="Expand sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Recent Chats */}
        <div className="px-3 pt-3 flex-1 overflow-y-auto">
          <div className="mb-4">
            <h3
              className={cn(
                "px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                collapsed && "md:hidden",
              )}
            >
              Recent Chats
            </h3>
            {conversations.length === 0 ? (
              <p className={cn("px-3 text-sm text-muted-foreground leading-relaxed", collapsed && "md:hidden")}>
                No conversations yet.
              </p>
            ) : (
              <div className="space-y-1">
                {conversations.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    onClick={() => onSelectConversation(chat.id)}
                    className={cn(
                      "btn-3d w-full gap-3 text-sidebar-foreground hover:bg-sidebar-accent font-medium truncate",
                      collapsed ? "md:justify-center md:px-0" : "justify-start",
                    )}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className={cn("truncate", collapsed && "md:hidden")}>{chat.title}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Button
            variant="ghost"
            onClick={() => onNavigate("profile")}
            className={cn(
              "btn-3d w-full gap-3 font-medium hover:bg-sidebar-accent text-sidebar-foreground",
              collapsed ? "md:justify-center md:px-0" : "justify-start",
              activeView === "profile" && "bg-sidebar-accent",
            )}
            aria-label="My Profile"
          >
            <User className="w-4 h-4 shrink-0" />
            <span className={cn(collapsed && "md:hidden")}>My Profile</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/" })}
            className={cn(
              "btn-3d w-full gap-3 text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive font-medium",
              collapsed ? "md:justify-center md:px-0" : "justify-start",
            )}
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={cn(collapsed && "md:hidden")}>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
