import { getLowByDay } from '@/api/get-low-by-day'
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

export function useLowByDay(status: string) {
  const { data: currentTransactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['lowsByDay'],
    queryFn: () => getLowByDay(status),
  })


  return { currentTransactions, isLoading }
}
