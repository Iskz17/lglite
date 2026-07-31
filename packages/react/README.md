# @lglite/react

Liquid Glass components for React. shadcn-style API, Apple's glass material,
~50 components on one DRY glass engine.

- Real edge refraction on desktop Chromium, honest frosted glass on Safari,
  Firefox and mobile
- WCAG 2.2 AA one prop away: `<GlassProvider contrast="aa">`
- Customize via props, `--glass-*` CSS variables and `className`

## Install

```bash
npm i @lglite/react
```

```tsx
import { GlassProvider, Card, CardHeader, CardTitle, Button } from "@lglite/react";
import "@lglite/react/styles.css"; // engine + all component styles, import once

export function App() {
  return (
    <GlassProvider>
      <Card frosted>
        <CardHeader>
          <CardTitle>Hello glass</CardTitle>
        </CardHeader>
        <Button variant="glass" tone="primary">Continue</Button>
      </Card>
    </GlassProvider>
  );
}
```

## The material scale

Every glass component supports the same levers:

- default: glass-first, translucent
- `frosted`: denser material for legibility over busy backdrops
- `plate`: opaque, guaranteed contrast (also forced by `contrast="aa"`)
- accent `tone`s (`primary` / `destructive` / `success`) render colored-frosted

## Browser honesty

Refraction (`backdrop-filter: url()`) renders on desktop Chromium only today
(WebKit bug #245510 tracks Safari; a fix is in review upstream). Everything else
gets clean frosted glass. `forced-colors` and `prefers-contrast: more` disable
glass entirely and keep real boundaries.

Docs, storybook and the full component list: https://github.com/Iskz17/lglite

## License

MIT
