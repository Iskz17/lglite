import * as React from "react";
import { CHROMIUM_RE, WEBVIEW_RE, MOBILE_RE } from "./chromium";

// Inline pre-paint script — can't import at runtime, so it interpolates the shared
// regex sources (single source of truth lives in chromium.ts).
const SRC = `(function(){try{
  var ua=navigator.userAgent;var d=document.documentElement;
  if(/${CHROMIUM_RE.source}/.test(ua)&&!/${WEBVIEW_RE.source}/.test(ua)&&!/${MOBILE_RE.source}/.test(ua)){d.setAttribute('data-lg-refraction','on');}
}catch(e){}})();`;

/**
 * Pre-paint gate ([spec 02 §2.5]). Enables refraction only on desktop Chromium.
 * Place in <head> (Next.js app/layout). For SPA dev, GlassProvider sets the gate
 * from an effect after filters mount (no pre-paint script needed).
 */
export function GlassScript({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: SRC }} />;
}
