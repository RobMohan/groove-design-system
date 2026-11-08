import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Serves api/chat.mjs under `vite dev` the way Vercel does in production, so the
// docs chatbot works locally. Put ANTHROPIC_API_KEY in .env.local (git-ignored).
function chatApiDev() {
  return {
    name: 'groove-chat-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const env = loadEnv(server.config.mode, process.cwd(), '')
          for (const key of ['ANTHROPIC_API_KEY', 'CHAT_MODEL', 'CHAT_RATE_LIMIT', 'CHAT_ALLOWED_ORIGINS']) {
            if (env[key] && !process.env[key]) process.env[key] = env[key]
          }
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          req.body = Buffer.concat(chunks).toString('utf8')
          const { default: handler } = await server.ssrLoadModule('/api/chat.mjs')
          await handler(req, res)
        } catch (error) {
          server.config.logger.error(String(error?.stack ?? error))
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'dev_server_error', message: 'The chat endpoint failed to load.' }))
          }
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), chatApiDev()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'src/test/',
      ]
    }
  },
})
