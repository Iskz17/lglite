import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@lglite/react";
import { glassControlArgTypes } from "./glass-controls";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: { ...glassControlArgTypes },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

const labelStyle: React.CSSProperties = { display: "flex", gap: "0.5rem", alignItems: "center" };

/** Hero control — `lens` refraction ON by default; it shows through the translucent
 *  (unchecked) box. Toggle it off in Controls to compare. */
export const Primary: Story = {
  args: { lens: true, frosted: false },
  render: (args) => (
    <span style={{ transform: "scale(3)", display: "inline-block", padding: "1rem" }}>
      <Checkbox {...args} aria-label="checkbox" />
    </span>
  ),
};

export const Basic: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <label style={labelStyle}>
        <Checkbox defaultChecked /> Checked
      </label>
      <label style={labelStyle}>
        <Checkbox /> Unchecked
      </label>
      <label style={labelStyle}>
        <Checkbox checked="indeterminate" /> Indeterminate
      </label>
      <label style={labelStyle}>
        <Checkbox disabled defaultChecked /> Disabled
      </label>
    </div>
  ),
};

/** `lens` refraction shows through the TRANSLUCENT (unchecked) box; the checked box's
 *  solid tone fill sits on top of the backdrop-filter and hides it. */
export const Lens: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "3rem", alignItems: "center", padding: "2rem" }}>
      <span style={{ transform: "scale(3)" }}>
        <Checkbox lens aria-label="lens unchecked" />
      </span>
      <span style={{ transform: "scale(3)" }}>
        <Checkbox lens defaultChecked aria-label="lens checked" />
      </span>
    </div>
  ),
};
