import { api } from "@/lib/axios";


interface SetMetaRequest {
  id: string
  month: string
  metaValue: number
}

export async function setUpdatedMeta(data: SetMetaRequest) {
  const response = await api.patch(`/meta/${data.id}`, data)

  return response.data
}