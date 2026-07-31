/**
 * Single source of truth for the refraction gate ([D1]): live-backdrop `url()`
 * refraction renders only on desktop Chromium. Safari/Firefox/mobile must never
 * receive it. Used by the lens hook and the provider at runtime, and by the
 * pre-paint script (which interpolates these regex sources, since it can't import).
 */
export const CHROMIUM_RE = /Chrome|Chromium|Edg|OPR/;
export const WEBVIEW_RE = /Android.*; wv\)/;
export const MOBILE_RE = /Android|Mobile/;

export function chromiumDesktop(ua: string): boolean {
  return CHROMIUM_RE.test(ua) && !WEBVIEW_RE.test(ua) && !MOBILE_RE.test(ua);
}

/** True only on desktop Chromium (and only in a browser).
 *  A WebKit fix for bug #245510 (backdrop-filter: url(#svg)) is in review upstream;
 *  when it ships in a Safari release, extend this gate to Safari ≥ that version and
 *  the same CSS/SVG path works there unchanged. Until then, letting Safari through
 *  DEGRADES it: the unsupported url() weakens the whole backdrop-filter. */
export function refractionCapable(): boolean {
  return typeof navigator !== "undefined" && chromiumDesktop(navigator.userAgent);
}
