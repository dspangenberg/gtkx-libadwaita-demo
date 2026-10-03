import { applicationId } from 'virtual:gtkx-config'
import type * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwAboutDialog } from '@gtkx/jsx/adw'
import { useCallback } from 'react'

const developerName = 'Danny Spangenberg'

export const AppAboutDialog = ({ onClose }: { onClose: () => void }) => {
  const addAcknowledgements = useCallback((dialog: Adw.AboutDialog | null) => {
    if (dialog === null) {
      return
    }

    dialog.addAcknowledgementSection('Special thanks to', [
      'GTKX https://gtkx.dev',
      'libadwaita demo https://gitlab.gnome.org/GNOME/libadwaita/tree/main/demo'
    ])
  }, [])

  return (
    <AdwAboutDialog
      ref={addAcknowledgements}
      applicationName="GTKX Adwaita Demo"
      applicationIcon={applicationId}
      version="1.0.0"
      developerName={developerName}
      issueUrl="https://github.com/dspangenberg/gtkx-libadwaita-demo/issues"
      copyright={`© 2026 ${developerName}`}
      licenseType={Gtk.License.LGPL_2_1}
      developers={[developerName]}
      comments="A tour of Adwaita widgets rendered from React with GTKX."
      onClosed={onClose}
    />
  )
}
