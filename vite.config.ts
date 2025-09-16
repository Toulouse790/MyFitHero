import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Copie index.html -> 404.html après le build (fallback SPA pour GitHub Pages)
function spa404Plugin(): Plugin {
  return {
    name: 'spa-404-copy',
    apply: 'build',
    closeBundle() {
      const src = path.resolve(__dirname, 'dist/index.html')
      const dst = path.resolve(__dirname, 'dist/404.html')
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst)
        console.log('SPA fallback: dist/404.html created')
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spa404Plugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimisations pour les performances
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les vendors pour un meilleur caching
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          supabase: ['@supabase/supabase-js'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    },
    // Compression et minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Asset optimization
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: false
  },
  optimizeDeps: {
    // Pre-bundle dependencies pour des temps de démarrage plus rapides
    include: [
      'react',
      'react-dom',
      'lucide-react',
      '@supabase/supabase-js',
      'date-fns',
      'clsx',
      'tailwind-merge'
    ]
  },
  server: {
    // Configuration pour le développement
    hmr: {
      overlay: false
    }
  }
})
