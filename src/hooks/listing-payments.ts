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
  details?: string | null 
  method: string
  nf: string | null
  account: string
}

const ITEMS_PER_PAGE = 4

export function useListingPayments(
  currentPage: number,
  valuePaymentFilter: string,
) {
  const { data: transactions, isLoading } = useQuery<Transactions[]>({
    queryKey: ['transactionsByDate'],
    queryFn: getTransactions,
  })

  if (isLoading) {
    return { paymentTransactions: [], totalPages: 0 } // ou retornar algum estado de carregamento
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const filteredPayments = transactions?.filter(
    (t) => t.scheduling === true && t.type === 'saida',
  )

  const finalFilteredPayments = filteredPayments?.filter((payment) => {
    return valuePaymentFilter === 'paid'
      ? payment.pay === true
      : payment.pay === false
  })

  const sortedPayments = finalFilteredPayments?.sort((b, a) => {
    const dateA = a.payment_date ? new Date(a.payment_date) : new Date(0) // Se não tiver data, considera a data mais antiga
    const dateB = b.payment_date ? new Date(b.payment_date) : new Date(0)
    return dateB.getTime() - dateA.getTime() // Ordem decrescente (mais recente primeiro)
  })

  const totalPages = sortedPayments
    ? Math.ceil(sortedPayments.length / ITEMS_PER_PAGE)
    : 1

  const paymentTransactions = finalFilteredPayments?.slice(startIndex, endIndex)

  return { paymentTransactions, totalPages }
}
