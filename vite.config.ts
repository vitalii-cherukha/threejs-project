import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000
  },
  publicDir: 'static',
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  }
});
