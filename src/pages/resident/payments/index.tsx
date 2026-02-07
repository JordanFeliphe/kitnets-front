import { useState, useMemo } from 'react'
import { usePaymentStats, usePayments } from '../dashboard/hooks/useResident'
import { PaymentFilters as FilterType, Payment } from '../dashboard/types/resident.types'

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from '@/app/shared/components/ui/breadcrumb'
import { PaymentStats } from '@/pages/admin/payments/components/PaymentStats'
import { PaymentFilters } from '@/pages/admin/payments/components/PaymentFilters'
import { PaymentsTable, PaymentRow } from '@/pages/admin/payments/components/PaymentsTable'

export default function ResidentPayments() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    status: undefined
  })

  const {
    data: stats,
    isLoading: statsLoading,
  } = usePaymentStats()

  const {
    data: payments,
    isLoading: paymentsLoading,
  } = usePayments(currentPage, 10, filters)

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }


  // Transform payments data to match PaymentRow[] interface
  const statusMap: Record<Payment['status'], PaymentRow['status']> = {
    PAID: 'Pago',
    PENDING: 'Pendente',
    OVERDUE: 'Atrasado',
  }

  const paymentRows: PaymentRow[] = useMemo(() => {
    if (!payments?.data) return []
    return payments.data.map((p): PaymentRow => ({
      id: p.id,
      title: p.title,
      competencia: p.dueDate,
      vencimento: p.dueDate,
      pagamento: p.paymentDate ?? null,
      categoria: '',
      forma: null,
      valor: p.amount,
      status: statusMap[p.status] ?? 'Pendente',
    }))
  }, [payments])

  // Transform stats data to match PaymentStats interface
  const statsData = stats ? {
    totalPago: stats.totalPaid,
    valorPendente: stats.pendingAmount,
    proximoVencimento: stats.nextDueDate,
    emAtraso: stats.overdueAmount,
    pendentesCount: payments?.data.filter(p => p.status === 'PENDING').length || 0
  } : undefined

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/resident">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Meus Pagamentos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Meus Pagamentos</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seus pagamentos e acompanhe o histórico financeiro
        </p>
      </div>

      {/* Payment Stats */}
      <PaymentStats
        data={statsData}
        isLoading={statsLoading}
      />

      {/* Filters */}
      <PaymentFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isLoading={paymentsLoading}
      />

      {/* Payments Table */}
      <PaymentsTable
        data={paymentRows}
        loading={paymentsLoading}
      />
    </div>
  )
}