import { readdirSync } from "node:fs";
import { defineConfig } from "tsup";

// One entry per component → '@lglite/react/components/<name>' subpaths that carry
// only that component's code (plus shared split chunks), so consumers never pay
// for components they don't import. The root barrel stays for convenience.
const componentEntries = Object.fromEntries(
  readdirSync("src/components", { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => [`components/${d.name}`, `src/components/${d.name}/${d.name}.tsx`]),
);

export default defineConfig({
  entry: { index: "src/index.ts", ...componentEntries },
  format: ["esm"],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ["react", "react-dom", "@lglite/glass-core"],
  // client-only library: the directive makes every chunk work under RSC bundlers
  banner: { js: '"use client";' },
});
