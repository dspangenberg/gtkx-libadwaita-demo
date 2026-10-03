import * as Gtk from '@gtkx/gi/gtk'
import { AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton } from '@gtkx/jsx/gtk'
import { TabViewDemo } from './TabViewDemo.js'
import { tabStore } from './tabViewStore.js'

export const TabViewDemoPage = () => (
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
        onClicked={() => tabStore.openWindow()}
      />
    </GtkBox>
    <TabViewDemo />
  </AdwStatusPage>
)
