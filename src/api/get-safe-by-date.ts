import { api } from "@/lib/axios";

interface GetSafeRequest {
  startDate: string
  endDate: string
}

interface GetSafeResponse {
  id: string
  sen_date: Date
  send_amount: number
  active: boolean
}


export async function getSafesbyDate({ startDate, endDate }: GetSafeRequest) {
  const response = await api.get<GetSafeResponse[]>(`/safe/${startDate}/${endDate}`)

  return response.data
}