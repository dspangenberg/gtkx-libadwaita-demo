import * as Gio from '@gtkx/gi/gio'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwButtonContent, AdwClamp, AdwSplitButton, AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkBox, GtkGrid, GtkGridLayoutChild } from '@gtkx/jsx/gtk'
import { useState } from 'react'

const buildMenu = () => {
  const menu = new Gio.Menu()
  menu.append('Item 1', null)
  menu.append('Item 2', null)
  menu.append('Item 3', null)
  return menu
}

export const ButtonsDemo = () => {
  const [menu] = useState(buildMenu)

  return (
    <AdwStatusPage iconName="widget-buttons-symbolic" title="Buttons" description="Button helper widgets" vexpand>
      <AdwClamp maximumSize={400} tighteningThreshold={300}>
        <GtkBox orientation={Gtk.Orientation.VERTICAL}>
          <GtkGrid halign={Gtk.Align.CENTER} columnSpacing={12} rowSpacing={12}>
            <GtkGridLayoutChild column={0} row={0}>
              <AdwSplitButton iconName="document-open-symbolic" menuModel={menu} tooltipText="Open" />
            </GtkGridLayoutChild>
            <GtkGridLayoutChild column={0} row={1}>
              <AdwSplitButton
                iconName="document-open-symbolic"
                menuModel={menu}
                tooltipText="Open"
                cssClasses={['flat']}
              />
            </GtkGridLayoutChild>
            <GtkGridLayoutChild column={1} row={0}>
              <AdwSplitButton label="_Open" useUnderline={true} canShrink={true} menuModel={menu} />
            </GtkGridLayoutChild>
            <GtkGridLayoutChild column={1} row={1}>
              <AdwSplitButton
                label="_Open"
                useUnderline={true}
                canShrink={true}
                menuModel={menu}
                cssClasses={['flat']}
              />
            </GtkGridLayoutChild>
            <GtkGridLayoutChild column={2} row={0}>
              <AdwSplitButton menuModel={menu}>
                <AdwButtonContent
                  iconName="document-open-symbolic"
                  label="_Open"
                  useUnderline={true}
                  canShrink={true}
                />
              </AdwSplitButton>
            </GtkGridLayoutChild>
            <GtkGridLayoutChild column={2} row={1}>
              <AdwSplitButton menuModel={menu} cssClasses={['flat']}>
                <AdwButtonContent
                  iconName="document-open-symbolic"
                  label="_Open"
                  useUnderline={true}
                  canShrink={true}
                />
              </AdwSplitButton>
            </GtkGridLayoutChild>
          </GtkGrid>
        </GtkBox>
      </AdwClamp>
    </AdwStatusPage>
  )
}
