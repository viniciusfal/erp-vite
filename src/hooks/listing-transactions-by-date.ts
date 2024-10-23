import { getTransactionsByDate } from "@/api/get-transactions-by-date";
import { useQuery } from "@tanstack/react-query";

interface Transaction {
  transaction_id: string;
  title: string;
  value: number;
  type: string;
  category: string;
  scheduling: boolean;
  annex: string | null;
  payment_date: Date | null;
  created_at: Date;
  updated_at: Date;
  pay: boolean;
}

interface GetTransactionRequest {
  start_date: string;
  end_date: string;
}

const ITEMS_PER_PAGE = 10;

export function useListingtransactionByDate(
  startDate: Date,
  endDate: Date,
  currentPage: number,
  inputType: string
) {
  // Adicione a tipagem ao parâmetro 'date'
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda
    const day = String(date.getDate()).padStart(2, '0'); // Adiciona zero à esquerda
    return `${year}-${month}-${day}`; // Formato "YYYY-MM-DD"
  }

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const { data: transactionsByDate } = useQuery<Transaction[]>({
    queryKey: ['transactionsByDate', { start_date: formattedStartDate, end_date: formattedEndDate }],
    queryFn: () => getTransactionsByDate({ start_date: formattedStartDate, end_date: formattedEndDate }),
    enabled: !!formattedStartDate && !!formattedEndDate, // Garante que a query só execute se as datas estiverem disponíveis
  });

  const totalPages = transactionsByDate ? Math.ceil(transactionsByDate.length / ITEMS_PER_PAGE) : 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const filteredForType =
    inputType === 'full' || !inputType
      ? transactionsByDate
      : transactionsByDate?.filter((t) => t.type === inputType);

  const currentTransactions = filteredForType?.slice(startIndex, endIndex);

  return { currentTransactions, totalPages };
}
