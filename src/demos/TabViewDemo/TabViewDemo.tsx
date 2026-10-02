import { cx } from '@gtkx/css'
import * as Adw from '@gtkx/gi/adw'
import * as Gio from '@gtkx/gi/gio'
import * as GLib from '@gtkx/gi/glib'
import * as Gtk from '@gtkx/gi/gtk'
import {
  AdwBreakpoint,
  AdwDialog,
  AdwHeaderBar,
  AdwTabBar,
  AdwTabButton,
  AdwTabOverview,
  AdwTabView,
  AdwToolbarView
} from '@gtkx/jsx/adw'
import { GtkButton } from '@gtkx/jsx/gtk'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { tabPage, tabPageColors } from './tabPageStyles.js'
import { type DemoTab, tabStore, useTabViewState } from './tabViewStore.js'

const appendHidden = (menu: Gio.Menu, label: string, action: string) => {
  const item = Gio.MenuItem.new(label, action)
  item.setAttributeValue('hidden-when', GLib.Variant.newString('action-disabled'))
  menu.appendItem(item)
}

const buildMenu = () => {
  const menu = new Gio.Menu()

  const edit = new Gio.Menu()
  edit.append('D_uplicate', 'win.tab-duplicate')
  menu.appendSection(null, edit)

  const pin = new Gio.Menu()
  appendHidden(pin, 'P_in Tab', 'win.tab-pin')
  appendHidden(pin, 'Unp_in Tab', 'win.tab-unpin')
  menu.appendSection(null, pin)

  const icons = new Gio.Menu()
  icons.append('Icon', 'win.tab-icon')
  icons.append('R_efresh Icon', 'win.tab-refresh-icon')
  menu.appendSection(null, icons)

  const flags = new Gio.Menu()
  flags.append('Loa_ding', 'win.tab-loading')
  flags.append('Needs _Attention', 'win.tab-needs-attention')
  flags.append('Indicator', 'win.tab-indicator')
  menu.appendSection(null, flags)

  const close = new Gio.Menu()
  close.append('Close _Other Tabs', 'win.tab-close-other')
  close.append('Close Tabs to the _Left', 'win.tab-close-before')
  close.append('Close Tabs to the _Right', 'win.tab-close-after')
  close.append('_Close', 'win.tab-close')
  menu.appendSection(null, close)

  return menu
}

type Props = {
  isOpen: boolean
  onClosed: () => void
}

type PageRef = {
  page: Adw.TabPage
  content: Adw.Bin
  entry: Gtk.Entry
}

