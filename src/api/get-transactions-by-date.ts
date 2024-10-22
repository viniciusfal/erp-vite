import { api } from '@/lib/axios'

interface GetTransactionRequest {
  start_date: Date
  end_date: Date
}

interface GetTransactionResponse {
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


export async function getTransactionsByDate(data: GetTransactionRequest) {
  const response = await api.post<GetTransactionResponse[]>('/transaction/by-date', data)

  return response.data
}