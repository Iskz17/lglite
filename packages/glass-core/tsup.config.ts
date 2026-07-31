import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  // no `treeshake`: the rollup post-pass strips module-level directives (the banner)
  clean: true,
  external: ["react", "react-dom"],
  // client-only engine (context, hooks): required for RSC bundlers like Next.js
  banner: { js: '"use client";' },
  // CSS lives in src/styles and is shipped as-is via the package "exports" map.
});
