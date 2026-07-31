# 25 — Landing / marketing page (`apps/web`)

One public marketing page that sells LGLite and proves the engine live. It is the
first thing people see; it must feel like the library: glass-first, fast, honest.

## 25.1 Decisions (user-confirmed)

- **Stack: Vite + React SPA** in a new `apps/web` workspace. Consumes `@lglite/react`
  exactly like a real npm consumer (workspace dep, no deep imports).
- **Scope v1: one page.** No docs pages yet (later phase).
- **Hosting: static.** `pnpm --filter @lglite/web build` must produce a fully static
  `dist/` that works on Vercel/Netlify/GitHub Pages as-is. Mechanism: Vite
  `base: "./"` (single page, no router, so no 404/SPA-fallback needed).

## 25.1.1 Prerequisite (BLOCKER found in review): fix the consumer CSS export

`@lglite/react`'s `./styles.css` export still points at a stale Phase-0 file (engine
base + button/card/dialog only); `dist/index.js` imports no CSS. A real consumer gets
~47 unstyled components. Before any apps/web work: regenerate
`packages/react/src/styles.css` to `@import` the engine styles plus EVERY component's
css (the export map and shipped `files` already cover the paths). This is a library
bug worth fixing regardless of the landing page.

## 25.1.2 Art direction (user-approved, July 2026)

Dark, one continuous night scene: the hero photo fades into a deep dark page
(fixed aurora glows via multi radial-gradient body background, zero extra elements),
so the glass identity never breaks on scroll. Type gets Apple-scale drama (clamped
display sizes, gradient headline, mono eyebrow labels); tiles are rich dark panels
with per-tile color glows and hover lift. Blend: Apple product page + Linear/Vercel
sharpness + playful glassmorphism.

## 25.2 Page structure (top to bottom)

1. **Hero.** Full-viewport photo backdrop: same night-photo art direction as the
   storybook but a SELF-HOSTED compressed jpg (no Unsplash hotlink) and STATIC (no
   infinite pan animation; an endless transform forces every hero backdrop-filter to
   re-sample per frame). A glass `Navbar` floats on top; a `Dock` sits at the bottom
   of the hero. Headline + one-line pitch + install command (`npm i @lglite/react`)
   in a copyable snippet + CTA buttons (GitHub, Get started) rendered as SOLID
   variant (keeps the hero within the glass budget).
2. **Live playground.** One glass `Card` (Slider + solid/ghost Buttons inside) over
   a swappable backdrop, with real knobs: theme and contrast via `GlassProvider`
   props; frosted via the stage class AND the Card's `frosted` prop (the tone rules
   re-declare the tint var on the element, so the stage class alone is a no-op on a
   toned card); clear glass via `.lg-no-blur`; tone via the Card prop; backdrop
   photo/grid/stripes (backdrop CSS copied from the storybook's backdrops.css, which
   is storybook-local and not exported). The knob row is FLAT: Switches plus flat
   `Toggle` segmented pickers, never glass `ToggleGroup` bars (budget). Playground
   viewport budget: ≤6 backdrop-filters INCLUDING small control blurs (4 knob
   switches + the Card + the slider thumb).
2b. **Motion test (the conveyor).** A continuously looping specimen belt (brand
   letterforms + token-color calibration marks, GPU transform on a SIBLING track,
   duplicated set for a seamless loop, hover pauses, reduced-motion stops) running
   behind one fixed empty glass Card: the clearest possible proof that the lens
   bends live motion. One glass surface; the belt is aria-hidden decoration.
3. **Component gallery.** A grid of ~8 small live tiles (real components, not
   screenshots): Button, Card, Input, Switch, Slider, Tabs, Badge, Progress. One
   glass SURFACE per tile (no nested glass; second Badge is `solid`; `lens={false}`
   where lens defaults on), over rich dark gradient tiles (not the photo). Explicit
   budget exception: tiles carry small bespoke control blurs, cap 8 visible.
   `content-visibility: auto` + `contain-intrinsic-size` on tiles. A "and ~40 more
   in Storybook" note replaces completeness. (Calendar/Toast/Dialog/Select cut from
   v1 tiles: they pull heavier deps or portalled UI and blow the tile grid.)
4. **The honest engine story.** Short section: refraction is a DESKTOP-Chromium
   enhancement (D1; mobile Chrome is excluded by the gate); Safari, Firefox and
   mobile get frosted glass; AA is one line (`contrast="aa"`). Show a side-by-side
   pair of pre-captured static images (refraction vs frost) captured with the
   HANDOFF §5 CDP harness + Playwright WebKit at a fixed playground state, committed
   under `apps/web/public/`, regen command documented in a comment. Exactly two
   images.
5. **Footer.** Install command again, GitHub link, license.

## 25.3 Perf budget (directive: performance first)

- Respect the engine blur budget: **≤ 6 live glass surfaces in any viewport** (hero:
  navbar + dock + hero card; playground: 1-3; gallery tiles are small Surfaces and
  scroll in, acceptable because each is tiny; Dialog/Toast only on interaction).
- No UI framework beyond React + `@lglite/react`. No CSS framework. Page CSS is one
  file. No animation library (the engine's own transitions only).
- Hero photo: single compressed jpg (< 300 KB), `loading="eager"`, everything below
  the fold `loading="lazy"`. Gallery renders on scroll (plain `content-visibility:
  auto`, no JS observer needed).
- `prefers-reduced-motion` honored (no parallax/auto-pan for those users).
- Lighthouse targets on the static build: Performance ≥ 90, A11y ≥ 95.

## 25.4 Correctness requirements

- `GlassProvider` wraps the app; theme/contrast toggles go through it (portalled
  overlays must inherit, same as storybook).
- The D6 pre-paint gate: `GlassScript` is a React component and CANNOT go in a static
  `index.html`. For this SPA we rely on the provider effect (correct and FOUC-free
  here: an SPA paints nothing before React mounts, so there is no pre-hydration frame
  to protect). Do NOT hand-inline the UA script in index.html; it would duplicate
  `CHROMIUM_RE` and drift when the Safari gate is extended (see CLAUDE.md facts).
- All claims in copy match CLAUDE.md verified facts (no "works everywhere" lies;
  refraction wording is "desktop Chromium").
- Keyboard: every interactive demo reachable and operable by keyboard.
- `index.html` head essentials: `html lang`, `<title>`, meta description, an inline
  SVG favicon, and `<link rel="preload" as="image">` for the hero jpg (the img tag
  only exists after JS boots, so preload is what protects LCP). No `og:image` in v1
  (it requires an absolute canonical URL we don't have yet).

## 25.5 Definition of great (check before shipping)

- A Chromium visitor sees real refraction in the hero within 1s and can feel the
  difference when toggling frosted/aa in the playground.
- A Safari/Firefox visitor sees a page that still looks premium (frost), and the
  engine-story section tells them why, honestly.
- View-source-level simplicity: one page, one CSS file, components imported from
  `@lglite/react` only.
- Verified with real-Chrome CDP screenshots (hero, playground toggles, gallery) and
  one Playwright WebKit screenshot for the fallback, before showing the user.

## 25.6 Out of scope (v1)

Docs pages, MDX, search, versioned docs, analytics, blog. A `docs` phase gets its
own spec later.
