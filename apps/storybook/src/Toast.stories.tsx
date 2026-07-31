import type { Meta, StoryObj } from "@storybook/react";
import { Button, Toaster, toast } from "@lglite/react";
import { frostedControl } from "./glass-controls";

const meta: Meta<typeof Toaster> = {
  title: "Components/Toast",
  component: Toaster,
  argTypes: { frosted: frostedControl },
};
export default meta;
type Story = StoryObj<typeof Toaster>;

export const Basic: Story = {
  args: { frosted: false },
  render: (args) => (
    <div>
      <Toaster {...args} />
      <Button
        onClick={() =>
          toast("Liquid Glass toast", {
            description: "Rendered through Sonner with glass styling.",
          })
        }
      >
        Show toast
      </Button>
    </div>
  ),
};
