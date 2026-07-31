import type { Meta, StoryObj } from "@storybook/react";
import { AspectRatio } from "@lglite/react";

const meta: Meta<typeof AspectRatio> = {
  title: "Components/AspectRatio",
  component: AspectRatio,
};
export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Basic: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <AspectRatio ratio={16 / 9}>
        <img
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=640"
          alt="Landscape"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
        />
      </AspectRatio>
    </div>
  ),
};
