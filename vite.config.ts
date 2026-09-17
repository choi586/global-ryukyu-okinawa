import { defineConfig } from 'vite';
import vinext from 'vinext';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  envDir: '.cloudflare-env',
  resolve: {
    alias: [
      {
        find: /^\.\/cloudflare-storage$/,
        replacement: new URL('./cloudflare/bindings.ts', import.meta.url).pathname,
      },
      {
        find: 'node:sqlite',
        replacement: new URL('./cloudflare/disabled-sqlite.ts', import.meta.url).pathname,
      },
    ],
  },
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: 'rsc',
        childEnvironments: ['ssr'],
      },
    }),
  ],
});
