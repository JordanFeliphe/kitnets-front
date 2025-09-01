"use client"

import * as React from "react"
import { Tooltip, Legend, TooltipProps, LegendProps } from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = Record<string, { label?: string; color?: string }>

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({
  config,
  className,
  style,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn(className)}
      style={{
        ...Object.fromEntries(
          Object.entries(config).map(([key, value]) => [
            `--color-${key}`,
            value.color,
          ])
        ),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function ChartTooltip({
  content,
  ...props
}: React.ComponentProps<typeof Tooltip>) {
  return <Tooltip content={content} {...props} />
}

interface ChartTooltipContentProps
  extends TooltipProps<number, string> {
  indicator?: "dot" | "line"
  labelFormatter?: (value: any) => React.ReactNode
  className?: string
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
  labelFormatter,
  className,
}: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null

  const formattedLabel = labelFormatter ? labelFormatter(label) : label

  return (
    <div
      className={cn(
        "grid gap-2 rounded-lg border bg-background p-2 text-xs shadow-md",
        className
      )}
    >
      {formattedLabel && (
        <div className="font-medium text-foreground">{formattedLabel}</div>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.name && (
              <span className="text-muted-foreground">{item.name}</span>
            )}
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartLegend({
  content,
  ...props
}: React.ComponentProps<typeof Legend>) {
  return <Legend content={content} {...props} />
}

interface ChartLegendContentProps extends LegendProps {
  className?: string
}

export function ChartLegendContent({
  payload,
  className,
  ...props
}: ChartLegendContentProps) {
  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      {payload?.map((item) => (
        <div key={item.value} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-muted-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
