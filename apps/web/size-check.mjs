// Ad-hoc release check: what does importing ONE Button cost a rollup consumer?
import { build } from "vite";
import { gzipSync } from "node:zlib";
import { readFileSync, writeFileSync, rmSync } from "node:fs";

const cases = {
  barrel: 'export { Button } from "@lglite/react";',
  sub: 'export { Button } from "@lglite/react/components/button";',
  all: 'export * from "@lglite/react";',
};

for (const [name, code] of Object.entries(cases)) {
  writeFileSync(`_t_${name}.ts`, code);
  await build({
    configFile: false,
    logLevel: "error",
    build: {
      lib: { entry: `_t_${name}.ts`, formats: ["es"], fileName: name },
      outDir: `_tout/${name}`,
      rollupOptions: { external: ["react", "react-dom", "react/jsx-runtime"] },
      minify: true,
    },
  });
  const out = readFileSync(`_tout/${name}/${name}.js`);
  console.log(`${name}: ${Math.round(out.length / 1024)} KB raw, ${Math.round(gzipSync(out).length / 1024)} KB gzip`);
  rmSync(`_t_${name}.ts`);
}
rmSync("_tout", { recursive: true, force: true });
