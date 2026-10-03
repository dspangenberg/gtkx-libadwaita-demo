import { applicationId } from 'virtual:gtkx-config'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwAboutDialog } from '@gtkx/jsx/adw'

export const AppAboutDialog = ({ onClose }: { onClose: () => void }) => (
  <AdwAboutDialog
    applicationName="GTKX Adwaita Demo"
    applicationIcon={applicationId}
    version="1.0.0"
    developerName="Twiceware"
    website="https://gtkx.dev"
    issueUrl="https://github.com/gtkx-org/gtkx/issues"
    copyright="© 2026 Twiceware"
    licenseType={Gtk.License.GPL_3_0}
    developers={['Twiceware']}
    comments="A tour of Adwaita widgets rendered from React with GTKX."
    onClosed={onClose}
  />
)
