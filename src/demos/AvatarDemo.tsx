import type * as Adw from '@gtkx/gi/adw'
import * as Gdk from '@gtkx/gi/gdk'
import * as Gtk from '@gtkx/gi/gtk'
import * as Pango from '@gtkx/gi/pango'
import {
  AdwActionRow,
  AdwAvatar,
  AdwClamp,
  AdwEntryRow,
  AdwPreferencesGroup,
  AdwSpinRow,
  AdwSwitchRow
} from '@gtkx/jsx/adw'
import { GtkAdjustment, GtkBox, GtkButton, GtkImage, GtkLabel, GtkListBox, GtkScrolledWindow } from '@gtkx/jsx/gtk'
import { useCallback, useRef, useState } from 'react'
import '@/styles.js'

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

const createRandomName = () =>
  `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
    lastNames[Math.floor(Math.random() * lastNames.length)]
  }`

const createRandomNames = (count: number) => Array.from({ length: count }, createRandomName)

export const AvatarDemo = () => {
  const [text] = useState(createRandomName)
  const [contacts] = useState(() => createRandomNames(30))
  const [showInitials, setShowInitials] = useState(true)
  const [size, setSize] = useState(128)
  const [customImage, setCustomImage] = useState<Gdk.Texture | null>(null)
  const [fileName, setFileName] = useState('(None)')
  const avatarRef = useRef<Adw.Avatar | null>(null)

  const getWindow = useCallback(() => {
    const root = avatarRef.current?.getRoot()

    return root instanceof Gtk.Window ? root : null
  }, [])

  const openAvatar = useCallback(async () => {
    const dialog = Gtk.FileDialog.new()
    dialog.setTitle('Select an Avatar')

    try {
      const file = await dialog.open(getWindow())

      setCustomImage(Gdk.Texture.newFromFile(file))
      setFileName(file.getBasename() ?? '')
    } catch {
      // The dialog was cancelled.
    }
  }, [getWindow])

  const removeAvatar = useCallback(() => {
    setCustomImage(null)
    setFileName('(None)')
  }, [])

  const saveAvatar = useCallback(async () => {
    const avatar = avatarRef.current

    if (avatar === null) {
      return
    }

    const dialog = Gtk.FileDialog.new()
    dialog.setTitle('Save Avatar')

    try {
      const file = await dialog.save(getWindow())
      const texture = avatar.drawToTexture(avatar.getScaleFactor())
      const path = file.getPath()

      if (path !== null) {
        texture.saveToPng(path)
      }
    } catch {
      // The dialog was cancelled.
    }
  }, [getWindow])

  return (
    <GtkScrolledWindow vexpand hscrollbarPolicy={Gtk.PolicyType.NEVER}>
      <GtkBox orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.START} cssClasses={['avatar-page']}>
        <GtkBox orientation={Gtk.Orientation.VERTICAL}>
          <AdwAvatar
            ref={avatarRef}
            text={text}
            showInitials={showInitials}
            size={size}
            customImage={customImage}
            valign={Gtk.Align.CENTER}
            marginBottom={36}
          />
          <GtkLabel
            label="Avatar"
            cssClasses={['title', 'title-1']}
            wrap
            wrapMode={Pango.WrapMode.WORD_CHAR}
            justify={Gtk.Justification.CENTER}
          />
          <GtkLabel
            label="A user avatar with generated fallback"
            cssClasses={['body', 'description']}
            useMarkup
            wrap
            justify={Gtk.Justification.CENTER}
          />
        </GtkBox>

        <AdwClamp maximumSize={400} tighteningThreshold={300}>
          <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={12} valign={Gtk.Align.CENTER}>
            <AdwPreferencesGroup>
              <AdwEntryRow
                title="Text"
                text={text}
                inputPurpose={Gtk.InputPurpose.NAME}
                inputHints={Gtk.InputHints.NO_SPELLCHECK | Gtk.InputHints.UPPERCASE_WORDS}
                showApplyButton={false}
              />

              <AdwSwitchRow
                title="Show Initials"
                active={true}
                onNotifyActive={value => setShowInitials(value ?? false)}
              />

              <AdwActionRow
                title="File"
                suffix={
                  <>
                    <GtkButton valign={Gtk.Align.CENTER} onClicked={openAvatar}>
                      <GtkBox spacing={6}>
                        <GtkImage iconName="document-open-symbolic" />
                        <GtkLabel label={fileName} ellipsize={Pango.EllipsizeMode.MIDDLE} />
                      </GtkBox>
                    </GtkButton>
                    <GtkButton
                      valign={Gtk.Align.CENTER}
                      iconName="user-trash-symbolic"
                      cssClasses={['flat']}
                      sensitive={customImage !== null}
                      onClicked={removeAvatar}
                    />
                  </>
                }
              />

              <AdwSpinRow
                title="Size"
                numeric={true}
                adjustment={<GtkAdjustment lower={24} upper={320} value={128} pageIncrement={8} stepIncrement={8} />}
                value={size}
                onNotifyValue={value => setSize(value ?? 128)}
              />

              <AdwActionRow
                title="Export to File"
                suffix={
                  <GtkButton
                    valign={Gtk.Align.CENTER}
                    iconName="document-save-symbolic"
                    cssClasses={['flat']}
                    onClicked={saveAvatar}
                  />
                }
              />
            </AdwPreferencesGroup>

            <GtkListBox selectionMode={Gtk.SelectionMode.NONE} cssClasses={['boxed-list']}>
              {contacts.map(name => (
                <AdwActionRow
                  key={name}
                  title={name}
                  prefix={<AdwAvatar text={name} showInitials={true} size={40} marginTop={12} marginBottom={12} />}
                />
              ))}
            </GtkListBox>
          </GtkBox>
        </AdwClamp>
      </GtkBox>
    </GtkScrolledWindow>
  )
}
