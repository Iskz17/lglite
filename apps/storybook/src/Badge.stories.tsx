import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@lglite/react";
import { frostedControl, plateControl } from "./glass-controls";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    variant: { control: "inline-radio", options: ["glass", "solid", "outline"] },
    // Badge supports an extra `warning` tone beyond the shared glass tones.
    tone: {
      control: "inline-radio",
      options: ["default", "primary", "destructive", "success", "warning"],
    },
    frosted: frostedControl,
    plate: plateControl,
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Basic: Story = {
  args: { variant: "glass", tone: "default", frosted: false, plate: false },
  render: (args) => <Badge {...args}>Badge</Badge>,
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
      <Badge>Glass</Badge>
      <Badge variant="solid" tone="primary">Primary</Badge>
      <Badge variant="solid" tone="destructive">Error</Badge>
      <Badge variant="solid" tone="success">Success</Badge>
      <Badge variant="solid" tone="warning">Warning</Badge>
      <Badge variant="outline" tone="primary">Outline</Badge>
      <Badge plate>Plate</Badge>
    </div>
  ),
};
