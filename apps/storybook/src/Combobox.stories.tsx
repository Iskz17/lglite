import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "@lglite/react";
import { frostedControl, plateControl } from "./glass-controls";

const meta: Meta<typeof Combobox> = {
  title: "Components/Combobox",
  component: Combobox,
  argTypes: { frosted: frostedControl, plate: plateControl },
};
export default meta;
type Story = StoryObj<typeof Combobox>;

const frameworks = [
  { label: "Next.js", value: "next" },
  { label: "SvelteKit", value: "sveltekit" },
  { label: "Nuxt", value: "nuxt" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
  { label: "SolidStart", value: "solidstart" },
];

export const Basic: Story = {
  args: { frosted: true, plate: false },
  render: (args) => (
    <Combobox {...args} options={frameworks} placeholder="Select framework…" emptyText="No framework found." />
  ),
};
