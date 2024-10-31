import { CardTransaction } from '@/components/card-transaction'
import { CalendarDateRangePicker } from '@/components/date-ranger-picker'
import { Payments } from '@/components/payments'
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

import { Bolt, File, MoveUpRight, ShieldCheck, Wrench, X } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { Link } from 'react-router-dom'
import { useListingPayments } from '@/hooks/listing-payments'
import Safe from '@/components/safe'

export function Finances() {
  const [visible, setVisible] = useState<boolean>(false)
  const [visiblePayment, setVisiblePayment] = useState<boolean>(false)
  const [visibleSafe, setVisibleSafe] = useState<boolean>(false)

  const allPayments = useListingPayments(1, 'unpaid')
  const currentPayments = allPayments.paymentTransactions

  const today = new Date();

  const filteredPayments = currentPayments
    ?.filter((p) => !p.pay && p.payment_date) // Filtra pagamentos não pagos e com data válida
    .filter((p) => p.payment_date && new Date(p.payment_date) >= today) // Adiciona filtro para pagamentos a vencer
    .sort((a, b) => {
      const dateA = a.payment_date ? new Date(a.payment_date) : new Date(0); // Usa uma data padrão se null
      const dateB = b.payment_date ? new Date(b.payment_date) : new Date(0); // Usa uma data padrão se null
      return dateA.getTime() - dateB.getTime(); // Ordena por data crescente
    })
    .slice(0, 2)

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between">
        <Helmet titleTemplate="Financeiro" />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl text-slate-900">Financeiro</h2>
            <span className="mb-4 text-sm text-muted-foreground">
              Registre as entradas e saidas financeiras.
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <CalendarDateRangePicker />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default" className='rounded-full' onClick={() => setVisibleSafe(true)}>
                  <ShieldCheck className='text-muted size-5' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cofre</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant={'outline'} className="rounded-full">
            <Bolt className="size-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <TableTransaction setVisible={setVisible} />

        <div className="flex w-1/3 flex-col gap-2">
          <div className="flex h-1/2 w-full flex-col justify-between rounded-2xl border border-muted bg-white px-4 py-5 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Top 3 Entradas</h2>
              <Select>
                <SelectTrigger className="w-[100px] text-xs font-medium">
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

          <div className="flex h-full w-full flex-col rounded-2xl border border-muted bg-white px-4 py-5 shadow-md">
            <div className="flex justify-between">
              <h2 className="text-lg font-medium">Proximos Agendamentos</h2>
              <Button
                variant="outline"
                className="rounded-full p-3 text-muted-foreground hover:bg-primary hover:text-white"
                onClick={() => setVisiblePayment(true)}
              >
                <MoveUpRight className="size-3" />
              </Button>
            </div>

            {filteredPayments?.map((payment) => (
              <Card className="mt-2 bg-muted" key={payment.transaction_id} >
                <CardHeader >
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-medium">
                      {payment.title}
                    </CardTitle>
                    <div className="flex gap-1 items-center">
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Link to="#">
                                <Button variant="outline" className="rounded-full">
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
                                className="rounded-full  hover:bg-red-300 hover:text-white bg-red-400 text-white"
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
                  <CardDescription>{payment.value}</CardDescription>
                </CardHeader>
                <CardContent className="-mt-4 flex items-end justify-between">
                  <span className="text-sm text-muted-foreground">
                    Vencimento:{payment.payment_date && new Date(payment.payment_date).toLocaleDateString()}
                  </span>


                  < Button className="bg-gradient-to-tr from-sky-800 to-sky-500 text-xs text-white hover:from-sky-600 hover:to-sky-500/90">
                    Marcar como Pago
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {
        visible && (
          <div className="fixed left-0 top-0 z-1 h-full w-full flex items-center justify-center bg-black bg-opacity-60">
            <CardTransaction setVisible={setVisible} />
          </div>
        )
      }

      {
        visiblePayment && (
          <div className="fixed left-0 top-0 z-1 h-full w-full flex items-center justify-center bg-black bg-opacity-60">
            <Payments setVisiblePayment={setVisiblePayment} />
          </div>
        )
      }

      {
        visibleSafe && (
          <div className="fixed left-0 top-0 z-1 h-full w-full flex items-center justify-center bg-black bg-opacity-60">
            <Safe setVisibleSafe={setVisibleSafe} />
          </div>
        )
      }
    </div >


  )
}
