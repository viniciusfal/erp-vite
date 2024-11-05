'use client'

import { TrendingUp } from 'lucide-react'
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


export const description = 'A multiple bar chart'

const chartConfig = {
  desktop: {
    label: 'Entrada',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Saída',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig


export function Analyses() {
  const { currentTransactions } = useListingtransaction('full')
  const [meta, setMeta] = useState(0)

  const monthlyTotals = useMemo(() => {
    const totals = Array.from({ length: 12 }, () => ({
      income: 0,
      outcome: 0
    }))

    currentTransactions?.forEach((t) => {
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

  const chartData = [
    { month: 'Janeiro', desktop: monthlyTotals[0]?.income || 0, mobile: monthlyTotals[0]?.outcome || 0 },
    { month: 'Fevereiro', desktop: monthlyTotals[1]?.income || 0, mobile: monthlyTotals[1]?.outcome || 0 },
    { month: 'Março', desktop: monthlyTotals[2]?.income || 0, mobile: monthlyTotals[2]?.outcome || 0 },
    { month: 'Abril', desktop: monthlyTotals[3]?.income || 0, mobile: monthlyTotals[3]?.outcome || 0 },
    { month: 'Maio', desktop: monthlyTotals[4]?.income || 0, mobile: monthlyTotals[4]?.outcome || 0 },
    { month: 'Junho', desktop: monthlyTotals[5]?.income || 0, mobile: monthlyTotals[5]?.outcome || 0 },
    { month: 'Julho', desktop: monthlyTotals[6]?.income || 0, mobile: monthlyTotals[6]?.outcome || 0 },
    { month: 'Agosto', desktop: monthlyTotals[7]?.income || 0, mobile: monthlyTotals[7]?.outcome || 0 },
    { month: 'Setembro', desktop: monthlyTotals[8]?.income || 0, mobile: monthlyTotals[8]?.outcome || 0 },
    { month: 'Outubro', desktop: monthlyTotals[9]?.income || 0, mobile: monthlyTotals[9]?.outcome || 0 },
    { month: 'Novembro', desktop: monthlyTotals[10]?.income || 0, mobile: monthlyTotals[10]?.outcome || 0 },
    { month: 'Dezembro', desktop: monthlyTotals[11]?.income || 0, mobile: monthlyTotals[11]?.outcome || 0 },
  ]

  return (
    <div className='grid grid-rows-3 grid-cols-4 gap-4'>
      <Card className='col-span-3 row-span-2'>
        <CardHeader>
          <CardTitle>Grafico - Entradas e saídas do Ano de {new Date().getFullYear()}</CardTitle>
          <CardDescription>Janeiro - Dezembro</CardDescription>
        </CardHeader>
        <CardContent className=''>
          <ChartContainer config={chartConfig} className=''>
            <BarChart accessibilityLayer data={chartData} className=''>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value = '') => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm ">
          <div className="flex gap-2 font-medium leading-none">
            Tendência de alta de 5.2% nesse mês
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Mostrando o total de entradas e saidas dos ultimos 6 meses
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
          <IncomesPizza />
        </CardContent>
      </Card>

      <Card className='col-span-5 row-span-1 p-4'>
        <CardTitle className='mb-4'>Entradas e Saidas por Dia</CardTitle>
        <InteractiveForDay />
      </Card>
    </div>

  )
}