export default function TabViewDemo({ isOpen, onClosed }: Props) {
  const { tabs, overviewOpen } = useTabViewState()
  const [isNarrow, setIsNarrow] = useState(false)
  const [tabView, setTabView] = useState<Adw.TabView | null>(null)
  const refs = useRef(new Map<number, PageRef>())

  const createPage = useCallback(
    (tab: DemoTab): Adw.TabPage | null => {
      if (!tabView) return null

      const entry = new Gtk.Entry()
      entry.halign = Gtk.Align.CENTER
      entry.valign = Gtk.Align.CENTER
      entry.text = tab.title

      const content = new Adw.Bin({
        child: entry,
        cssClasses: cx(tabPage, tabPageColors[tab.color - 1])
      })

      const page = tabView.append(content)
      const onChanged = () => tabStore.setTitle(tab.id, entry.text)
      const onSelected = () => {
        if (page.selected) tabStore.select(tab.id)
      }
      entry.on('changed', onChanged)
      page.on('notify::selected', onSelected)

      // Keep the wrappers alive: otherwise GJS collects them while GTK still owns the widgets.
      refs.current.set(tab.id, { page, content, entry })
      return page
    },
    [tabView]
  )

  const idOfPage = useCallback((page: Adw.TabPage | null) => {
    if (!page) return null
    for (const [id, ref] of refs.current) if (ref.page === page) return id
    return null
  }, [])

  const releasePage = useCallback((id: number) => {
    refs.current.delete(id)
  }, [])

  useEffect(() => {
    if (!isOpen || !tabView) return

    for (const tab of tabs) {
      const page = refs.current.get(tab.id)?.page ?? createPage(tab)
      if (!page) continue

      page.setTitle(tab.title)
      page.setTooltip(tab.title)
      page.setIcon(tab.icon)
      page.setLoading(tab.loading)
      page.setNeedsAttention(tab.needsAttention)

      if (tab.indicator) {
        page.setIndicatorIcon(Gio.ThemedIcon.new(tab.muted ? 'tab-audio-muted-symbolic' : 'tab-audio-playing-symbolic'))
        page.setIndicatorTooltip(tab.muted ? 'Unmute Tab' : 'Mute Tab')
      } else {
        page.setIndicatorIcon(null)
        page.setIndicatorTooltip('')
      }
      page.setIndicatorActivatable(true)

      tabView.setPagePinned(page, tab.pinned)

      const content = refs.current.get(tab.id)?.content
      if (content) {
        const colorClass = tabPageColors[tab.color - 1]
        const previous = tabPageColors.find((name: string) => content.hasCssClass(name))
        if (previous !== colorClass) {
          if (previous) content.removeCssClass(previous)
          content.addCssClass(colorClass)
        }
      }
    }

    for (const [id, ref] of refs.current) {
      if (tabs.find(tab => tab.id === id)) continue
      tabView.closePage(ref.page)
      releasePage(id)
    }
  }, [isOpen, tabView, tabs, createPage, releasePage])

  // The pages die with the dialog when it closes. Without this, refs.current keeps the
  // wrappers of destroyed widgets around and the next sync pass writes to dead objects.
  useEffect(() => {
    if (!isOpen) refs.current.clear()
    return () => {
      refs.current.clear()
    }
  }, [isOpen])

  const menuModel = useMemo(buildMenu, [])

  const topBar = (
    <>
      <AdwHeaderBar
        start={<AdwTabButton view={tabView} visible={isNarrow} onClicked={() => tabStore.toggleOverview()} />}
        end={
          <>
            <GtkButton
              iconName="view-grid-symbolic"
              tooltipText="Tab Overview"
              visible={!isNarrow}
              onClicked={() => tabStore.toggleOverview()}
            />
            <GtkButton
              iconName="tab-new-symbolic"
              tooltipText="New Tab"
              visible={!isNarrow}
              onClicked={() => tabStore.add()}
            />
          </>
        }
      />
      <AdwTabBar view={tabView} />
    </>
  )

  if (!isOpen) return null

  return (
    <AdwDialog
      title="Tab View"
      widthRequest={360}
      heightRequest={200}
      contentWidth={900}
      contentHeight={600}
      onClosed={onClosed}
      breakpoints={
        <AdwBreakpoint
          condition={Adw.BreakpointCondition.parse('max-width: 600sp')}
          onApply={() => setIsNarrow(true)}
          onUnapply={() => setIsNarrow(false)}
        />
      }
    >
      <AdwTabOverview
        view={tabView}
        open={overviewOpen}
        onNotifyOpen={open => tabStore.setOverview(Boolean(open))}
        enableNewTab
        onCreateTab={() => createPage(tabStore.add()) ?? undefined}
      >
        <AdwToolbarView topBar={topBar} topBarStyle={Adw.ToolbarStyle.RAISED}>
          <AdwTabView
            ref={setTabView}
            menuModel={menuModel}
            onSetupMenu={page => tabStore.setMenuPage(idOfPage(page))}
            onPageDetached={page => {
              const id = idOfPage(page)
              if (id === null) return
              releasePage(id)
              queueMicrotask(() => tabStore.close(id))
            }}
            onIndicatorActivated={page => {
              const id = idOfPage(page)
              if (id !== null && page.indicatorIcon !== null) tabStore.toggleMute(id)
            }}
          />
        </AdwToolbarView>
      </AdwTabOverview>
    </AdwDialog>
  )
}
