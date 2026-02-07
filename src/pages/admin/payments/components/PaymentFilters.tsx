import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/app/shared/utils/cn'
import { PaymentFilters as FilterType } from '@/pages/resident/dashboard/types/resident.types'

import { Button } from '@/app/shared/components/ui/button'
import { Input } from '@/app/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/shared/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/shared/components/ui/popover'
import { Calendar } from '@/app/shared/components/ui/calendar'
import { SearchIcon, FilterIcon, CalendarIcon, XIcon } from 'lucide-react'

interface PaymentFiltersProps {
  filters: FilterType
  onFiltersChange: (filters: FilterType) => void
  isLoading?: boolean
}

export function PaymentFilters({
  filters,
  onFiltersChange,
  isLoading = false
}: PaymentFiltersProps) {
  const [dateRange, setDateRange] = useState<{
    from?: Date
    to?: Date
  }>({})

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === 'ALL' ? undefined : value as 'PAID' | 'PENDING' | 'OVERDUE'
    })
  }

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range)
    onFiltersChange({
      ...filters,
      startDate: range.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      endDate: range.to ? format(range.to, 'yyyy-MM-dd') : undefined
    })
  }

  const clearDateRange = () => {
    setDateRange({})
    onFiltersChange({
      ...filters,
      startDate: undefined,
      endDate: undefined
    })
  }

  const hasActiveFilters = filters.search || filters.status || filters.startDate || filters.endDate

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por título..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
          disabled={isLoading}
        />
      </div>

      {/* Status Filter */}
      <Select
        value={filters.status || 'ALL'}
        onValueChange={handleStatusChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full sm:w-40">
          <FilterIcon className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="PAID">Pago</SelectItem>
          <SelectItem value="PENDING">Pendente</SelectItem>
          <SelectItem value="OVERDUE">Atrasado</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Range Filter */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal w-full sm:w-64',
                !dateRange.from && 'text-muted-foreground'
              )}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'dd/MM/yy', { locale: ptBR })} -{' '}
                    {format(dateRange.to, 'dd/MM/yy', { locale: ptBR })}
                  </>
                ) : (
                  format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
                )
              ) : (
                'Selecionar período'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{
                from: dateRange.from,
                to: dateRange.to
              }}
              onSelect={(range) => {
                if (range) {
                  handleDateRangeChange({
                    from: range.from,
                    to: range.to
                  })
                }
              }}
              numberOfMonths={2}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>

        {dateRange.from && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateRange}
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFiltersChange({})}
          className="text-xs text-muted-foreground hover:text-foreground"
          disabled={isLoading}
        >
          Limpar filtros
        </Button>
      )}
    </div>
  )
}