import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: true
  }
}) 