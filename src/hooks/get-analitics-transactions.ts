import { getAnalysesTransactions } from "@/api/get-analyses-transactions";
import { useQuery } from "@tanstack/react-query";


export function useGetAnaliticsTransactions() {
  const {data: totalBalanceTransactions, isLoading, error} = useQuery({
    queryKey: ['analiticsEntries'],
    queryFn:  getAnalysesTransactions,
  });
  
  return {
    totalBalanceTransactions,
    isLoading,
    error
  }
}