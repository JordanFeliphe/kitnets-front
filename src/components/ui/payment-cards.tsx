import React from "react"
import { MoreVerticalIcon, EyeIcon, DownloadIcon, ReceiptIcon, AlertTriangleIcon, CalendarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface PaymentCardData {
  id: string
  title: string
  competencia: string
  vencimento: string
  pagamento: string | null
  categoria: string
  forma: string | null
  valor: number
  status: "Pago" | "Pendente" | "Atrasado" | "Cancelado"
}

interface PaymentCardProps {
  payment: PaymentCardData
  onViewDetails?: (payment: PaymentCardData) => void
  onDownloadReceipt?: (payment: PaymentCardData) => void
  onDownloadInvoice?: (payment: PaymentCardData) => void
  onDispute?: (payment: PaymentCardData) => void
  onClick?: (payment: PaymentCardData) => void
}

interface PaymentCardsProps {
  payments: PaymentCardData[]
  loading?: boolean
  onViewDetails?: (payment: PaymentCardData) => void
  onDownloadReceipt?: (payment: PaymentCardData) => void
  onDownloadInvoice?: (payment: PaymentCardData) => void
  onDispute?: (payment: PaymentCardData) => void
  onClick?: (payment: PaymentCardData) => void
}

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "pago":
      return "statusActive"
    case "pendente":
      return "statusPending"
    case "atrasado":
      return "statusBlocked"
    case "cancelado":
      return "statusInactive"
    default:
      return "outline"
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function PaymentCard({
  payment,
  onViewDetails,
  onDownloadReceipt,
  onDownloadInvoice,
  onDispute,
  onClick,
}: PaymentCardProps) {
  return (
    <Card 
      className={cn(
        "@container/card hover:bg-accent/50 transition-colors",
        onClick && "cursor-pointer"
      )}
      onClick={onClick ? () => onClick(payment) : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight mb-1">
              {payment.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {payment.competencia}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={getStatusVariant(payment.status)} className="text-xs">
              {payment.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Abrir menu de ações"
                >
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewDetails?.(payment)
                  }}
                  className="cursor-pointer"
                >
                  <EyeIcon className="mr-2 h-4 w-4" />
                  Ver detalhes
                </DropdownMenuItem>
                {payment.status === "Pago" && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDownloadReceipt?.(payment)
                    }}
                    className="cursor-pointer"
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Baixar recibo
                  </DropdownMenuItem>
                )}
                {payment.status !== "Pago" && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDownloadInvoice?.(payment)
                    }}
                    className="cursor-pointer"
                  >
                    <ReceiptIcon className="mr-2 h-4 w-4" />
                    Baixar boleto/2ª via
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDispute?.(payment)
                  }}
                  className="cursor-pointer"
                >
                  <AlertTriangleIcon className="mr-2 h-4 w-4" />
                  Disputar/solicitar revisão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Valor:</span>
            <span className="text-sm font-semibold">
              {formatCurrency(payment.valor)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground block">Vencimento:</span>
              <span className="font-medium">{payment.vencimento}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Pagamento:</span>
              <span className="font-medium">
                {payment.pagamento || <span className="text-muted-foreground">—</span>}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground block">Categoria:</span>
              <Badge variant="outline" className="text-xs mt-1">
                {payment.categoria}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground block">Forma:</span>
              <span className="font-medium">
                {payment.forma || <span className="text-muted-foreground">—</span>}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                onViewDetails?.(payment)
              }}
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PaymentCards({
  payments,
  loading = false,
  onViewDetails,
  onDownloadReceipt,
  onDownloadInvoice,
  onDispute,
  onClick,
}: PaymentCardsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="@container/card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
                <div className="h-6 bg-muted animate-pulse rounded w-16" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-muted animate-pulse rounded w-16" />
                  <div className="h-4 bg-muted animate-pulse rounded w-20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </div>
                <div className="pt-2 border-t">
                  <div className="h-8 bg-muted animate-pulse rounded w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <Card className="@container/card">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-lg mb-2">Nenhum pagamento encontrado</CardTitle>
          <CardDescription>
            Não foram encontrados pagamentos com os filtros aplicados.
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          onViewDetails={onViewDetails}
          onDownloadReceipt={onDownloadReceipt}
          onDownloadInvoice={onDownloadInvoice}
          onDispute={onDispute}
          onClick={onClick}
        />
      ))}
    </div>
  )
}