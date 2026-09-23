import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'logo azul etiqueta.png'],
    manifest: {
      name: 'Etiqueta Azul | Santher',
      short_name: 'Etiqueta Azul',
      description: 'Registro digital de etiquetas de serviço da Santher',
      theme_color: '#0b5cab',
      background_color: '#f4f7fa',
      display: 'standalone',
      icons: [{ src: '/logo%20azul%20etiqueta.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' }, { src: '/logo%20azul%20etiqueta.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }],
    },
  })],
})
