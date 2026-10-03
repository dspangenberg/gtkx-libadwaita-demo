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
import { Navigation, navigateToPageShortcut, pageShortcuts } from './components/DemoWindow.js'
import { ToastOverlayRefProvider } from './components/ToastOverlayContext.js'

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
    <GSimpleAction name="quit" onActivate={() => quit()} />
  </>
)

const pageActions = pageShortcuts.map((page, index) => (
  <GSimpleAction key={page.route} name={`page-${index + 1}`} onActivate={() => navigateToPageShortcut(index)} />
))

const pageAccels = pageShortcuts.map((page, index) => ({
  detailedActionName: `win.page-${index + 1}`,
  accels: [`<Control>${index + 1}`]
}))

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
  const windowRef = useRef<Adw.ApplicationWindow | null>(null)
  const collapsed = narrow

  return (
    <ToastProvider overlayRef={toastOverlayRef}>
      <ToastOverlayRefProvider overlayRef={toastOverlayRef}>
        <AdwApplicationWindow
          ref={windowRef}
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
              <GSimpleAction name="close" onActivate={() => windowRef.current?.close()} />
              {pageActions}
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
        ...pageAccels,
        { detailedActionName: 'app.preferences', accels: ['<Control>comma'] },
        { detailedActionName: 'app.shortcuts', accels: ['<Control>question'] },
        { detailedActionName: 'win.adaptive-preview', accels: ['<Control><Shift>p'] },
        { detailedActionName: 'win.close', accels: ['<Control>w'] },
        { detailedActionName: 'app.quit', accels: ['<Control>q'] },
        { detailedActionName: 'win.tab-new', accels: ['<Control>t'] },
        { detailedActionName: 'win.tab-duplicate', accels: ['<Control><Shift>t'] },
        { detailedActionName: 'win.tab-close', accels: ['<Control><Shift>w'] },
        ...pageShortcuts.map((_, index) => ({
          detailedActionName: `win.tab-select-${index + 1}`,
          accels: [`<Alt>${index + 1}`]
        }))
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
