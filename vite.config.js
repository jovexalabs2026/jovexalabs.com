import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: process.env.VITE_JOVEXA_SIMULATION === 'true'
      ? {
          '/api': {
            target: 'http://127.0.0.1:4174',
            changeOrigin: false,
          },
        }
      : undefined,
  },
})
