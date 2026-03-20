import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/app',        // ← uncomment this
  server: {
    host: '127.0.0.1',
    port: 3000,
    allowedHosts: ['meharaz733.com', 'www.meharaz733.com'],
  }
})
