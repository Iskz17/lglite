import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DatePicker } from "@lglite/react";
import { frostedControl, plateControl } from "./glass-controls";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  argTypes: { frosted: frostedControl, plate: plateControl },
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Basic: Story = {
  args: { frosted: true, plate: false },
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>();
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};
