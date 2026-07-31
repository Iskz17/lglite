import * as React from "react";
import type { Decorator, Preview } from "@storybook/react";
import { GlassProvider } from "@lglite/react";
import "@lglite/react/styles.css";
import "./backdrops.css";

const backdrops: Record<string, string> = {
  rings: "lg-bg lg-bg--rings",
  stripes: "lg-bg lg-bg--stripes",
  photo: "lg-bg lg-bg--photo",
  grid: "lg-bg lg-bg--grid",
  solid: "lg-bg lg-bg--solid",
};

const withGlass: Decorator = (Story, ctx) => {
  const { theme, contrast, backdrop, reduceGlass, blur, frosted } = ctx.globals;
  return (
    <GlassProvider
      theme={theme}
      contrast={contrast}
      reduceGlass={reduceGlass === "on"}
    >
      <div className={backdrops[backdrop] ?? backdrops.grid}>
        {/* lg-no-blur / lg-frosted on the stage cascade their vars to every glass element inside */}
        <div
          className={
            "lg-stage" + (blur === "off" ? " lg-no-blur" : "") + (frosted === "on" ? " lg-frosted" : "")
          }
        >
          <Story />
        </div>
      </div>
    </GlassProvider>
  );
};

const preview: Preview = {
  decorators: [withGlass],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
  },
  globalTypes: {
    theme: {
      description: "Glass theme",
      defaultValue: "light",
      toolbar: { icon: "circlehollow", items: ["light", "dark"], dynamicTitle: true },
    },
    contrast: {
      description: "Contrast mode",
      defaultValue: "default",
      toolbar: { icon: "accessibility", items: ["default", "aa"], dynamicTitle: true },
    },
    backdrop: {
      description: "Backdrop behind the glass",
      defaultValue: "photo",
      toolbar: { icon: "photo", items: ["photo", "rings", "stripes", "grid", "solid"], dynamicTitle: true },
    },
    reduceGlass: {
      description: "Reduce transparency",
      defaultValue: "off",
      toolbar: { icon: "eyeclose", items: ["off", "on"], dynamicTitle: true },
    },
    blur: {
      description: "Glass frost blur (off = lg-no-blur)",
      defaultValue: "on",
      toolbar: { icon: "contrast", items: ["on", "off"], dynamicTitle: true },
    },
    frosted: {
      description: "Denser frosted material (lg-frosted) on all glass",
      defaultValue: "off",
      toolbar: { icon: "beaker", items: ["off", "on"], dynamicTitle: true },
    },
  },
};

export default preview;
