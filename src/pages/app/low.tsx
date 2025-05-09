import { CardTransaction } from '@/components/card-transaction'
import { TableTransaction } from '@/components/table-transaction'
import { TopIncome, TopOutcome } from '@/components/top-income-outcome'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel } from '@/components/ui/select'
import { Asterisk, File, MoveUpRight, Wrench, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'
import { useListingPaymentsNeverPag } from '@/hooks/list-payments-never-pagination'
import { markPayment, removeTransaction } from '@/api'
import { queryClient } from '@/lib/query-client'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DropSettings } from '@/components/drop-settings'
import { z } from 'zod'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { getTransactionsByFilter } from '@/api/get-transactions-by-filter'

const today = new Date()

const PaymentID = z.object({
  id: z.string().uuid(),
})

type paymentID = z.infer<typeof PaymentID>

type FilterType = 'day' | 'month' | 'seven' | 'third'

export function LowByDue() {
  const [visible, setVisible] = useState<boolean>(false)
  const [filtering, setFiltering] = useState<FilterType>('day')
  const { finalFilteredPayments } = useListingPaymentsNeverPag('unpaid')

  // Único hook para buscar transações baseado no filtro
  const { data: filteredTransactions } = useQuery({
    queryKey: ['transactionsByDate', filtering],
    queryFn: () => getTransactionsByFilter(filtering, 'pago'),
    staleTime: 1000 * 60 * 5 // 5 minutos de cache
  })

  const { mutateAsync: markAsPaid } = useMutation({
    mutationFn: markPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactionsByDate'],
      })
      toast.success('Pagamento marcado com sucesso')
    },
    onError: () => {
      toast.error('Erro ao tentar marcar como pago')
    },
  })

  const { mutateAsync: removePayment } = useMutation({
    mutationFn: removeTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactionsByDate'],
      })
      toast.warning('Transação deletada com sucesso')
    },
    onError: () => {
      toast.error('Falha ao excluir transação')
    },
  })

  const formatDate = useCallback((dateString: Date) => {
    const date = new Date(dateString)
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
  }, [])

  const filteredPayments = useMemo(() => {
    return finalFilteredPayments
      ?.filter((p) => !p.pay && p.payment_date)
      .filter((p) => p.payment_date && new Date(p.payment_date) >= today)
      .sort((a, b) => {
        const dateA = a.payment_date ? new Date(a.payment_date) : new Date(0)
        const dateB = b.payment_date ? new Date(b.payment_date) : new Date(0)
        return dateA.getTime() - dateB.getTime()
      })
      .slice(0, 2)
  }, [finalFilteredPayments])

  const handleMarkAsPaid = async (id: string) => {
    try {
      await markAsPaid({ id })
    } catch (err) {
      console.error(err)
    }
  }

  const handleConfirmRemove = async (data: paymentID) => {
    try {
      await removePayment({ id: data.id })
    } catch (err) {
      toast.error('Erro ao remover agendamento')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between">
        <Helmet titleTemplate="Contas a Pagar" />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl text-slate-900 dark:text-foreground font-semibold">
              Baixa de títulos (A Pagar)
            </h2>
            <span className="mb-4 text-sm text-muted-foreground">
              Visualize as baixas e dê baixa nos títulos com status aberto
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select onValueChange={(value) => setFiltering(value as FilterType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filtrar</SelectLabel>
                <SelectItem value="day">Do dia</SelectItem>
                <SelectItem value="month">Do mês</SelectItem>
                <SelectItem value="seven">Últimos 7 dias</SelectItem>
                <SelectItem value="third">Últimos 30</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DropSettings />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <TableTransaction
          setVisible={setVisible}
          transactions={filteredTransactions || []}
        />

        <DashboardSections
          filteredPayments={filteredPayments}
          formatDate={formatDate}
          handleMarkAsPaid={handleMarkAsPaid}
          handleConfirmRemove={handleConfirmRemove}
        />
      </div>

      {visible && (
        <div className="z-1 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
          <CardTransaction setVisible={setVisible} />
        </div>
      )}
    </div>
  )
}

// Componente auxiliar para as seções do dashboard
function DashboardSections({ filteredPayments, formatDate, handleMarkAsPaid, handleConfirmRemove }: {
  filteredPayments: any[] | undefined,
  formatDate: (date: Date) => string,
  handleMarkAsPaid: (id: string) => void,
  handleConfirmRemove: (data: paymentID) => void
}) {
  return (
    <div className="flex h-1/3 gap-2">
      <DashboardCard title="Ranking (Entradas)">
        <TopIncome />
      </DashboardCard>

      <DashboardCard title="Ranking (Saídas)">
        <TopOutcome />
      </DashboardCard>

      <UpcomingPayments
        payments={filteredPayments}
        formatDate={formatDate}
        handleMarkAsPaid={handleMarkAsPaid}
        handleConfirmRemove={handleConfirmRemove}
      />
    </div>
  )
}

// Componente auxiliar para cartões do dashboard
function DashboardCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col justify-between rounded-2xl border border-muted bg-card px-4 py-5 shadow">
      <div className="flex items-center justify-between">
        <h2 className="flex items-baseline gap-0.5 text-lg font-medium dark:text-white">
          {title}
          <Asterisk className="size-2.5 text-muted-foreground" />
        </h2>
        <Select>
          <SelectTrigger className="w-[100px] text-xs font-medium dark:text-white">
            <SelectValue placeholder="diário" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="diario" className="text-xs">diário</SelectItem>
              <SelectItem value="semanal" className="text-xs">semanal</SelectItem>
              <SelectItem value="mensal" className="text-xs">mensal</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {children}
    </div>
  )
}

