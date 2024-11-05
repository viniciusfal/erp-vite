import { api } from "@/lib/axios";

interface SetSafeRequest {
  id: string
  send_date: string
  send_amount: number
  active?: boolean 
}

export async function setSafe(data: SetSafeRequest) {
  const response = await api.put(`/safe/${data.id}`, data)

  return response.data
}