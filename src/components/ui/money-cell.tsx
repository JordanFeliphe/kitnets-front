import React from 'react'
import { cn } from '@/lib/utils'

interface MoneyCellProps {
  value: number | string
  currency?: string
  className?: string
  variant?: 'default' | 'positive' | 'negative' | 'muted'
}

export const MoneyCell: React.FC<MoneyCellProps> = ({
  value,
  currency = 'R$',
  className,
  variant = 'default'
}) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value
  
  const formatValue = (val: number) => {
    return val.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'positive':
        return 'text-green-600 font-semibold'
      case 'negative':
        return 'text-red-600 font-semibold'
      case 'muted':
        return 'text-muted-foreground'
      default:
        return 'font-medium'
    }
  }

  return (
    <span className={cn(getVariantStyles(), className)}>
      {currency} {formatValue(numericValue)}
    </span>
  )
}