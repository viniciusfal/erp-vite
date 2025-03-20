import { CalendarArrowUp, Download, File, Wrench, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import pdftest from '@/assets/pix.pdf'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Link } from 'react-router-dom'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '../../components/ui/pagination'
import { useMemo, useState } from 'react'

import { useListingPayments } from '@/hooks/listing-payments'
import { useMutation } from '@tanstack/react-query'
import { markPayment } from '@/api/mark-payment'
import { queryClient } from '@/lib/query-client'
import { toast } from 'sonner'
import { Helmet } from 'react-helmet-async'
import { DropSettings } from '@/components/drop-settings'
import { PdfViewer } from '@/components/pdfviewer'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { removeTransaction } from '@/api/remove-transaction'
import { z } from 'zod'

const PaymentID = z.object({
  id: z.string().uuid(),
})

type paymentId = z.infer<typeof PaymentID>

export function Payments() {
  const [loadData, setLoadData] = useState(false)
  const [valuePaymentFilter, setValuePaymentFilter] = useState('unpaid')
  const [currentPage, setCurrentPage] = useState(1)

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
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString)

    // Extraindo dia, mês e ano da data
    const day = String(date.getUTCDate()).padStart(2, '0') // Garantir que o dia tenha dois dígitos
    const month = String(date.getUTCMonth() + 1).padStart(2, '0') // O mês começa de 0, então somamos 1
    const year = date.getUTCFullYear() // Pega o ano

    return `${day}/${month}/${year}` // Retorna a data no formato "dd/MM/yyyy"
  }

  const handleMarkAsPaid = async (id: string) => {
    try {
      await transaction({ id })

      toast.success('A transação foi marcada como paga com sucesso!')
    } catch (err) {
      console.log(err)
    }
  }

  const allPayments = useListingPayments(currentPage, valuePaymentFilter)
  const currentPayments = allPayments.paymentTransactions
  const totalPages = allPayments.totalPages

  const filteredPaids = currentPayments?.filter((payments) =>
    valuePaymentFilter === 'paid'
      ? payments.pay === true
      : payments.pay === false,
  )

  const handleConfirmRemove = async (data: paymentId) => {
    try {
      await payment({
        id: data.id,
      })
      console.log(data)
    } catch (err) {
      toast.error('Erro ao remover agendamento' + err)
    }
  }
  const pdfViewerMemo = useMemo(
    () => <PdfViewer pdfUrl={pdftest} pageNumber={1} />,
    [pdftest],
  )

  return (
    <div className="h-full">
      {!loadData ? (
        <div className="mt-12 flex items-center justify-center">
          <Button
            className="w-1/4 dark:text-foreground"
            onClick={() => setLoadData(true)}
          >
            Ver agendamentos
          </Button>
        </div>
      ) : (
        <div className="">
          <div className="flex items-center justify-between">
            <Helmet titleTemplate="Financeiro" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl text-slate-900 dark:text-foreground">
                  Agendamentos
                </h2>
                <span className="mb-4 text-sm text-muted-foreground">
                  Gerencie seus agendamentos financeiros.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={'outline'}
                className="flex items-center gap-2 rounded-full text-muted-foreground"
              >
                <Download className="size-5" />
                Exportar Dados
              </Button>

              <DropSettings />
            </div>
          </div>

          <Card className="relative h-[1000px] w-full max-lg:w-[80vw]">
            <CardHeader className="">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-medium">
                  <div className="flex items-center gap-0.5">
                    <CalendarArrowUp className="size-5 text-muted-foreground" />
                    Historico de Agendamentos
                  </div>
                </CardTitle>
                <div className="flex gap-2">
                  <Select onValueChange={setValuePaymentFilter}>
                    <SelectTrigger
                      className="w-[180px]"
                      value={valuePaymentFilter}
                    >
                      <SelectValue placeholder="Escolha..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="unpaid">Não pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <div className="flex">
              <CardContent className="w-1/2">
                {filteredPaids?.map((t) => (
                  <Card
                    className="mt-2 bg-muted"
                    key={t.transaction_id}
                    style={
                      t.pay
                        ? { borderColor: '#4ade80' }
                        : { borderColor: '#f87171' }
                    }
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium">
                          {t.title}
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
                                              id: t.transaction_id,
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
                      <CardDescription className="text-base">
                        {new Intl.NumberFormat('pt-br', {
                          currency: 'BRL',
                          style: 'currency',
                        }).format(t.value)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="-mt-4 flex items-end justify-between">
                      <div className="sp flex w-full justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Detalhamento: {t.details}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Conta corrente: {t.account}
                          </p>

                          <span className="text-sm text-muted-foreground">
                            Vencimento:{' '}
                            {t.payment_date && formatDate(t.payment_date)}
                          </span>
                        </div>

                        <div className="mr-6 space-y-0.5">
                          <span className="text-sm text-muted-foreground">
                            {'NF:' + t.nf}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            Metodo: {t.method}
                          </p>
                        </div>

                        {t.pay === true && (
                          <span className="text-sm text-muted-foreground">
                            Pago dia: {new Date().toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <Button
                        disabled={t.pay}
                        variant="outline"
                        className={
                          !t.pay
                            ? 'bg-gradient-to-tr from-emerald-700 to-emerald-500 text-xs text-white hover:from-emerald-600 hover:to-emerald-500/90'
                            : 'hidden'
                        }
                        onClick={() => handleMarkAsPaid(t.transaction_id)}
                      >
                        Marcar como Pago
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
              <div className="w-1/2">{pdfViewerMemo}</div>
            </div>
            <CardFooter className="absolute bottom-0 right-0 mx-auto space-x-4">
              <Pagination className="">
                <PaginationContent className="space-x-1">
                  <PaginationItem>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <PaginationLink
                        key={index}
                        href="#"
                        className={`mx-0.5 rounded-full ${currentPage === index + 1 ? 'bg-gradient-to-tr from-slate-800 to-slate-950 text-white dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-foreground' : 'border bg-muted'}`}
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(index + 1)
                        }}
                      >
                        {index + 1}
                      </PaginationLink>
                    ))}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>

          <div></div>
        </div>
      )}
    </div>
  )
}
