import { getTransactionsByDate } from '@/api/get-transactions-by-date'
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
  method: string,
  nf: string | null,
  account: string
}

const ITEMS_PER_PAGE = 10

export function useListingTransactionByDate(
  startDate: Date,
  endDate: Date,
  currentPage: number,
  inputType: string,
) {
  // Função para formatar datas no padrão "YYYY-MM-DD"
  function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formattedStartDate = formatDate(startDate)
  const formattedEndDate = formatDate(endDate)

  const { data: transactionsByDate = [], isLoading } = useQuery<Transaction[]>({
    queryKey: [
      'transactionsByDate',
      { start_date: formattedStartDate, end_date: formattedEndDate },
    ],
    queryFn: async () => {
      const response = await getTransactionsByDate({
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      })
      return Array.isArray(response) ? response : [] // Garante que seja sempre um array
    },
    enabled: !!startDate && !!endDate, // Garante que a query só execute se as datas estiverem disponíveis
  })

  // Certifique-se de que `transactionsByDate` é um array antes de aplicar `filter`
  const filteredForType =
    inputType === 'full' || !inputType
      ? transactionsByDate
      : transactionsByDate.filter((t) => t.type === inputType)

  const totalPages = Math.ceil(filteredForType.length / ITEMS_PER_PAGE)

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE

  const currentTransactions = filteredForType.slice(startIndex, endIndex)

  return { currentTransactions, totalPages, isLoading }
}
