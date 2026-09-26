import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || ''
  const supabasePublicKey = env.VITE_SUPABASE_PUBLISHABLE_KEY
    || env.VITE_SUPABASE_ANON_KEY
    || env.SUPABASE_PUBLISHABLE_KEY
    || env.SUPABASE_ANON_KEY
    || ''

  return {
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(supabasePublicKey),
    },
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
  }
})
