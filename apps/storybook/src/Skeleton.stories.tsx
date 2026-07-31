import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "@lglite/react";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Basic: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: 280 }}>
      <Skeleton style={{ width: 48, height: 48, borderRadius: "9999px" }} />
      <div style={{ display: "grid", gap: 8, flex: 1 }}>
        <Skeleton style={{ height: 14, width: "100%" }} />
        <Skeleton style={{ height: 14, width: "70%" }} />
      </div>
    </div>
  ),
};
