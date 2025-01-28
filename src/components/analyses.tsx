'use client'

import { Asterisk, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { useListingtransaction } from '@/hooks/listing-transactions'
import { useMemo, useState } from 'react'
import { IncomesPizza } from './incomes-pizza'
import { Meta } from './meta'
import { InteractiveForDay } from './interactive-for-day'
import { DrawerMeta } from './drawer'
import { useGetAnaliticsTransactions } from '@/hooks/get-analitics-transactions'

export const description = 'A multiple bar chart'

const chartConfig = {
  desktop: {
    label: 'Entrada',
    color: '#10b981',
  },
  mobile: {
    label: 'Saída',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function Analyses() {
  const { currentTransactions } = useListingtransaction('full')
  const { totalBalanceTransactions } = useGetAnaliticsTransactions()
  const [meta, setMeta] = useState(0)

  const monthlyTotals = useMemo(() => {
    const totals = Array.from({ length: 12 }, () => ({ income: 0, outcome: 0 }))
    const transactionsArray = Array.isArray(currentTransactions) ? currentTransactions : []

    transactionsArray.forEach((t) => {
      if (t.payment_date) {
        const month = new Date(t.payment_date).getMonth()
        if (t.type === 'entrada') {
          totals[month].income += t.value
        } else if (t.type === 'saida') {
          totals[month].outcome += t.value
        }
      }
    })

    return totals
  }, [currentTransactions])

  const chartData = useMemo(() => {
    return monthlyTotals.map((total, index) => ({
      month: new Date(0, index).toLocaleString('pt-BR', { month: 'long' }),
      desktop: total.income,
      mobile: total.outcome,
    }))
  }, [monthlyTotals])

  const trend = totalBalanceTransactions && totalBalanceTransactions.total_balance > 0 ? "alta" : "baixa"
  const balancePercentage = totalBalanceTransactions ? parseFloat(totalBalanceTransactions.total_balance?.toString()).toFixed(2) : "0.00"

  return (
    <div className='grid grid-rows-3 grid-cols-4 gap-4'>
      <Card className='col-span-3 row-span-2'>
        <CardHeader>
          <CardTitle>Grafico - Entradas e saídas do Ano de {new Date().getFullYear()}</CardTitle>
          <CardDescription>Janeiro - Dezembro</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value?.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Tendência de {trend} de {balancePercentage}%
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Mostrando o total de entradas e saídas do último ano.
          </div>
        </CardFooter>
      </Card>

      <Card className='row-span-1 col-span-2'>
        <CardContent>
          <Meta monthlyTotals={monthlyTotals} meta={meta} />
        </CardContent>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='invisible'></div>
            <DrawerMeta setNewMeta={setMeta} />
          </div>
        </CardHeader>
      </Card>

      <Card className='row-span-1 col-span-2'>
        <CardContent className='mt-3'>
          <div className="py-4 flex items-baseline gap-0.5">
            <CardTitle>Resumo por Categoria</CardTitle>
            <Asterisk className='size-2.5 text-muted-foreground' />
          </div>
          <IncomesPizza />
        </CardContent>
      </Card>

      <Card className='col-span-5 row-span-1 p-4'>
        <CardTitle className='mb-4'>Análise do Trimestre</CardTitle>
        <InteractiveForDay />
      </Card>
    </div>
  )
}
