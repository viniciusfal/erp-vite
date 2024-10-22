import { getTransactionsByDate } from "@/api/get-transactions-by-date";
import { queryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";


export function useListingtransactionByDate() {
  const { mutateAsync: transactionsByDate } = useMutation({
    mutationFn: getTransactionsByDate,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactionByDate']
      })
    }
  })

  return { transactionsByDate }
}