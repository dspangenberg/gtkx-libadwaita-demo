import { useToast } from '@gtkx/components'
import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import {
  AdwAvatar,
  AdwBanner,
  AdwClamp,
  AdwEntryRow,
  AdwActionRow,
  AdwPreferencesGroup,
  AdwStatusPage,
  AdwSwitchRow
} from '@gtkx/jsx/adw'
import { GtkBox, GtkSwitch, GtkLabel, GtkListBoxRow, GtkListBox } from '@gtkx/jsx/gtk'
import { useState } from 'react'

const firstNames = [
  'Adam',
  'Adrian',
  'Anna',
  'Charlotte',
  'Frédérique',
  'Ilaria',
  'Jakub',
  'Jennyfer',
  'Julia',
  'Justin',
  'Mario',
  'Miriam',
  'Mohamed',
  'Nourimane',
  'Owen',
  'Peter',
  'Petra',
  'Rachid',
  'Rebecca',
  'Sarah',
  'Thibault',
  'Wolfgang'
]

const lastNames = [
  'Bailey',
  'Berat',
  'Chen',
  'Farquharson',
  'Ferber',
  'Franco',
  'Galinier',
  'Han',
  'Lawrence',
  'Lepied',
  'Lopez',
  'Mariotti',
  'Rossi',
  'Urasawa',
  'Zwickelman'
]

const buildFullNames = (): string[] => {
  const fullNames = []
  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    fullNames.push(`${firstName} ${lastName}`)
  }
  return fullNames
}

const fullNames = buildFullNames()
const mainAvatar = fullNames[0]
const otherAvatars = fullNames.slice(1)

console.log('**', mainAvatar)

export const AvatarDemo = () => {
  const { show } = useToast()

  const [showBanner, setShowBanner] = useState(true)
  const [showButton, setShowButton] = useState(true)
  const [title, setTitle] = useState('Metered connection — updates paused')
  const [buttonLabel, setButtonLabel] = useState('_Network Settings')
  const [suggested, setSuggested] = useState(false)

  return (
    <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={8}>
      <AdwAvatar
        text={mainAvatar}
        showInitials={true}
        size={128}
      />
      <AdwStatusPage
        title="Avatar"
        description="A user avatar with generated fallback."
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

          <AdwPreferencesGroup>
            {otherAvatars.map(item => {
              return <AdwActionRow
                key={item}
                title={item}
                prefix={
                  <AdwAvatar
                    text={item}
                    showInitials={true}


                    size={40}
                  />}
              />
            })}

          </AdwPreferencesGroup>


        </AdwClamp>
      </AdwStatusPage>
    </GtkBox>
  )
}
