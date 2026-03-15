import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,   // ← fixes Windows file watching
    },
  },
  optimizeDeps: {
    force: true,          // ← never use stale cache
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})