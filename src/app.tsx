import { ToastProvider, useToast } from '@gtkx/components'
import * as Adw from '@gtkx/gi/adw'
import * as GLib from '@gtkx/gi/glib'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwApplication, AdwApplicationWindow, AdwBreakpoint, AdwToastOverlay, AdwToolbarView } from '@gtkx/jsx/adw'
import { GSimpleAction } from '@gtkx/jsx/gio'
import { GtkBox, GtkButton, GtkLabel } from '@gtkx/jsx/gtk'
import { NavigationContainer } from '@gtkx/navigation'
import { quit } from '@gtkx/react'
import { useEffect, useRef, useState } from 'react'
import { AppDialogs, type DialogKind } from './components/AppDialogs.js'
import { Navigation } from './components/DemoWindow.js'
import { ToastOverlayRefProvider } from './components/ToastOverlayContext.js'
import { TabViewActions } from './demos/TabViewDemo/TabViewActions.js'

type AppActionsProps = {
  onInspectorToggled: () => void
  showDialog: (dialog: DialogKind) => void
}

const AppActions = ({ onInspectorToggled, showDialog }: AppActionsProps) => (
  <>
    <GSimpleAction name="preferences" onActivate={() => showDialog('preferences')} />
    <GSimpleAction name="shortcuts" onActivate={() => showDialog('shortcuts')} />
    <GSimpleAction name="about" onActivate={() => showDialog('about')} />
    <GSimpleAction name="inspector" onActivate={onInspectorToggled} />
  </>
)

const MainWindow = ({
  dialog,
  onCloseDialog,
  onInspectorToggled
}: {
  dialog: DialogKind
  onCloseDialog: () => void
  onInspectorToggled: () => void
}) => {
  const [count, setCount] = useState(0)
  const [adaptivePreview, setAdaptivePreview] = useState(false)
  const [narrow, setNarrow] = useState(false)
  const toastOverlayRef = useRef<Adw.ToastOverlay | null>(null)
  const collapsed = narrow

  return (
    <ToastProvider overlayRef={toastOverlayRef}>
      <ToastOverlayRefProvider overlayRef={toastOverlayRef}>
        <AdwApplicationWindow
          title={'GTKX Adwaita Demo'}
          defaultWidth={1000}
          defaultHeight={720}
          adaptivePreview={adaptivePreview}
          onCloseRequest={quit}
          onEnableDebugging={toggle => {
            if (toggle) {
              onInspectorToggled()
            }
          }}
          breakpoints={
            <AdwBreakpoint
              condition={Adw.BreakpointCondition.parse('max-width: 500sp')}
              onApply={() => setNarrow(true)}
              onUnapply={() => setNarrow(false)}
            />
          }
          actions={
            <>
              <GSimpleAction
                name="adaptive-preview"
                state={GLib.Variant.newBoolean(adaptivePreview)}
                onChangeState={value => setAdaptivePreview(value?.getBoolean() ?? false)}
              />
              <TabViewActions />
            </>
          }
        >
          <AdwToastOverlay ref={toastOverlayRef}>
            <NavigationContainer>
              <Navigation collapsed={collapsed} />
            </NavigationContainer>
          </AdwToastOverlay>
          <AppDialogs dialog={dialog} onClose={onCloseDialog} />
        </AdwApplicationWindow>
      </ToastOverlayRefProvider>
    </ToastProvider>
  )
}

export const App = () => {
  const [dialog, setDialog] = useState<DialogKind>('none')
  const [inspectorOpen, setInspectorOpen] = useState(false)

  useEffect(() => {
    Gtk.Window.setInteractiveDebugging(inspectorOpen)
  }, [inspectorOpen])

  return (
    <AdwApplication
      actions={<AppActions onInspectorToggled={() => setInspectorOpen(open => !open)} showDialog={setDialog} />}
      actionAccels={[
        { detailedActionName: 'app.preferences', accels: ['<Control>comma'] },
        { detailedActionName: 'app.shortcuts', accels: ['<Control>question'] },
        { detailedActionName: 'win.adaptive-preview', accels: ['<Control><Shift>p'] }
      ]}
    >
      <MainWindow
        dialog={dialog}
        onCloseDialog={() => setDialog('none')}
        onInspectorToggled={() => setInspectorOpen(open => !open)}
      />
    </AdwApplication>
  )
}

export default App
