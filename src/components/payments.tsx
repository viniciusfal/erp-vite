import { File, Wrench, X } from "lucide-react";
import { CalendarDateRangePicker } from "./date-ranger-picker";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "./ui/pagination";
import { useState, Dispatch } from "react";

import { listingPayments } from "@/services/listing-payments";

interface PaymentProps {
  setVisiblePayment: Dispatch<React.SetStateAction<boolean>>
}

export function Payments({ setVisiblePayment }: PaymentProps) {
  const [paidState, setPaidState] = useState<boolean[]>([])
  const [currentPage, setCurrentPage] = useState(1)


  function handleMarkAsPaid(index: number) {
    const updatedPaid = [...paidState]
    updatedPaid[index] = true

    setPaidState(updatedPaid)
  }

  const allPayments = listingPayments(currentPage)
  const currentPayments = allPayments.paymentTransactions
  const totalPages = allPayments.totalPages


  return (
    <div className="">
      <Card className="w-[800px] h-[850px] relative" >
        <CardHeader className="">
          <div className="flex justify-between items-center">
            <CardTitle>Historico de Agendamentos</CardTitle>
            <div className="flex gap-2">
              <CalendarDateRangePicker />
              <Select>
                <SelectTrigger className="w-[180px]">
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
          {currentPayments?.map((t, index) => (
            <Card className="mt-2 bg-muted" key={index} style={paidState[index] ? { borderColor: '#4ade80' } : { borderColor: '#f87171' }}>
              <CardHeader >
                <div className="flex justify-between items-center">
                  <CardTitle className="font-medium">
                    {t.title}
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
                <CardDescription>R$ {t.value}</CardDescription>
              </CardHeader>
              <CardContent className="-mt-4 flex items-end justify-between">
                <span className="text-sm text-muted-foreground">
                  Vencimento: {t.payment_date && new Date(t.payment_date).toLocaleDateString()}
                </span>

                {paidState[index] === true ? (
                  <span className="text-sm text-muted-foreground">
                    Pago dia: {new Date().toLocaleDateString()}
                  </span>
                ) : <span></span>}
                <Button className="bg-gradient-to-tr from-sky-800 to-sky-500 text-xs text-white hover:from-sky-600 hover:to-sky-500/90" onClick={() => handleMarkAsPaid(index)}>
                  Marcar como Pago
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
        <CardFooter className="absolute bottom-0 mx-auto right-0 space-x-4">
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
          <Button className="w-[100px] " onClick={() => setVisiblePayment(false)}>Sair</Button>
        </CardFooter>
      </Card >
    </div >
  )
}