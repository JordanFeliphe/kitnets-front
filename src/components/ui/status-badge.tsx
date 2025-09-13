import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UserStatus, UnitStatus, LeaseStatus, TransactionStatus, UserRole } from '@/types';

interface StatusBadgeProps {
  status: UserStatus | UnitStatus | LeaseStatus | TransactionStatus | UserRole | string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'statusActive' | 'dangerAlt' | 'warningAlt' | 'statusDraft' | 'infoAlt';
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  // User Status
  ACTIVE: {
    label: 'Ativo',
    variant: 'default' as const,
    className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    icon: '●',
  },
  ativo: {
    label: 'Ativo',
    variant: 'default' as const,
    className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    icon: '●',
  },
  INACTIVE: {
    label: 'Inativo',
    variant: 'secondary' as const,
    className: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
    icon: '○',
  },
  BLOCKED: {
    label: 'Bloqueado',
    variant: 'destructive' as const,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    icon: '●',
  },

  // Unit Status
  AVAILABLE: {
    label: 'Disponível',
    variant: 'default' as const,
    className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    icon: '✓',
  },
  Ocupada: {
    label: 'Ocupada',
    variant: 'default' as const,
    className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    icon: '●',
  },
  Vazia: {
    label: 'Vazia',
    variant: 'secondary' as const,
    className: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
    icon: '○',
  },
  'Manutenção': {
    label: 'Manutenção',
    variant: 'outline' as const,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    icon: '⚠',
  },
  MAINTENANCE: {
    label: 'Manutenção',
    variant: 'outline' as const,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    icon: '⚠',
  },

  // Payment/Transaction Status
  Pago: {
    label: 'Pago',
    variant: 'default' as const,
    className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    icon: '✓',
  },
  PAID: {
    label: 'Pago',
    variant: 'default' as const,
    className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    icon: '✓',
  },
  Pendente: {
    label: 'Pendente',
    variant: 'outline' as const,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    icon: '⏳',
  },
  PENDING: {
    label: 'Pendente',
    variant: 'outline' as const,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    icon: '⏳',
  },
  Atrasado: {
    label: 'Atrasado',
    variant: 'destructive' as const,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    icon: '⚠',
  },
  OVERDUE: {
    label: 'Em Atraso',
    variant: 'destructive' as const,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    icon: '⚠',
  },
  Cancelado: {
    label: 'Cancelado',
    variant: 'secondary' as const,
    className: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
    icon: '✗',
  },
  CANCELLED: {
    label: 'Cancelado',
    variant: 'secondary' as const,
    className: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
    icon: '✗',
  },

  // Contract Status
  Ativo: {
    label: 'Ativo',
    variant: 'statusActive' as const,
    className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    icon: '●',
  },
  Vencido: {
    label: 'Vencido',
    variant: 'dangerAlt' as const,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    icon: '⚠',
  },
  'Renovação': {
    label: 'Renovação',
    variant: 'warningAlt' as const,
    className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    icon: '⟲',
  },
  Encerrado: {
    label: 'Encerrado',
    variant: 'statusDraft' as const,
    className: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
    icon: '■',
  },

  // Priority levels
  high: {
    label: 'Alta',
    variant: 'destructive' as const,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    icon: '●',
  },
  medium: {
    label: 'Média',
    variant: 'outline' as const,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    icon: '●',
  },
  low: {
    label: 'Baixa',
    variant: 'secondary' as const,
    className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    icon: '●',
  },

  // User Roles
  ADMIN: {
    label: 'Administrador',
    variant: 'destructive' as const,
    className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    icon: '⚡',
  },
  MANAGER: {
    label: 'Gerente',
    variant: 'default' as const,
    className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    icon: '◆',
  },
  RESIDENT: {
    label: 'Morador',
    variant: 'secondary' as const,
    className: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
    icon: '👤',
  },
} as const;

const sizeClasses = {
  sm: 'text-xs px-2 py-1 rounded-full border',
  default: 'text-xs px-2.5 py-1 rounded-full border',
  lg: 'text-sm px-3 py-1.5 rounded-full border',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  size = 'default',
  showIcon = false,
  className,
}) => {
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) {
    // Fallback for unknown status
    return (
      <Badge
        variant={variant || 'outline'}
        className={cn(sizeClasses[size], className)}
      >
        {status}
      </Badge>
    );
  }

  return (
    <Badge
      variant={variant || config.variant}
      className={cn(
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
};

// Specific status badge components for better type safety
export const UserStatusBadge: React.FC<Omit<StatusBadgeProps, 'status'> & { status: UserStatus }> = (props) => (
  <StatusBadge {...props} />
);

export const UnitStatusBadge: React.FC<Omit<StatusBadgeProps, 'status'> & { status: UnitStatus }> = (props) => (
  <StatusBadge {...props} />
);

export const LeaseStatusBadge: React.FC<Omit<StatusBadgeProps, 'status'> & { status: LeaseStatus }> = (props) => (
  <StatusBadge {...props} />
);

export const TransactionStatusBadge: React.FC<Omit<StatusBadgeProps, 'status'> & { status: TransactionStatus }> = (props) => (
  <StatusBadge {...props} />
);

export const UserRoleBadge: React.FC<Omit<StatusBadgeProps, 'status'> & { status: UserRole }> = (props) => (
  <StatusBadge {...props} />
);

// Multi-status badge for showing multiple states
interface MultiStatusBadgeProps {
  statuses: Array<{
    status: string;
    label?: string;
    variant?: StatusBadgeProps['variant'];
  }>;
  separator?: string;
  className?: string;
}

export const MultiStatusBadge: React.FC<MultiStatusBadgeProps> = ({
  statuses,
  separator = ' • ',
  className,
}) => {
  if (statuses.length === 0) return null;

  if (statuses.length === 1) {
    return (
      <StatusBadge
        status={statuses[0].status}
        variant={statuses[0].variant}
        className={className}
      />
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {statuses.map((item, index) => (
        <React.Fragment key={index}>
          <StatusBadge
            status={item.status}
            variant={item.variant}
            size="sm"
          />
          {index < statuses.length - 1 && (
            <span className="text-xs text-muted-foreground">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Animated status badge for real-time updates
interface AnimatedStatusBadgeProps extends StatusBadgeProps {
  animate?: boolean;
  pulseOnChange?: boolean;
}

export const AnimatedStatusBadge: React.FC<AnimatedStatusBadgeProps> = ({
  animate = false,
  pulseOnChange = false,
  className,
  ...props
}) => {
  const [shouldPulse, setShouldPulse] = React.useState(false);
  const prevStatus = React.useRef(props.status);

  React.useEffect(() => {
    if (pulseOnChange && prevStatus.current !== props.status) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 1000);
      prevStatus.current = props.status;
      return () => clearTimeout(timer);
    }
  }, [props.status, pulseOnChange]);

  return (
    <StatusBadge
      {...props}
      className={cn(
        animate && 'transition-all duration-200 ease-in-out',
        shouldPulse && 'animate-pulse',
        className
      )}
    />
  );
};