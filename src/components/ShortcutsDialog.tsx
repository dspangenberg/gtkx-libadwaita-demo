import { AdwShortcutsDialog, AdwShortcutsItem, AdwShortcutsSection } from '@gtkx/jsx/adw'

const tabSelectShortcuts = Array.from({ length: 9 }, (_, offset) => ({
  title: `Select Tab ${offset + 1}`,
  accelerator: `<Alt>${offset + 1}`
}))

export const ShortcutsDialog = ({ onClose }: { onClose: () => void }) => (
  <AdwShortcutsDialog onClosed={onClose}>
    <AdwShortcutsSection title="General">
      <AdwShortcutsItem title="Preferences" accelerator="<Control>comma" />
      <AdwShortcutsItem title="Keyboard Shortcuts" accelerator="<Control>question" />
      <AdwShortcutsItem title="Main Menu" accelerator="F10" />
      <AdwShortcutsItem title="Close Window" accelerator="<Control>w" />
      <AdwShortcutsItem title="Quit" accelerator="<Control>q" />
    </AdwShortcutsSection>
    <AdwShortcutsSection title="Tabs">
      <AdwShortcutsItem title="New Tab" accelerator="<Control>t" />
      <AdwShortcutsItem title="Duplicate Tab" accelerator="<Control><Shift>t" />
      <AdwShortcutsItem title="Close Tab" accelerator="<Control>w" />
      {tabSelectShortcuts.map(shortcut => (
        <AdwShortcutsItem key={shortcut.title} title={shortcut.title} accelerator={shortcut.accelerator} />
      ))}
    </AdwShortcutsSection>
    <AdwShortcutsSection title="View">
      <AdwShortcutsItem title="Adaptive Preview" accelerator="<Control><Shift>p" />
    </AdwShortcutsSection>
  </AdwShortcutsDialog>
)
