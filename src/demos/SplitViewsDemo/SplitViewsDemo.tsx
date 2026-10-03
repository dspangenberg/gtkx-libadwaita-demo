import * as Adw from '@gtkx/gi/adw'
import * as GLib from '@gtkx/gi/glib'
import type * as Gtk from '@gtkx/gi/gtk'
import {
  AdwBreakpoint,
  AdwDialog,
  AdwHeaderBar,
  AdwNavigationPage,
  AdwNavigationSplitView,
  AdwStatusPage,
  AdwToolbarView
} from '@gtkx/jsx/adw'
import { GtkButton } from '@gtkx/jsx/gtk'
import { useState } from 'react'

type SplitViewsDemoProps = {
  isOpen: boolean
  onClosed: () => void
}

export const SplitViewsDemo = ({ isOpen, onClosed }: SplitViewsDemoProps) => {
  const [collapsed, setCollapsed] = useState(false)

  if (!isOpen) {
    return null
  }

  return (
    <AdwDialog
      title="Navigation Split View"
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
      <AdwNavigationSplitView
        collapsed={collapsed}
        sidebar={
          <AdwNavigationPage title="Sidebar" tag="sidebar">
            <AdwToolbarView topBar={<AdwHeaderBar showTitle={false} />}>
              <AdwStatusPage title="Sidebar">
                <GtkButton
                  label="Open Content"
                  cssClasses={['pill']}
                  visible={collapsed}
                  actionName="navigation.push"
                  actionTarget={GLib.Variant.newString('content')}
                />
              </AdwStatusPage>
            </AdwToolbarView>
          </AdwNavigationPage>
        }
      >
        <AdwNavigationPage title="Content" tag="content">
          <AdwToolbarView topBar={<AdwHeaderBar showTitle={false} />}>
            <AdwStatusPage title="Content" />
          </AdwToolbarView>
        </AdwNavigationPage>
      </AdwNavigationSplitView>
    </AdwDialog>
  )
}
