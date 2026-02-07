import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  MoreVerticalIcon,
  PlusIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { z } from "zod"

import { Badge } from "@/app/shared/components/ui/badge"
import { Button } from "@/app/shared/components/ui/button"
import { Checkbox } from "@/app/shared/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/shared/components/ui/dropdown-menu"
import { Input } from "@/app/shared/components/ui/input"
import { Label } from "@/app/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select"
import { Card, CardContent } from "@/app/shared/components/ui/card"
import { ResponsiveCard } from "@/app/shared/components/ui/responsive-card"

export const transactionsSchema = z.object({
  id: z.number(),
  date: z.string(),
  description: z.string(),
  resident: z.string().optional(),
  unit: z.string().optional(),
  type: z.string(),
  category: z.string(),
  amount: z.string(),
  status: z.string(),
  paymentMethod: z.string().optional(),
})

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pago':
    case 'concluído':
      return 'statusActive'
    case 'pendente':
      return 'warningAlt'
    case 'atrasado':
    case 'vencido':
      return 'dangerAlt'
    case 'cancelado':
      return 'statusDraft'
    default:
      return 'statusDraft'
  }
}

const getTypeIcon = (type: string) => {
  return type.toLowerCase() === 'receita' ? (
    <ArrowUpIcon className="h-4 w-4 text-custom-orange-600" />
  ) : (
    <ArrowDownIcon className="h-4 w-4 text-red-600" />
  )
}

const columns: ColumnDef<z.infer<typeof transactionsSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.date}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "resident",
    header: "Morador",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.resident || "-"}
      </div>
    ),
  },
  {
    accessorKey: "unit",
    header: "Unidade",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.original.unit || "-"}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {getTypeIcon(row.original.type)}
        <span className="text-sm">{row.original.type}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.category}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => (
      <div className={`font-medium ${
        row.original.type.toLowerCase() === 'receita' 
          ? 'text-custom-orange-600' 
          : 'text-red-600'
      }`}>
        R$ {row.original.amount}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.original.status) as any}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Forma de Pagamento",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.paymentMethod || "-"}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row: _row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVerticalIcon className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Cancelar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

interface TransactionsTableProps {
  data: z.infer<typeof transactionsSchema>[]
}

export function TransactionsTable({ data }: TransactionsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
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
  })

  return (
    <div className="w-full space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Filtrar transações..."
            value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
            className="h-8 w-full sm:w-[200px]"
          />
          <Select
            value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn("type")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-full sm:w-[150px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Receita">Receita</SelectItem>
              <SelectItem value="Despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Pago">Pago</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Atrasado">Atrasado</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <ColumnsIcon className="mr-2 h-4 w-4" />
                Colunas
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
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
          
          <Button size="sm" className="h-8">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      {table.getRowModel().rows?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {table.getRowModel().rows.map((row) => {
            const transaction = row.original
            const actions = [
              {
                label: "Ver detalhes",
                icon: Eye,
                onClick: () => {},
                variant: "ghost" as const
              },
              {
                label: "Editar",
                icon: Edit, 
                onClick: () => {},
                variant: "ghost" as const
              },
              {
                label: "Cancelar",
                icon: Trash2,
                onClick: () => {},
                variant: "destructive" as const
              }
            ]
            
            const fields = [
              { label: "Data", value: transaction.date },
              { label: "Morador", value: transaction.resident || "-" },
              { label: "Unidade", value: transaction.unit || "-" },
              { 
                label: "Tipo", 
                value: transaction.type,
                icon: getTypeIcon(transaction.type)
              },
              { label: "Categoria", value: transaction.category },
              { 
                label: "Valor", 
                value: `R$ ${transaction.amount}`,
                className: transaction.type.toLowerCase() === 'receita' 
                  ? 'text-custom-orange-600 font-medium' 
                  : 'text-red-600 font-medium'
              },
              { label: "Forma de Pagamento", value: transaction.paymentMethod || "-" }
            ]
            
            return (
              <div key={row.id} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Selecionar transação"
                  />
                </div>
                <ResponsiveCard
                  title={transaction.description}
                  subtitle={`${transaction.type} - ${transaction.category}`}
                  status={{ value: transaction.status }}
                  fields={fields}
                  actions={actions}
                  className={`${row.getIsSelected() ? 'ring-2 ring-primary' : ''} pt-8`}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
          </CardContent>
        </Card>
      )}

      {/* Paginação */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </span>
        </div>
        
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Linhas por página
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
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
              className="h-8 w-8 p-0"
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