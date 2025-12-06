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
    chunkSizeWarningLimit: 2000, // Increase chunk size warning limit to 2000 KB
  },
  optimizeDeps: {
    // Explicitly include common dependencies to speed up cold start
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
});