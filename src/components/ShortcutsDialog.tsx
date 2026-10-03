import { AdwShortcutsDialog, AdwShortcutsItem, AdwShortcutsSection } from '@gtkx/jsx/adw'
import { pageShortcuts } from '@/components/DemoWindow.js'

export const ShortcutsDialog = ({ onClose }: { onClose: () => void }) => (
  <AdwShortcutsDialog onClosed={onClose}>
    <AdwShortcutsSection title="General">
      <AdwShortcutsItem title="Preferences" accelerator="<Control>comma" />
      <AdwShortcutsItem title="Keyboard Shortcuts" accelerator="<Control>question" />
      <AdwShortcutsItem title="Main Menu" accelerator="F10" />
      <AdwShortcutsItem title="Close Window" accelerator="<Control>w" />
      <AdwShortcutsItem title="Quit" accelerator="<Control>q" />
    </AdwShortcutsSection>
    <AdwShortcutsSection title="Pages">
      {pageShortcuts.map((page, index) => (
        <AdwShortcutsItem key={page.route} title={page.title} accelerator={`<Control>${index + 1}`} />
      ))}
    </AdwShortcutsSection>
    <AdwShortcutsSection title="Tabs">
      <AdwShortcutsItem title="New Tab" accelerator="<Control>t" />
      <AdwShortcutsItem title="Duplicate Tab" accelerator="<Control><Shift>d" />
      <AdwShortcutsItem title="Close Tab" accelerator="<Control><Shift>w" />
    </AdwShortcutsSection>
    <AdwShortcutsSection title="View">
      <AdwShortcutsItem title="Adaptive Preview" accelerator="<Control><Shift>p" />
    </AdwShortcutsSection>
  </AdwShortcutsDialog>
)
