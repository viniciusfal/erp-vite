import { format, parseISO } from "date-fns"
import { useListingtransaction } from "./listing-transactions";

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
  pay?: boolean;
}

export function useGroupTransactionByMonth() {
  const { currentTransactions } = useListingtransaction(1, 'full')

  const transactions = currentTransactions?.reduce<Record<string, Transaction[]>>((acc, transaction) => {
    const date = transaction.payment_date && parseISO(transaction.payment_date.toString())

    if (!date || isNaN(date.getTime())) {
      return acc // Ignora se a data não for válida
    }

    const monthYear = format(date, 'MM/yyyy')

    if (!acc[monthYear]) {
      acc[monthYear] = []
    }

    acc[monthYear].push(transaction) // Adiciona a transação ao mês correspondente
    return acc
  }, {})

  return { transactions }
}
