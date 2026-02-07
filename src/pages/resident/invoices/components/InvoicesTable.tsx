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
  DownloadIcon,
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

export interface InvoiceRow {
  id: string
  numero: string
  emissao: string
  vencimento: string
  categoria: string
  valorOriginal: number
  juros?: number
  multa?: number
  valorTotal: number
  status: "Pago" | "Pendente" | "Atrasado" | "Cancelado"
  barCode?: string
  pixKey?: string
  paymentDate?: string
}

interface InvoicesTableProps {
  data: InvoiceRow[]
  loading?: boolean
  onRowClick?: (invoice: InvoiceRow) => void
  onViewDetails?: (invoice: InvoiceRow) => void
  onDownloadPDF?: (invoice: InvoiceRow) => void
  onPrintInvoice?: (invoice: InvoiceRow) => void
  onCopyBarCode?: (invoice: InvoiceRow) => void
  onCopyPixKey?: (invoice: InvoiceRow) => void
  onSendEmail?: (invoice: InvoiceRow) => void
}

const getStatusVariant = (status: string): "success" | "warning" | "destructive" | "secondary" => {
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

export function InvoicesTable({
  data,
  loading = false,
  onRowClick,
  onViewDetails,
  onDownloadPDF,
  onPrintInvoice,
  onCopyBarCode,
  onCopyPixKey,
  onSendEmail,
}: InvoicesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns: ColumnDef<InvoiceRow>[] = useMemo(
    () => [
      {
        accessorKey: "numero",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold"
            >
              Número
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          )
        },
        cell: ({ row }) => {
          const invoice = row.original
          return (
            <button
              onClick={() => onRowClick?.(invoice)}
              className="text-left font-medium text-foreground hover:text-muted-foreground hover:underline"
              role="button"
              aria-label={`Ver detalhes do boleto ${invoice.numero}`}
            >
              {invoice.numero}
            </button>
          )
        },
      },
      {
        accessorKey: "emissao",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold"
            >
              Emissão
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("emissao")}</div>
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
        cell: ({ row }) => {
          const vencimento = row.getValue("vencimento") as string
          const today = new Date()
          const dueDate = new Date(vencimento.split('/').reverse().join('-'))
          const isOverdue = dueDate < today
          
          return (
            <div className={cn(
              "text-sm font-medium",
              isOverdue && row.original.status !== "Pago" && "text-muted-foreground"
            )}>
              {vencimento}
              {isOverdue && row.original.status !== "Pago" && (
                <div className="text-xs text-muted-foreground">Em atraso</div>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "categoria",
        header: "Categoria",
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-xs">
            {row.getValue("categoria")}
          </Badge>
        ),
      },
      {
        accessorKey: "valorOriginal",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold"
            >
              Valor Original
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          )
        },
        cell: ({ row }) => {
          const valor = parseFloat(row.getValue("valorOriginal"))
          return (
            <div className="text-right font-medium">
              {formatCurrency(valor)}
            </div>
          )
        },
      },
      {
        accessorKey: "jurosmulta",
        header: "Juros/Multa",
        cell: ({ row }) => {
          const juros = row.original.juros || 0
          const multa = row.original.multa || 0
          const total = juros + multa
          
          if (total === 0) {
            return <div className="text-right text-muted-foreground">—</div>
          }
          
          return (
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                {formatCurrency(total)}
              </div>
              <div className="text-xs text-muted-foreground">
                {juros > 0 && `J: ${formatCurrency(juros)}`}
                {juros > 0 && multa > 0 && " • "}
                {multa > 0 && `M: ${formatCurrency(multa)}`}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "valorTotal",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-auto p-0 font-semibold"
            >
              Valor Total
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              ) : null}
            </Button>
          )
        },
        cell: ({ row }) => {
          const valor = parseFloat(row.getValue("valorTotal"))
          return (
            <div className="text-right font-bold text-lg">
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
          const invoice = row.original
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
                  onClick={() => onViewDetails?.(invoice)}
                  className="cursor-pointer"
                >
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDownloadPDF?.(invoice)}
                  className="cursor-pointer"
                >
                  Baixar PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onPrintInvoice?.(invoice)}
                  className="cursor-pointer"
                >
                  Imprimir
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {invoice.barCode && (
                  <DropdownMenuItem
                    onClick={() => onCopyBarCode?.(invoice)}
                    className="cursor-pointer"
                  >
                    Copiar código de barras
                  </DropdownMenuItem>
                )}
                {invoice.pixKey && (
                  <DropdownMenuItem
                    onClick={() => onCopyPixKey?.(invoice)}
                    className="cursor-pointer"
                  >
                    Copiar chave PIX
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onSendEmail?.(invoice)}
                  className="cursor-pointer"
                >
                  Enviar por e-mail
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [onRowClick, onViewDetails, onDownloadPDF, onPrintInvoice, onCopyBarCode, onCopyPixKey, onSendEmail]
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
                {columns.map((_, index) => (
                  <TableHead key={index}>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card shadow-sm">
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
                        (header.column.id === "valorOriginal" || header.column.id === "valorTotal" || header.column.id === "jurosmulta") && "text-right"
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
                        (cell.column.id === "valorOriginal" || cell.column.id === "valorTotal" || cell.column.id === "jurosmulta") && "text-right"
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
                    <DownloadIcon className="h-8 w-8" />
                    <p>Nenhum boleto encontrado.</p>
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