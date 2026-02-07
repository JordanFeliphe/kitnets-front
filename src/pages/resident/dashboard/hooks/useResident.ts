import { useQuery } from "@tanstack/react-query"
import { DashboardSummary, PaymentStats, PaginatedPayments, PaymentFilters, Notification } from "../types/resident.types"

// Mock API functions (replace with real API calls later)
const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    resident: {
      name: "João Silva",
      unit: "Apto 101",
      accountStatus: "IN_GOOD_STANDING"
    },
    metrics: {
      pendingPaymentsCount: 2,
      nextDueDate: "2024-01-15",
      availableDocumentsCount: 5
    }
  }
}

const fetchPaymentStats = async (): Promise<PaymentStats> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  return {
    totalPaid: 15420.50,
    pendingAmount: 2850.00,
    overdueAmount: 0,
    nextDueDate: "2024-01-15"
  }
}

const fetchPayments = async (params: { page: number; limit: number; filters: PaymentFilters }): Promise<PaginatedPayments> => {
  await new Promise(resolve => setTimeout(resolve, 1200))

  const mockPayments = [
    {
      id: "1",
      title: "Aluguel Janeiro 2024",
      dueDate: "2024-01-15",
      paymentDate: "2024-01-12",
      amount: 1500.00,
      status: "PAID" as const,
      description: "Pagamento referente ao aluguel de janeiro"
    },
    {
      id: "2",
      title: "Taxa de Condomínio",
      dueDate: "2024-01-10",
      amount: 350.00,
      status: "PENDING" as const,
      description: "Taxa mensal de condomínio"
    },
    {
      id: "3",
      title: "Internet/Wi-Fi",
      dueDate: "2024-01-05",
      amount: 120.00,
      status: "OVERDUE" as const,
      description: "Serviço de internet residencial"
    }
  ]

  return {
    data: mockPayments,
    pagination: {
      page: params.page,
      limit: params.limit,
      total: mockPayments.length,
      totalPages: Math.ceil(mockPayments.length / params.limit)
    }
  }
}

const fetchNotifications = async (): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 600))

  return [
    {
      id: "1",
      title: "Nova Taxa de Condomínio",
      message: "Foi adicionada uma nova cobrança de taxa de condomínio",
      severity: "HIGH",
      date: "2024-01-10T10:30:00Z",
      isRead: false
    },
    {
      id: "2",
      title: "Manutenção Programada",
      message: "Haverá manutenção no elevador no próximo sábado",
      severity: "MEDIUM",
      date: "2024-01-09T15:20:00Z",
      isRead: false
    },
    {
      id: "3",
      title: "Novo Regulamento",
      message: "Foi atualizado o regulamento do condomínio",
      severity: "LOW",
      date: "2024-01-08T09:45:00Z",
      isRead: true
    }
  ]
}

// Custom hooks
export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
  })
}

export const usePaymentStats = () => {
  return useQuery({
    queryKey: ['payment-stats'],
    queryFn: fetchPaymentStats,
  })
}

export const usePayments = (page: number = 1, limit: number = 10, filters: PaymentFilters = {}) => {
  return useQuery({
    queryKey: ['payments', page, limit, filters],
    queryFn: () => fetchPayments({ page, limit, filters }),
  })
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  })
}