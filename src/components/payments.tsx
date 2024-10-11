import { File, Wrench, X } from "lucide-react";
import { CalendarDateRangePicker } from "./date-ranger-picker";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "./ui/pagination";
import { useState } from "react";


export function Payments({ setVisiblePayment }: any) {
  const [paidState, setPaidState] = useState<boolean[]>([])

  function handleMarkAsPaid(index: number) {
    const updatedPaid = [...paidState]
    updatedPaid[index] = true
    setPaidState(updatedPaid)
  }

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
          {Array.from({ length: 3 }).map((_, index) => (
            <Card className="mt-2 bg-muted" key={index} style={paidState[index] ? { borderColor: '#4ade80' } : { borderColor: '#f87171' }}>
              <CardHeader >
                <div className="flex justify-between items-center">
                  <CardTitle className="font-medium">
                    Boleto Transdata
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
                <CardDescription>R$ 980,65</CardDescription>
              </CardHeader>
              <CardContent className="-mt-4 flex items-end justify-between">
                <span className="text-sm text-muted-foreground">
                  Vencimento: 04/10/2024
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
                <PaginationLink
                  href="#"
                  className="rounded-full bg-gradient-to-tr from-slate-800 to-slate-950 text-white hover:text-white"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="rounded-full border bg-muted"
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="rounded-full border bg-muted"
                >
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="rounded-full border bg-muted"
                >
                  4
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <Button className="w-[100px]" onClick={() => setVisiblePayment(false)}>Sair</Button>
        </CardFooter>
      </Card >
    </div >
  )
}