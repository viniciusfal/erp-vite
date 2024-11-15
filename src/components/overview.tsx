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
    { month: 'Julho', desktop: monthlyTotals[6]?.income || 0, mobile: monthlyTotals[6]?.outcome || 0 },
    { month: 'Agosto', desktop: monthlyTotals[7]?.income || 0, mobile: monthlyTotals[7]?.outcome || 0 },
    { month: 'Setembro', desktop: monthlyTotals[8]?.income || 0, mobile: monthlyTotals[8]?.outcome || 0 },
    { month: 'Outubro', desktop: monthlyTotals[9]?.income || 0, mobile: monthlyTotals[9]?.outcome || 0 },
    { month: 'Novembro', desktop: monthlyTotals[10]?.income || 0, mobile: monthlyTotals[10]?.outcome || 0 },
    { month: 'Dezembro', desktop: monthlyTotals[11]?.income || 0, mobile: monthlyTotals[11]?.outcome || 0 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafico - Entradas e saídas</CardTitle>
        <CardDescription>Julho - Dezembro {new Date().getFullYear()}</CardDescription>
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Tendência de {totalBalanceTransactions && totalBalanceTransactions.total_balance > 0 ? "alta" : "baixa"} de
          {" "} {totalBalanceTransactions && totalBalanceTransactions && parseFloat(totalBalanceTransactions.total_balance.toString()).toFixed(2)}% nesse mês
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando o total de entradas e saidas dos ultimos 6 meses
        </div>
      </CardFooter>
    </Card>
  )
}
