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
    // Optimisations pour atteindre bundle < 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les vendors pour un meilleur caching
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          supabase: ['@supabase/supabase-js'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
          // Chunks spécifiques par feature pour lazy loading
          auth: ['@supabase/auth-js'],
          charts: ['recharts'],
          analytics: ['web-vitals']
        },
        // Optimiser les noms de chunks pour cache-busting
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `[name]-[hash].js`;
        },
        // Optimiser les assets
        assetFileNames: 'assets/[name]-[hash][extname]'
      },
      // Tree-shaking agressif
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    // Compression et minification avancée
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },
    // Asset optimization pour performance
    assetsInlineLimit: 2048, // Réduire pour éviter les gros bundles
    cssCodeSplit: true,
    sourcemap: false,
    // Limites de taille pour alertes
    chunkSizeWarningLimit: 500,
    // Compression Gzip
    reportCompressedSize: true
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
      'tailwind-merge',
      'web-vitals'
    ],
    // Exclure les packages qui doivent être lazy-loaded
    exclude: ['@supabase/auth-js']
  },
  server: {
    // Configuration pour le développement
    hmr: {
      overlay: false
    },
    // Préchargement des modules pour développement
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/pages/index.tsx',
        './src/features/dashboard/**/*.tsx'
      ]
    }
  },
  // Plugin pour mesurer les performances de build
  esbuild: {
    // Optimisations esbuild pour performances
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  }
})
