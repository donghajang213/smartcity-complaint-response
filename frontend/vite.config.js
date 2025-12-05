import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const API_ORIGIN = env.VITE_API_ORIGIN || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: command === 'serve' ? {
      proxy: {
        '/api': {
          target: API_ORIGIN,
          changeOrigin: true,
          secure: false,
        },
        '/chat': {
          target: API_ORIGIN,
          changeOrigin: true,
          secure: false,
        },
        '/static/ads': {
          target: API_ORIGIN,
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/static\/ads/, '/api/ads')
        },
      }
    } : undefined,
  }
})