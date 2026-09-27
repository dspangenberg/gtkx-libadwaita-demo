import { useToast } from '@gtkx/components'
import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwBanner, AdwClamp, AdwEntryRow, AdwPreferencesGroup, AdwStatusPage, AdwSwitchRow } from '@gtkx/jsx/adw'
import { GtkBox, GtkSwitch } from '@gtkx/jsx/gtk'
import { useState } from 'react'

export const BannerDemo = () => {
  const { show } = useToast()

  const [showBanner, setShowBanner] = useState(true)
  const [showButton, setShowButton] = useState(true)
  const [title, setTitle] = useState('Metered connection — updates paused')
  const [buttonLabel, setButtonLabel] = useState('_Network Settings')
  const [suggested, setSuggested] = useState(false)

  return (
    <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={8}>
      <AdwBanner
        title={title}
        buttonLabel={showButton ? buttonLabel : null}
        revealed={showBanner}
        buttonStyle={suggested ? Adw.BannerButtonStyle.SUGGESTED : Adw.BannerButtonStyle.DEFAULT}
        onButtonClicked={() => show({ title: 'Banner button clicked' })}
      />
      <AdwStatusPage
        iconName="widget-banner-symbolic"
        title="Banner"
        description="A bar with contextual information"
        vexpand
      >
        <AdwClamp maximumSize={400} tighteningThreshold={300}>
          <AdwPreferencesGroup>
            <AdwSwitchRow
              title="Show banner"
              active={showBanner}
              onNotifyActive={active => setShowBanner(active ?? false)}
            />
            <AdwEntryRow
              title="Title"
              text={title}
              onNotifyText={value => setTitle(value as string)}
              useUnderline={true}
            />
            <AdwEntryRow
              title="Button"
              text={buttonLabel}
              onNotifyText={value => setButtonLabel(value as string)}
              useUnderline={true}
              suffix={
                <GtkSwitch
                  valign={Gtk.Align.CENTER}
                  active={showButton}
                  onNotifyActive={value => setShowButton(value ?? false)}
                />
              }
            />

            <AdwSwitchRow
              title="Suggested Style"
              active={suggested}
              onNotifyActive={active => setSuggested(active ?? false)}
            />
          </AdwPreferencesGroup>
        </AdwClamp>
      </AdwStatusPage>
    </GtkBox>
  )
}
