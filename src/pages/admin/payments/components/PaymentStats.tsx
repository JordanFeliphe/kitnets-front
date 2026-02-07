import { formatCurrency, formatDate } from '@/app/shared/utils/formatters'
import { Badge } from '@/app/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/app/shared/components/ui/card'
import { Skeleton } from '@/app/shared/components/ui/skeleton'

interface PaymentStatsData {
  totalPago: number
  valorPendente: number
  proximoVencimento?: string
  emAtraso: number
  pendentesCount: number
}

interface PaymentStatsProps {
  data?: PaymentStatsData
  isLoading: boolean
}

function StatCard({
  title,
  value,
  subtitle,
  showAlert = false
}: {
  title: string
  value: string
  subtitle?: string
  showAlert?: boolean
}) {
  return (
    <Card className="rounded-2xl bg-card border shadow-xs">
      <CardHeader className="pb-2">
        <CardDescription className="text-sm font-medium">
          {title}
        </CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        {showAlert && (
          <CardAction>
            <Badge variant="destructive" className="text-xs">
              Atenção
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      {subtitle && (
        <CardContent className="pt-0 pb-4">
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        </CardContent>
      )}
    </Card>
  )
}

export function PaymentStats({ data, isLoading }: PaymentStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="rounded-2xl bg-card border shadow-xs">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-32" />
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Pago"
        value={formatCurrency(data.totalPago)}
        subtitle="Pagamentos realizados"
      />

      <StatCard
        title="Valor Pendente"
        value={formatCurrency(data.valorPendente)}
        subtitle={
          data.proximoVencimento
            ? `Vence ${formatDate(data.proximoVencimento)}`
            : 'Nenhum pendente'
        }
      />

      <StatCard
        title="Em Atraso"
        value={formatCurrency(data.emAtraso)}
        subtitle="Valores vencidos"
        showAlert={data.emAtraso > 0}
      />

      <StatCard
        title="Pagamentos Pendentes"
        value={data.pendentesCount.toString()}
        subtitle="Quantidade de pendências"
      />
    </div>
  )
}