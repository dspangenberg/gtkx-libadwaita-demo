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
