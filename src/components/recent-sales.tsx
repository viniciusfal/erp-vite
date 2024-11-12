import { useListingtransaction } from '@/hooks/listing-transactions'
import { ArrowRightLeft } from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { CardInfoTransaction } from './card-Info-transaction'
import { useState } from 'react'

interface TransactionProps {
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
  pay?: boolean
}

export function RecentSales() {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionProps | null>(null);
  const [isOpen, setIsOpen] = useState(false)

  const { currentTransactions } = useListingtransaction('full')

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
          {transaction.type === 'saida' ?
            <div className=''>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full p-2.5 text-red-400 bg-muted hover:bg-red-400 hover:text-muted transition-colors"
                    onClick={() => setSelectedTransaction(transaction)} // Atualiza a transação ao clicar
                  >
                    <ArrowRightLeft className='size-3 ' />
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Detalhes da Transação</DialogTitle>
                    <DialogDescription>
                      Informações detalhadas sobre a transação selecionada.
                    </DialogDescription>
                  </DialogHeader>

                  <CardInfoTransaction transaction={selectedTransaction} />
                </DialogContent>
              </Dialog>
            </div> :
            <div className=''>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full p-2.5 text-emerald-500 bg-muted hover:bg-emerald-500  hover:text-muted transition-colors"
                    onClick={() => setSelectedTransaction(transaction)} // Atualiza a transação ao clicar
                  >
                    <ArrowRightLeft className='size-3 ' />
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Detalhes da Transação</DialogTitle>
                    <DialogDescription>
                      Informações detalhadas sobre a transação selecionada.
                    </DialogDescription>
                  </DialogHeader>

                  <CardInfoTransaction transaction={selectedTransaction} />
                </DialogContent>
              </Dialog>
            </div>
          }

          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.title}</p>
            <p className="text-xs text-muted-foreground">{format(transaction.created_at, 'dd/MM/yyyy | HH:mm')}</p>
          </div>
          <div className={transaction.type == 'saida' ? "ml-auto font-medium text-muted-foreground" :
            "ml-auto font-medium text-muted-foreground"}>{transaction.type === 'saida' ? "-" + new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(transaction.value) : new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(transaction.value)}</div>
        </div>
      ))
      }
    </div >
  )
}
