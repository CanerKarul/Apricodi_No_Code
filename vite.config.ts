
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // Netlify'daki API_KEY ortam değişkenini koddaki process.env.API_KEY ile değiştirir.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  build: {
    target: 'esnext',
  },
});
