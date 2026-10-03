# GTKX Adwaita Demo

A tour of Adwaita widgets built with [GTKX](https://gtkx.dev): native GTK4 and libadwaita widgets rendered from React in JSX.

## Requirements

- Linux with GTK4 and libadwaita
- Node.js >= 26.7.0
- pnpm

## Run it

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs the app with fast refresh. The GTKX bindings and the reference under `.gtkx/` are generated, so run `pnpm codegen` after changing the GTK version.

## Other commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Run the app with fast refresh |
| `pnpm build` | Build the production bundle |
| `pnpm start` | Run the built bundle |
| `pnpm test` | Run the tests |
| `pnpm typecheck` | Regenerate bindings and run `tsc` |
| `pnpm codegen` | Regenerate bindings and `.gtkx/reference` |
| `pnpm deploy` | Build and install the app |

## License

LGPL-2.1-or-later, see [COPYING](./COPYING).