// Componente auxiliar para pagamentos futuros
function UpcomingPayments({ payments, formatDate, handleMarkAsPaid, handleConfirmRemove }: {
  payments: any[] | undefined,
  formatDate: (date: Date) => string,
  handleMarkAsPaid: (id: string) => void,
  handleConfirmRemove: (data: paymentID) => void
}) {
  return (
    <div className="flex w-full flex-col rounded-2xl border border-muted bg-card px-4 py-5 shadow">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium dark:text-white">
          Próximos Agendamentos
        </h2>
        <Link to="/payments">
          <Button variant="outline" className="rounded-full p-3 text-muted-foreground hover:bg-primary hover:text-white">
            <MoveUpRight className="size-3" />
          </Button>
        </Link>
      </div>

      <div className="my-auto space-y-3">
        {payments?.map((payment) => (
          <PaymentCard
            key={payment.transaction_id}
            payment={payment}
            formatDate={formatDate}
            handleMarkAsPaid={handleMarkAsPaid}
            handleConfirmRemove={handleConfirmRemove}
          />
        ))}
      </div>
    </div>
  )
}

// Componente auxiliar para cartão de pagamento
function PaymentCard({ payment, formatDate, handleMarkAsPaid, handleConfirmRemove }: {
  payment: any,
  formatDate: (date: Date) => string,
  handleMarkAsPaid: (id: string) => void,
  handleConfirmRemove: (data: paymentID) => void
}) {
  return (
    <Card className="bg-muted">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-medium">{payment.title}</CardTitle>
          <PaymentActions
            transactionId={payment.transaction_id}
            handleConfirmRemove={handleConfirmRemove}
          />
        </div>
        <CardDescription>{payment.value}</CardDescription>
      </CardHeader>
      <CardContent className="-mt-4 flex items-end justify-between">
        <span className="text-sm text-muted-foreground">
          Vencimento: {payment.payment_date && formatDate(payment.payment_date)}
        </span>
        <Button
          onClick={() => handleMarkAsPaid(payment.transaction_id)}
          className="bg-gradient-to-tr from-emerald-700 to-emerald-500 text-xs text-white hover:from-emerald-600 hover:to-emerald-500/90"
        >
          Marcar como Pago
        </Button>
      </CardContent>
    </Card>
  )
}

// Componente auxiliar para ações de pagamento
function PaymentActions({ transactionId, handleConfirmRemove }: {
  transactionId: string,
  handleConfirmRemove: (data: paymentID) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Link to="#">
              <Button variant="outline" className="rounded-full">
                <File className="size-3 text-muted-foreground" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent><p>Ver Anexo</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" className="rounded-full">
              <Wrench className="size-3 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Editar</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DeletePaymentButton
        transactionId={transactionId}
        handleConfirmRemove={handleConfirmRemove}
      />
    </div>
  )
}

// Componente auxiliar para botão de deletar
function DeletePaymentButton({ transactionId, handleConfirmRemove }: {
  transactionId: string,
  handleConfirmRemove: (data: paymentID) => void
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button className="rounded-full bg-red-400 text-white hover:bg-red-300 hover:text-white" variant="outline">
                <X className="size-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="dark:text-foreground">
                  Tem certeza que deseja excluir esse agendamento?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Ao excluir esse agendamento, você consequentemente excluirá essa transação.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="dark:text-foreground">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleConfirmRemove({ id: transactionId })}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipTrigger>
        <TooltipContent><p>Deletar</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}