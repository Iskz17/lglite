import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "@lglite/react";
import { glassControlArgTypes } from "./glass-controls";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    ...glassControlArgTypes,
    tone: { control: "inline-radio", options: ["default", "primary"] },
  },
};
export default meta;
type Story = StoryObj<typeof Switch>;

/** Hero control — `lens` refraction ON by default so it's visible in the Controls panel. */
export const Primary: Story = {
  args: { lens: true, frosted: false },
  render: (args) => (
    <Switch {...args} defaultChecked aria-label="switch" style={{ transform: "scale(2.2)" }} />
  ),
};

export const Basic: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Switch defaultChecked aria-label="checked" />
      <Switch aria-label="unchecked" />
      <Switch size="sm" defaultChecked aria-label="small checked" />
      <Switch tone="default" defaultChecked aria-label="default tone" />
      <Switch disabled defaultChecked aria-label="disabled" />
    </div>
  ),
};

/** Opt-in `lens` — the track refracts the live backdrop (hero use; off by default for perf). */
export const Lens: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      <Switch lens aria-label="lens unchecked" style={{ transform: "scale(2.2)" }} />
      <Switch lens defaultChecked aria-label="lens checked" style={{ transform: "scale(2.2)" }} />
    </div>
  ),
};
