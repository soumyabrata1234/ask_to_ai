import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
//import abc from '@tailwindcss/typography'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  // plugins: [require('@tailwindcss/typography')],
  server: {
    headers: {
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin"
    },
    proxy: {
      '/cdn': {
        target: 'https://unpkg.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn/, '')
      }
    }
  }

  

})
