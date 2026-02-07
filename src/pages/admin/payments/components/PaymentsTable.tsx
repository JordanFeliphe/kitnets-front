import { useState, useMemo } from "react"
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
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreVerticalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  DownloadIcon,
  ReceiptIcon,
  AlertTriangleIcon,
} from "lucide-react"

import { Badge } from "@/app/shared/components/ui/badge"
import { Button } from "@/app/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/shared/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/shared/components/ui/table"
import { cn } from "@/app/shared/utils/cn"
import { Skeleton } from "@/app/shared/components/ui/skeleton"

export interface PaymentRow {
  id: string
  title: string
  competencia: string
  vencimento: string
  pagamento: string | null
  categoria: string
  forma: string | null
  valor: number
  status: "Pago" | "Pendente" | "Atrasado" | "Cancelado"
  receiptCode?: string
  invoiceId?: string
  ourNumber?: string
  multa?: number
  desconto?: number
  juros?: number
}

interface PaymentsTableProps {
  data: PaymentRow[]
  loading?: boolean
  onRowClick?: (payment: PaymentRow) => void
  onViewDetails?: (payment: PaymentRow) => void
  onDownloadReceipt?: (payment: PaymentRow) => void
  onDownloadInvoice?: (payment: PaymentRow) => void
  onDispute?: (payment: PaymentRow) => void
}

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "pago":
      return "success"
    case "pendente":
      return "warning"
    case "atrasado":
      return "destructive"
    case "cancelado":
      return "secondary"
    default:
      return "secondary"
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function PaymentsTable({
  data,
  loading = false,
  onRowClick,
  onViewDetails,
  onDownloadReceipt,
  onDownloadInvoice,
  onDispute,
}: PaymentsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns: ColumnDef<PaymentRow>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold"
            >
              Título
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          )
        },
        cell: ({ row }) => {
          const payment = row.original
          return (
            <button
              onClick={() => onRowClick?.(payment)}
              className="text-left font-medium text-primary hover:underline"
              role="button"
              aria-label={`Ver detalhes de ${payment.title}`}
            >
              {payment.title}
            </button>
          )
        },
      },
      {
        accessorKey: "competencia",
        header: "Competência",
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("competencia")}</div>
        ),
      },
      {
        accessorKey: "vencimento",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold"
            >
              Vencimento
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("vencimento")}</div>
        ),
      },
      {
        accessorKey: "pagamento",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold"
            >
              Pagamento
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          )
        },
        cell: ({ row }) => {
          const pagamento = row.getValue("pagamento") as string | null
          return (
            <div className="text-sm">
              {pagamento || <span className="text-muted-foreground">—</span>}
            </div>
          )
        },
      },
      {
        accessorKey: "categoria",
        header: "Categoria",
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs">
            {row.getValue("categoria")}
          </Badge>
        ),
      },
      {
        accessorKey: "forma",
        header: "Forma",
        cell: ({ row }) => {
          const forma = row.getValue("forma") as string | null
          return (
            <div className="text-sm">
              {forma || <span className="text-muted-foreground">—</span>}
            </div>
          )
        },
      },
      {
        accessorKey: "valor",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold"
            >
              Valor
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          )
        },
        cell: ({ row }) => {
          const valor = parseFloat(row.getValue("valor"))
          return (
            <div className="text-right font-medium">
              {formatCurrency(valor)}
            </div>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string
          return (
            <Badge variant={getStatusVariant(status)} className="text-xs">
              {status}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const payment = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  aria-label="Abrir menu de ações"
                >
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onViewDetails?.(payment)}
                  className="cursor-pointer"
                >
                  <EyeIcon className="mr-2 h-4 w-4" />
                  Ver detalhes
                </DropdownMenuItem>
                {payment.status === "Pago" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => onDownloadReceipt?.(payment)}
                      className="cursor-pointer"
                    >
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Baixar recibo
                    </DropdownMenuItem>
                  </>
                )}
                {payment.status !== "Pago" && (
                  <DropdownMenuItem
                    onClick={() => onDownloadInvoice?.(payment)}
                    className="cursor-pointer"
                  >
                    <ReceiptIcon className="mr-2 h-4 w-4" />
                    Baixar boleto/2ª via
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDispute?.(payment)}
                  className="cursor-pointer"
                >
                  <AlertTriangleIcon className="mr-2 h-4 w-4" />
                  Disputar/solicitar revisão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [onRowClick, onViewDetails, onDownloadReceipt, onDownloadInvoice, onDispute]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                <TableHead><Skeleton className="h-4 w-14" /></TableHead>
                <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center space-x-6 lg:space-x-8">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        header.column.getCanSort() && "cursor-pointer select-none",
                        header.column.id === "valor" && "text-right"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      aria-sort={
                        header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : "none"
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  role="button"
                  tabIndex={0}
                  onClick={() => onRowClick?.(row.original)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onRowClick?.(row.original)
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.id === "valor" && "text-right"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ReceiptIcon className="h-8 w-8" />
                    <p>Nenhum pagamento encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Mostrando {table.getRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} resultado(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Página</p>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para primeira página</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para página anterior</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para próxima página</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para última página</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}