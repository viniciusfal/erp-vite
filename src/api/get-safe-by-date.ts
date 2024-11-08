import { api } from "@/lib/axios";

interface GetSafeRequest {
  startDate: string
  endDate: string
}

interface Safe {
  id: string
  send_date: string
  send_amount: number
  active: boolean
}

export async function getSafesbyDate({ startDate, endDate }: GetSafeRequest): Promise<Safe[]> {
  const response = await api.get<Safe[]>(`/safe/${startDate}/${endDate}`)

  return response.data
}