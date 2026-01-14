
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // Derleme anında koddaki process.env.API_KEY ifadelerini gerçek anahtarla değiştirir.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  }
});
