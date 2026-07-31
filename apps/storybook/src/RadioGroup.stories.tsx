import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "@lglite/react";
import { glassControlArgTypes } from "./glass-controls";

// `lens`/`frosted` live on RadioGroupItem (not the root); typed via RadioGroupItem here.
const meta: Meta<typeof RadioGroupItem> = {
  title: "Components/RadioGroup",
  component: RadioGroupItem,
  argTypes: { ...glassControlArgTypes },
};
export default meta;
type Story = StoryObj<typeof RadioGroupItem>;

const labelStyle: React.CSSProperties = { display: "flex", gap: "0.5rem", alignItems: "center" };

/** Hero control — `lens` refraction ON by default, spread onto each item. */
export const Primary: Story = {
  args: { lens: true, frosted: false },
  render: (args) => (
    <RadioGroup defaultValue="comfortable">
      <label style={labelStyle}>
        <RadioGroupItem {...args} value="default" /> Default
      </label>
      <label style={labelStyle}>
        <RadioGroupItem {...args} value="comfortable" /> Comfortable
      </label>
      <label style={labelStyle}>
        <RadioGroupItem {...args} value="compact" /> Compact
      </label>
    </RadioGroup>
  ),
};

export const Basic: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <label style={labelStyle}>
        <RadioGroupItem value="default" /> Default
      </label>
      <label style={labelStyle}>
        <RadioGroupItem value="comfortable" /> Comfortable
      </label>
      <label style={labelStyle}>
        <RadioGroupItem value="compact" /> Compact
      </label>
      <label style={labelStyle}>
        <RadioGroupItem value="disabled" disabled /> Disabled
      </label>
    </RadioGroup>
  ),
};
