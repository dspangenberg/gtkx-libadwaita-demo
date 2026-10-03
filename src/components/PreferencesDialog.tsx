import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import * as Pango from '@gtkx/gi/pango'
import {
  AdwActionRow,
  AdwBanner,
  AdwHeaderBar,
  AdwNavigationPage,
  AdwPreferencesDialog,
  AdwPreferencesGroup,
  AdwPreferencesPage,
  AdwPreferencesRow,
  AdwShortcutLabel,
  AdwStatusPage,
  AdwToolbarView
} from '@gtkx/jsx/adw'
import { GtkButton, GtkImage, GtkLabel } from '@gtkx/jsx/gtk'
import { createRoot } from '@gtkx/react'
import { useCallback, useEffect, useMemo, useRef } from 'react'

export const PreferencesDialog = ({ onClose }: { onClose: () => void }) => {
  const dialogRef = useRef<Adw.PreferencesDialog | null>(null)
  const subpageRef = useRef<Adw.NavigationPage | null>(null)
  const anotherSubpageRef = useRef<Adw.NavigationPage | null>(null)
  const subpagesContainer = useMemo(() => new Gtk.Box(), [])

  const pushSubpage = useCallback((page: Adw.NavigationPage | null) => {
    if (page === null) {
      return
    }

    // pushSubpage() adopts the page, so it must not have a parent yet.
    page.unparent()
    dialogRef.current?.pushSubpage(page)
  }, [])

  // The subpages are not children of the dialog, which only accepts preferences pages.
  // They live in a container that is never shown until pushSubpage() reparents them.
  // The root stays mounted on purpose: the dialog takes ownership of every page that
  // was pushed, and unmounting would then remove a widget from a parent it no longer has.
  useEffect(() => {
    const root = createRoot(subpagesContainer)

    root.render(
      <>
        <AdwNavigationPage
          ref={page => {
            subpageRef.current = page
          }}
          title="Subpage"
        >
          <AdwToolbarView topBar={<AdwHeaderBar />}>
            <AdwStatusPage title="This Is a Subpage">
              <GtkButton
                label="Open Another Subpage"
                canShrink
                cssClasses={['pill']}
                halign={Gtk.Align.CENTER}
                onClicked={() => pushSubpage(anotherSubpageRef.current)}
              />
            </AdwStatusPage>
          </AdwToolbarView>
        </AdwNavigationPage>
        <AdwNavigationPage
          ref={page => {
            anotherSubpageRef.current = page
          }}
          title="Another Subpage"
        >
          <AdwToolbarView topBar={<AdwHeaderBar />}>
            <AdwStatusPage title="This Is Another Subpage" />
          </AdwToolbarView>
        </AdwNavigationPage>
      </>
    )
  }, [pushSubpage, subpagesContainer])

  return (
    <AdwPreferencesDialog ref={dialogRef} contentHeight={1000} searchEnabled={true} onClosed={onClose}>
      <AdwPreferencesPage
        title="L_ayout"
        iconName="preferences-window-layout-symbolic"
        description="Preferences pages can have a description"
        useUnderline={true}
        banner={<AdwBanner title="Preferences pages can have a banner" revealed={true} />}
      >
        <AdwPreferencesGroup
          title="Pages"
          description="Preferences are organized in pages, this example has the following pages:"
        >
          <AdwActionRow title="L_ayout" useUnderline={true} />
          <AdwActionRow title="S_earch" useUnderline={true} />
        </AdwPreferencesGroup>
        <AdwPreferencesGroup
          title="Groups"
          description="Preferences are grouped together, a group can have a title and a description. Descriptions will be wrapped if they are too long. This page has the following groups:"
        >
          <AdwActionRow title="An Untitled Group" />
          <AdwActionRow title="Pages" />
          <AdwActionRow title="Groups" />
          <AdwActionRow title="Preferences" />
        </AdwPreferencesGroup>
        <AdwPreferencesGroup title="Preferences">
          <AdwActionRow title="Preferences rows are appended to the list box" />
          <GtkLabel
            label="Other widgets are appended after the list box"
            cssClasses={['dimmed']}
            ellipsize={Pango.EllipsizeMode.END}
            marginTop={12}
            marginBottom={12}
            xalign={0}
          />
        </AdwPreferencesGroup>
        <AdwPreferencesGroup title="Toasts">
          <AdwActionRow
            title="Show a Toast"
            suffix={
              <GtkButton
                label="Show"
                valign={Gtk.Align.CENTER}
                onClicked={() => dialogRef.current?.addToast(new Adw.Toast({ title: 'Example Toast' }))}
              />
            }
          />
        </AdwPreferencesGroup>
        <AdwPreferencesGroup title="Subpages" description="Preferences dialogs can have subpages">
          <AdwActionRow
            title="Open Subpage"
            activatable={true}
            onActivated={() => pushSubpage(subpageRef.current)}
            suffix={<GtkImage iconName="go-next-symbolic" />}
          />
          <AdwActionRow
            title="Open Another Subpage"
            activatable={true}
            onActivated={() => pushSubpage(anotherSubpageRef.current)}
            suffix={<GtkImage iconName="go-next-symbolic" />}
          />
        </AdwPreferencesGroup>
      </AdwPreferencesPage>
      <AdwPreferencesPage title="S_earch" iconName="preferences-window-search-symbolic" useUnderline={true}>
        <AdwPreferencesGroup
          title="Searching"
          description="Preferences can be searched, do so using one of the following ways:"
        >
          <AdwActionRow title="Activate the Search Button" />
          <AdwPreferencesRow title="Ctrl + F">
            <AdwShortcutLabel
              accelerator="<Control>f"
              marginTop={12}
              marginBottom={12}
              marginStart={12}
              marginEnd={12}
            />
          </AdwPreferencesRow>
          <AdwActionRow title="Directly Type Your Search" />
        </AdwPreferencesGroup>
      </AdwPreferencesPage>
    </AdwPreferencesDialog>
  )
}
