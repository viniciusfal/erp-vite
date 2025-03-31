import { api } from '@/lib/axios'


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
  details: string | null
  method: string
  nf: string | null
  account: string
  due_date: Date
  status: string
  Installment: Number
  TotalInstallments: Number
  SupplierID: string
}

export async function getLowByThird() {
  const response = await api.get<GetTransactionResponse[]>(`/transaction/byDate/low/lastThird`)

  return response.data 
}