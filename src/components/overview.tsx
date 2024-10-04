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

export const description = 'A multiple bar chart'

const chartData = [
  { month: 'Janeiro', desktop: 186, mobile: 80 },
  { month: 'Fevereiro', desktop: 305, mobile: 200 },
  { month: 'Março', desktop: 237, mobile: 120 },
  { month: 'Abril', desktop: 73, mobile: 190 },
  { month: 'Maio', desktop: 209, mobile: 130 },
  { month: 'Junho', desktop: 214, mobile: 140 },
]

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
