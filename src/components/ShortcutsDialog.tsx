import { AdwShortcutsDialog, AdwShortcutsItem, AdwShortcutsSection } from '@gtkx/jsx/adw'

export const ShortcutsDialog = ({ onClose }: { onClose: () => void }) => (
  <AdwShortcutsDialog onClosed={onClose}>
    <AdwShortcutsSection title="General">
      <AdwShortcutsItem title="Preferences" accelerator="<Control>comma" />
      <AdwShortcutsItem title="Keyboard Shortcuts" accelerator="<Control>question" />
      <AdwShortcutsItem title="Main Menu" accelerator="F10" />
      <AdwShortcutsItem title="Close Window" accelerator="<Control>w" />
      <AdwShortcutsItem title="Quit" accelerator="<Control>q" />
    </AdwShortcutsSection>
    <AdwShortcutsSection title="View">
      <AdwShortcutsItem title="Adaptive Preview" accelerator="<Control><Shift>p" />
    </AdwShortcutsSection>
  </AdwShortcutsDialog>
)
