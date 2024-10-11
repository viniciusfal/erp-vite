import { api } from '@/lib/axios'

export interface TransactionBody {
  title: string
  value: number
  type: string
  category: string
  scheduling: boolean
  annex: string | null
  payment_date: Date | null
}

export async function registerTransaction({ title, value, type, category, scheduling, annex, payment_date }: TransactionBody) {
  await api.post('/transaction/', { title, value, type, category, scheduling, annex, payment_date })
}