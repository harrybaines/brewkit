import { Row } from "@tanstack/react-table"
import { Checkbox } from "../checkbox"

interface DataTableSelectCellProps<TData> {
  row: Row<TData>
}

export function DataTableSelectCell<TData>({ row }: DataTableSelectCellProps<TData>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  )
}