import { devtools } from '@tanstack/devtools-vite';
import path from 'node:path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { tanstackRouter } from '@tanstack/router-plugin/vite';

import viteReact from '@vitejs/plugin-react';

const config = defineConfig({
  base: '/crm/',
  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@common-styles': path.resolve(__dirname, '../common/src/styles'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          '@use "@common-styles/abstracts/variables" as *; @use "@common-styles/abstracts/mixins" as *;',
      },
    },
  },
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteReact(),
  ],
});

export default config;
