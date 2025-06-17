import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
//import abc from '@tailwindcss/typography'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  // plugins: [require('@tailwindcss/typography')],

})
