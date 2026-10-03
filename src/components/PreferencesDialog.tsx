import { ComboRow } from '@gtkx/components'
import * as Adw from '@gtkx/gi/adw'
import { AdwPreferencesDialog, AdwPreferencesGroup, AdwPreferencesPage } from '@gtkx/jsx/adw'
import { useState } from 'react'

const colorSchemes = [
  { id: 'default', label: 'Follow System', scheme: Adw.ColorScheme.DEFAULT },
  { id: 'light', label: 'Light', scheme: Adw.ColorScheme.FORCE_LIGHT },
  { id: 'dark', label: 'Dark', scheme: Adw.ColorScheme.FORCE_DARK }
]

export const PreferencesDialog = ({ onClose }: { onClose: () => void }) => {
  const [colorScheme, setColorScheme] = useState(Adw.StyleManager.getDefault().getColorScheme())
  const selectedId = colorSchemes.find(theme => theme.scheme === colorScheme)?.id ?? 'default'

  return (
    <AdwPreferencesDialog title="Preferences" searchEnabled={true} onClosed={onClose}>
      <AdwPreferencesPage title="Appearance" iconName="preferences-system-symbolic">
        <AdwPreferencesGroup
          title="Color Scheme"
          description="Whether the application follows the system theme or forces one appearance."
        >
          <ComboRow
            title="Theme"
            items={colorSchemes.map(theme => ({ id: theme.id, value: theme.label }))}
            selectedId={selectedId}
            onSelectionChanged={id => {
              const theme = colorSchemes.find(entry => entry.id === id)

              if (theme === undefined) {
                return
              }

              Adw.StyleManager.getDefault().setColorScheme(theme.scheme)
              setColorScheme(theme.scheme)
            }}
          />
        </AdwPreferencesGroup>
      </AdwPreferencesPage>
    </AdwPreferencesDialog>
  )
}
