import { Table } from "@tanstack/react-table"
import { Checkbox } from "../checkbox"

interface DataTableSelectHeaderProps<TData> {
  table: Table<TData>
}

export function DataTableSelectHeader<TData>({ table }: DataTableSelectHeaderProps<TData>) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  )
}