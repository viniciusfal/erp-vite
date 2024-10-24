import { useListingtransaction } from '@/hooks/listing-transactions'
import { ArrowRightLeft } from 'lucide-react'
import { format, isSameDay } from 'date-fns'

export function RecentSales() {
  const { currentTransactions } = useListingtransaction(3, 'full')

  const today = new Date()

  let filteredLastsActivities = currentTransactions
    ?.filter((t) => isSameDay(new Date(t.created_at), today))
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
    .slice(0, 10)

  return (
    <div className="space-y-8">
      {filteredLastsActivities?.map((transaction) => (
        <div className="flex items-center" key={transaction.transaction_id}>
          {transaction.type === 'saida' ? <ArrowRightLeft className='size-3 text-red-400' /> : <ArrowRightLeft className='size-3 text-green-400' />}

          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.title}</p>
            <p className="text-xs text-muted-foreground">{format(transaction.created_at, 'dd/MM/yyyy | HH:mm')}</p>
          </div>
          <div className={transaction.type == 'saida' ? "ml-auto font-medium text-red-400" : "ml-auto font-medium text-green-400"}>{transaction.type === 'saida' ? new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(transaction.value) : new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(transaction.value)}</div>
        </div>
      ))}
    </div>
  )
}
