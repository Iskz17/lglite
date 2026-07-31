# @lglite/glass-core

The glass engine behind [`@lglite/react`](https://github.com/Iskz17/lglite).
You normally don't install this directly: `@lglite/react` depends on it and
re-exports everything.

What lives here:

- `--glass-*` design tokens and the surface/frosted/plate material CSS
- `GlassProvider` (theme, `contrast="aa"`, reduce-glass) and the pre-paint
  refraction gate (`GlassScript`)
- the edge-refraction rim lens: a baked SDF displacement map driving
  `backdrop-filter: url(#filter)` on desktop Chromium, with pooled `<filter>`
  nodes shared across same-size surfaces
- the accessibility fallbacks: `forced-colors`, `prefers-contrast: more`,
  reduced transparency and the manual reduce-glass escape hatch

## License

MIT
