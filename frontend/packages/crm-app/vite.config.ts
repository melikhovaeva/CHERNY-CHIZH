import { devtools } from '@tanstack/devtools-vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { tanstackRouter } from '@tanstack/router-plugin/vite';

import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';

const config = defineConfig({
  base: '/crm/',
  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: true,
  },
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteReact(),
  ],
});

export default config;
