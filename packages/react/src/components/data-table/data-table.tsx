"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { cn, useGlass, useGlassSurface } from "@lglite/glass-core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table/table";
import "./data-table.css";

export type { ColumnDef };

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  /** Wrap the table in a glass Surface. ON by default. */
  glass?: boolean;
  /** Denser frosted material. */
  frosted?: boolean;
  /** Opaque plate (AA-legible). Forced on in `contrast="aa"`. */
  plate?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  glass = true,
  frosted,
  plate,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // hooks unconditionally; gate only the lens merge + surface classes.
  const ctx = useGlass();
  const usePlate = plate || ctx.contrast === "aa";
  const surfaceRef = useGlassSurface<HTMLDivElement>(undefined, glass);

  return (
    <div
      ref={surfaceRef}
      className={cn(
        "lg-data-table",
        glass && "lg-surface",
        glass && frosted && "lg-frosted",
        glass && usePlate && "lg-plate",
        className,
      )}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="lg-data-table__empty">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
