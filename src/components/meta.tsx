"use client"

import {  TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

import { useListMeta } from "@/hooks/list-meta"

interface MetaProps {
  monthlyTotals: {
    income: number;
    outcome: number;
  }[]
  meta: number | undefined
}

export function Meta({ monthlyTotals, meta }: MetaProps) {
  
  const {mounthMeta} = useListMeta()
  const currentDate = new Date();

  meta  = mounthMeta?.metaValue
  console.log(currentDate.getMonth())
  const month = monthlyTotals[currentDate.getMonth()]
  const progresso = meta ? (month.income / meta) * 100 : 0 // Calcula o progresso em relação à meta

  const chartData = [
    {
      browser: "safari",
      incomes: month.income,
      fill: "var(--color-safari)",
    },
  ]

  const chartConfig = {
    incomes: {
      label: "Entradas",
    },
    safari: {
      label: "Safari",
      color: progresso ? progresso < 50 ? "hsl(var(--chart-2))" : progresso >= 50 && progresso < 100 ? "hsl(var(--chart-4))" : "hsl(var(--chart-1))" : undefined,
    },
  } satisfies ChartConfig

  const startAngle = 90
  const endAngle = progresso && 90 + (360 * progresso) / 100

  return (
    <Card className="flex flex-col mt-2">
      <CardHeader className="items-center">
        <CardTitle>Progresso da Meta Mensal</CardTitle>
        <CardDescription>{mounthMeta && `Meta de ${new Intl.NumberFormat('pt-BR', {
          style: "currency",
          currency: "BRL",
        }).format(mounthMeta.metaValue)}`}</CardDescription>

      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="incomes"
              background
              cornerRadius={10}
              fill={progresso && progresso >= 100 ? "var(--color-success)" : "var(--color-safari)"}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {`${progresso && progresso.toFixed(1)}%`}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Atingido
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {`Progresso: R$${month.income} de R$${mounthMeta?.metaValue}`}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {`Meta para o mês atual`}
        </div>
      </CardFooter>
    </Card>
  )
}
