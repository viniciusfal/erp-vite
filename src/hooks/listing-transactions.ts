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

export function useListingtransaction(inputType: string) {
  const { data: transactions, isLoading } = useQuery<Transactions[]>({
    queryKey: ['transactions'],
    queryFn: getTransactions
  })


  const currentTransactions = inputType === 'full' ? transactions
    : transactions?.filter(t => t.type === inputType)


  return { currentTransactions , isLoading}
}