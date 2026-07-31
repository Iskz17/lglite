import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "@lglite/react";
import { glassSurfaceArgTypes } from "./glass-controls";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  argTypes: glassSurfaceArgTypes,
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Basic: Story = {
  args: { tone: "default", plate: false, frosted: false },
  render: (args) => (
    <Alert {...args} style={{ width: 360 }}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>A glass alert with a tone-driven accent.</AlertDescription>
    </Alert>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 360 }}>
      <Alert tone="default">
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Neutral glass, no tint.</AlertDescription>
      </Alert>
      <Alert tone="destructive">
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
      <Alert tone="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your changes were saved.</AlertDescription>
      </Alert>
    </div>
  ),
};
