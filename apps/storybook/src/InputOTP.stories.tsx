import type { Meta, StoryObj } from "@storybook/react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@lglite/react";
import { lensControl, frostedControl } from "./glass-controls";

// The glass knobs (`lens`/`frosted`) live on InputOTPSlot, so the story drives
// the slots — not InputOTP itself. Type the meta on the slot to expose them.
const meta: Meta<typeof InputOTPSlot> = {
  title: "Components/InputOTP",
  component: InputOTPSlot,
  argTypes: {
    lens: lensControl,
    frosted: frostedControl,
  },
  args: { lens: true, frosted: true },
};
export default meta;
type Story = StoryObj<typeof InputOTPSlot>;

export const Basic: Story = {
  render: (args) => (
    <InputOTP maxLength={6} aria-label="one-time code">
      <InputOTPGroup>
        <InputOTPSlot {...args} index={0} />
        <InputOTPSlot {...args} index={1} />
        <InputOTPSlot {...args} index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot {...args} index={3} />
        <InputOTPSlot {...args} index={4} />
        <InputOTPSlot {...args} index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};
