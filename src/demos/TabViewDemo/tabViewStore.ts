import * as Gdk from '@gtkx/gi/gdk'
import * as Gio from '@gtkx/gi/gio'
import * as Gtk from '@gtkx/gi/gtk'
import { useSyncExternalStore } from 'react'
import { TAB_PAGE_COLORS } from './tabPageStyles.js'

export type DemoTab = {
  id: number
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
  selectedId: number
  overviewOpen: boolean
  menuPageId: number | null
}

const randomIcon = (): Gio.Icon | null => {
  const display = Gdk.Display.getDefault()
  if (!display) return null
  const names = Gtk.IconTheme.getForDisplay(display).getIconNames()
  if (names.length === 0) return null
  return Gio.ThemedIcon.new(names[Math.floor(Math.random() * names.length)])
}

const makeTab = (id: number): DemoTab => ({
  id,
  title: `Tab ${id + 1}`,
  icon: randomIcon(),
  loading: false,
  needsAttention: false,
  indicator: false,
  muted: false,
  pinned: false,
  color: 1 + Math.floor(Math.random() * TAB_PAGE_COLORS)
})

let state: State = { tabs: [0, 1, 2].map(makeTab), selectedId: 0, overviewOpen: false, menuPageId: null }
let nextId = 3
const listeners = new Set<() => void>()

const emit = () => {
  for (const listener of listeners) listener()
}

const commit = (next: Partial<State>) => {
  state = { ...state, ...next }
  emit()
}

const normalize = (tabs: DemoTab[], selectedId: number, overviewOpen: boolean): State => ({
  tabs,
  selectedId: tabs.some(tab => tab.id === selectedId) ? selectedId : (tabs[0]?.id ?? -1),
  overviewOpen,
  menuPageId: state.menuPageId !== null && tabs.some(tab => tab.id === state.menuPageId) ? state.menuPageId : null
})

export const tabStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getState: () => state,
  add() {
    const id = nextId++
    const tab = makeTab(id)
    commit(normalize([...state.tabs, tab], id, state.overviewOpen))
    return tab
  },
  select(id: number) {
    commit({ selectedId: id })
  },
  setMenuPage(id: number | null) {
    if (state.menuPageId !== id) commit({ menuPageId: id })
  },
  setOverview(open: boolean) {
    if (state.overviewOpen !== open) commit({ overviewOpen: open })
  },
  toggleOverview() {
    commit({ overviewOpen: !state.overviewOpen })
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
    commit(normalize(tabs, copy.id, state.overviewOpen))
    return copy
  },
  close(id: number) {
    tabStore.drop(tab => tab.id !== id || tab.pinned)
  },
  drop(keep: (tab: DemoTab, index: number) => boolean) {
    commit(
      normalize(
        state.tabs.filter((tab, index) => keep(tab, index)),
        state.selectedId,
        state.overviewOpen
      )
    )
  },
  closeOthers(id: number) {
    tabStore.drop(tab => tab.id === id || tab.pinned)
  },
  closeBefore(index: number) {
    tabStore.drop((tab, i) => tab.pinned || i >= index)
  },
  closeAfter(index: number) {
    tabStore.drop((tab, i) => tab.pinned || i <= index)
  }
}

export const useTabViewState = () => useSyncExternalStore(tabStore.subscribe, tabStore.getState)
