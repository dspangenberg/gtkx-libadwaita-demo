import * as GLib from '@gtkx/gi/glib'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwActionRow, AdwClamp, AdwPreferencesGroup, AdwStatusPage, AdwSwitchRow } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton, GtkListBox } from '@gtkx/jsx/gtk'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FloatingStatusBar } from '@/components/FloatingStatusBar.js'
import '@/styles.js'

type Item = { name: string; size: number }

const items: Item[] = [
  { name: 'Quarterly Report.pdf', size: 2_400_000 },
  { name: 'photo.jpg', size: 4_800_000 },
  { name: 'budget.ods', size: 180_000 },
  { name: 'notes.txt', size: 12_400 },
  { name: 'presentation.odp', size: 9_100_000 },
  { name: 'archive.tar.gz', size: 148_000_000 },
  { name: 'logo.svg', size: 24_800 },
  { name: 'meeting-recording.ogg', size: 62_300_000 }
]

const LOAD_DURATION_MS = 1500

export const FloatingBarDemo = () => {
  const [selected, setSelected] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [hideOnHover, setHideOnHover] = useState(true)
  const loadTimeoutRef = useRef(0)

  const clearLoadTimeout = useCallback(() => {
    if (loadTimeoutRef.current !== 0) {
      GLib.Source.remove(loadTimeoutRef.current)
      loadTimeoutRef.current = 0
    }
  }, [])

  useEffect(() => clearLoadTimeout, [clearLoadTimeout])

  const startLoading = () => {
    if (loadTimeoutRef.current !== 0) {
      return
    }

    setLoading(true)
    loadTimeoutRef.current = GLib.timeoutAdd(GLib.PRIORITY_DEFAULT, LOAD_DURATION_MS, () => {
      loadTimeoutRef.current = 0
      setLoading(false)
      return GLib.SOURCE_REMOVE
    })
  }

  const stopLoading = () => {
    clearLoadTimeout()
    setLoading(false)
  }

  const toggleFile = (index: number) => {
    setSelected(current =>
      current.includes(index) ? current.filter(entry => entry !== index) : [...current, index].sort((a, b) => a - b)
    )
  }

  const selectedItems = selected.map(index => items[index])
  const selectedSize = selectedItems.reduce((sum, item) => sum + item.size, 0)

  const primary = loading
    ? 'Loading…'
    : selectedItems.length === 0
      ? null
      : selectedItems.length === 1
        ? `“${selectedItems[0].name}” selected`
        : `${selectedItems.length} items selected`

  const details = loading || selectedItems.length === 0 ? null : `(${GLib.formatSize(selectedSize)})`

  return (
    <FloatingStatusBar
      primary={primary}
      details={details}
      showSpinner={loading}
      showStop={loading}
      hideOnHover={hideOnHover}
      onStop={stopLoading}
    >
      <AdwStatusPage
        iconName="format-justify-fill-symbolic"
        title="Floating Status Bar"
        description="A status bar that floats over the content"
        vexpand
      >
        <AdwClamp maximumSize={600} tighteningThreshold={300}>
          <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={12}>
            <AdwPreferencesGroup title="Status">
              <AdwActionRow
                title="Load folder"
                subtitle="Shows the loading state with a spinner and a stop button"
                suffix={
                  <GtkButton
                    label="Load"
                    valign={Gtk.Align.CENTER}
                    cssClasses={['suggested']}
                    onClicked={startLoading}
                  />
                }
              />
              <AdwSwitchRow
                title="Hide on hover"
                active={hideOnHover}
                onNotifyActive={value => setHideOnHover(value ?? true)}
              />
            </AdwPreferencesGroup>

            <AdwPreferencesGroup title="Files">
              <GtkListBox
                selectionMode={Gtk.SelectionMode.NONE}
                cssClasses={['boxed-list']}
                onRowActivated={row => toggleFile(row.getIndex())}
              >
                {items.map((item, index) => (
                  <AdwActionRow
                    key={item.name}
                    title={item.name}
                    subtitle={GLib.formatSize(item.size)}
                    activatable
                    cssClasses={selected.includes(index) ? ['file-row', 'selected'] : ['file-row']}
                  />
                ))}
              </GtkListBox>
            </AdwPreferencesGroup>
          </GtkBox>
        </AdwClamp>
      </AdwStatusPage>
    </FloatingStatusBar>
  )
}
