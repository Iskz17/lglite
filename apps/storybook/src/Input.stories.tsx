import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@lglite/react";
import { lensControl, frostedControl, plateControl } from "./glass-controls";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    lens: lensControl,
    frosted: frostedControl,
    plate: plateControl,
  },
  args: { lens: true, frosted: true },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Basic: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "0.75rem", width: 300 }}>
      <Input {...args} aria-label="md" placeholder="Email address" />
      <Input {...args} aria-label="sm" inputSize="sm" placeholder="Small" />
      <Input {...args} aria-label="lg" inputSize="lg" placeholder="Large" />
      <Input {...args} aria-label="invalid" invalid defaultValue="not-an-email" />
      <Input {...args} aria-label="disabled" disabled placeholder="Disabled" />
    </div>
  ),
};
