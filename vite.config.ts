import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// La misma web sirve para dos cosas:
// - la app de escritorio (Tauri carga el build de dist/)
// - la app del móvil (PWA instalable desde el navegador)
export default defineConfig({
  // En GitHub Pages vive en /teselas/; en el portátil (Tauri) y en local, en la raíz
  base: process.env.TESELAS_BASE ?? '/',
  clearScreen: false,
  server: { port: 5199, strictPort: true },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // El registro del service worker se hace a mano en main.tsx (solo fuera de Tauri)
      injectRegister: null,
      registerType: 'autoUpdate',
      includeAssets: ['icono.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Teselas',
        short_name: 'Teselas',
        description: 'Cositas pequeñas, tesela a tesela.',
        lang: 'es',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#16120E',
        theme_color: '#16120E',
        icons: [
          { src: 'icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icono-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}', 'cuadros/*-mini.jpg'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/cuadros/'),
            handler: 'CacheFirst',
            options: { cacheName: 'cuadros', expiration: { maxEntries: 40 } },
          },
        ],
      },
    }),
  ],
})
