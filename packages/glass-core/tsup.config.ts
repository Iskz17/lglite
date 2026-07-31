import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm"],
  dts: true,
  treeshake: true,
  clean: true,
  external: ["react", "react-dom"],
  // CSS lives in src/styles and is shipped as-is via the package "exports" map.
});
