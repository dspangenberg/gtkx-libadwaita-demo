import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwClamp, AdwComboRow, AdwEnumListModel, AdwPreferencesGroup, AdwSpinRow, AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkAdjustment } from '@gtkx/jsx/gtk'
import { peekTypeClass, typeFromName } from '@gtkx/runtime'
import { useState } from 'react'

export const ClampDemo = () => {
  const [maximumSize, setMaximumSize] = useState(400)
  const [tighteningThreshold, setTighteningThreshold] = useState(300)
  const [unit, setUnit] = useState<Adw.LengthUnit>(Adw.LengthUnit.SP)

  // Create the GObjects after Gtk.init(), but keep them stable across renders.
  const [lengthUnit] = useState(() => {
    // AdwLengthUnit's GType is registered lazily when AdwClamp's class is initialized.
    peekTypeClass(Adw.Clamp)
    return typeFromName('AdwLengthUnit')
  })
  const [unitLabel] = useState(() => Gtk.PropertyExpression.new(Adw.EnumListItem, null, 'nick'))

  return (
    <AdwStatusPage
      iconName="widget-clamp-symbolic"
      title="Clamp"
      description="This page is clamped to smoothly grow up to a maximum width"
    >
      <AdwClamp maximumSize={maximumSize} tighteningThreshold={tighteningThreshold} unit={unit}>
        <AdwPreferencesGroup>
          <AdwSpinRow
            title="Maximum Width"
            adjustment={
              <GtkAdjustment
                lower={0}
                upper={10000}
                value={maximumSize}
                pageIncrement={100}
                stepIncrement={10}
                onNotifyValue={value => setMaximumSize(value ?? 0)}
              />
            }
          />
          <AdwSpinRow
            title="Tightening Threshold"
            adjustment={
              <GtkAdjustment
                lower={0}
                upper={10000}
                value={tighteningThreshold}
                pageIncrement={100}
                stepIncrement={10}
                onNotifyValue={value => setTighteningThreshold(value ?? 0)}
              />
            }
          />
          <AdwComboRow
            title="Unit"
            model={<AdwEnumListModel enumType={lengthUnit} />}
            expression={unitLabel}
            selected={unit}
            onNotifySelected={value => setUnit(value ?? Adw.LengthUnit.SP)}
          />
        </AdwPreferencesGroup>
      </AdwClamp>
    </AdwStatusPage>
  )
}
