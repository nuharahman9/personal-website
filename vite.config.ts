import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    // Small site: keep everything in one chunk, inline tiny assets.
    assetsInlineLimit: 4096,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Process tokens.css so tests can read it raw (accents ↔ CSS vars contract).
    css: { include: [/tokens\.css/], modules: { classNameStrategy: 'non-scoped' } },
    restoreMocks: true,
    unstubGlobals: true,
  },
});
