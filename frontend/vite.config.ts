import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Alternativa a __dirname para entorno ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    // Permitir acceso a la variable de entorno para detectar producción en código
    'import.meta.env.MODE': JSON.stringify(mode)
  },
  build: {
    // Opciones de optimización para producción
    target: 'es2015',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          form: ['formik', 'yup']
        }
      }
    },
    // Activar característica de tree-shaking agresivo
    terserOptions: {
      compress: {
        // Eliminar console.log pero mantener console.warn y console.error
        pure_funcs: ['console.log'],
        drop_debugger: true
      }
    }
  }
}))
