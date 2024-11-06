import { getMetaByMonth } from "@/api/get-meta"
import { useQuery } from "@tanstack/react-query"

interface Meta {
  id: string
  month: string
  metaValue: number
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function useListMeta() {
  const currentDate = new Date();
  const currentMonthName = months[currentDate.getMonth()];

  const {data: mounthMeta} = useQuery<Meta>({
    queryKey: ['getMeta'],
    queryFn: () => getMetaByMonth(currentMonthName)
  })

  return {mounthMeta}

}