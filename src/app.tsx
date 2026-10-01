import { ToastProvider, useToast } from '@gtkx/components'
import type * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwApplication, AdwApplicationWindow, AdwToastOverlay, AdwToolbarView } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton, GtkLabel } from '@gtkx/jsx/gtk'
import { NavigationContainer } from '@gtkx/navigation'
import { quit } from '@gtkx/react'
import { useRef, useState } from 'react'
import { Navigation } from './components/DemoWindow.js'
import { ToastOverlayRefProvider } from './components/ToastOverlayContext.js'
import { TabViewActions } from './demos/TabViewDemo/TabViewActions.js'

const MainWindow = () => {
  const [count, setCount] = useState(0)
  const toastOverlayRef = useRef<Adw.ToastOverlay | null>(null)

  return (
    <ToastProvider overlayRef={toastOverlayRef}>
      <ToastOverlayRefProvider overlayRef={toastOverlayRef}>
        <AdwApplicationWindow
          title={'GTKX Adwaita Demo'}
          defaultWidth={1000}
          defaultHeight={720}
          onCloseRequest={quit}
          actions={<TabViewActions />}
        >
          <AdwToastOverlay ref={toastOverlayRef}>
            <NavigationContainer>
              <Navigation isNarrow={false} />
            </NavigationContainer>
          </AdwToastOverlay>
        </AdwApplicationWindow>
      </ToastOverlayRefProvider>
    </ToastProvider>
  )
}

export const App = () => (
  <AdwApplication>
    <MainWindow />
  </AdwApplication>
)

export default App
