import { AppAboutDialog } from '@/components/AppAboutDialog.js'
import { PreferencesDialog } from '@/components/PreferencesDialog.js'
import { ShortcutsDialog } from '@/components/ShortcutsDialog.js'

export type DialogKind = 'none' | 'preferences' | 'shortcuts' | 'about'

export const AppDialogs = ({ dialog, onClose }: { dialog: DialogKind; onClose: () => void }) => {
  switch (dialog) {
    case 'preferences':
      return <PreferencesDialog onClose={onClose} />
    case 'shortcuts':
      return <ShortcutsDialog onClose={onClose} />
    case 'about':
      return <AppAboutDialog onClose={onClose} />
    default:
      return null
  }
}
