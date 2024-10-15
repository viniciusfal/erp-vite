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

const ITEMS_PER_PAGE = 4

export function listingPayments(currentPage: number) {
  const { data: transactions, isLoading } = useQuery<Transactions[]>({
    queryKey: ['transactions'],
    queryFn: getTransactions
  })

  if (isLoading) {
    return { paymentTransactions: [], totalPages: 0 }; // ou retornar algum estado de carregamento
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const filteredPayments = transactions?.filter((t) => t.scheduling === true && t.type === 'entrada')

  const totalPages = filteredPayments ? Math.ceil(filteredPayments.length / ITEMS_PER_PAGE) : 1

  const paymentTransactions = filteredPayments?.slice(startIndex, endIndex)

  return { paymentTransactions, totalPages }
}