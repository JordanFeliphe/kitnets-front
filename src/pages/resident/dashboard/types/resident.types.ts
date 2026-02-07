export interface DashboardSummary {
  resident: {
    name: string
    unit: string
    accountStatus: 'ACTIVE' | 'IN_GOOD_STANDING' | 'OVERDUE'
  }
  metrics: {
    pendingPaymentsCount: number
    nextDueDate?: string
    availableDocumentsCount: number
  }
}

export interface PaymentStats {
  totalPaid: number
  pendingAmount: number
  overdueAmount: number
  nextDueDate?: string
}

export interface Payment {
  id: string
  title: string
  dueDate: string
  paymentDate?: string
  amount: number
  status: 'PAID' | 'PENDING' | 'OVERDUE'
  description?: string
}

export interface PaymentFilters {
  search?: string
  status?: 'PAID' | 'PENDING' | 'OVERDUE' | 'ALL'
  startDate?: string
  endDate?: string
}

export interface PaginatedPayments {
  data: Payment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface Notification {
  id: string
  title: string
  message: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  date: string
  isRead: boolean
}

export interface QuickAction {
  id: string
  title: string
  description: string
  href: string
  icon: string
}