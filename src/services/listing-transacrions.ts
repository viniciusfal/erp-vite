import { getTransactions } from "@/api/get-transactions";
import { useQuery } from "@tanstack/react-query";

export interface Transactions {
  transaction_id: string
  title: string
  value: number
  type: string
  category: string
  scheduling: boolean
  annex: string | null
  payment_date: Date | null
  created_at: Date
  updated_at: Date
}

const ITEMS_PER_PAGE = 10

export function listingtransaction(currentPage: number, inputType: string) {
  const { data: transactions } = useQuery<Transactions[]>({
    queryKey: ['transactions'],
    queryFn: getTransactions
  })

  const totalPages = transactions ? Math.ceil(transactions.length / ITEMS_PER_PAGE) : 1

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const filteredForType = inputType === 'full' ? transactions
    : transactions?.filter(t => t.type === inputType)

  const currentTransactions = filteredForType?.slice(startIndex, endIndex)


  return { currentTransactions, totalPages }
}