import { api } from '@/lib/axios'

interface idTransaction {
  id: string
}

export async function removeTransaction({ id }: idTransaction) {
  await api.delete(`/transaction/${id}`)
}
