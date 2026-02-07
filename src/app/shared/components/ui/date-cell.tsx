import React from 'react'
import { cn } from '@/app/shared/utils/cn'
import { format, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DateCellProps {
  value: string | Date
  className?: string
  format?: string
  variant?: 'default' | 'muted' | 'relative'
  emptyText?: string
}

export const DateCell: React.FC<DateCellProps> = ({
  value,
  className,
  format: dateFormat = 'dd/MM/yyyy',
  variant = 'default',
  emptyText = '-'
}) => {
  const parseDate = (dateValue: string | Date): Date | null => {
    if (!dateValue) return null
    
    if (dateValue instanceof Date) {
      return isValid(dateValue) ? dateValue : null
    }
    
    if (typeof dateValue === 'string') {
      // Try parsing ISO string first
      try {
        const isoDate = parseISO(dateValue)
        if (isValid(isoDate)) return isoDate
      } catch {}
      
      // Try parsing DD/MM/YYYY format
      if (dateValue.includes('/')) {
        const [day, month, year] = dateValue.split('/')
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        if (isValid(date)) return date
      }
      
      // Try parsing as regular Date
      const date = new Date(dateValue)
      return isValid(date) ? date : null
    }
    
    return null
  }

  const formatDate = (date: Date): string => {
    try {
      return format(date, dateFormat, { locale: ptBR })
    } catch {
      return emptyText
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'muted':
        return 'text-muted-foreground'
      case 'relative':
        return 'text-sm'
      default:
        return ''
    }
  }

  const date = parseDate(value)
  
  if (!date) {
    return (
      <span className={cn('text-muted-foreground', className)}>
        {emptyText}
      </span>
    )
  }

  return (
    <span className={cn(getVariantStyles(), className)}>
      {formatDate(date)}
    </span>
  )
}