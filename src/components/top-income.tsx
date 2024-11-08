import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useListingtransactionByDate } from '@/hooks/listing-transactions-by-date';
import { useDateRange } from '@/hooks/date-ranger-context';

export const description = 'A bar chart';

const chartConfig = {
  desktop: {
    label: 'Entradas',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function TopIncome() {
  const { dateRange } = useDateRange()
  const { startDate, endDate } = dateRange
  const { currentTransactions } = useListingtransactionByDate(startDate, endDate, 1, 'entrada')

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
    <ChartContainer config={chartConfig} className='h-full pb-2.5'>
      <BarChart
        accessibilityLayer
        data={chartData}
        barGap={1}
        barCategoryGap="0%"

      >

        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#064e3b', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#99f6e4', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#34d399', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ecfdf5', stopOpacity: 1 }} />
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
