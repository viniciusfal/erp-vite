import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A bar chart'

const chartData = [
  { position: '305', desktop: 305, color: '#0ea5e9' },
  { position: '237', desktop: 237, color: '#7dd3fc' },
  { position: '186', desktop: 186, color: '#e0f2fe' },
]

const incomes = chartData.map((c) => c.color)

const chartConfig = {
  desktop: {
    label: 'Entradas',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function TopIncome() {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        barGap={1}
        barCategoryGap="1%"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="position"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />

        {/* Renderiza uma barra para cada entrada no chartData */}

        <Bar
          dataKey="desktop"
          fill={incomes[0]} // Aplica a cor específica para cada barra
          radius={8}
        />
      </BarChart>
    </ChartContainer>
  )
}
