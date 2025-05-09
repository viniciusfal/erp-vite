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
import { useMemo } from 'react'
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

export function Overview() {
  const { currentTransactions } = useListingtransaction('full')
  const { totalBalanceTransactions } = useGetAnaliticsTransactions()

  const monthlyTotals = useMemo(() => {
    const totals = Array.from({ length: 12 }, () => ({
      income: 0,
      outcome: 0,
    }))
    const transactionsArray = Array.isArray(currentTransactions)
      ? currentTransactions
      : []

    transactionsArray?.forEach((t) => {
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
    {
      month: 'Janeiro',
      desktop: monthlyTotals[0]?.income || 0,
      mobile: monthlyTotals[0]?.outcome || 0,
    },
    {
      month: 'Fevereiro',
      desktop: monthlyTotals[1]?.income || 0,
      mobile: monthlyTotals[1]?.outcome || 0,
    },
    {
      month: 'Março',
      desktop: monthlyTotals[2]?.income || 0,
      mobile: monthlyTotals[2]?.outcome || 0,
    },
    {
      month: 'Abril',
      desktop: monthlyTotals[3]?.income || 0,
      mobile: monthlyTotals[3]?.outcome || 0,
    },
    {
      month: 'Maio',
      desktop: monthlyTotals[4]?.income || 0,
      mobile: monthlyTotals[4]?.outcome || 0,
    },
    {
      month: 'Junho',
      desktop: monthlyTotals[5]?.income || 0,
      mobile: monthlyTotals[5]?.outcome || 0,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafico - Entradas e saídas</CardTitle>
        <CardDescription>
          Janeiro - Junho {new Date().getFullYear()}
        </CardDescription>
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
              tickFormatter={(value) => (value ? value.slice(0, 3) : '')}
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Tendência de{' '}
          {totalBalanceTransactions &&
            totalBalanceTransactions.total_balance > 0
            ? 'alta'
            : 'baixa'}{' '}
          de{' '}
          {totalBalanceTransactions &&
            totalBalanceTransactions &&
            new Intl.NumberFormat('pt-BR', {
              style: 'percent',
            }).format(totalBalanceTransactions.total_balance / 100)}{' '}
          nesse mês
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando o total de entradas e saidas dos ultimos 6 meses
        </div>
      </CardFooter>
    </Card>
  )
}
