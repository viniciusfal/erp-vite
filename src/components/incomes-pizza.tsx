"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { useListingtransactionByDate } from "@/hooks/listing-transactions-by-date"
import { useDateRange } from "@/hooks/date-ranger-context"


export function IncomesPizza() {
  const { dateRange } = useDateRange()
  const { startDate, endDate } = dateRange
  const { currentTransactions } = useListingtransactionByDate(startDate, endDate, 1, 'full')
  const [incomeData, setIncomeData] = React.useState<{ category: string; value: number; fill: string }[]>([])
  const [expenseData, setExpenseData] = React.useState<{ category: string; value: number; fill: string }[]>([])
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [hoveredCategory, setHoveredCategory] = React.useState<{ category: string; value: number } | null>(null)

  const id = "pie-interactive-carousel"

  const generateColor = (index: number, isExpense: boolean) => {
    const hue = isExpense ? 1 : 510;
    const saturation = 150 + (index % 12) * 10;
    const lightness = 40 + (index % 2) * 5;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  React.useEffect(() => {
    if (!currentTransactions) return;

    const processTransactions = (type: 'entrada' | 'saida') => {
      const transactions = currentTransactions?.reduce<Record<string, number>>((acc, transaction) => {
        if (transaction && transaction.type === type) {
          const category = transaction.category || 'Uncategorized'
          if (!acc[category]) {
            acc[category] = 0
          }
          acc[category] += +(transaction.value || 0)
        }
        return acc
      }, {}) || {}

      return Object.keys(transactions).map((category, index) => ({
        category,
        value: transactions[category],
        fill: generateColor(index, type === 'saida'),
      }))
    }

    setIncomeData(processTransactions('entrada'))
    setExpenseData(processTransactions('saida'))
  }, [currentTransactions])

  const chartConfig = {
    visitors: {
      label: activeIndex === 0 ? "Entradas" : "Saídas",
    },
    desktop: {
      label: "Category",
    },
  } satisfies ChartConfig

  const handlePrevious = () => setActiveIndex((prev) => (prev === 0 ? 1 : 0))
  const handleNext = () => setActiveIndex((prev) => (prev === 1 ? 0 : 1))

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle>{activeIndex === 0 ? "Entradas" : "Saídas"}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-4">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={activeIndex === 0 ? incomeData : expenseData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              labelLine={false}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props}
                    outerRadius={outerRadius + 10}
                    onMouseEnter={() => {
                      setHoveredCategory({
                        category: props.name ?? '',
                        value: props.value ?? 0,
                      })
                    }}
                  />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl  font-bold"
                        >
                          {hoveredCategory ? hoveredCategory.category : ''}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {hoveredCategory ? new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            maximumFractionDigits: 2
                          }).format(hoveredCategory.value) : "0"}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}