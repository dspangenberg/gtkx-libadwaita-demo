import { useToast } from '@gtkx/components'
import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import {
  AdwActionRow,
  AdwButtonContent,
  AdwButtonRow,
  AdwClamp,
  AdwComboRow,
  AdwEntryRow,
  AdwEnumListModel,
  AdwExpanderRow,
  AdwPasswordEntryRow,
  AdwPreferencesGroup,
  AdwSpinRow,
  AdwStatusPage,
  AdwSwitchRow
} from '@gtkx/jsx/adw'
import { GtkBox, GtkButton, GtkCheckButton, GtkStringList } from '@gtkx/jsx/gtk'
import { peekTypeClass, typeFromName } from '@gtkx/runtime'
import { useEffect, useRef, useState } from 'react'

const comboStrings = ['Foo', 'Bar', 'Baz']

const copyButton = () => (
  <GtkButton valign={Gtk.Align.CENTER} iconName="edit-copy-symbolic" tooltipText="Copy" cssClasses={['flat']} />
)

const expanderRows = () => (
  <>
    <AdwActionRow title="A Nested Row" />
    <AdwActionRow title="Another Nested Row" />
  </>
)

export const BoxedListDemo = () => {
  const { show } = useToast()

  // Create the GObjects after Gtk.init(), but keep them stable across renders.
  const [spinAdjustment] = useState(() => Gtk.Adjustment.new(50, 0, 100, 1, 10, 0))
  const [licenseType] = useState(() => {
    // GtkLicense's GType is registered lazily when GtkAboutDialog's class is initialized.
    peekTypeClass(Gtk.AboutDialog)
    return typeFromName('GtkLicense')
  })
  const [licenseLabel] = useState(() => Gtk.PropertyExpression.new(Adw.EnumListItem, null, 'nick'))

  const radio1Ref = useRef<Gtk.CheckButton | null>(null)
  const radio2Ref = useRef<Gtk.CheckButton | null>(null)
  const row1Ref = useRef<Adw.ActionRow | null>(null)
  const row2Ref = useRef<Adw.ActionRow | null>(null)

  // The two prefix buttons are a radio group, and their rows activate them.
  useEffect(() => {
    const first = radio1Ref.current
    const second = radio2Ref.current

    if (first !== null && second !== null) {
      second.setGroup(first)
    }

    if (row1Ref.current !== null && first !== null) {
      row1Ref.current.setActivatableWidget(first)
    }

    if (row2Ref.current !== null && second !== null) {
      row2Ref.current.setActivatableWidget(second)
    }
  }, [])

  return (
    <AdwStatusPage
      iconName="widget-list-symbolic"
      title="Boxed Lists"
      description="Rows for the boxed list pattern"
      vexpand
    >
      <AdwClamp maximumSize={400} tighteningThreshold={300}>
        <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={12}>
          <AdwPreferencesGroup>
            <AdwActionRow title="Rows Have a Title" subtitle="They also have a subtitle" />
            <AdwActionRow
              title="Rows Can Have Suffix Widgets"
              suffix={<GtkButton label="Action" valign={Gtk.Align.CENTER} />}
            />
          </AdwPreferencesGroup>

          <AdwPreferencesGroup>
            <AdwActionRow
              ref={row1Ref}
              title="Rows Can Have Prefix Widgets"
              prefix={<GtkCheckButton ref={radio1Ref} valign={Gtk.Align.CENTER} active={true} />}
            />
            <AdwActionRow
              ref={row2Ref}
              title="Rows Can Have Prefix Widgets"
              prefix={<GtkCheckButton ref={radio2Ref} valign={Gtk.Align.CENTER} />}
            />
          </AdwPreferencesGroup>

          <AdwPreferencesGroup title="Entry Rows" separateRows={true}>
            <AdwEntryRow title="Entry Row" useUnderline={true} />
            <AdwEntryRow
              title="Entry With Confirmation"
              showApplyButton={true}
              onApply={() => show({ title: 'Changes applied' })}
            />
            <AdwEntryRow title="Entry With Suffix" suffix={copyButton()} />
            <AdwPasswordEntryRow title="Password Entry" />
          </AdwPreferencesGroup>

          <AdwPreferencesGroup title="Spin Rows">
            <AdwSpinRow title="Spin Row" adjustment={spinAdjustment} />
          </AdwPreferencesGroup>

          <AdwPreferencesGroup title="Switch Rows">
            <AdwSwitchRow title="Switch Row" />
          </AdwPreferencesGroup>

          <AdwPreferencesGroup title="Combo Rows">
            <AdwComboRow title="Combo Row" model={<GtkStringList strings={comboStrings} />} />
            <AdwComboRow
              title="Enumeration Combo Row"
              subtitle="This combo row was created from an enumeration"
              enableSearch={true}
              model={<AdwEnumListModel enumType={licenseType} />}
              expression={licenseLabel}
            />
          </AdwPreferencesGroup>

          <AdwPreferencesGroup title="Expander Rows">
            <AdwExpanderRow title="Expander Row" rows={expanderRows()} />
            <AdwExpanderRow title="Expander Row With an Action" suffix={copyButton()} rows={expanderRows()} />
            <AdwExpanderRow title="Toggleable Expander Row" showEnableSwitch={true} rows={expanderRows()} />
          </AdwPreferencesGroup>

          <AdwPreferencesGroup title="Property Rows">
            <AdwActionRow title="Property Row" subtitle="Value" subtitleSelectable={true} cssClasses={['property']} />
          </AdwPreferencesGroup>

          <AdwPreferencesGroup
            title="Groups With Suffix"
            headerSuffix={
              <GtkButton cssClasses={['flat']}>
                <AdwButtonContent iconName="list-add-symbolic" label="Suffix" />
              </GtkButton>
            }
          >
            <AdwActionRow title="Groups Can Have a Header Suffix" />
          </AdwPreferencesGroup>

          <AdwPreferencesGroup title="Button Rows" separateRows={true}>
            <AdwButtonRow title="Add Input Source" startIconName="list-add-symbolic" />
            <AdwButtonRow title="Add Calendar" endIconName="go-next-symbolic" />
            <AdwButtonRow title="Delete Event" cssClasses={['destructive-action']} />
            <AdwButtonRow title="Search" cssClasses={['suggested-action']} />
          </AdwPreferencesGroup>
        </GtkBox>
      </AdwClamp>
    </AdwStatusPage>
  )
}
