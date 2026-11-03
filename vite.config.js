import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          lucide: ['lucide-react'],
          data: [
            './src/data/operacaoAmazonasData.js',
            './src/data/tacticalAssets.js',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
