import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@lglite/react";
import { glassControlArgTypes } from "./glass-controls";

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  argTypes: { ...glassControlArgTypes },
};
export default meta;
type Story = StoryObj<typeof Progress>;

/** Hero control — `lens` refraction ON by default; the glass track refracts the backdrop. */
export const Primary: Story = {
  args: { lens: true, frosted: false },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Progress {...args} value={60} aria-label="60 percent" />
    </div>
  ),
};

export const Basic: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem", width: 320 }}>
      <Progress value={60} aria-label="60 percent" />
      <Progress value={100} aria-label="complete" />
      <Progress value={0} aria-label="empty" />
    </div>
  ),
};

function Animated() {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 10)), 800);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ width: 320 }}>
      <Progress value={value} aria-label="loading" />
    </div>
  );
}

export const AnimatedProgress: Story = {
  render: () => <Animated />,
};
