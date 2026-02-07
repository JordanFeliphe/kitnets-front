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
  Eye,
  Edit,
  Trash2,
  Download,
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

export const contractsSchema = z.object({
  id: z.number(),
  contractNumber: z.string(),
  resident: z.string(),
  unit: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  rentAmount: z.string(),
  deposit: z.string(),
  status: z.string(),
  guarantor: z.string().optional(),
})

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'ativo':
      return 'statusActive'
    case 'vencido':
      return 'dangerAlt'
    case 'renovação':
      return 'warningAlt'
    case 'encerrado':
      return 'statusDraft'
    default:
      return 'statusDraft'
  }
}

const columns: ColumnDef<z.infer<typeof contractsSchema>>[] = [
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
    accessorKey: "contractNumber",
    header: "Nº Contrato",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.contractNumber}</div>
    ),
  },
  {
    accessorKey: "resident",
    header: "Morador",
  },
  {
    accessorKey: "unit",
    header: "Unidade",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.unit}</div>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Início",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.startDate}</div>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Término",
    cell: ({ row }) => (
      <div className="text-sm">{row.original.endDate}</div>
    ),
  },
  {
    accessorKey: "rentAmount",
    header: "Aluguel",
    cell: ({ row }) => (
      <div className="font-medium">R$ {row.original.rentAmount}</div>
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
            <DropdownMenuItem>Ver contrato</DropdownMenuItem>
            <DropdownMenuItem>Renovar</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Encerrar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

interface ContractsTableProps {
  data: z.infer<typeof contractsSchema>[]
}

export function ContractsTable({ data }: ContractsTableProps) {
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
      {/* Filtros e controles */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Filtrar contratos..."
            value={(table.getColumn("resident")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("resident")?.setFilterValue(event.target.value)
            }
            className="h-8 w-full sm:w-[150px] lg:w-[250px]"
          />
          <Select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-8 w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Vencido">Vencido</SelectItem>
              <SelectItem value="Renovação">Renovação</SelectItem>
              <SelectItem value="Encerrado">Encerrado</SelectItem>
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
            Novo Contrato
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      {table.getRowModel().rows?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {table.getRowModel().rows.map((row) => {
            const contract = row.original
            const actions = [
              {
                label: "Ver contrato",
                icon: Eye,
                onClick: () => {},
                variant: "ghost" as const
              },
              {
                label: "Renovar",
                icon: Download, 
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
                label: "Encerrar",
                icon: Trash2,
                onClick: () => {},
                variant: "destructive" as const
              }
            ]
            
            const fields = [
              { label: "Unidade", value: contract.unit },
              { label: "Início", value: contract.startDate },
              { label: "Término", value: contract.endDate },
              { label: "Aluguel", value: `R$ ${contract.rentAmount}` },
              { label: "Caução", value: `R$ ${contract.deposit}` },
              { label: "Fiador", value: contract.guarantor || "Não informado" }
            ]
            
            return (
              <div key={row.id} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Selecionar contrato"
                  />
                </div>
                <ResponsiveCard
                  title={contract.contractNumber}
                  subtitle={contract.resident}
                  status={{ value: contract.status }}
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
            <p className="text-muted-foreground">Nenhum contrato encontrado.</p>
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