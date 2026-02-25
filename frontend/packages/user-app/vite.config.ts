import { devtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@styles/abstracts/variables" as *; 
        @use "@styles/abstracts/mixins" as *;`,
      },
    },
  },
  envPrefix: 'VITE_',
  plugins: [
    devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/app/routes',
    }),
    viteReact(),
    svgr(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/app/pages', import.meta.url)),
      '@widgets': fileURLToPath(new URL('./src/app/widgets', import.meta.url)),
      '@features': fileURLToPath(
        new URL('./src/app/features', import.meta.url),
      ),
      '@entities': fileURLToPath(
        new URL('./src/app/entities', import.meta.url),
      ),
      '@shared': fileURLToPath(new URL('./src/app/shared', import.meta.url)),

      '@styles': fileURLToPath(new URL('./src/app/styles', import.meta.url)),
    },
  },
});
