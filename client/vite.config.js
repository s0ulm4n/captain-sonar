import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    /* global process */
    port: process.env.APP_PORT || 3010,
    clientPort: 443,
    path: "/vite-hmr",
  }
})
