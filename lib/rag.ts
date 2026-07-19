import { readFile, stat } from "node:fs/promises"
import path from "node:path"
import type { GoogleGenAI } from "@google/genai"

const INDEX_PATH = path.join(process.cwd(), "data", "index.json")
const EMBED_MODEL = "gemini-embedding-001"

interface IndexRecord {
  file: string
  chunkIndex: number
  text: string
  embedding: number[]
}

interface IndexFile {
  model: string
  records: IndexRecord[]
}

export interface RetrievedChunk {
  file: string
  text: string
  score: number
}

let cachedIndex: IndexFile | null | undefined
let cachedMtimeMs: number | undefined

// Reloads data/index.json whenever its mtime changes, so re-running
// `npm run build-index` while the server is already running (e.g. resuming
// after a quota pause) is picked up without needing a restart.
async function loadIndex(): Promise<IndexFile | null> {
  let mtimeMs: number
  try {
    mtimeMs = (await stat(INDEX_PATH)).mtimeMs
  } catch {
    cachedIndex = null
    cachedMtimeMs = undefined
    return cachedIndex
  }

  if (cachedIndex !== undefined && cachedMtimeMs === mtimeMs) return cachedIndex

  try {
    const raw = await readFile(INDEX_PATH, "utf-8")
    cachedIndex = JSON.parse(raw) as IndexFile
    cachedMtimeMs = mtimeMs
  } catch {
    cachedIndex = null
    cachedMtimeMs = undefined
  }
  return cachedIndex
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Embeds the query with the same model used to build the index and returns
// the top-k most similar chunks. Returns [] if no index has been built yet.
export async function retrieveContext(
  ai: GoogleGenAI,
  query: string,
  topK = 5,
): Promise<RetrievedChunk[]> {
  const index = await loadIndex()
  if (!index || index.records.length === 0) return []

  const response = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: [query],
  })
  const queryEmbedding = response.embeddings?.[0]?.values
  if (!queryEmbedding) return []

  return index.records
    .map((record) => ({
      file: record.file,
      text: record.text,
      score: cosineSimilarity(queryEmbedding, record.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}
