import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://uhwgmxorg.online/MyIonicReactMToNRelationApp/',
  plugins: [
    react(),
    legacy()
  ],
})
