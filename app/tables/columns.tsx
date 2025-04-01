"use client"

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

import { DataTableCurrencyCell } from "@/components/ui/data-table/data-table-currency-cell"
import { DataTableRowActions } from "@/components/ui/data-table/data-table-row-actions"
import { DataTableSelectCell } from "@/components/ui/data-table/data-table-select-cell"
import { DataTableSelectHeader } from "@/components/ui/data-table/data-table-select-header"
import { defineMeta, filterFn } from "@/lib/filters"
import { ColumnDef } from "@tanstack/react-table"
import { CircleCheckIcon, CircleDotDashedIcon, CircleXIcon, DollarSignIcon, MailIcon } from "lucide-react"
import { type Payment } from "./types"

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => <DataTableSelectHeader table={table} />,
    cell: ({ row }) => <DataTableSelectCell row={row} />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    filterFn: filterFn('text'),
    meta: defineMeta('email', {
      displayName: 'Email',
      type: 'text',
      icon: MailIcon,
    }),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: filterFn('option'),
    meta: defineMeta('status', {
      displayName: 'Status',
      type: 'option',
      icon: CircleDotDashedIcon,
      options: [{
        label: 'Pending',
        value: 'pending',
        icon: CircleDotDashedIcon,
      }, {
        label: 'Processing',
        value: 'processing',
        icon: CircleDotDashedIcon,
      }, {
        label: 'Success',
        value: 'success',
        icon: CircleCheckIcon,
      }, {
        label: 'Failed',
        value: 'failed',
        icon: CircleXIcon,
      }],
    }),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    filterFn: filterFn('number'),
    meta: defineMeta('amount', {
      displayName: 'Amount',
      type: 'number',
      icon: DollarSignIcon,
    }),
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