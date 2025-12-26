import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    include: ['tests/**/*.test.{js,jsx}'],
    coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'tests/setup.js'],
    },
  },
  resolve: {
    alias: {
        '@': path.resolve('./src'),
        '@components': path.resolve('./src/components'),
        '@hooks': path.resolve('./src/hooks'),
        '@utils': path.resolve('./src/utils'),
        '@apps': path.resolve('./src/apps'),
        '@widgets': path.resolve('./src/widgets'),
        '@styles': path.resolve('./src/styles'),
    },
  },
});
