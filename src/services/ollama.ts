export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const API_BASE = import.meta.env.VITE_OLLAMA_API_URL || '/api/ollama'
const MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2:1b'
const KEEP_ALIVE = import.meta.env.VITE_OLLAMA_KEEP_ALIVE || '30m'
const MAX_TOKENS = Number(import.meta.env.VITE_OLLAMA_MAX_TOKENS || 45)
const MAX_HISTORY = Number(import.meta.env.VITE_OLLAMA_MAX_HISTORY || 2)
const NUM_CTX = Number(import.meta.env.VITE_OLLAMA_NUM_CTX || 1024)
const NUM_THREAD = Number(import.meta.env.VITE_OLLAMA_NUM_THREAD || 8)

let preloadPromise: Promise<void> | null = null

export function isChatbotEnabled(): boolean {
  return import.meta.env.VITE_OLLAMA_ENABLED !== 'false'
}

function chatOptions(overrides?: { num_predict?: number }) {
  return {
    num_predict: overrides?.num_predict ?? MAX_TOKENS,
    num_ctx: NUM_CTX,
    num_thread: NUM_THREAD,
    num_batch: 256,
    temperature: 0.1,
    top_k: 15,
    top_p: 0.9,
    repeat_penalty: 1.08,
  }
}

export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/tags`, { method: 'GET' })
    return response.ok
  } catch {
    return false
  }
}

/** Load model into memory once — must use same num_ctx as chat requests */
export function preloadOllamaModel(messages: ChatMessage[]): Promise<void> {
  if (preloadPromise) return preloadPromise

  preloadPromise = fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      keep_alive: KEEP_ALIVE,
      messages,
      stream: false,
      options: chatOptions({ num_predict: 1 }),
    }),
  })
    .then(() => undefined)
    .catch(() => {
      preloadPromise = null
    })

  return preloadPromise
}

export function trimChatHistory(messages: ChatMessage[]): ChatMessage[] {
  const system = messages.find((m) => m.role === 'system')
  const rest = messages.filter((m) => m.role !== 'system')
  const recent = rest.slice(-MAX_HISTORY * 2)
  return system ? [system, ...recent] : recent
}

export async function streamOllamaChat(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
      keep_alive: KEEP_ALIVE,
      options: chatOptions(),
    }),
    signal,
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(detail || `Ollama request failed (${response.status})`)
  }

  if (!response.body) {
    throw new Error('No response stream from Ollama')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      try {
        const payload = JSON.parse(trimmed) as {
          message?: { content?: string }
          done?: boolean
        }
        if (payload.message?.content) {
          onToken(payload.message.content)
        }
      } catch {
        // Ignore malformed stream chunks
      }
    }
  }
}
