import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['source/**/*.test.ts'],  // Adjust the glob pattern to match your test file locations
    coverage: {
      reporter: ['text'],
    },
  },
})
