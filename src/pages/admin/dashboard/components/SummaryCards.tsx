import { DashboardData } from '../services/dashboardService';
import { Skeleton } from '@/app/shared/components/ui/skeleton';

interface SummaryCardsProps {
  data: DashboardData['summary'];
  isLoading?: boolean;
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const cards = [
    {
      title: 'Recebido no Ano',
      value: data.paidYear,
      icon: '📊',
      color: 'bg-green-100 text-green-800',
      description: 'Total de pagamentos confirmados no ano'
    },
    {
      title: 'Recebido no Mês',
      value: data.paidMonth,
      icon: '💰',
      color: 'bg-blue-100 text-blue-800',
      description: 'Total de pagamentos confirmados no mês atual'
    },
    {
      title: 'Pendente no Mês',
      value: data.dueMonth,
      icon: '⏳',
      color: 'bg-orange-100 text-orange-800',
      description: 'Saldo devedor com vencimento no mês atual'
    },
    {
      title: 'Pagamentos Pendentes',
      value: data.pendingPayments,
      icon: '❗',
      color: 'bg-red-100 text-red-800',
      description: 'Número de pagamentos ainda não quitados',
      isCount: true
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <div className="mb-2">
            <p className="text-2xl font-bold text-gray-900">
              {card.isCount ? card.value : formatCurrency(card.value)}
            </p>
          </div>
          <p className="text-xs text-gray-600">{card.description}</p>
          <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${card.color}`}>
            {card.isCount ? 'Itens' : 'Financeiro'}
          </div>
        </div>
      ))}
    </div>
  );
}