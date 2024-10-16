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

import { Bolt, File, MoveUpRight, Wrench, X } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'
import { useListingtransaction } from '@/hooks/listing-transacrions'

export function Finances() {
  const [visible, setVisible] = useState<boolean>(false)
  const [visiblePayment, setVisiblePayment] = useState<boolean>(false)
  const [inputType, setInputType] = useState('full')
  const [currentPage, setCurrentPage] = useState(1)

  const handleListingTransactios = useListingtransaction(currentPage, inputType)

  const currentTransactions = handleListingTransactios.currentTransactions
  const totalPages = handleListingTransactios.totalPages

  return (
    <div className="">
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

        <div className="flex gap-2">
          <CalendarDateRangePicker />
          <Button variant={'outline'} className="rounded-full">
            <Bolt className="size-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <TableTransaction
          currentPage={currentPage}
          setVisible={setVisible}
          currentTransactions={currentTransactions}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          setInputType={setInputType}
          inputType={inputType}
        />

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

            <TopIncome currentTransactions={currentTransactions} />
          </div>

          <div className="flex h-1/2 w-full flex-col rounded-2xl border border-muted bg-white px-4 py-5 shadow-md">
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

            {Array.from({ length: 2 }).map((_, index) => (
              <Card className="mt-2 bg-muted" key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-medium">
                      Boleto Transdata
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
                  <CardDescription>R$ 980,65</CardDescription>
                </CardHeader>
                <CardContent className="-mt-4 flex items-end justify-between">
                  <span className="text-sm text-muted-foreground">
                    Vencimento: 04/10/2024
                  </span>

                  <Button className="bg-gradient-to-tr from-sky-800 to-sky-500 text-xs text-white hover:from-sky-600 hover:to-sky-500/90">
                    Marcar como Pago
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {visible === true ? (
        <div className="z-1 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
          <CardTransaction setVisible={setVisible} />
        </div>
      ) : (
        <div></div>
      )}

      {visiblePayment === true ? (
        <div className="z-1 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
          <Payments setVisiblePayment={setVisiblePayment} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}
