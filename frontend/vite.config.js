import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Redireciona todas as chamadas /api para o backend
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      // Redireciona as conexões WebSocket
      '/socket.io': {
        target: 'ws://localhost:4000',
        ws: true,
      },
    },
  },
});