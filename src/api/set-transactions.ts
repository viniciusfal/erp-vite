import { api } from "@/lib/axios"

export interface setTransaction {
  id: string
  title: string
  value: number
  type: string
  category: string
  scheduling: boolean
  annex?: string | null
  payment_date: string | null
  created_at: Date
  updated_at: Date
  pay?: boolean
}

export async function setTransaction(data: setTransaction) {
  await api.put(`/transaction/${data.id}`, data)
}


