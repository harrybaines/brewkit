"use client"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

import { DataTableCurrencyCell } from "@/components/ui/data-table/data-table-currency-cell"
import { DataTableRowActions } from "@/components/ui/data-table/data-table-row-actions"
import { DataTableSelectCell } from "@/components/ui/data-table/data-table-select-cell"
import { DataTableSelectHeader } from "@/components/ui/data-table/data-table-select-header"
import { ColumnDef } from "@tanstack/react-table"
import { type Payment } from "./types"

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => <DataTableSelectHeader table={table} />,
    cell: ({ row }) => <DataTableSelectCell row={row} />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => <DataTableCurrencyCell amount={parseFloat(row.getValue("amount"))} />
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        actions={[
          {
            label: "Copy payment ID",
            onClick: () => navigator.clipboard.writeText(row.original.id),
          },
          {
            label: "View customer",
            onClick: () => { },
          },
          {
            label: "View payment details",
            onClick: () => { },
          },
        ]}
      />
    ),
  },
]