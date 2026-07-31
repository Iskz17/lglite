"use client";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

/** Constrains content to a given ratio ([flat] — pure layout, no glass, no css).
 *  Re-export of the Radix primitive; explicit type annotation avoids TS2742. */
export const AspectRatio: typeof AspectRatioPrimitive.Root = AspectRatioPrimitive.Root;
