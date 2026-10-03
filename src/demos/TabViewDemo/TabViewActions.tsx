import * as GLib from '@gtkx/gi/glib'
import { GSimpleAction } from '@gtkx/jsx/gio'
import { type TabFlag, tabStore, useTabViewState } from './tabViewStore.js'

const bool = (value: boolean) => GLib.Variant.newBoolean(value)

export const TabViewActions = ({ windowId }: { windowId: number }) => {
  const { tabs, selectedId, selectedByWindow, menuPageId } = useTabViewState()
  const windowTabs = tabs.filter(tab => tab.windowId === windowId)

  // The context menu reports the page it was opened for, which is not necessarily the
  // selected one. When that tab lives in another window - the selection follows whichever
  // window has focus - fall back to the tab this window has selected itself.
  const target =
    tabs.find(tab => tab.id === (menuPageId ?? selectedId)) ??
    windowTabs.find(tab => tab.id === selectedByWindow[windowId])
  const pos = windowTabs.findIndex(tab => tab.id === target?.id)
  const selected = pos >= 0 ? windowTabs[pos] : null
  const pinned = selected?.pinned ?? false
  const prevPinned = pos > 0 ? windowTabs[pos - 1].pinned : false
  const canCloseBefore = !pinned && pos > 0 && !prevPinned
  const canCloseAfter = pos >= 0 && pos < windowTabs.length - 1
  const hasIcon = selected?.icon !== null && selected !== null

  const flag = (name: string, key: TabFlag, enabled = true) => (
    <GSimpleAction
      key={name}
      name={name}
      enabled={enabled && selected !== null}
      state={bool(selected?.[key] ?? false)}
      onChangeState={value => {
        if (selected) tabStore.setFlag(selected.id, key, value?.getBoolean() ?? false)
      }}
    />
  )

  const selectActions = Array.from({ length: 9 }, (_, offset) => {
    const position = offset + 1
    const name = `tab-select-${position}`

    return (
      <GSimpleAction
        key={name}
        name={name}
        enabled={windowTabs.length >= position}
        onActivate={() => {
          const tab = windowTabs[position - 1]

          if (tab !== undefined) tabStore.select(tab.id)
        }}
      />
    )
  })

  return (
    <>
      <GSimpleAction name="tab-new" onActivate={() => tabStore.add(windowId)} />
      <GSimpleAction
        name="tab-duplicate"
        enabled={selected !== null}
        onActivate={() => selected && tabStore.duplicate(selected.id)}
      />
      <GSimpleAction
        name="tab-pin"
        enabled={selected !== null && !pinned}
        onActivate={() => selected && tabStore.patch(selected.id, { pinned: true })}
      />
      <GSimpleAction
        name="tab-unpin"
        enabled={pinned}
        onActivate={() => selected && tabStore.patch(selected.id, { pinned: false })}
      />
      <GSimpleAction
        name="tab-icon"
        enabled={selected !== null}
        state={bool(hasIcon)}
        onChangeState={value => {
          if (selected && Boolean(value?.getBoolean()) !== hasIcon) tabStore.toggleIcon(selected.id)
        }}
      />
      <GSimpleAction
        name="tab-refresh-icon"
        enabled={hasIcon}
        onActivate={() => selected && tabStore.refreshIcon(selected.id)}
      />
      {flag('tab-loading', 'loading')}
      {flag('tab-needs-attention', 'needsAttention')}
      {flag('tab-indicator', 'indicator')}
      <GSimpleAction
        name="tab-close"
        enabled={selected !== null && !pinned}
        onActivate={() => selected && tabStore.close(selected.id)}
      />
      <GSimpleAction
        name="tab-close-other"
        enabled={canCloseBefore || canCloseAfter}
        onActivate={() => selected && tabStore.closeOthers(windowId, selected.id)}
      />
      <GSimpleAction
        name="tab-close-before"
        enabled={canCloseBefore}
        onActivate={() => tabStore.closeBefore(windowId, pos)}
      />
      <GSimpleAction
        name="tab-close-after"
        enabled={canCloseAfter}
        onActivate={() => tabStore.closeAfter(windowId, pos)}
      />
      <GSimpleAction
        name="tab-move-to-new-window"
        enabled={selected !== null}
        onActivate={() => selected && tabStore.moveTabToNewWindow(selected.id)}
      />
      {selectActions}
    </>
  )
}
