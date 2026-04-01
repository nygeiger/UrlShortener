import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITEX_");
  return {
    plugins: [react(), tailwindcss()],
    server: {
      open: true,
      port: env.VITEX_CLIENT_PORT ? Number(env.VITEX_CLIENT_PORT) : 3001
    }
  }
})
