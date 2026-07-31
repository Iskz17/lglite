import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // relative asset paths → the same static dist/ works at a domain root
  // (Vercel/Netlify) AND under a subpath (GitHub Pages) with no rebuild.
  base: "./",
});
