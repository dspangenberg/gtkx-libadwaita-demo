import * as Gtk from '@gtkx/gi/gtk'
import { AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton } from '@gtkx/jsx/gtk'
import { useState } from 'react'
import { SplitViewsDemo } from './SplitViewsDemo.js'
import { SplitViewsOverlayDemo } from './SplitViewsOverlayDemo.js'

export const SplitViewsDemoPage = () => {
  const [isNavigationSplitViewOpen, setIsNavigationSplitViewOpen] = useState(false)
  const [isNavigationOverlaySplitViewOpen, setIsOverlayNavigationSplitViewOpen] = useState(false)

  return (
    <AdwStatusPage
      iconName="widget-split-views-symbolic"
      title="Split Views"
      description="Widgets that display sidebar and content"
    >
      <GtkBox spacing={18} halign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL}>
        <GtkButton
          cssClasses={['pill']}
          label="Navigation Split View"
          canShrink
          valign={Gtk.Align.CENTER}
          halign={Gtk.Align.CENTER}
          onClicked={() => setIsNavigationSplitViewOpen(true)}
        />
        <GtkButton
          cssClasses={['pill']}
          label="Overlay Split View"
          canShrink
          valign={Gtk.Align.CENTER}
          halign={Gtk.Align.CENTER}
          onClicked={() => setIsOverlayNavigationSplitViewOpen(true)}
        />
      </GtkBox>
      <SplitViewsDemo isOpen={isNavigationSplitViewOpen} onClosed={() => setIsNavigationSplitViewOpen(false)} />
      <SplitViewsOverlayDemo
        isOpen={isNavigationOverlaySplitViewOpen}
        onClosed={() => setIsOverlayNavigationSplitViewOpen(false)}
      />
    </AdwStatusPage>
  )
}
