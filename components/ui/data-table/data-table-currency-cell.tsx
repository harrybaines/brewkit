interface DataTableCurrencyCellProps {
  amount: number
  currency?: string
  locale?: string
}

export function DataTableCurrencyCell({
  amount,
  currency = "USD",
  locale = "en-US"
}: DataTableCurrencyCellProps) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)

  return <div className="font-medium">{formatted}</div>
}