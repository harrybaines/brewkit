import { columns } from "@/app/tables/columns"
import { Payment } from "@/app/tables/types"
import { DataTable } from "@/components/ui/data-table/data-table"
import { PageHeader } from "@/components/ui/page-header"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52g",
      amount: 200,
      status: "processing",
      email: "n@example.com",
    },
    {
      id: "728ed52h",
      amount: 300,
      status: "success",
      email: "o@example.com",
    },
    {
      id: "728ed52i",
      amount: 400,
      status: "success",
      email: "p@example.com",
    },
    {
      id: "728ed52j",
      amount: 500,
      status: "pending",
      email: "q@example.com",
    },
    {
      id: "728ed52k",
      amount: 600,
      status: "processing",
      email: "r@example.com",
    },
  ]
}

export default async function TablesPage() {
  const data = await getData()

  return (
    <div>
      <PageHeader
        title="Tables"
        description="An example data table for viewing data."
      />
      <DataTable {...{ columns, data }} />
    </div>
  )
}
