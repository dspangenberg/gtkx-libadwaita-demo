import * as Gdk from '@gtkx/gi/gdk'
import * as Gio from '@gtkx/gi/gio'
import * as GObject from '@gtkx/gi/gobject'
import * as Gtk from '@gtkx/gi/gtk'
import { getClassType } from '@gtkx/runtime'
import { fireEvent, render, screen, userEvent, waitFor } from '@gtkx/testing'
import { describe, expect, it } from 'vitest'
import { DragDropDemo } from '../src/demos/DragDropDemo.js'

const DROPPED_FILE = `${process.cwd()}/package.json`
const PLACEHOLDER = 'Drop a file anywhere on this page to inspect it'

const ancestorsOf = (widget: Gtk.Widget): Gtk.Widget[] => {
  const ancestors: Gtk.Widget[] = []
  let current: Gtk.Widget | null = widget

  while (current !== null) {
    ancestors.push(current)
    current = current.getParent()
  }

  return ancestors
}

const dropTargetFor = (start: Gtk.Widget): { page: Gtk.Widget; target: Gtk.DropTarget } => {
  for (const widget of ancestorsOf(start)) {
    const controllers = widget.observeControllers()

    for (let index = 0; index < controllers.getNItems(); index += 1) {
      const item = controllers.getItem(index)

      if (item instanceof Gtk.DropTarget) {
        return { page: widget, target: item }
      }
    }
  }

  throw new Error('No Gtk.DropTarget found above the given widget')
}

const propertyRowFor = (label: Gtk.Widget): Gtk.Widget => {
  const row = ancestorsOf(label).find(widget => widget.getCssClasses().includes('property'))
  expect(row).toBeDefined()
  return row as Gtk.Widget
}

describe('DragDropDemo', () => {
  it('uses the status page as the drop target and highlights it while a drag hovers', async () => {
    await render(<DragDropDemo />)

    expect(await screen.findByText(PLACEHOLDER)).toBeDefined()
    expect(screen.queryByText('Dropped file')).toBeNull()

    const { page, target } = dropTargetFor(screen.getByText('Drag and Drop'))

    expect(page.getCssClasses()).not.toContain('drop-highlight')

    await fireEvent(target, 'enter', 0, 0)
    expect(page.getCssClasses()).toContain('drop-highlight')

    await fireEvent(target, 'leave')
    expect(page.getCssClasses()).not.toContain('drop-highlight')
  })

  it('shows the properties of a dropped file as property rows', async () => {
    await render(<DragDropDemo />)

    const { page } = dropTargetFor(screen.getByText('Drag and Drop'))
    const value = new GObject.Value()
    value.init(getClassType(Gdk.FileList))
    value.setBoxed(Gdk.FileList.newFromArray([Gio.File.newForPath(DROPPED_FILE)]))

    await userEvent.drop(page, value)

    expect(await screen.findByText('package.json')).toBeDefined()
    expect(screen.queryByText(PLACEHOLDER)).toBeNull()
    expect(screen.getByText(DROPPED_FILE)).toBeDefined()

    expect(propertyRowFor(screen.getByText('Name')).getCssClasses()).toContain('property')
    expect(propertyRowFor(screen.getByText('Size')).getCssClasses()).toContain('property')
    expect(propertyRowFor(screen.getByText('Type')).getCssClasses()).toContain('property')
    expect(propertyRowFor(screen.getByText('Location')).getCssClasses()).toContain('property')

    await userEvent.click(screen.getByText('Clear'))

    await waitFor(() => expect(screen.queryByText(DROPPED_FILE)).toBeNull())
    expect(await screen.findByText(PLACEHOLDER)).toBeDefined()
  })
})
