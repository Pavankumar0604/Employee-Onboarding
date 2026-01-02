import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, '../components'),
      '@pages': path.resolve(__dirname, '../pages'),
      '@services': path.resolve(__dirname, '../services'),
      '@types': path.resolve(__dirname, '../types'),
      '@mindmesh-types': path.resolve(__dirname, '../types'),
      '@config': path.resolve(__dirname, '../config'),
      '@mocks': path.resolve(__dirname, '../mocks'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'es2015',
    minify: 'esbuild', // Use esbuild for faster builds
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI libraries
          ui: ['lucide-react', 'framer-motion'],
          // State management
          state: ['zustand', '@tanstack/react-query'],
          // Utilities
          utils: ['date-fns', 'react-hook-form', 'yup'],
          // Supabase
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Warn for chunks > 1MB
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
});