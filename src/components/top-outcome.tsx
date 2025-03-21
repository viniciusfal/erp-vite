import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useListingTransactionByDate } from '@/hooks/listing-transactions-by-date'
import { useDateRange } from '@/hooks/date-ranger-context'

export const description = 'Grafico de Ranking de saidas'

const chartConfig = {
  desktop: {
    label: 'Saidas',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig

export function TopOutcome() {
  const { dateRange } = useDateRange()
  const { startDate, endDate } = dateRange
  const { currentTransactions } = useListingTransactionByDate(
    startDate,
    endDate,
    'saida',
  )

  // Agrupar e somar as entradas por categoria
  const totals = (currentTransactions || [])
    .filter((transaction) => transaction.type === 'saida')
    .reduce(
      (acc, transaction) => {
        // Acumular o total por categoria
        const category = transaction.category // Ajuste conforme o campo real que representa a categoria
        acc[category] = (acc[category] || 0) + transaction.value // Somar o valor
        return acc
      },
      {} as Record<string, number>,
    ) // Usando um objeto para acumular

  // Transformar o objeto de totais em um array para o gráfico
  const chartData = Object.entries(totals)
    .map(([category, total]) => ({
      position: category,
      desktop: total,
    }))
    .sort((a, b) => b.desktop - a.desktop) // Ordenando de forma descrescente
    .slice(0, 5) // Pegar o top 3

  return (
    <ChartContainer config={chartConfig} className="pb-2.5">
      <BarChart
        accessibilityLayer
        data={chartData}
        barGap={0}
        barCategoryGap="0%"
        barSize={120}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="position"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 10)}
        />

        <ChartTooltip
          cursor={true}
          content={<ChartTooltipContent hideLabel />}
        />

        <Bar dataKey="desktop" radius={8}>
          {chartData.map((_, index) => (
            <Cell key={index} fill={`url(#grad${index + 1})`} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
