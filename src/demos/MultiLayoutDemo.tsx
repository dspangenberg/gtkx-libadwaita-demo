import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import {
  AdwBreakpoint,
  AdwDialog,
  AdwHeaderBar,
  AdwLayout,
  AdwLayoutSlot,
  AdwMultiLayoutView,
  AdwOverlaySplitView,
  AdwStatusPage,
  AdwToolbarView
} from '@gtkx/jsx/adw'
import { GtkButton, GtkLabel } from '@gtkx/jsx/gtk'
import { useState } from 'react'

const headerBar = () => <AdwHeaderBar showTitle={false} />

const toolbarWithSlot = (id: string) => (
  <AdwToolbarView topBar={headerBar()}>
    <AdwLayoutSlot id={id} />
  </AdwToolbarView>
)

export const MultiLayoutDemo = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [layoutName, setLayoutName] = useState('wide')

  return (
    <AdwStatusPage
      title="Multi-Layout View"
      description="A widget for switching between different layouts"
      iconName="widget-multi-layout-symbolic"
    >
      <GtkButton
        cssClasses={['pill']}
        label="Run the Demo"
        halign={Gtk.Align.CENTER}
        onClicked={() => setIsOpen(true)}
      />
      {isOpen && (
        <AdwDialog
          widthRequest={360}
          heightRequest={200}
          contentWidth={800}
          contentHeight={600}
          breakpoints={
            <AdwBreakpoint
              condition={Adw.BreakpointCondition.parse('max-width: 500sp')}
              onApply={() => setLayoutName('narrow')}
              onUnapply={() => setLayoutName('wide')}
            />
          }
          onClosed={() => setIsOpen(false)}
        >
          <AdwMultiLayoutView
            layoutName={layoutName}
            layouts={
              <>
                <AdwLayout name="wide">
                  <AdwOverlaySplitView sidebar={toolbarWithSlot('sidebar')}>
                    {toolbarWithSlot('content')}
                  </AdwOverlaySplitView>
                </AdwLayout>
                <AdwLayout name="narrow">
                  <AdwToolbarView
                    topBar={headerBar()}
                    bottomBar={<AdwLayoutSlot id="sidebar" heightRequest={100} />}
                    bottomBarStyle={Adw.ToolbarStyle.RAISED}
                  >
                    <AdwLayoutSlot id="content" />
                  </AdwToolbarView>
                </AdwLayout>
              </>
            }
            sidebarSlot={<GtkLabel label="Sidebar" cssClasses={['title-1']} />}
            contentSlot={<GtkLabel label="Content" cssClasses={['title-1']} />}
          />
        </AdwDialog>
      )}
    </AdwStatusPage>
  )
}
