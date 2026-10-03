import { fileURLToPath } from 'node:url'
import gtkx from '@gtkx/cli/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [gtkx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    bail: 1
  }
})
