import * as Gtk from '@gtkx/gi/gtk'
import { fireEvent, render, screen, userEvent, waitFor } from '@gtkx/testing'
import { describe, expect, it } from 'vitest'
import { FloatingBarDemo } from '../src/demos/FloatingBarDemo.js'

const barFor = (widget: Gtk.Widget): Gtk.Box => {
  let current: Gtk.Widget | null = widget

  while (current !== null && !current.getCssClasses().includes('floating-bar')) {
    current = current.getParent()
  }

  expect(current).not.toBeNull()
  return current as Gtk.Box
}

const motionControllerFor = (widget: Gtk.Widget): Gtk.EventControllerMotion => {
  const controllers = widget.observeControllers()
  let found: Gtk.EventControllerMotion | null = null

  for (let index = 0; index < controllers.getNItems(); index += 1) {
    const item = controllers.getItem(index)

    if (item instanceof Gtk.EventControllerMotion) {
      found = item
      break
    }
  }

  expect(found).not.toBeNull()
  return found as Gtk.EventControllerMotion
}

describe('FloatingBarDemo', () => {
  it('reports the selection in the floating status bar and clears it on a second click', async () => {
    await render(<FloatingBarDemo />)

    expect(screen.queryByText('“photo.jpg” selected')).toBeNull()

    await userEvent.click(screen.getByText('photo.jpg'))

    expect(await screen.findByText('“photo.jpg” selected')).toBeDefined()
    expect(screen.queryByText('(4,8 MB)')).not.toBeNull()

    await userEvent.click(screen.getByText('photo.jpg'))

    await waitFor(() => expect(screen.queryByText('“photo.jpg” selected')).toBeNull())
    expect(screen.getByText('photo.jpg')).toBeDefined()
  })

  it('sums the size of every selected file', async () => {
    await render(<FloatingBarDemo />)

    await userEvent.click(screen.getByText('photo.jpg'))
    await userEvent.click(screen.getByText('notes.txt'))

    expect(await screen.findByText('2 items selected')).toBeDefined()
    expect(screen.queryByText('(4,8 MB)')).not.toBeNull()
  })

  it('shows the loading state with a spinner and a stop button', async () => {
    await render(<FloatingBarDemo />)

    await userEvent.click(screen.getByText('Load'))

    expect(await screen.findByText('Loading…')).toBeDefined()

    const stopButton = screen.getByRole(Gtk.AccessibleRole.BUTTON, { name: 'Stop' })
    expect(stopButton).toBeDefined()

    await userEvent.click(stopButton)

    await waitFor(() => expect(screen.queryByText('Loading…')).toBeNull())
    expect(screen.queryByRole(Gtk.AccessibleRole.BUTTON, { name: 'Stop' })).toBeNull()
  })

  it('hides the bar while the pointer rests on it', async () => {
    await render(<FloatingBarDemo />)

    await userEvent.click(screen.getByText('photo.jpg'))
    const status = await screen.findByText('“photo.jpg” selected')
    const bar = barFor(status)
    const overlay = bar.getParent() as Gtk.Widget

    await waitFor(() => expect(bar.getAllocatedWidth()).toBeGreaterThan(10))

    const [computed, bounds] = bar.computeBounds(overlay)
    expect(computed).toBe(true)

    const controller = motionControllerFor(overlay)
    await fireEvent(controller, 'motion', bounds.getX() + bounds.getWidth() / 2, bounds.getY() + bounds.getHeight() / 2)

    await waitFor(() => expect(bar.getVisible()).toBe(false), { timeout: 2000 })

    await fireEvent(controller, 'motion', 0, 0)

    await waitFor(() => expect(bar.getVisible()).toBe(true), { timeout: 2000 })
  })
})
