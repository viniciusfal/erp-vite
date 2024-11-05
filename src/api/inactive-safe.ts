import { api } from "@/lib/axios";

interface SetSafeRequest {
  id: string
  active: boolean
}

export async function inactiveSafe(data: SetSafeRequest) {
  const response = await api.patch(`/safe/${data.id}`, data)

  return response.data
}