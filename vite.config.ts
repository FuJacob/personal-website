import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

/**
 * Under `npm run dev`, answers /api/styles from memory so the toolbar works without Redis.
 * On Vercel (or `vercel dev`) the real function in api/styles.ts handles it instead.
 */
function devStylesApi(): Plugin {
  const styled: Record<string, Set<string>> = {
    highlight: new Set(),
    strikethrough: new Set(),
    bold: new Set(),
  }

  return {
    name: 'dev-styles-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/styles', (request, response) => {
        if (request.method === 'POST') {
          let body = ''
          request.on('data', (chunk) => (body += chunk))
          request.on('end', () => {
            const { wordId, style } = JSON.parse(body || '{}')
            styled[style]?.add(wordId)
            response.statusCode = 204
            response.end()
          })
          return
        }

        response.setHeader('Content-Type', 'application/json')
        response.end(
          JSON.stringify(Object.fromEntries(Object.entries(styled).map(([style, ids]) => [style, [...ids]]))),
        )
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    devStylesApi(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
})
