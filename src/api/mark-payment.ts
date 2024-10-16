import { api } from '@/lib/axios'

interface idTransaction {
  id: string
}
export async function markPayment({ id }: idTransaction) {
  await api.patch(`/transaction/${id}`)
}
