import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'kcgq0cr42r42j87gv7nebnio.82.112.238.62.sslip.io',
      'vyp6we9ivrh0wgxrqj1qxrbu.82.112.238.62.sslip.io',
    ],
  },
})
