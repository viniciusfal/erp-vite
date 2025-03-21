import { CardTransaction } from '@/components/card-transaction'
import { CalendarDateRangePicker } from '@/components/date-ranger-picker'
import { TableTransaction } from '@/components/table-transaction'
import { TopIncome } from '@/components/top-income'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from '@/components/ui/select'

import { Asterisk, File, MoveUpRight, Wrench, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { Link } from 'react-router-dom'
import { useListingPaymentsNeverPag } from '@/hooks/list-payments-never-pagination'
import { markPayment } from '@/api/mark-payment'
import { queryClient } from '@/lib/query-client'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { DropSettings } from '@/components/drop-settings'
import { removeTransaction } from '@/api/remove-transaction'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { TopOutcome } from '@/components/top-outcome'

const today = new Date()

const PaymentID = z.object({
  id: z.string().uuid(),
})

type paymentID = z.infer<typeof PaymentID>

export function Finances() {
  const [visible, setVisible] = useState<boolean>(false)
  const { finalFilteredPayments } = useListingPaymentsNeverPag('unpaid')

  const { mutateAsync: transaction } = useMutation({
    mutationFn: markPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactionsByDate'],
      })
    },
    onError: () => {
      toast.error('Erro ao tentar marcar como pago')
    },
  })

  const { mutateAsync: payment } = useMutation({
    mutationFn: removeTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactionsByDate'],
        exact: false, // Se quiser invalidar todas as consultas que começam com 'transactions'
      })
      toast.warning('Transação Deletada com sucesso.')
    },
    onError: () => {
      toast.error('Falha ao excluir transação.')
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
  }, [finalFilteredPayments, today])

  const handleMarkAsPaid = async (id: string) => {
    try {
      await transaction({ id })
    } catch (err) {
      console.log(err)
    }
  }

  const handleConfirmRemove = async (data: paymentID) => {
    try {
      await payment({
        id: data.id,
      })
      console.log(data)
    } catch (err) {
      toast.error('Erro ao remover agendamento' + err)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between">
        <Helmet titleTemplate="Financeiro" />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl text-slate-900 dark:text-foreground">
              Financeiro
            </h2>
            <span className="mb-4 text-sm text-muted-foreground">
              Registre as entradas e saidas financeiras.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDateRangePicker />

          <DropSettings />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <TableTransaction setVisible={setVisible} />
        <div className="flex h-1/3 gap-2">
          <div className="flex w-full flex-col justify-between rounded-2xl border border-muted bg-card px-4 py-5 shadow">
            <div className="flex items-center justify-between">
              <h2 className="flex items-baseline gap-0.5 text-lg font-medium dark:text-white">
                Ranking (Entradas)
                <Asterisk className="size-2.5 text-muted-foreground" />
              </h2>
              <Select>
                <SelectTrigger className="w-[100px] text-xs font-medium dark:text-white">
                  <SelectValue placeholder="diario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="diario" className="text-xs">
                      diario
                    </SelectItem>
                    <SelectItem value="semanal" className="text-xs">
                      semanal
                    </SelectItem>
                    <SelectItem value="mensal" className="text-xs">
                      mes
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <TopIncome />
          </div>
          <div className="flex w-full flex-col justify-between rounded-2xl border border-muted bg-card px-4 py-5 shadow">
            <div className="flex items-center justify-between">
              <h2 className="flex items-baseline gap-0.5 text-lg font-medium dark:text-white">
                Ranking (Saidas)
                <Asterisk className="size-2.5 text-muted-foreground" />
              </h2>
              <Select>
                <SelectTrigger className="w-[100px] text-xs font-medium dark:text-white">
                  <SelectValue placeholder="diario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="diario" className="text-xs">
                      diario
                    </SelectItem>
                    <SelectItem value="semanal" className="text-xs">
                      semanal
                    </SelectItem>
                    <SelectItem value="mensal" className="text-xs">
                      mes
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <TopOutcome />
          </div>

          <div className="flex w-full flex-col rounded-2xl border border-muted bg-card px-4 py-5 shadow">
            <div className="flex justify-between">
              <h2 className="text-lg font-medium dark:text-white">
                Proximos Agendamentos
              </h2>
              <Link to="/payments">
                <Button
                  variant="outline"
                  className="rounded-full p-3 text-muted-foreground hover:bg-primary hover:text-white"
                >
                  <MoveUpRight className="size-3" />
                </Button>
              </Link>
            </div>

            <div className="my-auto space-y-3">
              {filteredPayments &&
                filteredPayments.length > 0 &&
                filteredPayments.map((payment) => (
                  <Card className="bg-muted" key={payment.transaction_id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-medium">
                          {payment.title}
                        </CardTitle>
                        <div className="flex items-center gap-1">
                          <div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Link to="#">
                                    <Button
                                      variant="outline"
                                      className="rounded-full"
                                    >
                                      <File className="size-3 text-muted-foreground" />
                                    </Button>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Ver Anexo</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button
                                    variant="outline"
                                    className="rounded-full"
                                  >
                                    <Wrench className="size-3 text-muted-foreground" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Editar</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="">
                                  <AlertDialog>
                                    <AlertDialogTrigger>
                                      <Button
                                        className="rounded-full bg-red-400 text-white hover:bg-red-300 hover:text-white"
                                        variant="outline"
                                      >
                                        <X className="size-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="dark:text-foreground">
                                          Tem certeza que deseja excluir esse
                                          agendamento?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Ao excluir esse agendamento, você
                                          consequentemente excluirá essa
                                          transação, não podendo mais acessa-la.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter className="dark:text-foreground">
                                        <AlertDialogCancel>
                                          Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleConfirmRemove({
                                              id: payment.transaction_id,
                                            })
                                          }
                                        >
                                          Excluir
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Deletar</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                      <CardDescription>{payment.value}</CardDescription>
                    </CardHeader>
                    <CardContent className="-mt-4 flex items-end justify-between">
                      <span className="text-sm text-muted-foreground">
                        Vencimento:
                        {payment.payment_date &&
                          formatDate(payment.payment_date)}
                      </span>

                      <Button
                        onClick={() => handleMarkAsPaid(payment.transaction_id)}
                        className="bg-gradient-to-tr from-emerald-700 to-emerald-500 text-xs text-white hover:from-emerald-600 hover:to-emerald-500/90"
                      >
                        Marcar como Pago
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>

      {visible && (
        <div className="z-1 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
          <CardTransaction setVisible={setVisible} />
        </div>
      )}
    </div>
  )
}
