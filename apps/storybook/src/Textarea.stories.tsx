import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@lglite/react";
import { lensControl, frostedControl, plateControl } from "./glass-controls";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  argTypes: {
    lens: lensControl,
    frosted: frostedControl,
    plate: plateControl,
  },
  args: { lens: true, frosted: true },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Basic: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "0.75rem", width: 300 }}>
      <Textarea {...args} aria-label="message" placeholder="Type your message…" />
      <Textarea {...args} aria-label="invalid" invalid defaultValue="too short" />
      <Textarea {...args} aria-label="disabled" disabled placeholder="Disabled" />
    </div>
  ),
};
