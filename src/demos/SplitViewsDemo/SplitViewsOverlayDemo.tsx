import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwBreakpoint, AdwDialog, AdwHeaderBar, AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton, GtkToggleButton } from '@gtkx/jsx/gtk'
import { createDrawerNavigator, DrawerActions, type DrawerHeaderProps } from '@gtkx/navigation'
import { useState } from 'react'

type PageRoutes = { Content: undefined }

const Drawer = createDrawerNavigator<PageRoutes>()

type SplitViewsOverlayDemoProps = {
  isOpen: boolean
  onClosed: () => void
}

const Content = () => <AdwStatusPage title="Content" />

export const SplitViewsOverlayDemo = ({ isOpen, onClosed }: SplitViewsOverlayDemoProps) => {
  const [sidebarPosition, setSidebarPosition] = useState<'start' | 'end'>('start')
  const [isNarrow, setIsNarrow] = useState(false)

  if (!isOpen) {
    return null
  }

  const Sidebar = () => (
    <AdwStatusPage title="Sidebar">
      <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={18} halign={Gtk.Align.CENTER}>
        <GtkToggleButton
          label="Start"
          canShrink
          active={sidebarPosition === 'start'}
          cssClasses={['pill']}
          onToggled={() => setSidebarPosition('start')}
        />
        <GtkToggleButton
          label="End"
          canShrink
          active={sidebarPosition === 'end'}
          cssClasses={['pill']}
          onToggled={() => setSidebarPosition('end')}
        />
      </GtkBox>
    </AdwStatusPage>
  )

  const header = ({ navigation }: DrawerHeaderProps) => (
    <AdwHeaderBar
      start={
        sidebarPosition === 'start' ? (
          <GtkButton
            iconName="view-sidebar-start-symbolic"
            tooltipText="Toggle Sidebar"
            accessibleLabel="Toggle Sidebar"
            onClicked={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ) : undefined
      }
      end={
        sidebarPosition === 'end' ? (
          <GtkButton
            iconName="view-sidebar-end-symbolic"
            tooltipText="Toggle Sidebar"
            accessibleLabel="Toggle Sidebar"
            onClicked={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ) : undefined
      }
    />
  )

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
          onApply={() => setIsNarrow(true)}
          onUnapply={() => setIsNarrow(false)}
        />
      }
      onClosed={onClosed}
    >
      <Drawer.Navigator
        initialRouteName="Content"
        collapsed={isNarrow}
        sidebarPosition={sidebarPosition}
        drawerContent={() => <Sidebar />}
      >
        <Drawer.Screen
          name="Content"
          component={Content}
          options={{ title: 'Content', drawerLabel: 'Content', header }}
        />
      </Drawer.Navigator>
    </AdwDialog>
  )
}
