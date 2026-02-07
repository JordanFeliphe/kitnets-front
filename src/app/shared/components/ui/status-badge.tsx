import React from 'react';
import { Badge, type BadgeProps } from '@/app/shared/components/ui/badge';

interface StatusBadgeProps extends Omit<BadgeProps, 'children'> {
  status: string;
  showIcon?: boolean;
}

const statusConfig = {
  // User Status
  ACTIVE: { label: 'Ativo', variant: 'success' as const, icon: '●' },
  ativo: { label: 'Ativo', variant: 'success' as const, icon: '●' },
  INACTIVE: { label: 'Inativo', variant: 'secondary' as const, icon: '○' },
  BLOCKED: { label: 'Bloqueado', variant: 'destructive' as const, icon: '●' },

  // Unit Status
  AVAILABLE: { label: 'Disponível', variant: 'success' as const, icon: '✓' },
  Ocupada: { label: 'Ocupada', variant: 'default' as const, icon: '●' },
  Vazia: { label: 'Vazia', variant: 'secondary' as const, icon: '○' },
  'Manutenção': { label: 'Manutenção', variant: 'warning' as const, icon: '⚠' },
  MAINTENANCE: { label: 'Manutenção', variant: 'warning' as const, icon: '⚠' },

  // Payment/Transaction Status
  Pago: { label: 'Pago', variant: 'success' as const, icon: '✓' },
  PAID: { label: 'Pago', variant: 'success' as const, icon: '✓' },
  Pendente: { label: 'Pendente', variant: 'warning' as const, icon: '⏳' },
  PENDING: { label: 'Pendente', variant: 'warning' as const, icon: '⏳' },
  Atrasado: { label: 'Atrasado', variant: 'destructive' as const, icon: '⚠' },
  OVERDUE: { label: 'Em Atraso', variant: 'destructive' as const, icon: '⚠' },
  Cancelado: { label: 'Cancelado', variant: 'secondary' as const, icon: '✗' },
  CANCELLED: { label: 'Cancelado', variant: 'secondary' as const, icon: '✗' },

  // Contract Status
  Ativo: { label: 'Ativo', variant: 'success' as const, icon: '●' },
  Vencido: { label: 'Vencido', variant: 'destructive' as const, icon: '⚠' },
  'Renovação': { label: 'Renovação', variant: 'info' as const, icon: '⟲' },
  Encerrado: { label: 'Encerrado', variant: 'secondary' as const, icon: '■' },

  // Priority levels
  high: { label: 'Alta', variant: 'destructive' as const, icon: '●' },
  medium: { label: 'Média', variant: 'warning' as const, icon: '●' },
  low: { label: 'Baixa', variant: 'secondary' as const, icon: '●' },

  // User Roles
  ADMIN: { label: 'Administrador', variant: 'destructive' as const, icon: '⚡' },
  MANAGER: { label: 'Gerente', variant: 'default' as const, icon: '◆' },
  RESIDENT: { label: 'Morador', variant: 'secondary' as const, icon: '👤' },
} as const;

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  showIcon = false,
  className,
  ...props
}) => {
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) {
    return (
      <Badge variant={variant || 'outline'} className={className} {...props}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant={variant || config.variant} className={className} {...props}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;