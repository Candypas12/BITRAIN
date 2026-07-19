import { GoogleGenAI } from "@google/genai"
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

const NOTES_DIR = path.join(process.cwd(), "data", "notes")
const INDEX_PATH = path.join(process.cwd(), "data", "index.json")
const EMBED_MODEL = "gemini-embedding-001"
const CHUNK_SIZE = 1000
const CHUNK_OVERLAP = 150
const BATCH_SIZE = 20
const BATCH_PAUSE_MS = 2000
const MAX_RETRIES = 6

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Splits on blank lines, then packs paragraphs into ~CHUNK_SIZE chunks so
// related sentences stay together instead of being cut mid-thought.
function chunkText(text) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const chunks = []
  let current = ""

  for (const para of paragraphs) {
    if (current && (current.length + para.length + 2) > CHUNK_SIZE) {
      chunks.push(current)
      current = current.slice(Math.max(0, current.length - CHUNK_OVERLAP))
    }
    current = current ? `${current}\n\n${para}` : para

    while (current.length > CHUNK_SIZE * 1.5) {
      chunks.push(current.slice(0, CHUNK_SIZE))
      current = current.slice(CHUNK_SIZE - CHUNK_OVERLAP)
    }
  }
  if (current) chunks.push(current)
  return chunks
}

// Free-tier embedding quota is rate-limited (429s). Retry with backoff,
// honoring the server's suggested retryDelay when it provides one.
async function embedWithRetry(ai, texts, attempt = 0) {
  try {
    return await ai.models.embedContent({ model: EMBED_MODEL, contents: texts })
  } catch (err) {
    const message = err?.message ?? String(err)
    const isRateLimit = err?.status === 429 || message.includes("RESOURCE_EXHAUSTED")
    if (!isRateLimit || attempt >= MAX_RETRIES) throw err

    const match = message.match(/"retryDelay":"(\d+)s"/)
    const waitMs = match ? (parseInt(match[1], 10) + 2) * 1000 : 15000 * (attempt + 1)
    console.log(`Rate limited, waiting ${Math.round(waitMs / 1000)}s before retry (attempt ${attempt + 1})...`)
    await sleep(waitMs)
    return embedWithRetry(ai, texts, attempt + 1)
  }
}

// Reuses embeddings from a previous (possibly interrupted) run so re-running
// the script after a crash/quota error doesn't re-embed everything.
async function loadExistingEmbeddings() {
  const map = new Map()
  try {
    const raw = await readFile(INDEX_PATH, "utf-8")
    const parsed = JSON.parse(raw)
    if (parsed.model !== EMBED_MODEL) return map
    for (const r of parsed.records ?? []) {
      if (r.embedding) map.set(`${r.file}::${r.chunkIndex}`, r.embedding)
    }
  } catch {
    // no existing index yet
  }
  return map
}

async function saveIndex(records) {
  await mkdir(path.dirname(INDEX_PATH), { recursive: true })
  const done = records.filter((r) => r.embedding)
  await writeFile(INDEX_PATH, JSON.stringify({ model: EMBED_MODEL, records: done }, null, 2))
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error(
      "GEMINI_API_KEY is not set. Run with: node --env-file=.env.local scripts/build-index.mjs",
    )
    process.exit(1)
  }

  let files
  try {
    files = (await readdir(NOTES_DIR)).filter((f) => f.endsWith(".txt"))
  } catch {
    console.error(`Notes folder not found: ${NOTES_DIR}`)
    process.exit(1)
  }
  if (files.length === 0) {
    console.error(`No .txt files found in ${NOTES_DIR}`)
    process.exit(1)
  }

  const existing = await loadExistingEmbeddings()

  const records = []
  for (const file of files) {
    const text = await readFile(path.join(NOTES_DIR, file), "utf-8")
    const chunks = chunkText(text)
    chunks.forEach((chunk, i) => {
      const key = `${file}::${i}`
      records.push({ file, chunkIndex: i, text: chunk, embedding: existing.get(key) })
    })
  }

  const toEmbed = records.filter((r) => !r.embedding)
  console.log(
    `Chunked ${files.length} files into ${records.length} chunks ` +
      `(${records.length - toEmbed.length} reused from previous run, ${toEmbed.length} to embed).`,
  )

  const ai = new GoogleGenAI({ apiKey })

  for (let i = 0; i < toEmbed.length; i += BATCH_SIZE) {
    const batch = toEmbed.slice(i, i + BATCH_SIZE)
    const response = await embedWithRetry(ai, batch.map((r) => r.text))
    const embeddings = response.embeddings ?? []
    batch.forEach((record, j) => {
      record.embedding = embeddings[j]?.values
    })

    await saveIndex(records)
    console.log(`Embedded ${Math.min(i + BATCH_SIZE, toEmbed.length)}/${toEmbed.length}`)

    if (i + BATCH_SIZE < toEmbed.length) await sleep(BATCH_PAUSE_MS)
  }

  await saveIndex(records)
  console.log(`Wrote index with ${records.filter((r) => r.embedding).length} chunks to ${INDEX_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
