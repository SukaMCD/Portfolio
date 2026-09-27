// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sukamcd.tech',
  integrations: [react()],
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ['PUBLIC_', 'VITE_'],
    build: {
      sourcemap: true,
    },
  },
});

