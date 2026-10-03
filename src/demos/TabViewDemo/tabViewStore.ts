import * as Gdk from '@gtkx/gi/gdk'
import * as Gio from '@gtkx/gi/gio'
import * as Gtk from '@gtkx/gi/gtk'
import { useSyncExternalStore } from 'react'
import { TAB_PAGE_COLORS } from './tabPageStyles.js'

export type DemoTab = {
  id: number
  windowId: number
  title: string
  icon: Gio.Icon | null
  loading: boolean
  needsAttention: boolean
  indicator: boolean
  muted: boolean
  pinned: boolean
  color: number
}

export type TabFlag = 'loading' | 'needsAttention' | 'indicator'

type State = {
  tabs: DemoTab[]
  windows: number[]
  activeWindowId: number
  selectedByWindow: Record<number, number>
  selectedId: number
  overviewByWindow: Record<number, boolean>
  menuPageId: number | null
}

const randomIcon = (): Gio.Icon | null => {
  const display = Gdk.Display.getDefault()
  if (!display) return null
  const names = Gtk.IconTheme.getForDisplay(display).getIconNames()
  if (names.length === 0) return null
  return Gio.ThemedIcon.new(names[Math.floor(Math.random() * names.length)])
}

const makeTab = (id: number, windowId: number): DemoTab => ({
  id,
  windowId,
  title: `Tab ${id + 1}`,
  icon: randomIcon(),
  loading: false,
  needsAttention: false,
  indicator: false,
  muted: false,
  pinned: false,
  color: 1 + Math.floor(Math.random() * TAB_PAGE_COLORS)
})

let state: State = {
  tabs: [],
  windows: [],
  activeWindowId: 0,
  selectedByWindow: {},
  selectedId: -1,
  overviewByWindow: {},
  menuPageId: null
}
let nextId = 0
let nextWindowId = 1
const listeners = new Set<() => void>()

const emit = () => {
  for (const listener of listeners) listener()
}

const ownTabs = (tabs: DemoTab[], windowId: number) => tabs.filter(tab => tab.windowId === windowId)

// Windows come and go, so every selection has to be re-checked: a window may have lost
// its selected tab to a close or a move, or the window itself may be gone.
const prune = (next: State): State => {
  const selectedByWindow: Record<number, number> = {}

  for (const windowId of next.windows) {
    const tabs = ownTabs(next.tabs, windowId)
    const current = next.selectedByWindow[windowId]
    const keep = current !== undefined && tabs.some(tab => tab.id === current)

    selectedByWindow[windowId] = keep ? (current as number) : (tabs[0]?.id ?? -1)
  }

  const selectedId = next.tabs.some(tab => tab.id === next.selectedId)
    ? next.selectedId
    : (selectedByWindow[next.activeWindowId] ?? -1)

  return {
    ...next,
    selectedByWindow,
    selectedId,
    menuPageId: next.menuPageId !== null && next.tabs.some(tab => tab.id === next.menuPageId) ? next.menuPageId : null
  }
}

const commit = (next: Partial<State>) => {
  state = prune({ ...state, ...next })
  emit()
}

