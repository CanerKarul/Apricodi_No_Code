
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // Netlify ortam değişkenini koda gömer, yoksa boş string döner
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  }
});
