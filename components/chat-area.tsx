"use client"

import { FileText, ArrowUp, Paperclip, BookOpenCheck, GraduationCap, Menu } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatAreaProps {
  onOpenSidebar?: () => void
  sidebarCollapsed?: boolean
}

export function ChatArea({ onOpenSidebar, sidebarCollapsed }: ChatAreaProps) {
  return (
    <main className="flex-1 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

      {/* Animated gradient orbs for shader effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shader-orb shader-orb-1" />
        <div className="shader-orb shader-orb-2" />
        <div className="shader-orb shader-orb-3" />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-[0.15] grid-background" />

      {/* Noise texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
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

        {/* BITRAIN combined logo — shown in top nav only when the sidebar logo is hidden
            (always on mobile since the sidebar is off-canvas, and on desktop when collapsed) */}
        <div className={cn("flex items-center gap-2", sidebarCollapsed ? "md:flex" : "md:hidden")}>
          <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center bg-primary/10 border border-border/30 shadow-lg">
            <Image src="/LOGO-DARK.svg" alt="BITRAIN logo" width={36} height={36} className="object-cover" />
          </div>
          <span className="text-lg font-semibold text-foreground font-[var(--font-heading)] tracking-tight">
            BITRAIN
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-6">
        {/* Title */}
        <h1 className="text-4xl font-semibold text-foreground mb-8 text-center font-[var(--font-heading)] tracking-tight text-balance">
          How can BITRAIN help you today?
        </h1>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Button
            variant="secondary"
            className="btn-3d btn-glow gap-2 bg-gradient-to-br from-secondary/90 to-secondary/70 text-foreground hover:from-secondary/70 hover:to-secondary/50 backdrop-blur-sm shadow-lg font-medium"
          >
            <FileText className="w-4 h-4" />
            Summarize Notes
          </Button>
          <Button
            variant="secondary"
            className="btn-3d btn-glow gap-2 bg-gradient-to-br from-secondary/90 to-secondary/70 text-foreground hover:from-secondary/70 hover:to-secondary/50 backdrop-blur-sm shadow-lg font-medium"
          >
            <BookOpenCheck className="w-4 h-4" />
            Explain a Concept
          </Button>
          <Button
            variant="secondary"
            className="btn-3d btn-glow gap-2 bg-gradient-to-br from-secondary/90 to-secondary/70 text-foreground hover:from-secondary/70 hover:to-secondary/50 backdrop-blur-sm shadow-lg font-medium"
          >
            <GraduationCap className="w-4 h-4" />
            Ask from PYQs
          </Button>
        </div>

        {/* Input Area */}
        <div className="w-full max-w-4xl">
          <div className="input-3d bg-gradient-to-br from-secondary/70 via-secondary/60 to-secondary/50 backdrop-blur-xl rounded-2xl border border-border/50 p-4 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <textarea
                  placeholder="Ask BITRAIN anything..."
                  className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-lg min-h-[80px] font-normal"
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-3d gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="w-4 h-4" />
                    Attach File
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    className="btn-3d btn-glow h-9 w-9 rounded-full bg-gradient-to-br from-primary via-gray-900 to-black hover:from-gray-900 hover:to-black text-white shadow-xl"
                    aria-label="Send message"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
