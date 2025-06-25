// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const API = env.VITE_API_ORIGIN || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: command === 'serve' && {
      proxy: {
        // 맨 위에 static/ads/ 를 한 번만 선언
        '/static/ads/': {
          target: API,
          changeOrigin: true,
          secure: false,
          rewrite: path => 
            // /static/ads/xyz → /api/ads/xyz
            path.replace(/^\/static\/ads\//, '/api/ads/')
        },
        '/api': {
          target: API,
          changeOrigin: true,
          secure: false,
        },
        '/chat': {
          target: API,
          changeOrigin: true,
          secure: false,
        },
      }
    }
  }
})
