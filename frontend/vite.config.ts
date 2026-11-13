import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173, // Port préféré
    strictPort: false, // Si 5173 bloqué, essayer 5174, 5175, etc.
  },
})
