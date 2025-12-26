import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './tests/setup.js',
        include: ['tests/unit/**/*.{test,spec}.{js,jsx}'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'tests/setup.js'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@apps': path.resolve(__dirname, './src/apps'),
            '@widgets': path.resolve(__dirname, './src/widgets'),
            '@styles': path.resolve(__dirname, './src/styles'),
        },
    },
});
