import { useQuery } from "@tanstack/react-query"
import { getSafesbyDate } from "@/api/get-safe-by-date"
import { format } from "date-fns"

interface Safe {
  id: string
  send_date: string
  send_amount: number
  active: boolean
}

export function useListingSafesByDate(startDate: Date | null, endDate: Date | null) {
  const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : null
  const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : null
  console.log("Buscando safes entre:", startDate, endDate); // Debug


  const query = useQuery<Safe[]>({
    queryKey: ['safesByDate', { start_date: formattedStartDate, end_date: formattedEndDate }],
    queryFn: () => getSafesbyDate({ startDate: formattedStartDate!, endDate: formattedEndDate! }),
    enabled: !!startDate && !!endDate, // Habilita a chamada somente se as datas estiverem definidas
    initialData: [], // Valor padrão para evitar erros
  })

  return query
}



