import * as GLib from '@gtkx/gi/glib'
import { GSimpleAction } from '@gtkx/jsx/gio'
import { type TabFlag, tabStore, useTabViewState } from './tabViewStore.js'

const bool = (value: boolean) => GLib.Variant.newBoolean(value)

export const TabViewActions = () => {
  const { tabs, selectedId, menuPageId } = useTabViewState()

  const pos = tabs.findIndex(tab => tab.id === (menuPageId ?? selectedId))
  const selected = pos >= 0 ? tabs[pos] : null
  const pinned = selected?.pinned ?? false
  const prevPinned = pos > 0 ? tabs[pos - 1].pinned : false
  const canCloseBefore = !pinned && pos > 0 && !prevPinned
  const canCloseAfter = pos >= 0 && pos < tabs.length - 1
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

  return (
    <>
      <GSimpleAction name="tab-new" onActivate={() => tabStore.add()} />
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
        onActivate={() => selected && tabStore.closeOthers(selected.id)}
      />
      <GSimpleAction name="tab-close-before" enabled={canCloseBefore} onActivate={() => tabStore.closeBefore(pos)} />
      <GSimpleAction name="tab-close-after" enabled={canCloseAfter} onActivate={() => tabStore.closeAfter(pos)} />
    </>
  )
}
