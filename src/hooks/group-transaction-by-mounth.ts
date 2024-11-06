import { format, parseISO } from "date-fns"
import { useListingtransaction } from "./listing-transactions";

interface Transaction {
  transaction_id: string;
  title: string;
  value: number;
  type: string; // "entrada" ou "saída"
  category: string;
  scheduling: boolean;
  annex: string | null;
  payment_date: Date | null;
  created_at: Date;
  updated_at: Date;
  pay?: boolean;
}

export function useGroupTransactionByMonth() {
  const { currentTransactions } = useListingtransaction('full')

  const result = currentTransactions?.reduce<{
    transactions: Record<string, Transaction[]>;
    monthlyTotals: Record<string, number>;
  }>((acc, transaction) => {
    const date = transaction.payment_date && parseISO(transaction.payment_date.toString());

    if (!date || isNaN(date.getTime())) {
      return acc; // Ignora se a data não for válida
    }

    const monthYear = format(date, 'MM/yyyy');

    if (!acc.transactions[monthYear]) {
      acc.transactions[monthYear] = [];
      acc.monthlyTotals[monthYear] = 0; // Inicializa o total de entradas para o mês
    }

    acc.transactions[monthYear].push(transaction); // Adiciona a transação ao mês correspondente

    if (transaction.type === "entrada") {
      acc.monthlyTotals[monthYear] += transaction.value; // Soma o valor se for uma entrada
    }

    return acc;
  }, { transactions: {}, monthlyTotals: {} });

  return {
    transactions: result?.transactions,
    monthlyTotals: result?.monthlyTotals,
  };
}
