"use client";
import * as React from "react";

// Read NODE_ENV off globalThis so the browser build needs no node types.
const isProd =
  (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV ===
  "production";

/**
 * Dev-only a11y guard ([specs 17/18/19]): warn (once, on mount) when an
 * interactive control has no accessible name — via `aria-label`,
 * `aria-labelledby`, a `title`, an associated `<label for>`, or a wrapping
 * `<label>`. No-op in production. Pass the ref that lands on the real control.
 */
export function useNameWarning(
  ref: React.RefObject<HTMLElement | null>,
  component: string,
  /** Set when the component names an INNER node itself (e.g. Slider forwards
   *  aria-label to its thumbs) so the root check would false-positive. */
  skip = false,
): void {
  React.useEffect(() => {
    if (isProd || skip) return;
    const el = ref.current;
    if (!el) return;
    const named =
      el.getAttribute("aria-label") ||
      el.getAttribute("aria-labelledby") ||
      el.getAttribute("title") ||
      (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) ||
      el.closest("label");
    if (!named) {
      console.warn(
        `[lglite] <${component}> has no accessible name. Add aria-label, aria-labelledby, or an associated <label>.`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
