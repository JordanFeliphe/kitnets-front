import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/shared/components/ui/card';
import { Skeleton } from '@/app/shared/components/ui/skeleton';
import { cn } from '@/app/shared/utils/cn';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Home,
  Calendar,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: {
    value: number;
    period: string;
    isPositive?: boolean;
  };
  icon?: React.ElementType;
  iconColor?: string;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  status?: 'success' | 'warning' | 'error' | 'neutral';
  format?: 'currency' | 'percentage' | 'number' | 'text';
}

const formatValue = (value: string | number, format: string = 'number'): string => {
  if (typeof value === 'string') return value;

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'number':
      return new Intl.NumberFormat('pt-BR').format(value);
    default:
      return String(value);
  }
};

const getTrendIcon = (isPositive: boolean, value: number) => {
  if (value === 0) return Minus;
  return isPositive ? TrendingUp : TrendingDown;
};

const getStatusColor = (_status?: string) => {
  // Always use neutral colors that adapt to theme
  return 'text-foreground';
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  change,
  icon: Icon,
  iconColor = 'text-muted-foreground',
  loading = false,
  className,
  onClick,
  status: _status,
  format = 'number',
}) => {
  const TrendIcon = change ? getTrendIcon(change.isPositive ?? true, change.value) : null;

  if (loading) {
    return (
      <Card className={cn('hover:shadow-md transition-shadow', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'hover:shadow-md transition-all duration-200',
        onClick && 'cursor-pointer hover:bg-accent/5',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn('h-4 w-4', iconColor)} />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className={cn(
            'text-2xl font-bold',
            getStatusColor(_status)
          )}>
            {formatValue(value, format)}
          </div>
          
          {change && (
            <div className="flex items-center space-x-1">
              {TrendIcon && (
                <TrendIcon className={cn(
                  'h-3 w-3',
                  change.isPositive
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground'
                )} />
              )}
              <span className={cn(
                'text-xs font-medium',
                change.isPositive
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground'
              )}>
                {Math.abs(change.value).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        
        {(description || change) && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
            {change && (
              <span className="text-xs text-muted-foreground">
                vs {change.period}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Specialized metric card components
interface RevenueCardProps extends Omit<MetricCardProps, 'format' | 'icon'> {
  value: number;
}

export const RevenueCard: React.FC<RevenueCardProps> = (props) => (
  <MetricCard
    {...props}
    format="currency"
    icon={DollarSign}
    iconColor="text-muted-foreground"
  />
);

interface OccupancyCardProps extends Omit<MetricCardProps, 'format' | 'icon'> {
  value: number;
  occupied: number;
  total: number;
}

export const OccupancyCard: React.FC<OccupancyCardProps> = ({
  occupied,
  total,
  ...props
}) => {
  const occupancyRate = total > 0 ? (occupied / total) * 100 : 0;
  
  return (
    <MetricCard
      {...props}
      value={occupancyRate}
      description={`${occupied} de ${total} unidades`}
      format="percentage"
      icon={Home}
      iconColor="text-muted-foreground"
      status={occupancyRate >= 80 ? 'success' : occupancyRate >= 60 ? 'warning' : 'error'}
    />
  );
};

interface CollectionRateCardProps extends Omit<MetricCardProps, 'format' | 'icon'> {
  value: number;
}

export const CollectionRateCard: React.FC<CollectionRateCardProps> = (props) => (
  <MetricCard
    {...props}
    format="percentage"
    icon={CheckCircle}
    iconColor="text-emerald-600 dark:text-emerald-400"
    status={props.value >= 95 ? 'success' : props.value >= 85 ? 'warning' : 'error'}
  />
);

// Metric cards grid component
interface MetricCardsGridProps {
  metrics: Array<MetricCardProps & { id: string }>;
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const MetricCardsGrid: React.FC<MetricCardsGridProps> = ({
  metrics,
  loading = false,
  columns = 4,
  className,
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          {...metric}
          loading={loading}
        />
      ))}
    </div>
  );
};

// Quick stats component for dashboard summary
interface QuickStatsProps {
  stats: {
    revenue: number;
    occupiedUnits: number;
    totalUnits: number;
    pendingPayments: number;
    overduePayments: number;
  };
  loading?: boolean;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats, loading }) => {
  const metrics = [
    {
      id: 'revenue',
      title: 'Receita Mensal',
      value: stats.revenue,
      description: 'Total arrecadado',
      icon: DollarSign,
      format: 'currency' as const,
      iconColor: 'text-muted-foreground',
    },
    {
      id: 'occupancy',
      title: 'Taxa de Ocupação',
      value: stats.totalUnits > 0 ? (stats.occupiedUnits / stats.totalUnits) * 100 : 0,
      description: `${stats.occupiedUnits}/${stats.totalUnits} unidades`,
      icon: Home,
      format: 'percentage' as const,
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'pending',
      title: 'Pagamentos Pendentes',
      value: stats.pendingPayments,
      description: 'Aguardando pagamento',
      icon: Calendar,
      format: 'number' as const,
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      status: stats.pendingPayments > 0 ? 'warning' as const : 'success' as const,
    },
    {
      id: 'overdue',
      title: 'Em Atraso',
      value: stats.overduePayments,
      description: 'Pagamentos atrasados',
      icon: AlertCircle,
      format: 'number' as const,
      iconColor: 'text-muted-foreground',
      status: stats.overduePayments > 0 ? 'error' as const : 'success' as const,
    },
  ];

  return <MetricCardsGrid metrics={metrics} loading={loading} />;
};