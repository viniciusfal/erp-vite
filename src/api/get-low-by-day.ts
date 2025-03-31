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

export async function getLowByDay(status:string) {
  const params = status ? {params: {status}}: undefined
  const response = await api.get<GetTransactionResponse[]>(`/transaction/byDate/low/today`, params)


  const result =  response.data.map(t => ({
    ...t,
    payment_date: t.payment_date ? new Date(t.payment_date) : null,
    created_at: new Date(t.created_at),
    updated_at: new Date(t.updated_at),
    due_date: new Date(t.due_date)
  })) 

  console.log('Dados após conversão:', result)

  return result
}