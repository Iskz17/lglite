import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@lglite/react";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
};
export default meta;
type Story = StoryObj<typeof Table>;

const invoices = [
  { invoice: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { invoice: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { invoice: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
];

export const Basic: Story = {
  render: () => (
    <div style={{ width: 560 }}>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead style={{ textAlign: "right" }}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((i) => (
            <TableRow key={i.invoice}>
              <TableCell>{i.invoice}</TableCell>
              <TableCell>{i.status}</TableCell>
              <TableCell>{i.method}</TableCell>
              <TableCell style={{ textAlign: "right" }}>{i.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell style={{ textAlign: "right" }}>$750.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};
