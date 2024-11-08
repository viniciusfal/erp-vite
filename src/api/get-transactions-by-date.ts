import { api } from '@/lib/axios'

interface GetTransactionRequest {
  start_date: string
  end_date: string
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

export async function getTransactionsByDate({ start_date, end_date }: GetTransactionRequest) {
  const response = await api.get<GetTransactionResponse[]>(`/transaction/byDate/${start_date}/${end_date}`)

  return response.data
}