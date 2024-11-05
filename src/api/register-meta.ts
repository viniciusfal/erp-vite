import { api } from "@/lib/axios";

interface MetaRequest {
  metaValue: number
}

export async function registerMeta(data: MetaRequest ){
  await api.post('/meta', data )
}