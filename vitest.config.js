import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'text-summary', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
      include: ['src/**/*.{jsx,js}'],
      exclude: ['src/main.jsx', 'src/test/**', '**/*.d.ts', '**/*.config.js'],
    },
  },
});
