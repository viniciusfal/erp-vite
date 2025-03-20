import { Analyses } from '@/components/analyses'
import { CalendarDateRangePicker } from '@/components/date-ranger-picker'
import { DropSettings } from '@/components/drop-settings'
import { Overview } from '@/components/overview'
import { RecentSales } from '@/components/recent-sales'
import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDateRange } from '@/hooks/date-ranger-context'
import { useGetAnaliticsTransactions } from '@/hooks/get-analitics-transactions'
import { useListingtransaction } from '@/hooks/listing-transactions'
import { useListingTransactionByDate } from '@/hooks/listing-transactions-by-date'
import { isSameDay } from 'date-fns'
import {
  Asterisk,
  CircleMinus,
  CirclePlus,
  DollarSign,
  Download,
  Info,
} from 'lucide-react'
import React, { useMemo, useState } from 'react'

export function Dashboard() {
  const { dateRange } = useDateRange()
  const { startDate, endDate } = dateRange

  const { currentTransactions, isLoading } = useListingTransactionByDate(
    startDate,
    endDate,
    'full',
  )
  const { currentTransactions: allTransactions = [] } =
    useListingtransaction('full')
  const { totalBalanceTransactions } = useGetAnaliticsTransactions()
  const { totalIncome, totalOutcome } = Array.isArray(currentTransactions)
    ? currentTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'entrada') {
          acc.totalIncome += transaction.value
        } else if (transaction.type === 'saida') {
          acc.totalOutcome += transaction.value
        }
        return acc
      },
      { totalIncome: 0, totalOutcome: 0 },
    )
    : { totalIncome: 0, totalOutcome: 0 }

  const [pagineAtual, setPagineAtual] = useState('overview')

  const today = new Date()

  const filteredLastsActivities = useMemo(() => {
    if (!Array.isArray(allTransactions)) return []
    return allTransactions
      .filter((t) => isSameDay(new Date(t.created_at), today))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
  }, [allTransactions, today])

  const MemoizedOverview = React.memo(Overview)
  const MemoizedRecentSales = React.memo(RecentSales)

  return (
    <div className="">
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl text-slate-900 dark:text-foreground">
              Dashboard
            </h2>
            <span className="mb-4 text-sm text-muted-foreground">
              Veja as estaticas do financeiro
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Button
                variant={'outline'}
                className="flex items-center gap-2 rounded-full text-muted-foreground dark:text-foreground"
              >
                <Download className="size-4" />
                Exportar Dados
              </Button>

              <DropSettings />
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex justify-between">
            <TabsList className="dark:bg-secondary">
              <TabsTrigger
                value="overview"
                className={
                  pagineAtual === 'overview'
                    ? 'rounded-full bg-gradient-to-r from-slate-800 to-slate-950 text-muted dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-foreground'
                    : 'rounded-full'
                }
                onClick={() => setPagineAtual('overview')}
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className={
                  pagineAtual === 'analytics'
                    ? 'rounded-full bg-gradient-to-r from-slate-800 to-slate-950 text-muted dark:bg-gradient-to-tr dark:from-emerald-700 dark:to-emerald-500 dark:text-foreground'
                    : 'rounded-full'
                }
                onClick={() => setPagineAtual('analytics')}
              >
                Analises
              </TabsTrigger>
              <TabsTrigger value="reports">Relatorios</TabsTrigger>
              <TabsTrigger value="notifications">Agendamentos</TabsTrigger>
            </TabsList>
            <CalendarDateRangePicker />
          </div>
          {isLoading ? (
            <Spinner />
          ) : pagineAtual === 'overview' ? (
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="flex items-baseline gap-0.5 text-sm font-medium">
                      Balanço
                      <Asterisk className="size-2.5 text-muted" />
                    </CardTitle>
                    <DollarSign className="size-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-0.5 text-2xl font-bold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(totalIncome - totalOutcome)}
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="size-3" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              A analise por porcentagem sempre é comparando o
                              mês atual e o anterior. <br />
                              Independente da data que você selecione essa
                              informação não mudará.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <p className="text-xs text-muted dark:text-muted-foreground">
                        {totalBalanceTransactions?.total_balance &&
                          new Intl.NumberFormat('pt-BR', {
                            style: 'percent',
                            signDisplay: 'exceptZero',
                          }).format(
                            totalBalanceTransactions?.total_balance / 100,
                          )}{' '}
                        do que o mês passado.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="flex items-baseline gap-0.5 text-sm font-medium">
                      Entradas
                      <Asterisk className="size-2.5 text-muted-foreground" />
                    </CardTitle>
                    <CirclePlus className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-0.5 text-2xl font-bold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(totalIncome)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 pt-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="size-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                A analise por porcentagem sempre é comparando o
                                mês atual e o anterior. <br />
                                Independente da data que você selecione essa
                                informação não mudará.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <p className="text-xs text-muted-foreground">
                          {totalBalanceTransactions?.total_entries &&
                            new Intl.NumberFormat('pt-BR', {
                              style: 'percent',
                              signDisplay: 'exceptZero',
                            }).format(
                              totalBalanceTransactions?.total_entries / 100,
                            )}{' '}
                          do que o mês passado.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="flex items-baseline gap-0.5 text-sm font-medium">
                      Saídas
                      <Asterisk className="size-2.5 text-muted-foreground" />
                    </CardTitle>
                    <CircleMinus className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-0.5 text-2xl font-bold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(totalOutcome)}
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="size-3" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              A analise por porcentagem sempre é comparando o
                              mês atual e o anterior. <br />
                              Independente da data que você selecione essa
                              informação não mudará.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className="text-xs text-muted-foreground">
                        {totalBalanceTransactions?.total_outcomes &&
                          new Intl.NumberFormat('pt-BR', {
                            style: 'percent',
                            signDisplay: 'exceptZero',
                          }).format(
                            totalBalanceTransactions?.total_outcomes / 100,
                          )}{' '}
                        do que o mês passado.
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
                    <MemoizedOverview />
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
                    <MemoizedRecentSales />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ) : pagineAtual === 'analytics' ? (
            <Analyses />
          ) : (
            <div></div>
          )}
        </Tabs>
      </div>
    </div>
  )
}
