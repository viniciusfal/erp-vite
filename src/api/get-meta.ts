import { api } from "@/lib/axios";

interface GetMetaResponse {
  id: string
  month: string
  metaValue: number
}

export async function getMetaByMonth(month: string) {
  const response = await api.get<GetMetaResponse>(`/meta/${month}` )

  return response.data
}