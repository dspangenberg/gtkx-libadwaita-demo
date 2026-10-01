import * as Gtk from '@gtkx/gi/gtk'
import { AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkButton } from '@gtkx/jsx/gtk'
import { useState } from 'react'
import { NavigationViewDemo } from '@/demos/NavigationViewDemo/NavigationViewDemo.js'

export const NavigationViewDemoPage = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <AdwStatusPage
      iconName="widget-navigation-view-symbolic"
      title="Navigation View"
      description="A page-based navigation container"
    >
      <GtkButton
        cssClasses={['pill']}
        label="Run the Demo"
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        onClicked={() => setIsOpen(true)}
      />
      <NavigationViewDemo isOpen={isOpen} onClosed={() => setIsOpen(false)} />
    </AdwStatusPage>
  )
}
