import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Calendar } from "@lglite/react";
import { glassControl, frostedControl } from "./glass-controls";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  argTypes: {
    glass: glassControl,
    frosted: frostedControl,
  },
};
export default meta;
type Story = StoryObj<typeof Calendar>;

export const Basic: Story = {
  args: { glass: true, frosted: true },
  render: (args) => {
    const [selected, setSelected] = React.useState<Date | undefined>(new Date());
    return <Calendar {...args} mode="single" selected={selected} onSelect={setSelected} />;
  },
};
