import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type ColumnDef } from "@lglite/react";
import { glassControl, frostedControl, plateControl } from "./glass-controls";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "success" | "failed";
  email: string;
};

const columns: ColumnDef<Payment>[] = [
  { accessorKey: "status", header: "Status" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue("amount")),
  },
];

const data: Payment[] = [
  { id: "1", amount: 100, status: "success", email: "ken@example.com" },
  { id: "2", amount: 125, status: "pending", email: "abe@example.com" },
  { id: "3", amount: 75, status: "failed", email: "mia@example.com" },
];

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
  argTypes: {
    glass: glassControl,
    frosted: frostedControl,
    plate: plateControl,
  },
};
export default meta;
type Story = StoryObj<typeof DataTable>;

export const Basic: Story = {
  args: { glass: true, frosted: false, plate: false },
  render: (args) => (
    <div style={{ width: 560 }}>
      <DataTable {...args} columns={columns} data={data} />
    </div>
  ),
};
