import type { Meta, StoryObj } from "@storybook/react";
import { Dock, DockItem } from "@lglite/react";

const meta: Meta<typeof Dock> = {
  title: "Components/Dock",
  component: Dock,
  argTypes: {
    itemGlass: { control: "boolean" },
    rangeFactor: { control: { type: "range", min: 1, max: 5, step: 0.5 } },
    tone: { control: "inline-radio", options: ["default", "primary", "destructive"] },
  },
};
export default meta;
type Story = StoryObj<typeof Dock>;

// Simple inline SVG glyphs so the story has no icon-lib dependency.
const Glyph = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ICONS = {
  Finder: "M4 5h16v14H4z M9 9h.01 M15 9h.01 M9 14c1 1 5 1 6 0",
  Mail: "M3 6h18v12H3z M3 7l9 6 9-6",
  Photos: "M4 5h16v14H4z M8 13l3-3 4 4 2-2 3 3",
  Music: "M9 18V5l10-2v13 M9 18a3 3 0 11-6 0 3 3 0 016 0z M19 16a3 3 0 11-6 0 3 3 0 016 0z",
  Calendar: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4",
  Settings: "M12 9a3 3 0 100 6 3 3 0 000-6z M19 12l2 1-2 4-2-1 M5 12l-2 1 2 4 2-1",
  Trash: "M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13",
};

const items = (onClick?: () => void) =>
  Object.entries(ICONS).map(([label, d]) => (
    <DockItem key={label} label={label} icon={<Glyph d={d} />} onClick={onClick} />
  ));

export const Basic: Story = {
  args: { tone: "default", rangeFactor: 2.5, itemGlass: false },
  render: (args) => <Dock {...args}>{items()}</Dock>,
};

export const Frosted: Story = {
  args: { frosted: true },
  render: (args) => <Dock {...args}>{items()}</Dock>,
};

/** Hero-only: per-item refraction. ≤3 items stays within the perf budget. */
export const ItemGlass: Story = {
  args: { itemGlass: true },
  render: (args) => (
    <Dock {...args}>
      <DockItem label="Finder" icon={<Glyph d={ICONS.Finder} />} />
      <DockItem label="Mail" icon={<Glyph d={ICONS.Mail} />} />
      <DockItem label="Settings" icon={<Glyph d={ICONS.Settings} />} />
    </Dock>
  ),
};
