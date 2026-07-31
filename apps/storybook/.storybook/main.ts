import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const root = fileURLToPath(new URL("../../..", import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  core: { disableTelemetry: true },
  async viteFinal(cfg) {
    cfg.resolve ??= {};
    // Resolve the bare package specifiers from source so no build step is needed
    // to dev. EXACT match only (regex) — subpaths like "@lglite/react/styles.css"
    // fall through to normal node resolution via the package "exports" map.
    const existing = Array.isArray(cfg.resolve.alias)
      ? cfg.resolve.alias
      : Object.entries(cfg.resolve.alias ?? {}).map(([find, replacement]) => ({
          find,
          replacement: replacement as string,
        }));
    cfg.resolve.alias = [
      { find: /^@lglite\/glass-core$/, replacement: `${root}/packages/glass-core/src/index.ts` },
      { find: /^@lglite\/react$/, replacement: `${root}/packages/react/src/index.ts` },
      ...existing,
    ];
    return cfg;
  },
};

export default config;
