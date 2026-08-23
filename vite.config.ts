import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function chatbotProxy() {
  return {
    target: process.env.CHATBOT_API_HOST || 'http://127.0.0.1:8000',
    changeOrigin: true,
    rewrite: (requestPath: string) => requestPath.replace(/^\/api\/chatbot/, ''),
    configure: (proxy: { on: (event: string, handler: (...args: unknown[]) => void) => void }) => {
      proxy.on('error', (_err, _req, res) => {
        const response = res as { writeHead?: (code: number, headers: Record<string, string>) => void; end?: (body: string) => void; headersSent?: boolean }
        if (response.writeHead && !response.headersSent) {
          response.writeHead(503, { 'Content-Type': 'application/json' })
          response.end(JSON.stringify({ status: 'unavailable' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
  server: {
    proxy: {
      '/api/ollama': {
        target: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/api\/ollama/, ''),
      },
      '/api/chatbot': chatbotProxy(),
    },
  },
  preview: {
    proxy: {
      '/api/ollama': {
        target: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/api\/ollama/, ''),
      },
      '/api/chatbot': chatbotProxy(),
    },
  },
})
