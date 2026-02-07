const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Tipos para as respostas
interface DashboardSummary {
  paidYear: number;
  paidMonth: number;
  dueMonth: number;
  pendingPayments: number;
}

interface ChartDataPoint {
  date: string;
  amount: number;
}

interface DashboardChart {
  period: string;
  paid: ChartDataPoint[];
  due: ChartDataPoint[];
}

export interface DashboardData {
  summary: DashboardSummary;
  chart: DashboardChart;
}

// Residents don't have dashboard API - removed resident dashboard types

// Função para buscar dados do dashboard admin
export const fetchAdminDashboard = async (token: string): Promise<DashboardData> => {
  const response = await fetch(`${API_BASE_URL}/dashboard/admin`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Acesso negado! Apenas administradores podem acessar.');
    }
    if (response.status === 401) {
      throw new Error('Token de autenticação inválido ou expirado.');
    }
    throw new Error('Erro ao carregar dados do dashboard');
  }

  return response.json();
};

// Residents don't have dashboard API - removed fetchResidentDashboard function