import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { retrieveContext } from "@/lib/rag"
import { checkRateLimit } from "@/lib/rate-limit"

// Rolling alias to Google's current recommended free-tier flash model —
// avoids hardcoding a dated model name that gets deprecated for new API keys.
const MODEL = "gemini-flash-latest"
const MAX_MESSAGES = 50
const MAX_MESSAGE_LENGTH = 8000
const BASE_SYSTEM_INSTRUCTION =
  "You are BITRAIN, an AI academic assistant for engineering students. Give clear, accurate, concise answers. " +
  "Format math using LaTeX: wrap inline expressions in single dollar signs (e.g. $R = 15\\ \\Omega$) and standalone " +
  "equations in double dollar signs (e.g. $$Z = \\sqrt{R^2 + (X_L - X_C)^2}$$)."

interface ChatMessage {
  role: "user" | "model"
  content: string
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false
  const { role, content } = value as Record<string, unknown>
  return (
    (role === "user" || role === "model") &&
    typeof content === "string" &&
    content.trim().length > 0 &&
    content.length <= MAX_MESSAGE_LENGTH
  )
}

export async function POST(req: Request) {
  const session = await auth()
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const clientKey = session?.user?.email ?? clientIp ?? "anonymous"

  const { allowed, retryAfterMs } = checkRateLimit(clientKey)
  if (!allowed) {
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000)
    return NextResponse.json(
      {
        error: `You're sending messages too quickly. Try again in ${retryAfterSeconds}s.`,
        retryAfterSeconds,
      },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    )
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const messages = (body as Record<string, unknown>)?.messages
  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isChatMessage)) {
    return NextResponse.json({ error: "messages must be a non-empty array of { role, content }." }, { status: 400 })
  }
  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: `Conversation too long (max ${MAX_MESSAGES} messages).` }, { status: 400 })
  }

  const ai = new GoogleGenAI({ apiKey })

  try {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content
    const context = lastUserMessage ? await retrieveContext(ai, lastUserMessage) : []

    const systemInstruction =
      context.length > 0
        ? `${BASE_SYSTEM_INSTRUCTION}

Use the following notes as context when relevant. If they don't cover the question, answer from your own knowledge and don't mention the notes.

${context.map((c, i) => `[${i + 1}] (from ${c.file})\n${c.text}`).join("\n\n")}`
        : BASE_SYSTEM_INSTRUCTION

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.content }],
      })),
      config: {
        systemInstruction,
      },
    })

    const text = response.text
    if (!text) {
      return NextResponse.json({ error: "Gemini returned an empty response." }, { status: 502 })
    }

    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("Gemini request failed:", error)
    return NextResponse.json({ error: "Failed to get a response from Gemini." }, { status: 502 })
  }
}
