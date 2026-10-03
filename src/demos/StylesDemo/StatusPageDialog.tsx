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
import { GtkButton, GtkToggleButton } from '@gtkx/jsx/gtk'
import { useState } from 'react'

type StatusPageDialogProps = {
  onClosed: () => void
}

export const StatusPageDialog = ({ onClosed }: StatusPageDialogProps) => {
  const [isNarrow, setIsNarrow] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <AdwDialog
      title="Status Pages"
      contentWidth={640}
      contentHeight={480}
      widthRequest={360}
      heightRequest={200}
      breakpoints={
        <AdwBreakpoint
          condition={Adw.BreakpointCondition.parse('max-width: 450sp')}
          onApply={() => setIsNarrow(true)}
          onUnapply={() => setIsNarrow(false)}
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
                iconName="view-sidebar-start"
                active={showSidebar}
                visible={isNarrow}
                onClicked={() => setShowSidebar(value => !value)}
              />
            }
          />
        }
      >
        <AdwOverlaySplitView
          collapsed={isNarrow}
          showSidebar={showSidebar}
          sidebar={
            <AdwStatusPage
              iconName="welcome-symbolic"
              title="Compact"
              description='This status page has the "compact" style class'
              tooltipText="compact"
              cssClasses={['compact']}
            >
              <GtkButton label="Button" halign={Gtk.Align.CENTER} cssClasses={['pill']} />
            </AdwStatusPage>
          }
        >
          <AdwStatusPage
            hexpand={true}
            iconName="welcome-symbolic"
            title="Regular"
            description="This is a regular status page"
          >
            <GtkButton label="Button" halign={Gtk.Align.CENTER} cssClasses={['pill']} />
          </AdwStatusPage>
        </AdwOverlaySplitView>
      </AdwToolbarView>
    </AdwDialog>
  )
}
