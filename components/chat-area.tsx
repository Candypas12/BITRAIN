"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ArrowUp, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatMessage {
  role: "user" | "model"
  content: string
}

function ChatComposer({
  value,
  onChange,
  onKeyDown,
  onSend,
  disabled,
  minHeight,
}: {
  value: string
  onChange: (value: string) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onSend: () => void
  disabled: boolean
  minHeight: string
}) {
  return (
    <div className="input-3d bg-gradient-to-br from-secondary/70 via-secondary/60 to-secondary/50 backdrop-blur-xl rounded-2xl border border-border/50 p-4 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask BITRAIN anything..."
            className={cn(
              "flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-lg font-normal",
              minHeight,
            )}
          />
        </div>
        <div className="flex items-center justify-end pt-2 border-t border-border/30">
          <Button
            size="icon"
            onClick={onSend}
            disabled={disabled}
            className="btn-3d btn-glow h-9 w-9 rounded-full bg-gradient-to-br from-primary via-gray-900 to-black hover:from-gray-900 hover:to-black text-white shadow-xl disabled:opacity-40"
            aria-label="Send message"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ChatArea() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }]
    setMessages(nextMessages)
    setInput("")
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong.")
      setMessages((prev) => [...prev, { role: "model", content: data.content as string }])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const hasMessages = messages.length > 0

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
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center bg-primary/10 border border-border/30 shadow-lg">
            <Image src="/LOGO-DARK.svg" alt="BITRAIN logo" width={36} height={36} className="object-cover" />
          </div>
          <span className="text-lg font-semibold text-foreground font-[var(--font-heading)] tracking-tight">
            BITRAIN
          </span>
        </div>
      </header>

      {hasMessages ? (
        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-4xl mx-auto w-full space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary via-gray-900 to-black text-white"
                        : "bg-secondary/60 border border-border/50 text-foreground backdrop-blur-sm",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 bg-secondary/60 border border-border/50 backdrop-blur-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div ref={bottomRef} />
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="max-w-4xl mx-auto w-full">
              <ChatComposer
                value={input}
                onChange={setInput}
                onKeyDown={handleKeyDown}
                onSend={handleSend}
                disabled={isLoading || !input.trim()}
                minHeight="min-h-[56px]"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-6">
          <h1 className="text-4xl font-semibold text-foreground mb-8 text-center font-[var(--font-heading)] tracking-tight text-balance">
            How can BITRAIN help you today?
          </h1>

          <div className="w-full max-w-4xl space-y-3">
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <ChatComposer
              value={input}
              onChange={setInput}
              onKeyDown={handleKeyDown}
              onSend={handleSend}
              disabled={isLoading || !input.trim()}
              minHeight="min-h-[80px]"
            />
          </div>
        </div>
      )}
    </main>
  )
}
