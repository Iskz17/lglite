import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "@lglite/react";

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Basic: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <div>Top section</div>
      <Separator style={{ margin: "12px 0" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, height: 24 }}>
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  ),
};
