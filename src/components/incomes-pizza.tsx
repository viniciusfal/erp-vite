"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useListingtransactionByDate } from "@/hooks/listing-transactions-by-date"
import { useDateRange } from "@/hooks/date-ranger-context"

export const description = "An interactive pie chart"
export function IncomesPizza() {
  const { dateRange } = useDateRange()
  const { startDate, endDate } = dateRange
  const { currentTransactions } = useListingtransactionByDate(startDate, endDate, 1, 'full')
  const [incomeByCategory, setIncomeByCategory] = React.useState<{ category: string; value: number; fill: string }[]>([])

  const id = "pie-interactive"

  React.useEffect(() => {
    const incomes = currentTransactions?.reduce<Record<string, number>>((acc, transaction) => {
      if (transaction.type === 'entrada') {
        const category = transaction.category

        if (!acc[category]) {
          acc[category] = 0
        }

        acc[category] = + transaction.value
      }
      return acc
    }, {}) || {}

    const outcomes = currentTransactions?.reduce((acc, transaction) => {
      if (transaction.type === 'saida') {
        return acc + transaction.value
      }
      return acc
    }, 0) || 0

    const formattedData = Object.keys(incomes).map(category => ({
      category,
      value: incomes[category],
      fill: `var(--color-${category.toLowerCase()})`, // Adicione uma cor para cada categoria
    }))

    setIncomeByCategory(formattedData)

  }, [currentTransactions])

  const desktopData = [
    { month: "Pro labore", desktop: incomeByCategory[0]?.value, fill: "var(--color-february)" },
    { month: "Folha d epagamento", desktop: incomeByCategory[1]?.value, fill: "var(--color-february)" },
  ]

  const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month)
  const chartConfig = {
    visitors: {
      label: "Entradas",
    },
    desktop: {
      label: "Categoria",
    },

  } satisfies ChartConfig

  const activeIndex = React.useMemo(
    () => desktopData.findIndex((item) => item.month === activeMonth),
    [activeMonth]
  )
  const months = React.useMemo(() => desktopData.map((item) => item.month), [])

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Pie Chart - Interactive</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
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
              data={desktopData}
              dataKey="desktop"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {desktopData[activeIndex].desktop}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
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
