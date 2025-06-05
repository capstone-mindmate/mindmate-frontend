/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      filename: 'custom-service-worker.js',
      registerType: 'autoUpdate',
      manifest: {
        name: 'MindMate',
        short_name: 'MindMate',
        theme_color: '#ffffff',
        lang: 'ko',
        id: '/?source=pwa',
        start_url: '/?source=pwa',
        display: 'standalone',
        background_color: '#ffffff',
        orientation: 'portrait',
        scope: '/',
        icons: [
          {
            src: '/fav/favicon-196x196.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/fav/favicon-96x96.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://lohttps://mindmate.shopcalhost',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },

  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
        }),
      ],
      define: {
        global: 'globalThis',
      },
    },
  },
  define: {
    global: 'globalThis',
  },
})
