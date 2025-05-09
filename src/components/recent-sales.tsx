import { useListingtransaction } from '@/hooks/listing-transactions'
import { ArrowRightLeft } from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { CardInfoTransaction } from './card-Info-transaction'
import React, { useState, useMemo } from 'react'

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
  details?: string | null
  method: string
  nf: string | null
  account: string
}

const currencyFormat = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormat = 'dd/MM/yyyy | HH:mm'

export function RecentSales() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionProps | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { currentTransactions } = useListingtransaction('full')

  const today = new Date()
  const transactionsArray = Array.isArray(currentTransactions)
    ? currentTransactions
    : []

  // Use useMemo to avoid unnecessary recalculations of filtered transactions
  const filteredLastsActivities = useMemo(() => {
    return transactionsArray
      .filter((t) => isSameDay(new Date(t.created_at), today))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 10)
  }, [transactionsArray, today])

  const renderTransactionTypeButton = (transaction: TransactionProps) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`rounded-full p-2.5 ${transaction.type === 'saida' ? 'text-red-400' : 'text-emerald-400'} bg-muted ${transaction.type === 'saida' ? 'hover:bg-red-400' : 'hover:bg-emerald-400'} transition-colors hover:text-muted`}
          onClick={() => setSelectedTransaction(transaction)} // Atualiza a transação ao clicar
        >
          <ArrowRightLeft className="size-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="dark:text-foreground">
            Detalhes da Transação
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a transação selecionada.
          </DialogDescription>
        </DialogHeader>
        <CardInfoTransaction transaction={selectedTransaction} />
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-8">
      {filteredLastsActivities.map((transaction) => (
        <div className="flex items-center" key={transaction.transaction_id}>
          {renderTransactionTypeButton(transaction)}

          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(transaction.created_at, dateFormat)}
            </p>
          </div>
          <div className="ml-auto font-medium text-muted-foreground">
            {currencyFormat.format(transaction.value)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default React.memo(RecentSales)
