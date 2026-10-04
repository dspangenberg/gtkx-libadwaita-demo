import * as Adw from '@gtkx/gi/adw'
import * as Gdk from '@gtkx/gi/gdk'
import * as GLib from '@gtkx/gi/glib'
import * as GObject from '@gtkx/gi/gobject'
import * as Gsk from '@gtkx/gi/gsk'
import * as Gtk from '@gtkx/gi/gtk'
import { appVersion } from '@/version.js'

const flatpakInfoPath = '/.flatpak-info'

const adwVersion = `${Adw.MAJOR_VERSION}.${Adw.MINOR_VERSION}.${Adw.MICRO_VERSION}`
const glibVersion = `${GLib.MAJOR_VERSION}.${GLib.MINOR_VERSION}.${GLib.MICRO_VERSION}`
const gtkVersion = `${Gtk.getMajorVersion()}.${Gtk.getMinorVersion()}.${Gtk.getMicroVersion()}`

const typeName = (instance: object) => GObject.typeNameFromInstance(instance as never)

// The C demo compares G_OBJECT_TYPE_NAME against these, so we can do the same instead of
// instanceof checks: the concrete display and renderer types are not introspectable.
const backendNames: Record<string, string> = {
  GdkWaylandDisplay: 'Wayland',
  GdkX11Display: 'X11',
  GdkBroadwayDisplay: 'Broadway',
  GdkWin32Display: 'Windows',
  GdkMacosDisplay: 'macOS'
}

const rendererNames: Record<string, string> = {
  GskCairoRenderer: 'Cairo',
  GskGLRenderer: 'GL',
  GskNglRenderer: 'NGL',
  GskVulkanRenderer: 'Vulkan',
  GskBroadwayRenderer: 'Broadway'
}

const gdkBackend = () => {
  const display = Gdk.Display.getDefault()

  if (display === null) {
    return 'unknown'
  }

  const name = typeName(display)

  return name === null ? 'unknown' : (backendNames[name] ?? name)
}

// A renderer is only obtainable from a surface, so this maps a throwaway toplevel the same
// way the GTK inspector does. Realized renderers have to be unrealized again, or they leak.
const gskRenderer = () => {
  const display = Gdk.Display.getDefault()

  if (display === null) {
    return 'unknown'
  }

  const surface = Gdk.Surface.newToplevel(display)
  const renderer = Gsk.Renderer.newForSurface(surface)

  if (renderer === null) {
    surface.destroy()

    return 'unknown'
  }

  const name = typeName(renderer)

  renderer.unrealize()
  surface.destroy()

  return name === null ? 'unknown' : (rendererNames[name] ?? name)
}

// C returns NULL for a missing key, while the binding throws, so the lookup is guarded.
const flatpakValue = (keyFile: GLib.KeyFile, group: string, key: string) => {
  if (!keyFile.hasGroup(group)) {
    return null
  }

  try {
    return keyFile.getString(group, key)
  } catch {
    return null
  }
}

const flatpakSection = () => {
  if (!GLib.fileTest(flatpakInfoPath, GLib.FileTest.EXISTS)) {
    return []
  }

  const keyFile = GLib.KeyFile.new()

  if (!keyFile.loadFromFile(flatpakInfoPath, GLib.KeyFileFlags.NONE)) {
    return []
  }

  const runtime = flatpakValue(keyFile, 'Application', 'runtime')
  const runtimeCommit = flatpakValue(keyFile, 'Instance', 'runtime-commit')
  const arch = flatpakValue(keyFile, 'Instance', 'arch')
  const flatpakVersion = flatpakValue(keyFile, 'Instance', 'flatpak-version')
  const devel = flatpakValue(keyFile, 'Instance', 'devel')

  return [
    'Flatpak:',
    `- Runtime: ${runtime ?? 'unknown'}`,
    `- Runtime commit: ${runtimeCommit ?? 'unknown'}`,
    `- Arch: ${arch ?? 'unknown'}`,
    `- Flatpak version: ${flatpakVersion ?? 'unknown'}`,
    `- Devel: ${devel === null ? 'no' : 'yes'}`,
    ''
  ]
}

const environmentVariable = (name: string) => {
  const value = GLib.getenv(name)

  return value === null || value === '' ? null : value
}

const environmentSection = () => {
  const lines = ['Environment:']

  const desktop = environmentVariable('XDG_CURRENT_DESKTOP')
  const sessionDesktop = environmentVariable('XDG_SESSION_DESKTOP')
  const sessionType = environmentVariable('XDG_SESSION_TYPE')
  const language = environmentVariable('LANG')

  lines.push(`- Desktop: ${desktop ?? 'unknown'}`)
  lines.push(`- Session: ${sessionDesktop ?? 'unknown'} (${sessionType ?? 'unknown'})`)
  lines.push(`- Language: ${language ?? 'unknown'}`)
  lines.push(`- Running inside Builder: ${environmentVariable('INSIDE_GNOME_BUILDER') === null ? 'no' : 'yes'}`)

  // Only worth reporting when they are actually set: these change how the app renders.
  const optional = [
    'GTK_DEBUG',
    'GTK_THEME',
    'ADW_DEBUG_COLOR_SCHEME',
    'ADW_DEBUG_ACCENT_COLOR',
    'ADW_DEBUG_HIGH_CONTRAST',
    'ADW_DISABLE_PORTAL'
  ]

  for (const name of optional) {
    const value = environmentVariable(name)

    if (value !== null) {
      lines.push(`- ${name}: ${value}`)
    }
  }

  return lines
}

export const generateDebugInfo = () => {
  const osName = GLib.getOsInfo('NAME')
  const osVersion = GLib.getOsInfo('VERSION')

  return [
    `GTKX Adwaita Demo: ${appVersion}`,
    '',
    'Running against:',
    `- libadwaita: ${adwVersion}`,
    `- GLib: ${glibVersion}`,
    `- GTK: ${gtkVersion}`,
    '',
    'System:',
    `- Name: ${osName ?? 'unknown'}`,
    `- Version: ${osVersion ?? 'unknown'}`,
    '',
    'GTK:',
    `- GDK backend: ${gdkBackend()}`,
    `- GSK renderer: ${gskRenderer()}`,
    '',
    ...flatpakSection(),
    ...environmentSection(),
    ''
  ].join('\n')
}
