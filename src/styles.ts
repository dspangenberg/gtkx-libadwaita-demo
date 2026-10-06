import { injectGlobal } from '@gtkx/css'

// Ported from the upstream demo stylesheet, which styles the custom widgets of the demo pages.
injectGlobal`
  .avatar-page {
    margin: 36px 12px;
  }

  .avatar-page > box > label.title {
    margin-bottom: 12px;
  }

  .avatar-page > box > label.description {
    margin-bottom: 36px;
  }

  .animation-sample {
    min-width: 30px;
    min-height: 30px;
    border-radius: 24px;
    background: linear-gradient(to bottom, var(--green-2), var(--green-5));
  }

  .tag {
    background: color-mix(in srgb, currentColor 10%, transparent);
    color: inherit;
    border-radius: 99px;
  }

  .tag:dir(ltr) {
    padding-left: 12px;
  }

  .tag:dir(rtl) {
    padding-right: 12px;
  }

  .tag button {
    margin: 3px;
    min-width: 0;
    min-height: 0;
    padding: 6px;
  }
`
  .floating-bar {
    padding: 3px;
    background-color: var(--view-bg-color, var(--window-bg-color));
    box-shadow: inset 0 100px 0 0 color-mix(in srgb, currentColor 10%, transparent);
    border-radius: 12px;
  }

  .floating-bar:backdrop {
    background-color: var(--window-bg-color);
  }

  .floating-bar button {
    padding: 0px;
  }

  .file-row.selected {
    background-color: color-mix(in srgb, var(--accent-color) 25%, transparent);
  }

`
