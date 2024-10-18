import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useListingtransaction } from '@/hooks/listing-transactions';

export const description = 'A bar chart';

const chartConfig = {
  desktop: {
    label: 'Entradas',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;


export function TopIncome() {
  const { currentTransactions } = useListingtransaction(1, 'entrada')

  // Agrupar e somar as entradas por categoria
  const totals = (currentTransactions || [])
    .filter(transaction => transaction.type === 'entrada')
    .reduce((acc, transaction) => {
      // Acumular o total por categoria
      const category = transaction.category // Ajuste conforme o campo real que representa a categoria
      acc[category] = (acc[category] || 0) + transaction.value // Somar o valor
      return acc
    }, {} as Record<string, number>) // Usando um objeto para acumular

  // Transformar o objeto de totais em um array para o gráfico
  const chartData = Object.entries(totals)
    .map(([category, total]) => (
      {
        position: category,
        desktop: total
      }
    ))
    .sort((a, b) => b.desktop - a.desktop) // Ordenando de forma descrescente
    .slice(0, 3) // Pegar o top 3
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        barGap={1}
        barCategoryGap="0%"

      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#003f5c', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#005f99', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#7dd3fc', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#007bbd', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#e0f2fe', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="position"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
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
  );
}
