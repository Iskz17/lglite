import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/button/button": "src/components/button/button.tsx",
    "components/card/card": "src/components/card/card.tsx",
    "components/dialog/dialog": "src/components/dialog/dialog.tsx",
  },
  format: ["esm"],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ["react", "react-dom", "@lglite/glass-core"],
  // Per-file "use client" directives are preserved by tsup's banner-free build.
});
