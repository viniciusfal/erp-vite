import { api } from "@/lib/axios";

export interface GetTransactionsResponse {
  transaction_id: string
  title: string
  value: number
  type: string
  category: string
  scheduling: boolean
  annex: string | null
  payment_date: Date | null
  created_at: Date
  updated_at: Date
  pay: boolean
}

export async function getTransactions() {
  const response = await api.get<GetTransactionsResponse[]>('/transaction/')

  return response.data
}