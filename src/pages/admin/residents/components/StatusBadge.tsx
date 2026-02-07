import React from 'react';
import { Badge } from '@/app/shared/components/ui/badge';
import { StatusBadgeProps } from '../types/residents.types';

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: 'Active',
          className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
        };
      case 'INACTIVE':
        return {
          label: 'Inactive',
          className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
        };
      case 'BLOCKED':
        return {
          label: 'Blocked',
          className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
        };
      case 'TRASH':
        return {
          label: 'Deleted',
          className: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={`${config.className} text-xs font-medium px-2 py-1`}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;