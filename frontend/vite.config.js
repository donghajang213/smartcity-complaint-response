import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => ({
  plugins: [react()],

  // 로컬 개발 서버일 때만 proxy 설정
  server: command === 'serve' ? {
    proxy: {
      // /api/* 요청을 로컬 백엔드(포트 8080)로 포워딩
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // 필요시 pathRewrite도 설정 가능
        // rewrite: path => path.replace(/^\/api/, '/api')
      }
    }
  } : undefined
}))
