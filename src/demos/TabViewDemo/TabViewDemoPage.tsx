import * as Gtk from '@gtkx/gi/gtk'
import { AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton } from '@gtkx/jsx/gtk'
import { useState } from 'react'
import TabViewDemo from './TabViewDemo.js'

export const TabViewDemoPage = () => {
  const [isTabViewOpen, setIsTabViewOpen] = useState(false)

  return (
    <AdwStatusPage
      iconName="widget-tab-view-symbolic"
      title="Tab View"
      description="Widgets to display and switch between tabs"
    >
      <GtkBox spacing={18} halign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL}>
        <GtkButton
          cssClasses={['pill']}
          label="Tab View"
          canShrink
          valign={Gtk.Align.CENTER}
          halign={Gtk.Align.CENTER}
          onClicked={() => setIsTabViewOpen(true)}
        />
      </GtkBox>
      <TabViewDemo isOpen={isTabViewOpen} onClosed={() => setIsTabViewOpen(false)} />
    </AdwStatusPage>
  )
}
