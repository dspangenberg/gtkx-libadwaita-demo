import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import {
  AdwBreakpoint,
  AdwDialog,
  AdwHeaderBar,
  AdwNavigationPage,
  AdwNavigationSplitView,
  AdwStatusPage,
  AdwToolbarView
} from '@gtkx/jsx/adw'
import { GtkLabel, GtkListBox, GtkScrolledWindow } from '@gtkx/jsx/gtk'
import { useState } from 'react'

type SidebarDialogProps = {
  onClosed: () => void
}

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']

export const SidebarDialog = ({ onClosed }: SidebarDialogProps) => {
  const [isNarrow, setIsNarrow] = useState(false)

  return (
    <AdwDialog
      title="Sidebar"
      contentWidth={720}
      contentHeight={480}
      widthRequest={360}
      heightRequest={240}
      breakpoints={
        <AdwBreakpoint
          condition={Adw.BreakpointCondition.parse('max-width: 400sp')}
          onApply={() => setIsNarrow(true)}
          onUnapply={() => setIsNarrow(false)}
        />
      }
      onClosed={onClosed}
    >
      <AdwNavigationSplitView collapsed={isNarrow}>
        <AdwNavigationPage title="Sidebar">
          <AdwToolbarView
            topBar={
              <AdwHeaderBar
                showTitle={false}
                titleWidget={
                  <GtkScrolledWindow>
                    <GtkListBox
                      cssClasses={['navigation-sidebar']}
                      selectionMode={isNarrow ? Gtk.SelectionMode.NONE : Gtk.SelectionMode.SINGLE}
                    >
                      {items.map(item => (
                        <GtkLabel key={item} label={item} ellipsize={3} xalign={0} />
                      ))}
                    </GtkListBox>
                  </GtkScrolledWindow>
                }
              />
            }
          />
        </AdwNavigationPage>
        <AdwNavigationPage title="Sidebar">
          <AdwToolbarView topBar={<AdwHeaderBar />}>
            <AdwStatusPage
              title="Sidebar"
              description='"navigation-sidebar" style class on GtkListBox or GtkListView'
            />
          </AdwToolbarView>
        </AdwNavigationPage>
      </AdwNavigationSplitView>
    </AdwDialog>
  )
}
