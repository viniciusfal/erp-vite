// src/api/get-transactions-by-filter.ts
import { api } from '@/lib/axios'

export interface Transaction {
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
  details?: string | null
  method: string
  nf: string | null
  account: string
  status: string
  Installment: Number
  TotalInstallments: Number
  SupplierID: string
}

type FilterType = 'day' | 'month' | 'seven' | 'third'

export async function getTransactionsByFilter(filter: FilterType, status?: string) {
  const params = {
    filter,
    status
  }

  const response = await api.get<Transaction[]>('/transaction/by-filter', { params })
  
  // Converte strings de data para objetos Date
  return response.data.map(t => ({
    ...t,
    payment_date: t.payment_date ? new Date(t.payment_date) : null,
    due_date: new Date(t.due_date)
  }))
}