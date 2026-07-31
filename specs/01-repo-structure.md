# 01 — Repo Structure, Tooling & Build

## Monorepo (pnpm workspaces + Turborepo)

```
LGLite/
├─ package.json                 # root: workspaces, turbo, changesets, lint scripts
├─ pnpm-workspace.yaml
├─ turbo.json
├─ tsconfig.base.json
├─ .changeset/
├─ .github/workflows/ci.yml
├─ packages/
│  ├─ glass-core/               # the DRY engine (CSS + tokens + filters + utils)
│  │  ├─ src/
│  │  │  ├─ index.ts
│  │  │  ├─ cn.ts
│  │  │  ├─ glass-surface.ts    # cva recipe
│  │  │  ├─ glass-provider.tsx
│  │  │  ├─ glass-filters.tsx   # <GlassFilters/> SVG defs
│  │  │  ├─ glass-script.tsx    # <GlassScript/> pre-paint gate
│  │  │  ├─ glass-text.tsx      # plate component
│  │  │  ├─ motion.ts           # springs/easings tokens
│  │  │  ├─ use-glass.ts        # context hook
│  │  │  └─ styles/
│  │  │     ├─ tokens.css       # :root + dark + aa-mode CSS vars
│  │  │     ├─ surface.css      # .lg-surface layer stack
│  │  │     ├─ a11y.css         # prefers-contrast / forced-colors / reduced-motion
│  │  │     └─ noise.css        # --lg-noise-url tile
│  │  ├─ package.json
│  │  └─ tsup.config.ts
│  ├─ react/                    # @lglite/react — the published components
│  │  ├─ src/
│  │  │  ├─ index.ts
│  │  │  └─ components/
│  │  │     ├─ button/ (button.tsx, button.css, button.stories.tsx, button.test.tsx)
│  │  │     ├─ card/ …
│  │  │     └─ dialog/ …
│  │  ├─ package.json
│  │  └─ tsup.config.ts
│  ├─ tailwind-preset/          # @lglite/tailwind
│  │  ├─ src/index.ts
│  │  └─ package.json
│  └─ webgl/                     # @lglite/webgl — OPTIONAL lens engine (Phase 2)
│     ├─ src/ (webgl-lens.ts, shaders/, texture.ts)
│     └─ package.json            # depends on glass-core's LensEngine interface only
└─ apps/
   ├─ storybook/                # Storybook 8 (Vite) dev harness
   └─ docs/                     # Phase 3 public docs site (Next.js / Astro)
```

## Why a separate `glass-core`

Every component depends on `glass-core`; it is the single source of the glass material, tokens, filters, motion, and utilities. This is the DRY guarantee — fix glass once, every component inherits it. `glass-core` ships its own CSS entrypoints; `@lglite/react` re-exports them so a consumer can `import "@lglite/react/styles.css"` once.

## Package: `@lglite/react`

`package.json` essentials:

```jsonc
{
  "name": "@lglite/react",
  "type": "module",
  "sideEffects": ["*.css"],                 // CSS has side effects; JS is tree-shakeable
  "exports": {
    ".":            { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./styles.css": "./dist/styles.css",
    "./button":     { "types": "./dist/button.d.ts", "import": "./dist/button.js" },
    "./card":       { "types": "./dist/card.d.ts",   "import": "./dist/card.js" },
    "./dialog":     { "types": "./dist/dialog.d.ts", "import": "./dist/dialog.js" }
    // …one subpath per component for maximal tree-shaking
  },
  "peerDependencies": { "react": ">=18", "react-dom": ">=18" },
  "dependencies": {
    "@lglite/glass-core": "workspace:*",
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "tailwind-merge": "^2",
    "@radix-ui/react-dialog": "^1",
    "@radix-ui/react-slot": "^1"
    /* …Radix primitives per component */
  }
}
```

- `lucide-react` is an **optional peer dependency** (icon strategy); components accept an `icon` prop / children rather than hard-importing icons.
- Every component file that uses hooks/Radix starts with `"use client"` (RSC compatibility). Pure-presentational components (e.g. Badge) can stay server-compatible — decide per component.

## Build — tsup

```ts
// tsup.config.ts (react package)
export default defineConfig({
  entry: { index: "src/index.ts", button: "src/components/button/button.tsx", /* … */ },
  format: ["esm"],            // ESM-only; modern toolchains. Add "cjs" only if demand appears.
  dts: true,
  splitting: true,
  treeshake: true,
  external: ["react", "react-dom"],
  esbuildOptions(o) { o.legalComments = "none"; },
});
```

**Do NOT use a tsup `banner` for `"use client"`** — a banner is applied to *every* output chunk, leaking the client boundary onto server-safe files (`index.js`, `badge.js`, CSS entries) and defeating RSC/SSR-safety (criterion #5). Instead: put a per-file `"use client"` at the top of each client component (as the [04] template does) and preserve directives through bundling with `esbuild-plugin-preserve-directives` (esbuild strips them by default). Server-safe components (e.g. Badge) omit the directive and stay RSC-compatible.

CSS pipeline: each component ships a `.css` co-located file using `@layer lglite.components`. `glass-core` owns `@layer lglite.tokens`, `@layer lglite.surface`, and the nested `@layer lglite.surface.a11y` (so a11y overrides win by layer order, not file order — see [02 §2.3]). **Declare the full layer order once, up front** (`@layer lglite.tokens, lglite.surface, lglite.surface.a11y, lglite.components;`) so cascade is deterministic regardless of concatenation/import order. This gives **CSS tree-shaking by component** when consumers import subpath CSS, and predictable cascade via `@layer`.

## Tailwind preset (`@lglite/tailwind`)

Exposes the `--glass-*` tokens as Tailwind theme values and adds utilities (`backdrop-blur-glass`, `bg-glass`, `rounded-glass`, `lg-surface`). Consumers add it to `presets: [require("@lglite/tailwind")]`. The library does **not** require consumers to use Tailwind — components ship working CSS; the preset is a convenience for those who want the utilities.

## Versioning & release — Changesets

- Component changes → normal semver.
- **Token renames/removals → `major`** (tokens are a public contract; see [02](02-glass-core-engine.md)).
- Automated release via GitHub Actions on merge to `main`.

## CI (`.github/workflows/ci.yml`)

Jobs: `lint` (eslint + prettier), `typecheck`, `unit` (Vitest), `a11y` (Storybook test-runner + jest-axe in 3 modes), `contrast` (the contrast-contract test — see [03](03-contrast-contract.md)), `visual` (Playwright across Chromium + WebKit + Firefox), `size` (size-limit gate per [00](00-overview-and-decisions.md) criterion 5). Visual + size run on PRs; release job runs on `main`.

## Local dev

`pnpm dev` → Turborepo runs `glass-core` watch build + Storybook. Storybook is the primary dev surface until the Phase-3 docs site exists.
