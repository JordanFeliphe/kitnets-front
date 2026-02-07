import { useQuery } from "@tanstack/react-query"
import { TrendingUpIcon, CreditCardIcon, UsersIcon, AlertTriangleIcon } from "lucide-react"
import { useAuth } from "@/app/shared/contexts/AuthContext"
import { formatCurrency } from "@/app/shared/utils/formatters"
import { fetchAdminDashboard } from "../services/dashboardService"

interface DashboardCardData {
  title: string
  value: string | number
  subtitle?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  icon?: any
  trend?: {
    value: number
    isPositive: boolean
  }
}

// Hook que transforma dados da API em cards do dashboard
export const useDashboardData = () => {
  const { user, token } = useAuth()
  const isAdmin = user?.type === 'ADMIN'

  // Use API data for admin
  const { data: apiData, isLoading: apiLoading } = useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => fetchAdminDashboard(token!),
    enabled: !!user && !!token && isAdmin,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // Residents don't have dashboard API
  const residentData = null
  const residentLoading = false

  return useQuery({
    queryKey: ['dashboard-cards', user?.type, apiData, residentData],
    queryFn: async (): Promise<DashboardCardData[]> => {
      if (isAdmin && apiData) {
        // Transform admin API data to dashboard cards
        return [
          {
            title: "Receita Anual",
            value: formatCurrency(apiData.summary.paidYear),
            subtitle: "Total recebido no ano",
            variant: 'success',
            icon: TrendingUpIcon,
            trend: {
              value: apiData.summary.paidYear > 0 ? 8.2 : 0,
              isPositive: true
            }
          },
          {
            title: "Receita Mensal",
            value: formatCurrency(apiData.summary.paidMonth),
            subtitle: "Total recebido no mês",
            variant: 'success',
            icon: CreditCardIcon,
            trend: {
              value: apiData.summary.paidMonth > 0 ? 5.1 : 0,
              isPositive: true
            }
          },
          {
            title: "Valores Pendentes",
            value: formatCurrency(apiData.summary.dueMonth),
            subtitle: "Valores devidos no mês",
            variant: apiData.summary.dueMonth > 0 ? 'warning' : 'success',
            icon: AlertTriangleIcon,
            trend: {
              value: apiData.summary.dueMonth > 0 ? -2.1 : 0,
              isPositive: false
            }
          },
          {
            title: "Pagamentos Pendentes",
            value: apiData.summary.pendingPayments,
            subtitle: "Número de pendências",
            variant: apiData.summary.pendingPayments > 0 ? 'error' : 'success',
            icon: UsersIcon,
            trend: {
              value: apiData.summary.pendingPayments > 0 ? -1.5 : 0,
              isPositive: apiData.summary.pendingPayments === 0
            }
          }
        ];
      }

      // Residents don't have dashboard data
      if (!isAdmin) {
        return [];
      }

      // Fallback empty data
      return [];
    },
    enabled: !!(isAdmin ? apiData : residentData) || (isAdmin ? !apiLoading : !residentLoading),
    staleTime: 1 * 60 * 1000,
  });
};

export const useAdminDashboard = () => {
  const { user, token } = useAuth();

  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => fetchAdminDashboard(token!),
    enabled: !!token && user?.type === 'ADMIN',
    staleTime: 2 * 60 * 1000, // 2 minutos (dados financeiros devem ser mais atualizados)
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos automaticamente
  });
};

// Residents don't have dashboard API - removed useResidentDashboard hook