export const tabStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getState: () => state,
  getTabsOf: (windowId: number) => ownTabs(state.tabs, windowId),
  openWindow() {
    const windowId = nextWindowId++
    // The first window opens the three tabs the demo starts with, every later one just a single tab.
    const seeds = state.tabs.length === 0 ? 3 : 1
    const added: DemoTab[] = []

    for (let index = 0; index < seeds; index += 1) added.push(makeTab(nextId++, windowId))

    commit({
      tabs: [...state.tabs, ...added],
      windows: [...state.windows, windowId],
      activeWindowId: windowId,
      selectedId: added[0]?.id ?? state.selectedId,
      selectedByWindow: { ...state.selectedByWindow, [windowId]: added[0]?.id ?? -1 },
      overviewByWindow: { ...state.overviewByWindow, [windowId]: false }
    })

    return windowId
  },
  closeWindow(windowId: number) {
    const windows = state.windows.filter(id => id !== windowId)
    const overviewByWindow = { ...state.overviewByWindow }

    delete overviewByWindow[windowId]

    commit({
      tabs: state.tabs.filter(tab => tab.windowId !== windowId),
      windows,
      overviewByWindow,
      activeWindowId: state.activeWindowId === windowId ? (windows[windows.length - 1] ?? 0) : state.activeWindowId
    })
  },
  add(windowId: number) {
    const tab = makeTab(nextId++, windowId)

    commit({
      tabs: [...state.tabs, tab],
      activeWindowId: windowId,
      selectedId: tab.id,
      selectedByWindow: { ...state.selectedByWindow, [windowId]: tab.id }
    })

    return tab
  },
  select(id: number) {
    const tab = state.tabs.find(candidate => candidate.id === id)
    const windowId = tab?.windowId ?? state.activeWindowId

    commit({
      selectedId: id,
      activeWindowId: windowId,
      selectedByWindow: { ...state.selectedByWindow, [windowId]: id }
    })
  },
  moveToWindow(id: number, targetWindowId: number) {
    const tab = state.tabs.find(candidate => candidate.id === id)

    if (!tab || tab.windowId === targetWindowId || !state.windows.includes(targetWindowId)) return

    commit({
      tabs: state.tabs.map(candidate => (candidate.id === id ? { ...candidate, windowId: targetWindowId } : candidate)),
      activeWindowId: targetWindowId,
      selectedId: id,
      selectedByWindow: { ...state.selectedByWindow, [targetWindowId]: id }
    })
  },
  moveTabToNewWindow(id: number) {
    const tab = state.tabs.find(candidate => candidate.id === id)

    if (!tab) return null

    const windowId = nextWindowId++

    commit({
      tabs: state.tabs.map(candidate => (candidate.id === id ? { ...candidate, windowId } : candidate)),
      windows: [...state.windows, windowId],
      activeWindowId: windowId,
      selectedId: id,
      selectedByWindow: { ...state.selectedByWindow, [windowId]: id },
      overviewByWindow: { ...state.overviewByWindow, [windowId]: false }
    })

    return windowId
  },
  setMenuPage(id: number | null) {
    if (state.menuPageId !== id) commit({ menuPageId: id })
  },
  setOverview(windowId: number, open: boolean) {
    if ((state.overviewByWindow[windowId] ?? false) !== open)
      commit({ overviewByWindow: { ...state.overviewByWindow, [windowId]: open } })
  },
  toggleOverview(windowId: number) {
    commit({
      overviewByWindow: { ...state.overviewByWindow, [windowId]: !(state.overviewByWindow[windowId] ?? false) }
    })
  },
  patch(id: number, changes: Partial<DemoTab>) {
    commit({ tabs: state.tabs.map(tab => (tab.id === id ? { ...tab, ...changes } : tab)) })
  },
  setTitle(id: number, title: string) {
    if (state.tabs.find(tab => tab.id === id)?.title === title) return
    tabStore.patch(id, { title })
  },
  setFlag(id: number, flag: TabFlag, value: boolean) {
    tabStore.patch(id, { [flag]: value })
  },
  toggleFlag(id: number, flag: TabFlag) {
    const tab = state.tabs.find(candidate => candidate.id === id)
    if (tab) tabStore.patch(id, { [flag]: !tab[flag] })
  },
  toggleMute(id: number) {
    const tab = state.tabs.find(candidate => candidate.id === id)
    if (tab) tabStore.patch(id, { muted: !tab.muted })
  },
  toggleIcon(id: number) {
    const tab = state.tabs.find(candidate => candidate.id === id)
    if (tab) tabStore.patch(id, { icon: tab.icon ? null : randomIcon() })
  },
  refreshIcon(id: number) {
    tabStore.patch(id, { icon: randomIcon() })
  },
  duplicate(id: number) {
    const index = state.tabs.findIndex(tab => tab.id === id)
    if (index < 0) return undefined
    const copy: DemoTab = { ...state.tabs[index], id: nextId++ }
    const tabs = [...state.tabs]

    tabs.splice(index + 1, 0, copy)

    commit({
      tabs,
      activeWindowId: copy.windowId,
      selectedId: copy.id,
      selectedByWindow: { ...state.selectedByWindow, [copy.windowId]: copy.id }
    })

    return copy
  },
  close(id: number) {
    tabStore.drop(tab => tab.id !== id || tab.pinned)
  },
  drop(keep: (tab: DemoTab, index: number) => boolean) {
    commit({ tabs: state.tabs.filter((tab, index) => keep(tab, index)) })
  },
  closeOthers(windowId: number, id: number) {
    tabStore.drop(tab => tab.windowId !== windowId || tab.id === id || tab.pinned)
  },
  closeBefore(windowId: number, position: number) {
    const tabs = ownTabs(state.tabs, windowId)

    tabStore.drop(tab => tab.windowId !== windowId || tab.pinned || tabs.indexOf(tab) >= position)
  },
  closeAfter(windowId: number, position: number) {
    const tabs = ownTabs(state.tabs, windowId)

    tabStore.drop(tab => tab.windowId !== windowId || tab.pinned || tabs.indexOf(tab) <= position)
  }
}

export const useTabViewState = () => useSyncExternalStore(tabStore.subscribe, tabStore.getState)
