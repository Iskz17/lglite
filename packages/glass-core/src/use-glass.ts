import { createContext, useContext } from "react";
import type { LensName } from "./lens";

export interface GlassContextValue {
  intensity?: "subtle";
  contrast: "default" | "aa";
  lens: LensName;
}

/** Default so components work with NO provider (the library is npm-import). */
export const GlassContext = createContext<GlassContextValue>({
  intensity: undefined,
  contrast: "default",
  lens: "css",
});

export const useGlass = () => useContext(GlassContext);
