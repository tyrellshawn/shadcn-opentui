import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['test/integration/**/*.test.ts'],
    alias: {
      '@': new URL('./', import.meta.url).pathname,
    },
    testTimeout: 120000,
    hookTimeout: 120000,
  },
})
