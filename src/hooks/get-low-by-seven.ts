import { getLowBySeven } from '@/api/get-low-by-seven'
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

export function useLowBySeven(status: string) {
  const { data: currentTransactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['lowsBySeven'],
    queryFn: () => getLowBySeven(status),
  })


  return { currentTransactions, isLoading }
}
