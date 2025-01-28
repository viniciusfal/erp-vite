import { api } from "@/lib/axios";

interface SafeBody {
  send_date: Date
  send_amount: number
  code?: string
  resp?: string
  details?: string
}

export async function registerSafe({ send_date, send_amount, resp, code, details }: SafeBody) {
  await api.post('/safe', { send_date, send_amount, resp, code, details })
}