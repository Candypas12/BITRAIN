"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowUp, Check, Copy, SquarePen, User } from "lucide-react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatMessage {
  role: "user" | "model"
  content: string
}

const SUGGESTIONS = [
  "Explain this concept in simple terms",
  "Summarize my notes on this topic",
  "Give me practice questions",
  "Walk me through a solved example",
]

const COMPOSER_MAX_HEIGHT = 200
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000

function ChatComposer({
  value,
  onChange,
  onKeyDown,
  onSend,
  disabled,
  minHeight,
  textareaRef,
  cooldownSeconds,
}: {
  value: string
  onChange: (value: string) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onSend: () => void
  disabled: boolean
  minHeight: string
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  cooldownSeconds: number
}) {
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, COMPOSER_MAX_HEIGHT)}px`
  }, [value, textareaRef])

  return (
    <div className="input-3d bg-gradient-to-br from-secondary/70 via-secondary/60 to-secondary/50 backdrop-blur-xl rounded-2xl border border-border/50 p-4 shadow-2xl">
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask BITRAIN anything..."
            rows={1}
            className={cn(
              "flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-lg font-normal overflow-y-auto",
              minHeight,
            )}
            style={{ maxHeight: COMPOSER_MAX_HEIGHT }}
          />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <span className="text-xs text-muted-foreground">
            {cooldownSeconds > 0
              ? `Slow down — you can send another message in ${cooldownSeconds}s`
              : <>Enter to send &middot; Shift+Enter for a new line</>}
          </span>
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy response"
      className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

function AssistantAvatar() {
  return (
    <div className="w-7 h-7 shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-primary/10 border border-border/30">
      <Image src="/LOGO-DARK.svg" alt="" width={28} height={28} className="object-cover" />
    </div>
  )
}

function UserAvatar() {
  return (
    <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center bg-secondary border border-border/50">
      <User className="w-3.5 h-3.5 text-muted-foreground" />
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3 group", isUser ? "justify-end" : "justify-start")}>
      {!isUser && <AssistantAvatar />}
      <div className={cn("max-w-[85%] flex flex-col", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-gradient-to-br from-gray-700 via-gray-900 to-black text-white whitespace-pre-wrap"
              : "bg-secondary/60 border border-border/50 text-foreground backdrop-blur-sm",
          )}
        >
          {isUser ? (
            message.content
          ) : (
            <div
              className="prose-chat [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {!isUser && <CopyButton text={message.content} />}
      </div>
      {isUser && <UserAvatar />}
    </div>
  )
}

export function ChatArea() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const sendTimestampsRef = useRef<number[]>([])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    if (distanceFromBottom < 200) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  useEffect(() => {
    if (cooldownSeconds <= 0) return
    const timer = setTimeout(() => setCooldownSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearTimeout(timer)
  }, [cooldownSeconds])

  const startCooldown = (ms: number) => setCooldownSeconds(Math.max(1, Math.ceil(ms / 1000)))

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    setShowScrollButton(distanceFromBottom > 300)
  }

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading || cooldownSeconds > 0) return

    const now = Date.now()
    const recentSends = sendTimestampsRef.current.filter((t) => now - t < RATE_WINDOW_MS)
    if (recentSends.length >= RATE_LIMIT) {
      const retryAfterMs = RATE_WINDOW_MS - (now - recentSends[0])
      startCooldown(retryAfterMs)
      toast.error(`You're sending messages too quickly. Try again in ${Math.ceil(retryAfterMs / 1000)}s.`)
      return
    }
    sendTimestampsRef.current = [...recentSends, now]

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }]
    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
        signal: controller.signal,
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 429 && typeof data.retryAfterSeconds === "number") {
          startCooldown(data.retryAfterSeconds * 1000)
        }
        throw new Error(data.error || "Something went wrong.")
      }
      setMessages((prev) => [...prev, { role: "model", content: data.content as string }])
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return
      toast.error(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleSend = () => sendMessage(input)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    abortRef.current?.abort()
    setMessages([])
    setInput("")
    setIsLoading(false)
    textareaRef.current?.focus()
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
      <header className="relative z-10 flex items-center justify-between gap-3 px-6 py-4 border-b border-border/50 backdrop-blur-sm bg-background/30">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center bg-primary/10 border border-border/30 shadow-lg">
            <Image src="/LOGO-DARK.svg" alt="BITRAIN logo" width={36} height={36} className="object-cover" />
          </div>
          <span className="text-lg font-semibold text-foreground font-[var(--font-heading)] tracking-tight">
            BITRAIN
          </span>
        </div>
        {hasMessages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewChat}
            className="text-muted-foreground hover:text-foreground"
          >
            <SquarePen className="w-4 h-4" />
            New chat
          </Button>
        )}
      </header>

      {hasMessages ? (
        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-6 relative"
          >
            <div className="max-w-4xl mx-auto w-full space-y-4">
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-3 justify-start">
                  <AssistantAvatar />
                  <div className="rounded-2xl px-4 py-3 bg-secondary/60 border border-border/50 backdrop-blur-sm flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                    </span>
                    <span className="text-xs text-muted-foreground">BITRAIN is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {showScrollButton && (
            <button
              type="button"
              onClick={scrollToBottom}
              aria-label="Scroll to latest message"
              className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-secondary/90 border border-border/50 backdrop-blur-sm shadow-lg hover:bg-secondary transition-colors"
            >
              <ArrowDown className="w-4 h-4 text-foreground" />
            </button>
          )}

          <div className="px-6 pb-6">
            <div className="max-w-4xl mx-auto w-full">
              <ChatComposer
                value={input}
                onChange={setInput}
                onKeyDown={handleKeyDown}
                onSend={handleSend}
                disabled={isLoading || !input.trim() || cooldownSeconds > 0}
                minHeight="min-h-[28px]"
                textareaRef={textareaRef}
                cooldownSeconds={cooldownSeconds}
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
            <ChatComposer
              value={input}
              onChange={setInput}
              onKeyDown={handleKeyDown}
              onSend={handleSend}
              disabled={isLoading || !input.trim() || cooldownSeconds > 0}
              minHeight="min-h-[52px]"
              textareaRef={textareaRef}
              cooldownSeconds={cooldownSeconds}
            />
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInput(suggestion)}
                  className="text-sm text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary/80 border border-border/40 rounded-full px-3.5 py-1.5 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
