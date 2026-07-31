import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarImage, AvatarFallback } from "@lglite/react";
import { frostedControl, lensControl } from "./glass-controls";

// The glass knobs (`frosted`/`lens`) live on AvatarFallback, so the story drives
// the fallback. Type the meta on the fallback to expose them in Controls.
const meta: Meta<typeof AvatarFallback> = {
  title: "Components/Avatar",
  component: AvatarFallback,
  argTypes: {
    frosted: frostedControl,
    lens: lensControl,
  },
  args: { frosted: true, lens: true },
};
export default meta;
type Story = StoryObj<typeof AvatarFallback>;

export const Basic: Story = {
  render: (args) => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback {...args}>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Ring: Story = {
  render: (args) => (
    <Avatar ring>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback {...args}>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: (args) => (
    <Avatar>
      <AvatarImage src="" alt="" />
      <AvatarFallback {...args}>LG</AvatarFallback>
    </Avatar>
  ),
};
