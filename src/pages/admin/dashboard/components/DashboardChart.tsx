'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DashboardData } from '../services/dashboardService';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardChartProps {
  data: DashboardData['chart'];
  isLoading?: boolean;
}

export function DashboardChart({ data, isLoading }: DashboardChartProps) {
  const chartData = useMemo(() => {
    // Combinar dados de pagos e devidos por data
    const allDates = new Set([
      ...data.paid.map(item => item.date),
      ...data.due.map(item => item.date)
    ]);

    return Array.from(allDates)
      .sort()
      .map(date => {
        const paidItem = data.paid.find(item => item.date === date);
        const dueItem = data.due.find(item => item.date === date);

        return {
          date,
          formattedDate: format(parseISO(date), 'dd/MM', { locale: ptBR }),
          paid: paidItem?.amount || 0,
          due: dueItem?.amount || 0
        };
      });
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Fluxo Financeiro - Mês Atual</h3>
        <div className="h-80 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">📊</p>
            <p>Nenhum dado disponível para o período</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Fluxo Financeiro - Mês Atual</h3>
        <p className="text-sm text-gray-600">Pagamentos recebidos vs. valores devidos por dia</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorDue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="formattedDate"
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-medium text-gray-900">{`Data: ${label}`}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                          {entry.name === 'paid' ? 'Recebido' : 'Devido'}: {formatCurrency(Number(entry.value))}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              formatter={(value) => value === 'paid' ? 'Pagamentos Recebidos' : 'Valores Devidos'}
            />
            <Area
              type="monotone"
              dataKey="paid"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#colorPaid)"
              name="paid"
            />
            <Area
              type="monotone"
              dataKey="due"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="url(#colorDue)"
              name="due"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}