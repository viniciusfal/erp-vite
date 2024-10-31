import { api } from "@/lib/axios";

interface SafeBody {
  send_date: Date
  send_amount: number
}

export async function registerSafe({ send_date, send_amount }: SafeBody) {
  await api.post('/safe', { send_date, send_amount })
}