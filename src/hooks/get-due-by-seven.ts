import { getTransactionDueByMonth } from '@/api/get-due-by-month'
import { getDueBySevenDays } from '@/api/get-due-by-seven-days'
import { getDueByToday } from '@/api/get-due-by-today'
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

export function useDueBySeven() {
  const { data: currentTransactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactionsBySeven'],
    queryFn: getDueBySevenDays,
  })


  return { currentTransactions, isLoading }
}
