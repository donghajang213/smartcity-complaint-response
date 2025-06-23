// vite.config.js (개발용)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// .env.local   VITE_API_ORIGIN=https://smartcityksva.site
const API_ORIGIN = process.env.VITE_API_ORIGIN || 'http://localhost:8080';

export default defineConfig(({ command }) => ({
  plugins: [react()],

  server: command === 'serve'
    ? {
        proxy: {
          // Spring Boot
          '/api': {
            target: API_ORIGIN,
            changeOrigin: true,
            secure: false,    // LetsEncrypt라서 true여도 상관없지만 일단 false
          },
          // FastAPI (Chat)
          '/chat': {
            target: API_ORIGIN,
            changeOrigin: true,
            secure: false,
          },
        }, 
      }
    : undefined,
}));

// // vite.config.js (운영용)
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig(({ command, mode }) => ({
//   plugins: [react()],

//   // 로컬 개발 서버일 때만 proxy 설정
//   server: command === 'serve' ? {
//     proxy: {
//       // /api/* 요청을 로컬 백엔드(포트 8080)로 포워딩
//       '/api': {
//         target: 'http://localhost:8080',
//         changeOrigin: true,
//         secure: false,
//         // 필요시 pathRewrite도 설정 가능
//         // rewrite: path => path.replace(/^\/api/, '/api')
//       }
//     }
//   } : undefined
// }))

