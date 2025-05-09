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

export async function getLowBySeven(status: string) {
  const params = status ? {params: {status}} : undefined
  const response = await api.get<GetTransactionResponse[]>(`/transaction/byDate/low/lastSeven`, params)

  return response.data.map(transaction => ({
    ...transaction,
    payment_date: transaction.payment_date ? new Date(transaction.payment_date) : null,
    created_at: new Date(transaction.created_at),
    updated_at: new Date(transaction.updated_at),
    due_date: new Date(transaction.due_date),
  }))
}