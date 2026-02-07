import { LucideIcon } from "lucide-react"
import { Badge } from "@/app/shared/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card"
import { cn } from "@/app/shared/utils/cn"

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className
}: DashboardCardProps) {
  const getCardClasses = () => {
    // Always use neutral card styling regardless of variant
    return 'border-border bg-card text-card-foreground'
  }

  const getTrendBadgeVariant = (): "outline" => {
    return 'outline'
  }

  const getTrendIcon = () => {
    if (!trend || !Icon) return null

    const iconColor = 'text-muted-foreground'

    return <Icon className={cn("h-3 w-3", iconColor)} />
  }

  return (
    <Card className={cn("@container/card rounded-2xl shadow-xs", getCardClasses(), className)}>
      <CardHeader className="relative pb-2">
        <CardDescription className="text-xs font-medium">{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        {trend && (
          <div className="absolute right-4 top-4">
            <Badge variant={getTrendBadgeVariant()} className={cn(
              "flex gap-1 rounded-lg text-xs text-muted-foreground border-border"
            )}>
              {getTrendIcon()}
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Badge>
          </div>
        )}
      </CardHeader>
      {subtitle && (
        <CardFooter className="pt-1">
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardFooter>
      )}
    </Card>
  )
}