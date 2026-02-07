import React, { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/shared/components/ui/table'
import { Button } from '@/app/shared/components/ui/button'
import { Input } from '@/app/shared/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/shared/components/ui/dropdown-menu'
import { ResponsiveCard } from '@/app/shared/components/ui/responsive-card'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Settings,
  Download,
  RefreshCw,
  X,
} from 'lucide-react'

// Enhanced interface for responsive table configuration
interface ResponsiveTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  exportable?: boolean
  refreshable?: boolean
  onRefresh?: () => void
  onExport?: (data: TData[]) => void
  
  // Mobile card configuration
  mobileCardConfig: {
    titleKey: string  // key from data object to use as card title
    subtitleKey?: string  // key from data object to use as card subtitle
    statusKey?: string  // key from data object to show status badge
    priorityKey?: string  // key from data object for priority styling
    
    // Function to transform row data into card fields
    getFields: (data: TData) => Array<{
      label: string
      value: any
      type?: 'text' | 'badge' | 'status' | 'currency' | 'date' | 'custom'
      className?: string
      render?: (value: any) => React.ReactNode
      icon?: React.ComponentType<any> | React.ReactNode
    }>
    
    // Function to get actions for each card
    getActions?: (data: TData) => Array<{
      label: string
      icon?: React.ComponentType<any> | React.ReactNode
      onClick: () => void
      variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
      disabled?: boolean
    }>
    
    // Optional click handler for entire card
    onCardClick?: (data: TData) => void
    
    // Optional details content for drawer
    getDetailsContent?: (data: TData) => React.ReactNode
    getDetailsTitle?: (data: TData) => string
    getDetailsDescription?: (data: TData) => string
  }
  
  // Responsive breakpoint (default: 768px)
  mobileBreakpoint?: number
  
  // Table configuration
  pageSize?: number
  pageSizeOptions?: number[]
  showPagination?: boolean
  showColumnVisibility?: boolean
  emptyMessage?: string
  className?: string
}

export function ResponsiveTable<TData, TValue>({
  columns,
  data,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  exportable = false,
  refreshable = false,
  onRefresh,
  onExport,
  mobileCardConfig,
  mobileBreakpoint = 768,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPagination = true,
  showColumnVisibility = true,
  emptyMessage = 'Nenhum resultado encontrado.',
  className = '',
}: ResponsiveTableProps<TData, TValue>) {
  const [isMobile, setIsMobile] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  // Check for mobile on resize
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < mobileBreakpoint)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  const filteredData = table.getFilteredRowModel().rows.map(row => row.original)
  const hasActiveFilters = globalFilter || columnFilters.length > 0

  const clearFilters = () => {
    setGlobalFilter('')
    setColumnFilters([])
  }

  const handleExport = () => {
    if (onExport) {
      onExport(filteredData)
    }
  }

  // Render mobile cards
  const renderMobileCards = () => {
    const currentPageData = table.getRowModel().rows
    
    if (currentPageData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-muted-foreground">{emptyMessage}</div>
          {hasActiveFilters && (
            <Button
              variant="link"
              onClick={clearFilters}
              className="text-xs mt-2"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {currentPageData.map((row, index) => {
          const rowData = row.original
          const fields = mobileCardConfig.getFields(rowData)
          const actions = mobileCardConfig.getActions?.(rowData) || []
          
          return (
            <ResponsiveCard
              key={row.id || index}
              title={String(rowData[mobileCardConfig.titleKey as keyof TData] || '')}
              subtitle={mobileCardConfig.subtitleKey ? String(rowData[mobileCardConfig.subtitleKey as keyof TData] || '') : undefined}
              fields={fields}
              actions={actions}
              status={mobileCardConfig.statusKey ? {
                value: String(rowData[mobileCardConfig.statusKey as keyof TData] || '')
              } : undefined}
              priority={mobileCardConfig.priorityKey ? 
                String(rowData[mobileCardConfig.priorityKey as keyof TData] || '') as 'high' | 'medium' | 'low'
                : undefined}
              onClick={mobileCardConfig.onCardClick ? () => mobileCardConfig.onCardClick!(rowData) : undefined}
              detailsContent={mobileCardConfig.getDetailsContent?.(rowData)}
              detailsTitle={mobileCardConfig.getDetailsTitle?.(rowData)}
              detailsDescription={mobileCardConfig.getDetailsDescription?.(rowData)}
            />
          )
        })}
      </div>
    )
  }

  // Render desktop table
  const renderDesktopTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="whitespace-nowrap">
                  {header.isPlaceholder ? null : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
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
                  <TableCell key={cell.id} className="whitespace-nowrap">
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
                <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                  <div className="text-sm">{emptyMessage}</div>
                  {hasActiveFilters && (
                    <Button
                      variant="link"
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      Limpar filtros
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-10 w-[250px] bg-muted animate-pulse rounded" />
          <div className="h-10 w-[120px] bg-muted animate-pulse rounded" />
        </div>
        <div className="h-[400px] bg-muted animate-pulse rounded" />
        <div className="flex items-center justify-between">
          <div className="h-4 w-[200px] bg-muted animate-pulse rounded" />
          <div className="h-8 w-[200px] bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-2">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
          )}
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-8 px-2 lg:px-3"
            >
              Limpar
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {exportable && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={data.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          )}
          
          {refreshable && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          {showColumnVisibility && !isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto hidden h-8 lg:flex"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Colunas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== 'undefined' && column.getCanHide()
                  )
                  .map((column) => {
                    return (
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
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Content - Table or Cards based on screen size */}
      {isMobile ? renderMobileCards() : renderDesktopTable()}

      {/* Pagination */}
      {showPagination && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Mostrando {table.getRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} resultado(s).
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Linhas por página</p>
              <select
                className="h-8 w-[70px] rounded border border-input bg-background px-3 py-0 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value))
                }}
              >
                {pageSizeOptions.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Primeira página</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Página anterior</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Próxima página</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Última página</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResponsiveTable