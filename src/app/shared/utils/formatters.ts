import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const formatDate = (date: Date | string, dateFormat: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, dateFormat, { locale: ptBR })
}

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE'

export const statusToBadgeVariant = (status: PaymentStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'PAID':
      return 'outline' // discrete outline for paid
    case 'PENDING':
      return 'secondary' // secondary for pending
    case 'OVERDUE':
      return 'destructive' // only destructive for overdue
    default:
      return 'outline'
  }
}

export const statusToLabel = (status: PaymentStatus): string => {
  switch (status) {
    case 'PAID':
      return 'Pago'
    case 'PENDING':
      return 'Pendente'
    case 'OVERDUE':
      return 'Atrasado'
    default:
      return status
  }
}

export const truncateText = (text: string, maxLength: number = 10): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Log-specific formatters
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export const formatLogDateTime = (timestamp: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp))
}

export const formatLogTimeAgo = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s atrás`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m atrás`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h atrás`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d atrás`
  }

  return formatLogDateTime(timestamp)
}

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export const getLevelColor = (level: LogLevel): string => {
  switch (level.toLowerCase()) {
    case 'error':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'warn':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'info':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'debug':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getLevelTextColor = (level: LogLevel): string => {
  switch (level.toLowerCase()) {
    case 'error':
      return 'text-red-600'
    case 'warn':
      return 'text-yellow-600'
    case 'info':
      return 'text-blue-600'
    case 'debug':
      return 'text-gray-600'
    default:
      return 'text-gray-600'
  }
}

export const isRecentLog = (timestamp: string, minutesThreshold: number = 5): boolean => {
  const logTime = new Date(timestamp)
  const now = new Date()
  const thresholdAgo = new Date(now.getTime() - minutesThreshold * 60 * 1000)
  return logTime > thresholdAgo
}

export const formatEndpoint = (method?: string, endpoint?: string): string => {
  if (!endpoint) return '—'
  if (!method) return endpoint
  return `${method.toUpperCase()} ${endpoint}`
}

export const maskSensitiveData = (text: string): string => {
  // Mask potential passwords, tokens, keys
  return text
    .replace(/password["\s]*[:=]["\s]*[^"\s,}]+/gi, 'password: "***"')
    .replace(/token["\s]*[:=]["\s]*[^"\s,}]+/gi, 'token: "***"')
    .replace(/key["\s]*[:=]["\s]*[^"\s,}]+/gi, 'key: "***"')
    .replace(/secret["\s]*[:=]["\s]*[^"\s,}]+/gi, 'secret: "***"')
}

// CPF formatter
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Phone formatter
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  return phone;
};

// Default export with all formatters
export const formatters = {
  date: formatDate,
  dateTime: formatDateTime,
  currency: formatCurrency,
  cpf: formatCPF,
  phone: formatPhone,
  number: formatNumber,
  logDateTime: formatLogDateTime,
  logTimeAgo: formatLogTimeAgo,
  truncateText,
  maskSensitiveData,
  getLevelColor,
  getLevelTextColor,
  isRecentLog,
  formatEndpoint,
  statusToBadgeVariant,
  statusToLabel,
};