import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Custom middleware to redirect backend hardcoded paths locally
function redirectPlugin() {
  return {
    name: 'redirect-dashboard',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/dashboard' || req.url.startsWith('/dashboard?')) {
          res.writeHead(302, { Location: '/app' + req.url });
          res.end();
        } else {
          next();
        }
      });
    }
  }
}

export default defineConfig({
  plugins: [react(), redirectPlugin()],
  base: '/app',        // ← uncomment this
  server: {
    host: '127.0.0.1',
    port: 3000,
    allowedHosts: ['meharaz733.com', 'www.meharaz733.com'],
    proxy: {
      '/api': {
        target: 'http://www.meharaz733.com',
        changeOrigin: true
      }
    }
  }
})
