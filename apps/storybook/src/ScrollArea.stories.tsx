import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "@lglite/react";
import { frostedControl } from "./glass-controls";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  argTypes: {
    frosted: frostedControl,
  },
  args: { frosted: true },
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 40 }, (_, i) => `v1.2.0-rc.${i + 1}`);

export const Basic: Story = {
  render: (args) => (
    <ScrollArea {...args} style={{ height: 240, width: 280, borderRadius: "0.75rem" }}>
      <div style={{ padding: "1rem" }}>
        <h4 style={{ margin: "0 0 0.5rem", fontWeight: 600 }}>Tags</h4>
        {tags.map((tag) => (
          <div
            key={tag}
            style={{
              padding: "0.5rem 0",
              fontSize: "0.875rem",
              borderTop: "1px solid rgb(var(--glass-rim) / 0.2)",
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
