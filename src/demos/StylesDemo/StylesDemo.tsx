import * as Gtk from '@gtkx/gi/gtk'
import { AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkButton } from '@gtkx/jsx/gtk'
import { useState } from 'react'
import { SidebarDialog } from './SidebarDialog.js'
import { StatusPageDialog } from './StatusPageDialog.js'
import { StyleClassesDialog } from './StyleClassesDialog.js'

export const StylesDemo = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isStatusPageOpen, setIsStatusPageOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <AdwStatusPage
      iconName="style-classes-symbolic"
      title="Style Classes"
      description="Various widget styles available for use"
    >
      <GtkButton
        cssClasses={['pill']}
        label="Run the Demo"
        halign={Gtk.Align.CENTER}
        onClicked={() => setIsOpen(true)}
      />
      {isOpen && (
        <StyleClassesDialog
          onClosed={() => setIsOpen(false)}
          onOpenStatusPages={() => setIsStatusPageOpen(true)}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
      )}
      {isStatusPageOpen && <StatusPageDialog onClosed={() => setIsStatusPageOpen(false)} />}
      {isSidebarOpen && <SidebarDialog onClosed={() => setIsSidebarOpen(false)} />}
    </AdwStatusPage>
  )
}
