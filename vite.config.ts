import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: true
    },
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  },
  preview: {
    port: 4173
  },
  optimizeDeps: {
    include: ['lucide-react']
  },
  build: {
    sourcemap: true
  }
});