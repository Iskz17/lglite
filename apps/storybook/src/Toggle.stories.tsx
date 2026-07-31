import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "@lglite/react";

// Toggle is a flat pressable button with no backdrop-filter — it has no `lens`/`frosted`
// (see toggle.tsx). Only `variant` + `size` are exposed; passing glass-control args would
// be unsupported props.
const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
};
export default meta;
type Story = StoryObj<typeof Toggle>;

export const Primary: Story = {
  args: { variant: "default", size: "md" },
  render: (args) => (
    <Toggle {...args} aria-label="Toggle bold">B</Toggle>
  ),
};

export const Basic: Story = {
  render: () => <Toggle aria-label="Toggle bold">B</Toggle>,
};

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle italic">
      I
    </Toggle>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Toggle size="sm" aria-label="Small">S</Toggle>
      <Toggle size="md" aria-label="Medium">M</Toggle>
      <Toggle size="lg" aria-label="Large">L</Toggle>
    </div>
  ),
};
