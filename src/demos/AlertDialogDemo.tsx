import { useToast } from '@gtkx/components'
import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwAlertDialog, AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkButton } from '@gtkx/jsx/gtk'
import { useRef, useState } from 'react'

const responses = [
  { id: 'cancel', label: '_Cancel' },
  { id: 'discard', label: '_Discard', appearance: Adw.ResponseAppearance.DESTRUCTIVE },
  { id: 'save', label: '_Save', appearance: Adw.ResponseAppearance.SUGGESTED }
]

export const AlertDialogDemo = () => {
  const { show } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const toastRef = useRef<Adw.Toast | null>(null)

  const onResponse = (response: string) => {
    setIsOpen(false)
    toastRef.current?.dismiss()
    toastRef.current = show({ title: `Dialog response: ${response}` })
  }

  return (
    <AdwStatusPage iconName="widget-dialog-symbolic" title="Alert Dialog" description="Adaptive alert dialog">
      <GtkButton
        cssClasses={['pill']}
        label="Alert Dialog"
        halign={Gtk.Align.CENTER}
        onClicked={() => setIsOpen(true)}
      />
      {isOpen && (
        <AdwAlertDialog
          heading="Save Changes?"
          body="Open document contains unsaved changes. Changes which are not saved will be permanently lost."
          responses={responses}
          defaultResponse="save"
          closeResponse="cancel"
          onResponse={onResponse}
        />
      )}
    </AdwStatusPage>
  )
}
