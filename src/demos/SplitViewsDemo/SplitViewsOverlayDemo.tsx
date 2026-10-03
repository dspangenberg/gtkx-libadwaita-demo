import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import {
  AdwBreakpoint,
  AdwDialog,
  AdwHeaderBar,
  AdwOverlaySplitView,
  AdwStatusPage,
  AdwToolbarView
} from '@gtkx/jsx/adw'
import { GtkBox, GtkToggleButton } from '@gtkx/jsx/gtk'
import { useState } from 'react'

type SplitViewsOverlayDemoProps = {
  isOpen: boolean
  onClosed: () => void
}

export const SplitViewsOverlayDemo = ({ isOpen, onClosed }: SplitViewsOverlayDemoProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [sidebarPosition, setSidebarPosition] = useState(Gtk.PackType.START)

  if (!isOpen) {
    return null
  }

  return (
    <AdwDialog
      title="Overlay Split View"
      widthRequest={360}
      heightRequest={200}
      contentWidth={640}
      contentHeight={480}
      breakpoints={
        <AdwBreakpoint
          condition={Adw.BreakpointCondition.parse('max-width: 400sp')}
          onApply={() => setCollapsed(true)}
          onUnapply={() => setCollapsed(false)}
        />
      }
      onClosed={onClosed}
    >
      <AdwToolbarView
        topBarStyle={Adw.ToolbarStyle.RAISED}
        topBar={
          <AdwHeaderBar
            start={
              <GtkToggleButton
                iconName="view-sidebar-start-symbolic"
                tooltipText="Toggle Sidebar"
                visible={sidebarPosition === Gtk.PackType.START}
                active={showSidebar}
                onToggled={() => setShowSidebar(previous => !previous)}
              />
            }
            end={
              <GtkToggleButton
                iconName="view-sidebar-end-symbolic"
                tooltipText="Toggle Sidebar"
                visible={sidebarPosition === Gtk.PackType.END}
                active={showSidebar}
                onToggled={() => setShowSidebar(previous => !previous)}
              />
            }
          />
        }
      >
        <AdwOverlaySplitView
          collapsed={collapsed}
          showSidebar={showSidebar}
          sidebarPosition={sidebarPosition}
          sidebar={
            <AdwStatusPage title="Sidebar">
              <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={18} halign={Gtk.Align.CENTER}>
                <GtkToggleButton
                  label="Start"
                  cssClasses={['pill']}
                  active={sidebarPosition === Gtk.PackType.START}
                  onToggled={() => setSidebarPosition(Gtk.PackType.START)}
                />
                <GtkToggleButton
                  label="End"
                  cssClasses={['pill']}
                  active={sidebarPosition === Gtk.PackType.END}
                  onToggled={() => setSidebarPosition(Gtk.PackType.END)}
                />
              </GtkBox>
            </AdwStatusPage>
          }
        >
          <AdwStatusPage title="Content" />
        </AdwOverlaySplitView>
      </AdwToolbarView>
    </AdwDialog>
  )
}
