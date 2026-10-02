import { useToast } from '@gtkx/components'
import type * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwActionRow, AdwClamp, AdwPreferencesGroup, AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton } from '@gtkx/jsx/gtk'
import { useRef, useState } from 'react'
import { useToastOverlayRef } from '@/components/ToastOverlayContext.js'

export const ToastDemo = () => {
  const { show, dismissAll } = useToast()
  const overlayRef = useToastOverlayRef()
  const [visibleToast, setVisibleToast] = useState<Adw.Toast | null>(null)
  const toastCountRef = useRef(0)

  const handleSimpleToastClicked = () => {
    show({ title: 'Simple Toast' })
  }

  const handleToastWithAction = () => {
    if (visibleToast !== null) {
      const nextCount = toastCountRef.current + 1
      toastCountRef.current = nextCount
      visibleToast.title = `${nextCount} item${nextCount === 1 ? '' : 's'} deleted`
      // Updating the title is not enough: the toast keeps its original timeout and would
      // disappear on schedule. Re-adding the same, currently displayed toast makes the
      // overlay reset that timeout instead of queueing it again.
      overlayRef.current?.addToast(visibleToast)
      return
    }

    const curToast = show({
      title: "'Lorem ipsum' deleted",
      buttonLabel: 'Undo',
      onButtonClicked: () => {
        const count = toastCountRef.current
        show({ title: `Undo Deleting ${count} item${count === 1 ? '' : 's'}` })
      },
      onDismissed: () => {
        toastCountRef.current = 0
        setVisibleToast(null)
      }
    })
    setVisibleToast(curToast)
  }

  const handleToastWithLongTitleClicked = () => {
    show({
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnam aliquam quaerat voluptatem.'
    })
  }

  const handleDismissAllClicked = () => {
    dismissAll()
  }

  return (
    <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={8}>
      <AdwStatusPage
        iconName="widget-toast-symbolic"
        title="Toasts"
        description="Transient in-app notifications"
        vexpand
      >
        <AdwClamp maximumSize={400} tighteningThreshold={300}>
          <AdwPreferencesGroup>
            <AdwActionRow
              title="Simple Toast"
              suffix={<GtkButton label="Show" valign={Gtk.Align.CENTER} onClicked={handleSimpleToastClicked} />}
            />

            <AdwActionRow
              title="Toast With an Action"
              suffix={
                <>
                  <GtkButton
                    iconName="user-trash-symbolic"
                    cssClasses={['flat']}
                    sensitive={visibleToast !== null}
                    onClicked={() => {
                      if (visibleToast !== null) {
                        visibleToast.dismiss()
                      }
                    }}
                  />
                  <GtkButton label="Show" valign={Gtk.Align.CENTER} onClicked={handleToastWithAction} />
                </>
              }
            />

            <AdwActionRow
              title="Toast With a Long Title"
              suffix={<GtkButton label="Show" valign={Gtk.Align.CENTER} onClicked={handleToastWithLongTitleClicked} />}
            />

            <AdwActionRow
              title="Dismiss all Toasts"
              suffix={<GtkButton label="Dismiss" valign={Gtk.Align.CENTER} onClicked={handleDismissAllClicked} />}
            />
          </AdwPreferencesGroup>
        </AdwClamp>
      </AdwStatusPage>
    </GtkBox>
  )
}
