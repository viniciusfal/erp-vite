import { getTransactions } from '@/api/get-transactions'
import { useQuery } from '@tanstack/react-query'

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
  pay: boolean
  details: string | null
  method: string
  nf: string | null
  account: string
}

export function useListingPaymentsNeverPag(valuePaymentFilter: string) {
  const { data: transactions, isLoading } = useQuery<Transactions[]>({
    queryKey: ['transactionsByDate'],
    queryFn: getTransactions,
  })

  if (isLoading) {
    return { paymentTransactions: [], totalPages: 0 } // ou retornar algum estado de carregamento
  }
  const ArrayList = Array.isArray(transactions) ? transactions : []
  const filteredPayments = ArrayList?.filter(
    (t) => t.scheduling === true && t.type === 'saida',
  )

  const finalFilteredPayments = filteredPayments?.filter((payment) => {
    return valuePaymentFilter === 'paid'
      ? payment.pay === true
      : payment.pay === false
  })

  return { finalFilteredPayments }
}
