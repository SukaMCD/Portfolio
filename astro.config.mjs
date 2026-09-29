// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sukamcd.tech',
  integrations: [react()],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ['PUBLIC_', 'VITE_'],
    build: {
      sourcemap: false,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/lucide-react')) return 'vendor-lucide';
            if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) return 'vendor-firebase';
            if (id.includes('node_modules/react-dom')) return 'vendor-react-dom';
            if (id.includes('node_modules/react/')) return 'vendor-react';
            if (id.includes('node_modules/lenis')) return 'vendor-lenis';
          },
        },
      },
    },
  },
});

