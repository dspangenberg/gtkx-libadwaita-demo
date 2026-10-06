import * as Gdk from '@gtkx/gi/gdk'
import * as Gio from '@gtkx/gi/gio'
import * as GLib from '@gtkx/gi/glib'
import type * as GObject from '@gtkx/gi/gobject'
import * as Gtk from '@gtkx/gi/gtk'
import { AdwActionRow, AdwClamp, AdwPreferencesGroup, AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton, GtkDropTarget, GtkListBox } from '@gtkx/jsx/gtk'
import { fromValue, getClassType, getHandle } from '@gtkx/runtime'
import { useState } from 'react'
import '@/styles.js'

type DroppedFile = {
  name: string
  size: string
  type: string
  path: string
}

const QUERY_ATTRIBUTES = 'standard::display-name,standard::size,standard::content-type'

const describeFile = (file: Gio.File): DroppedFile => {
  const path = file.getPath() ?? file.getUri() ?? ''
  const fallback: DroppedFile = {
    name: file.getBasename() ?? path,
    size: 'Unknown',
    type: 'Unknown',
    path
  }

  try {
    const info = file.queryInfo(QUERY_ATTRIBUTES, Gio.FileQueryInfoFlags.NONE, null)
    const contentType = info.getContentType()

    return {
      name: info.getDisplayName() ?? fallback.name,
      size: GLib.formatSize(info.getSize()),
      type: contentType === null ? fallback.type : (Gio.contentTypeGetDescription(contentType) ?? contentType),
      path
    }
  } catch {
    return fallback
  }
}

const readFiles = (value: GObject.Value): Gio.File[] => {
  try {
    const list = fromValue(getHandle(value)) as Gdk.FileList | null
    return list === null ? [] : list.getFiles()
  } catch {
    return []
  }
}

export const DragDropDemo = () => {
  const [dropped, setDropped] = useState<DroppedFile | null>(null)
  const [hovering, setHovering] = useState(false)

  return (
    <AdwStatusPage
      iconName="edit-copy-symbolic"
      title="Drag and Drop"
      description={dropped === null ? 'Drop a file anywhere on this page to inspect it' : `Dropped ${dropped.name}`}
      cssClasses={hovering ? ['drop-highlight'] : []}
      vexpand
      controllers={
        <GtkDropTarget
          types={[getClassType(Gdk.FileList)]}
          actions={Gdk.DragAction.COPY}
          onEnter={() => {
            setHovering(true)
            return Gdk.DragAction.COPY
          }}
          onLeave={() => setHovering(false)}
          onDrop={value => {
            const [first] = readFiles(value)

            if (first !== undefined) {
              setDropped(describeFile(first))
            }

            return true
          }}
        />
      }
    >
      <AdwClamp maximumSize={600} tighteningThreshold={300}>
        {dropped === null ? null : (
          <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={12}>
            <AdwPreferencesGroup title="Dropped file">
              <GtkListBox cssClasses={['boxed-list']}>
                <AdwActionRow cssClasses={['property']} title="Name" subtitle={dropped.name} />
                <AdwActionRow cssClasses={['property']} title="Size" subtitle={dropped.size} />
                <AdwActionRow cssClasses={['property']} title="Type" subtitle={dropped.type} />
                <AdwActionRow cssClasses={['property']} title="Location" subtitle={dropped.path} />
              </GtkListBox>
            </AdwPreferencesGroup>
            <GtkButton label="Clear" halign={Gtk.Align.END} onClicked={() => setDropped(null)} />
          </GtkBox>
        )}
      </AdwClamp>
    </AdwStatusPage>
  )
}
