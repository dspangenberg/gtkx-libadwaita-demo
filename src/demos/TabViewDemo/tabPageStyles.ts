import { css } from '@gtkx/css'

export const TAB_PAGE_COLORS = 8

export const tabPage = css`
  --accent-bg-color: rgb(0 0 0 / 60%);
  --accent-fg-color: white;
  --accent-color: rgb(0 0 0 / 75%);

  --grey-bg-color: white;

  background: hsl(from var(--hue) h s 92%);

  @media (prefers-color-scheme: dark) {
    --accent-bg-color: rgb(255 255 255 / 60%);
    --accent-fg-color: rgb(0 0 0 / 80%);
    --accent-color: rgb(255 255 255 / 75%);

    --grey-bg-color: #363636;

    background: hsl(from var(--hue) h s 20%);
  }
`

const hues = ['blue', 'green', 'yellow', 'orange', 'red', 'purple', 'brown'] as const

export const tabPageColors = [
  ...hues.map(
    hue => css`
    --hue: var(--${hue}-3);
  `
  ),
  css`
    background: var(--grey-bg-color);
  `
]
