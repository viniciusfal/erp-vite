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
import { useGroupTransactionByMonth } from '@/hooks/group-transaction-by-mounth'
import { useListingtransaction } from '@/hooks/listing-transactions'
import { useEffect, useState } from 'react'

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

export function Overview() {
  const { currentTransactions } = useListingtransaction(1, 'full')
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalOutcome, setTotalOutcome] = useState(0)

  const transactions = currentTransactions?.filter((t) => {
    const date = t.payment_date?.getMonth() === 1

    return date
  })



  useEffect(() => {
    const incomes = transactions?.reduce((acc, transaction) => {
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


  const chartData = [
    { month: 'janeiro', desktop: 186, mobile: 80 },
    { month: 'Fevereiro', desktop: 305, mobile: 200 },
    { month: 'Março', desktop: 237, mobile: 120 },
    { month: 'Abril', desktop: 73, mobile: 190 },
    { month: 'Maio', desktop: 209, mobile: 130 },
    { month: 'Junho', desktop: 214, mobile: 140 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafico - Entradas e saídas</CardTitle>
        <CardDescription>Janeiro - Junho 2024</CardDescription>
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
              tickFormatter={(value) => value.slice(0, 3)}
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
          Tendência de alta de 5.2% nesse mês
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando o total de entradas e saidas dos ultimos 6 meses
        </div>
      </CardFooter>
    </Card>
  )
}
