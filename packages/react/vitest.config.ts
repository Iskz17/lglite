import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import * as path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolve the engine from source so tests run against current code (no build step).
    alias: {
      "@lglite/glass-core": path.resolve(__dirname, "../glass-core/src/index.ts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    css: false, // styles aren't asserted in jsdom; skip CSS processing
    include: ["src/**/*.test.{ts,tsx}", "test/**/*.test.{ts,tsx}"],
  },
});
