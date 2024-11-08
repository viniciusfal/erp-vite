import { Analyses } from '@/components/analyses'
import { CalendarDateRangePicker } from '@/components/date-ranger-picker'
import { DropSettings } from '@/components/drop-settings'
import { Header } from '@/components/header'
import { Overview } from '@/components/overview'
import { RecentSales } from '@/components/recent-sales'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useDateRange } from '@/hooks/date-ranger-context'
import { useGetAnaliticsTransactions } from '@/hooks/get-analitics-transactions'
import { useListingtransaction } from '@/hooks/listing-transactions'
import { useListingtransactionByDate } from '@/hooks/listing-transactions-by-date'
import { isSameDay } from 'date-fns'
import { Asterisk, CircleMinus, CirclePlus, Download, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Dashboard() {
  const { dateRange } = useDateRange()
  const { startDate, endDate } = dateRange
  const { currentTransactions } = useListingtransactionByDate(startDate, endDate, 1, 'full')
  const { currentTransactions: allTransactions } = useListingtransaction('full')
  const { totalBalanceTransactions } = useGetAnaliticsTransactions()
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalOutcome, setTotalOutcome] = useState(0)
  const [pagineAtual, setPagineAtual] = useState('overview')

  useEffect(() => {
    const incomes = currentTransactions?.reduce((acc, transaction) => {
      if (transaction.type === 'entrada') {
        return acc + transaction.value
      }
      return acc
    }, 0) || 0

    const outcomes = currentTransactions?.reduce((acc, transaction) => {
      if (transaction.type === 'saida') {
        return acc + transaction.value
      }
      return acc
    }, 0) || 0

    setTotalIncome(incomes)
    setTotalOutcome(outcomes)
  }, [currentTransactions])

  const today = new Date()

  let filteredLastsActivities = allTransactions
    ?.filter((t) => isSameDay(new Date(t.created_at), today))
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })

  return (
    <div className="bg-primary-foreground">
      <Header />

      <div className="px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl text-slate-900">Dashboard</h2>
            <span className="mb-4 text-sm text-muted-foreground">
              Veja as estaticas do financeiro
            </span>
          </div>

          <div>
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
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger
                value="overview"
                className={pagineAtual === 'overview' ? "rounded-full bg-gradient-to-r from-slate-800 to-slate-950 text-muted" : "rounded-full"}
                onClick={() => setPagineAtual('overview')}
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className={pagineAtual === 'analytics' ? "rounded-full bg-gradient-to-r from-slate-800 to-slate-950 text-muted" : "rounded-full"}
                onClick={() => setPagineAtual('analytics')}
              >
                Analises
              </TabsTrigger>
              <TabsTrigger value="reports" >
                Relatorios
              </TabsTrigger>
              <TabsTrigger value="notifications" >
                Agendamentos
              </TabsTrigger>
            </TabsList>
            <CalendarDateRangePicker />
          </div>
          {pagineAtual === 'overview' ? (
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="flex gap-0.5 items-baseline text-sm font-medium">
                      Balanço
                      <Asterisk className='size-2.5 text-muted' />
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-0.5 text-2xl font-bold">{new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(totalIncome - totalOutcome)}

                    </div>
                    <div className='flex items-center gap-1.5 pt-1'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className='size-3' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>A analise por porcentagem sempre é comparando o mês atual e o anterior. <br />Independente da data que você selecione essa informação não mudará.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <p className="text-xs text-muted">
                        {totalBalanceTransactions?.total_balance.toFixed(2)}% do que o mês passado.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="flex gap-0.5 items-baseline text-sm font-medium">
                      Entradas
                      <Asterisk className='size-2.5 text-muted-foreground' />
                    </CardTitle>
                    <CirclePlus className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-0.5 items-baseline text-2xl font-bold">{new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(totalIncome)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <div className='flex items-center gap-1.5 pt-1'>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className='size-3' />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>A analise por porcentagem sempre é comparando o mês atual e o anterior. <br />Independente da data que você selecione essa informação não mudará.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <p className='text-xs text-muted-foreground'>
                          {totalBalanceTransactions?.total_entries.toFixed(2)}% do que o mês passado.
                        </p>
                      </div>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="flex items-baseline gap-0.5 text-sm font-medium">
                      Saídas
                      <Asterisk className='size-2.5 text-muted-foreground' />
                    </CardTitle>
                    <CircleMinus className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-0.5 text-2xl font-bold">{new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(totalOutcome)}

                    </div>
                    <div className='flex items-center gap-1.5 pt-1'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className='size-3' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>A analise por porcentagem sempre é comparando o mês atual e o anterior. <br />Independente da data que você selecione essa informação não mudará.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className="text-xs text-muted-foreground">
                        {totalBalanceTransactions?.total_outcomes.toFixed(2)}% do que o mês passado.
                      </p>
                    </div>

                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Visão Geral</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Registros recentes</CardTitle>
                    <CardDescription>
                      Você fez {filteredLastsActivities?.length} registros hoje.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ) : pagineAtual === 'analytics' ? (
            <Analyses />
          ) : <div></div>}

        </Tabs>
      </div >
    </div >
  )
}
