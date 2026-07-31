import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@lglite/react";
import { glassControlArgTypes } from "./glass-controls";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  argTypes: {
    ...glassControlArgTypes,
    tone: { control: "inline-radio", options: ["default", "primary"] },
  },
};
export default meta;
type Story = StoryObj<typeof Slider>;

/** Hero control — `lens` refraction ON by default so it's visible in the Controls panel. */
export const Primary: Story = {
  args: { lens: true, frosted: false },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Slider {...args} defaultValue={[40]} aria-label="slider" />
    </div>
  ),
};

export const Basic: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", width: 320 }}>
      <Slider defaultValue={[40]} aria-label="single value" />
      <Slider defaultValue={[20, 70]} aria-label="range" />
      <Slider defaultValue={[50]} tone="default" size="sm" aria-label="default tone, small" />
      <Slider defaultValue={[30]} disabled aria-label="disabled" />
    </div>
  ),
};
