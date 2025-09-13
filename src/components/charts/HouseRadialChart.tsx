"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
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

interface HouseRadialChartProps {
  title: string
  value: number
  colorVar?: string
  maxValue?: number
  unit?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  showPercentage?: boolean
}

export function HouseRadialChart({ 
  title, 
  value, 
  colorVar = "hsl(var(--teal-500))",
  maxValue = 100,
  unit = "",
  trend,
  showPercentage = false
}: HouseRadialChartProps) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : value;
  const displayValue = showPercentage ? percentage : value;
  
  const chartData = [
    { 
      name: title, 
      value: percentage, 
      fill: colorVar,
      displayValue: value
    },
  ]

  const chartConfig = {
    value: { label: "Valor" },
    [title]: { label: title, color: colorVar },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col rounded-xl bg-gradient-to-br from-background via-background to-muted/30 border-2 hover:shadow-lg transition-all duration-300">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          {title}
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          {unit && maxValue > 0 ? `${value} ${unit} de ${maxValue}` : "Indicador atual"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 + (percentage * 2.7)} // 270 degrees max for better visual
            innerRadius={50}
            outerRadius={85}
            barSize={18}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="hsl(var(--border))"
              className="first:fill-muted/30 last:fill-background"
              polarRadius={[58, 44]}
            />
            <RadialBar 
              dataKey="value" 
              background={{ 
                fill: 'hsl(var(--muted))',
                opacity: 0.3
              }}
              fill={colorVar}
              cornerRadius={9}
              className="drop-shadow-sm"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <g>
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 8}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {showPercentage ? 
                              `${displayValue.toFixed(1)}%` : 
                              displayValue.toLocaleString()
                            }
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 16}
                            className="fill-muted-foreground text-sm font-medium"
                          >
                            {showPercentage ? "Taxa" : (unit || "Unidades")}
                          </tspan>
                        </text>
                        {/* Progress ring background */}
                        <circle
                          cx={viewBox.cx}
                          cy={viewBox.cy}
                          r={42}
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth={2}
                          opacity={0.1}
                        />
                      </g>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-0">
        {trend && (
          <div className={`flex items-center gap-2 leading-none font-medium transition-colors ${
            trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
          }`}>
            {trend.isPositive ? (
              <>
                <TrendingUp className="h-4 w-4" />
                +{trend.value}% este mês
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4" />
                {trend.value}% este mês
              </>
            )}
          </div>
        )}
        <div className="text-muted-foreground leading-none text-center text-xs">
          Atualizado em tempo real • {new Date().toLocaleDateString('pt-BR')}
        </div>
      </CardFooter>
    </Card>
  )
}
