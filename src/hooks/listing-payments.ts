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
  pay: boolean
}

const ITEMS_PER_PAGE = 4

export function useListingPayments(currentPage: number, valuePaymentFilter: string) {
  const { data: transactions, isLoading } = useQuery<Transactions[]>({
    queryKey: ['transactionsByDate'],
    queryFn: getTransactions
  })

  if (isLoading) {
    return { paymentTransactions: [], totalPages: 0 }; // ou retornar algum estado de carregamento
  }


  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const filteredPayments = transactions?.filter((t) => t.scheduling === true && t.type === 'saida')

  const finalFilteredPayments = filteredPayments?.filter((payment) => {
    return valuePaymentFilter === 'paid' ? payment.pay === true : payment.pay === false
  })

  const totalPages = filteredPayments ? Math.ceil(filteredPayments.length / ITEMS_PER_PAGE) : 1

  const paymentTransactions = finalFilteredPayments?.slice(startIndex, endIndex)

  return { paymentTransactions, totalPages }
}