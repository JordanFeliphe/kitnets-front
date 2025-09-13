import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, CreditCard } from "lucide-react"

interface Payment {
  id: number
  title: string
  dueDate: string
  paymentDate?: string
  amount: string
  status: 'Pago' | 'Pendente' | 'Atrasado'
}

interface ResidentPaymentsTableProps {
  data: Payment[]
  loading?: boolean
  onDownloadReceipt?: (payment: Payment) => void
  onPayNow?: (payment: Payment) => void
}

const formatCurrency = (value: string) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(parseFloat(value))
}

const formatDate = (dateString: string) => {
  return new Date(dateString.split('/').reverse().join('-')).toLocaleDateString('pt-BR')
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pago':
      return <Badge variant="statusActive" className="text-xs">{status}</Badge>
    case 'Pendente':
      return <Badge variant="warningAlt" className="text-xs">{status}</Badge>
    case 'Atrasado':
      return <Badge variant="dangerAlt" className="text-xs">{status}</Badge>
    default:
      return <Badge variant="statusDraft" className="text-xs">{status}</Badge>
  }
}

export function ResidentPaymentsTable({
  data,
  loading = false,
  onDownloadReceipt,
  onPayNow,
}: ResidentPaymentsTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Desktop Skeleton */}
        <div className="hidden md:block rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                <TableHead><Skeleton className="h-4 w-14" /></TableHead>
                <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Skeleton */}
        <div className="md:hidden space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full ml-2" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div>
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              <div className="pt-3 border-t">
                <Skeleton className="h-8 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8">
        <div className="text-center text-muted-foreground">
          <p>Nenhum pagamento encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Data Pagamento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(payment.dueDate)}
                </TableCell>
                <TableCell className="text-sm">
                  {payment.paymentDate ? (
                    formatDate(payment.paymentDate)
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(payment.amount)}
                </TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>
                  {payment.status === 'Pago' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadReceipt?.(payment)}
                      className="h-8 w-8 p-0"
                      title="Baixar comprovante"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPayNow?.(payment)}
                      className="h-8 w-8 p-0"
                      title="Pagar agora"
                    >
                      <CreditCard className="h-3 w-3" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((payment) => (
          <div key={payment.id} className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{payment.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Vence em {formatDate(payment.dueDate)}
                </p>
              </div>
              <div className="ml-2">{getStatusBadge(payment.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Pagamento</p>
                <p className="font-medium">
                  {payment.paymentDate ? formatDate(payment.paymentDate) : 'Não pago'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Valor</p>
                <p className="font-medium">{formatCurrency(payment.amount)}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t">
              {payment.status === 'Pago' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadReceipt?.(payment)}
                  className="w-full"
                >
                  <Download className="h-3 w-3 mr-2" />
                  Baixar Comprovante
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onPayNow?.(payment)}
                  className="w-full"
                >
                  <CreditCard className="h-3 w-3 mr-2" />
                  Pagar Agora
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}