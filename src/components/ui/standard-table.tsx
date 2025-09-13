import React, { useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns,
  Plus,
  Search,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ResponsiveCard } from '@/components/ui/responsive-card'
import { Skeleton } from '@/components/ui/skeleton'

interface FilterOption {
  label: string
  value: string
  key: string // Campo para filtrar
}

interface StandardTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  
  // Search and filters
  searchPlaceholder?: string
  searchKey?: string // Campo principal para busca
  filterOptions?: FilterOption[] // Filtros por dropdown
  
  // Actions
  onAdd?: () => void
  addButtonLabel?: string
  
  // Mobile card configuration
  getCardTitle: (data: TData) => string
  getCardSubtitle?: (data: TData) => string
  getCardFields: (data: TData) => Array<{
    label: string
    value: any
    type?: 'text' | 'badge' | 'status' | 'currency' | 'date'
  }>
  getCardActions?: (data: TData) => Array<{
    label: string
    icon?: React.ComponentType<any>
    onClick: () => void
    variant?: 'default' | 'destructive'
  }>
  
  // Table configuration
  pageSize?: number
  enableSelection?: boolean
  emptyMessage?: string
  className?: string
}

export function StandardTable<TData, TValue>({
  columns,
  data,
  loading = false,
  searchPlaceholder = 'Filtrar...',
  searchKey,
  filterOptions = [],
  onAdd,
  addButtonLabel = 'Adicionar',
  getCardTitle,
  getCardSubtitle,
  getCardFields,
  getCardActions,
  pageSize = 10,
  enableSelection = false,
  emptyMessage = 'Nenhum registro encontrado.',
  className = ''
}: StandardTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobile, setIsMobile] = useState(false)
  
  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // Search state with debounce
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue)

  // Check mobile on resize
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue)
      if (searchValue) {
        searchParams.set('search', searchValue)
      } else {
        searchParams.delete('search')
      }
      setSearchParams(searchParams)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchValue, searchParams, setSearchParams])

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let filtered = [...data]

    // Global search
    if (debouncedSearch && searchKey) {
      filtered = filtered.filter((item) =>
        String(item[searchKey as keyof TData] || '')
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      )
    }

    // Apply URL filters
    filterOptions.forEach((filter) => {
      const filterValue = searchParams.get(filter.key)
      if (filterValue && filterValue !== 'all') {
        filtered = filtered.filter(
          (item) => String(item[filter.key as keyof TData]) === filterValue
        )
      }
    })

    return filtered
  }, [data, debouncedSearch, searchKey, searchParams, filterOptions])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
    enableRowSelection: enableSelection,
  })

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      if (value === 'all') {
        searchParams.delete(key)
      } else {
        searchParams.set(key, value)
      }
      setSearchParams(searchParams)
    },
    [searchParams, setSearchParams]
  )

  // Render mobile cards
  const renderMobileCards = () => {
    const currentPageData = table.getRowModel().rows

    if (currentPageData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-muted-foreground text-sm">{emptyMessage}</div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {currentPageData.map((row, index) => {
          const rowData = row.original
          const fields = getCardFields(rowData)
          const actions = getCardActions?.(rowData) || []

          return (
            <ResponsiveCard
              key={row.id || index}
              title={getCardTitle(rowData)}
              subtitle={getCardSubtitle?.(rowData)}
              fields={fields}
              actions={actions}
            />
          )
        })}
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`w-full space-y-4 ${className}`}>
        {/* Filtros skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-8 w-full sm:w-[250px]" />
            <Skeleton className="h-8 w-full sm:w-[180px]" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[120px]" />
          </div>
        </div>

        {/* Tabela skeleton */}
        <div className="rounded-md border">
          <div className="p-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="flex justify-between py-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </div>

        {/* Paginação skeleton */}
        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-4 w-[200px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Filtros e controles */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="h-8 pl-9 w-full sm:w-[250px]"
            />
          </div>

          {/* Filters */}
          {filterOptions.map((filter) => (
            <Select
              key={filter.key}
              value={searchParams.get(filter.key) || 'all'}
              onValueChange={(value) => handleFilterChange(filter.key, value)}
            >
              <SelectTrigger className="h-8 w-full sm:w-[180px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {filter.value.split(',').map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Column visibility */}
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Columns className="mr-2 h-4 w-4" />
                  Colunas
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Add button */}
          {onAdd && (
            <Button size="sm" className="h-8" onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Table/Cards */}
      {isMobile ? (
        renderMobileCards()
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Paginação */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {enableSelection && (
            <span>
              {table.getFilteredSelectedRowModel().rows.length} de{' '}
              {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
            </span>
          )}
          <span>
            Mostrando {table.getRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} registro(s)
          </span>
        </div>

        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Linhas por página
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para primeira página</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para próxima página</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para última página</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}