# LGLite — project instructions

LGLite is a **shadcn-style React component library shipped with Apple "Liquid Glass" styling**, distributed as a traditional npm package (`npm i @lglite/react` → `import { Button }`). Built DRY on one glass engine, fully customizable via props + CSS variables, **WCAG 2.2 AA–capable**.

## Locked decisions (do not re-litigate without asking)

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | **Glass = CSS base + Chromium-only SVG refraction enhancement** (progressive enhancement). | True `backdrop-filter: url(#svg)` refraction is Chromium-only (WebKit #245510). Safari/Firefox get the CSS base. |
| D2 | **Distribution = traditional npm import package** (not a shadcn-style copy-in registry). | User choice. Customization is via props + CSS vars + `className`, never source forking. |
| D3 | **Styling = Tailwind + CSS custom properties + class-variance-authority (cva).** | Matches shadcn ergonomics; DRY via shared `--glass-*` tokens. |
| D4 | **WCAG framing = glass-first by default, AA in one line** (`<GlassProvider contrast="aa">`). Claimed as "AA-capable", documented honestly. | User chose glass-first; default may fail 1.4.3 over busy backdrops. AA is an opt-in global mode + `<GlassText>` / `plate` prop. |
| D5 | **Distortion is preset-level, not per-instance** (`subtle`/`medium`/`strong` filters via `feTurbulence`). | `feDisplacementMap.scale` can't read CSS vars; per-instance maps cause ID explosion + resize storms. |
| D6 | **Refraction gate = pre-paint inline script** sets `data-lg-refraction="on"`; CSS keys off it. | `@supports(backdrop-filter:url())` is true-but-broken on Safari. Pre-paint script = SSR-correct, no FOUC. |
| D7 | **Rim = real `border`, not `box-shadow`.** | box-shadow is stripped in `forced-colors`; components would lose their boundary. |
| D8 | **Scope = phased.** Phase 0 engine + Button/Card/Dialog → Phase 1 core set → Phase 2 Dock/Navbar (physics) → Phase 3 full ~50 + docs site. | De-risk the engine before breadth; Dock is the riskiest item, isolated. |
| D9 | **Pluggable lens engine: `css` default, `webgl` opt-in** (`<Card lens="webgl" lensSource=…>`). WebGL ships as a separate optional `@lglite/webgl` package. | CSS lenses the live backdrop (Chromium only); WebGL lenses a *supplied* source cross-browser incl. Safari/iOS, but can't read arbitrary live DOM. Library is general-purpose → CSS default, WebGL for owned-media/static-bg surfaces. Abstraction lands Phase 0, WebGL impl Phase 2. See [specs/12-lens-engines.md](specs/12-lens-engines.md). |

## How to work here

- Specs live in [specs/](specs/). One concern per file. Read the relevant spec before implementing.
- Architectural decisions are recorded in [specs/00-overview-and-decisions.md](specs/00-overview-and-decisions.md).
- Before scaffolding code, run a final adversarial review of the spec set (global directive #3 — second-AI check).
- Components mirror shadcn names 1:1. Glass extras are prefixed `Glass*`. Tokens are `--glass-*`; internal classes `lg-*`.

## Verified technical facts (from research — respect these)

- `backdrop-filter: url(#svg)` refraction: **Chromium only**. Safari does not render it. Firefox unreliable. Fallback = plain `backdrop-filter: blur()`.
- `feDisplacementMap.scale` / channel selectors **cannot** be driven by CSS custom properties — must be attributes on the SVG `<filter>`.
- `prefers-reduced-transparency` is **unsupported in Safari/iOS** — cannot detect Apple's "Reduce Transparency" on web. Use `prefers-contrast: more` + `forced-colors` as the reliable levers; provide a manual "reduce glass" toggle.
- Blur does **not** reduce luminance → translucency cannot guarantee text contrast over a dynamic backdrop. AA requires opaque plates.
- `backdrop-filter` is GPU-expensive: blur ≤ ~20px, limit to a few floating surfaces.
- **No public trigger exists for Apple's native Liquid Glass on web content** (deep-researched June 2026 against Safari 26.0/26.2 release notes, 25 claims verified, none refuted). The glass people see on iOS websites is Safari's OWN toolbar chrome, which Safari self-tints by sampling `position: fixed/sticky` edge elements (needs `viewport-fit=cover`; `theme-color` meta is ignored). The private `-apple-visual-effect: -apple-system-glass-material` works only in a WKWebView with a private flag and is App Store rejectable. Form controls, PWAs and standalone mode get nothing. Do not re-research this.
- **WebKit #245510 fix is in review upstream (our own MR).** When it ships in a Safari release, extend the D1 gate (`chromium.ts` `refractionCapable` + `glass-script.tsx`) to Safari ≥ that version and the existing CSS/SVG path works there unchanged. Until then Safari must stay OUT of the gate: the unsupported `url()` weakens the entire `backdrop-filter`, so an early opt-in makes Safari look worse, not better. Firefox stays on plain frost (blur since v103, no SVG-in-backdrop-filter).
