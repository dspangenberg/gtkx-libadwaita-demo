import { rootElement } from '@gtkx/react'
import { render, screen } from '@gtkx/testing'
import { describe, expect, it } from 'vitest'
import App from '../src/app.js'

describe('App', () => {
  it('renders the demo navigation', async () => {
    await render(<App />, { container: rootElement })
    const item = await screen.findByText('Wrap Box')
    expect(item).toBeDefined()
  })
})
