import { getTransactionDueByMonth } from '@/api/get-due-by-month'
import { getLowByMonth } from '@/api/get-low-by-month'
import { useQuery } from '@tanstack/react-query'

interface Transaction {
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
  pay: boolean
  details?: string | null
  method: string
  nf: string | null
  account: string
  status: string
  Installment: Number
  TotalInstallments: Number
  SupplierID: string
}

export function useLowByMonth(status: string) {
  const { data: currentTransactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['lowsByMonth'],
    queryFn: () => getLowByMonth(status),
  })


  return { currentTransactions, isLoading }
}
