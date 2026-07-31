# LGLite

Liquid Glass components for React. shadcn-style API, Apple's glass material,
built on one DRY glass engine.

- Real edge refraction on desktop Chromium (`backdrop-filter: url()` over a baked
  SDF displacement map)
- Honest frosted glass on Safari, Firefox and mobile (no fakes, no broken effects)
- WCAG 2.2 AA one prop away: `<GlassProvider contrast="aa">`
- ~50 components mirroring shadcn names, customizable via props, CSS variables
  and `className`

## Install

```bash
npm i @lglite/react
```

```tsx
import { GlassProvider, Card, Button } from "@lglite/react";
import "@lglite/react/styles.css";

export function App() {
  return (
    <GlassProvider>
      <Card frosted>
        <Button variant="glass">Hello glass</Button>
      </Card>
    </GlassProvider>
  );
}
```

## How the engine degrades

| Engine | What you get |
| --- | --- |
| Desktop Chromium (Chrome, Edge, Arc, Opera) | Frost + live edge refraction at every surface rim |
| Safari, Firefox, mobile browsers | Frosted glass (`backdrop-filter: blur()`), real border, same layout |
| `forced-colors` / `prefers-contrast: more` | Glass disabled, system colors, real boundaries |
| `<GlassProvider contrast="aa">` | Opaque plates, AA-safe tone colors |

Refraction is gated by a UA check, not `@supports`, because Safari reports
support it does not render (WebKit bug #245510, fix in review upstream). When
that fix ships, the gate extends to Safari and the same CSS path works there
unchanged.

## Packages

| Package | What it is |
| --- | --- |
| [`@lglite/react`](packages/react) | The component library (installs the engine automatically) |
| [`@lglite/glass-core`](packages/glass-core) | The glass engine: tokens, provider, rim lens, a11y fallbacks |

## Development

```bash
pnpm install
pnpm build            # build both packages
pnpm -r typecheck
pnpm --filter @lglite/react test
pnpm storybook        # http://localhost:6006
pnpm --filter @lglite/web dev   # the landing page
```

Specs live in [specs/](specs/), one concern per file. Architectural decisions
are locked in [CLAUDE.md](CLAUDE.md) and [specs/00-overview-and-decisions.md](specs/00-overview-and-decisions.md).

## License

[MIT](LICENSE)
