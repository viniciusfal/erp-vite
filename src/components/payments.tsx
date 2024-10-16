import { File, Wrench, X } from 'lucide-react'
import { CalendarDateRangePicker } from './date-ranger-picker'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Link } from 'react-router-dom'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from './ui/pagination'
import { useState, Dispatch } from 'react'

import { useListingPayments } from '@/hooks/listing-payments'
import { useMutation } from '@tanstack/react-query'
import { markPayment } from '@/api/mark-payment'
import { queryClient } from '@/lib/query-client'
import { toast } from 'sonner'

interface PaymentProps {
  setVisiblePayment: Dispatch<React.SetStateAction<boolean>>
}

export function Payments({ setVisiblePayment }: PaymentProps) {
  const [valuePaymentFilter, setValuePaymentFilter] = useState('unpaid')
  const [currentPage, setCurrentPage] = useState(1)

  const { mutateAsync: transaction } = useMutation({
    mutationFn: markPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactions'],
      })
    },
    onError: () => {
      toast.error('Erro ao tentar marcar como pago')
    },
  })

  async function handleMarkAsPaid(id: string) {
    try {
      await transaction({ id })
    } catch (err) {
      console.log(err)
    }
  }

  const allPayments = useListingPayments(currentPage)
  const currentPayments = allPayments.paymentTransactions
  const totalPages = allPayments.totalPages

  const filteredPaids = currentPayments?.filter((payments) =>
    valuePaymentFilter === 'paid'
      ? payments.pay === true
      : payments.pay === false,
  )

  return (
    <div className="">
      <Card className="relative my-8 h-[90vh] w-[50vw] max-lg:w-[80vw]">
        <CardHeader className="">
          <div className="flex items-center justify-between">
            <CardTitle>Historico de Agendamentos</CardTitle>
            <div className="flex gap-2">
              <CalendarDateRangePicker />
              <Select onValueChange={setValuePaymentFilter}>
                <SelectTrigger className="w-[180px]" value={valuePaymentFilter}>
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
        <CardContent>
          {filteredPaids?.map((t) => (
            <Card
              className="mt-2 bg-muted"
              key={t.transaction_id}
              style={
                t.pay ? { borderColor: '#4ade80' } : { borderColor: '#f87171' }
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-medium">{t.title}</CardTitle>
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
                            <Button variant="outline" className="rounded-full">
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
                            <Button
                              className="rounded-full bg-red-400 text-white hover:bg-red-300 hover:text-white"
                              variant="outline"
                            >
                              <X className="size-3" />
                            </Button>
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
                  R$ {t.value}
                </CardDescription>
              </CardHeader>
              <CardContent className="-mt-4 flex items-end justify-between">
                <span className="text-sm text-muted-foreground">
                  Vencimento:{' '}
                  {t.payment_date &&
                    new Date(t.payment_date).toLocaleDateString()}
                </span>

                {t.pay === true && (
                  <span className="text-sm text-muted-foreground">
                    Pago dia: {new Date().toLocaleDateString()}
                  </span>
                )}
                <Button
                  disabled={t.pay}
                  variant="outline"
                  className={
                    !t.pay
                      ? 'bg-gradient-to-tr from-sky-800 to-sky-500 text-xs text-white hover:from-sky-600 hover:to-sky-500/90'
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
        <CardFooter className="absolute bottom-0 right-0 mx-auto space-x-4">
          <Pagination className="">
            <PaginationContent className="space-x-1">
              <PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationLink
                    key={index}
                    href="#"
                    className={`rounded-full ${currentPage === index + 1 ? 'bg-gradient-to-tr from-slate-800 to-slate-950 text-white' : 'border bg-muted'}`}
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
          <Button
            className="w-[100px]"
            onClick={() => setVisiblePayment(false)}
          >
            Sair
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
