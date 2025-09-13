import * as React from "react"
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
  Settings,
  Users,
} from "lucide-react"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveCard } from "@/components/ui/responsive-card"
import { UnitViewDetailsDrawer } from "@/components/units/UnitViewDetailsDrawer"
import { UnitEditDialog } from "@/components/units/UnitEditDialog"
import { UnitConfigureDialog } from "@/components/units/UnitConfigureDialog"
import { UnitManageTenantDrawer } from "@/components/units/UnitManageTenantDrawer"
import { UnitDeleteDialog } from "@/components/units/UnitDeleteDialog"

export const unitsSchema = z.object({
  id: z.number(),
  number: z.string(),
  type: z.string(),
  area: z.string(),
  rent: z.string(),
  status: z.string(),
  resident: z.string().optional(),
  lastPayment: z.string().optional(),
})

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'ocupada':
      return 'infoAlt'
    case 'vazia':
      return 'statusActive'  
    case 'manutenção':
      return 'dangerAlt'
    default:
      return 'statusDraft'
  }
}

// Actions component to access the parent component handlers
function ActionsCell({ 
  unit, 
  onViewDetails, 
  onEdit, 
  onConfigure, 
  onManageTenant, 
  onDelete 
}: {
  unit: z.infer<typeof unitsSchema>
  onViewDetails: (unit: z.infer<typeof unitsSchema>) => void
  onEdit: (unit: z.infer<typeof unitsSchema>) => void
  onConfigure: (unit: z.infer<typeof unitsSchema>) => void
  onManageTenant: (unit: z.infer<typeof unitsSchema>) => void
  onDelete: (unit: z.infer<typeof unitsSchema>) => void
}) {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVerticalIcon className="h-4 w-4" />
            <span className="sr-only">Abrir menu de ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation()
            console.log("MenuItem clicked - Ver detalhes")
            onViewDetails(unit)
          }}>
            <Eye className="mr-2 h-4 w-4 text-teal-500" />
            Ver detalhes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation()
            console.log("MenuItem clicked - Editar")
            onEdit(unit)
          }}>
            <Edit className="mr-2 h-4 w-4 text-teal-500" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation()
            console.log("MenuItem clicked - Configurar")
            onConfigure(unit)
          }}>
            <Settings className="mr-2 h-4 w-4 text-teal-500" />
            Configurar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation()
            console.log("MenuItem clicked - Gerenciar morador")
            onManageTenant(unit)
          }}>
            <Users className="mr-2 h-4 w-4 text-teal-500" />
            Gerenciar morador
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation()
              console.log("MenuItem clicked - Excluir")
              onDelete(unit)
            }}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const getBaseColumns = (): ColumnDef<z.infer<typeof unitsSchema>>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todas"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    header: "Unidade",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.number}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.type}</div>
    ),
  },
  {
    accessorKey: "area",
    header: "Área (m²)",
    cell: ({ row }) => (
      <div>{row.original.area}</div>
    ),
  },
  {
    accessorKey: "rent",
    header: "Aluguel",
    cell: ({ row }) => (
      <div className="font-medium">R$ {row.original.rent}</div>
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
    accessorKey: "resident",
    header: "Morador",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.resident || "Não ocupada"}
      </div>
    ),
  },
  {
    accessorKey: "lastPayment",
    header: "Último Pagamento",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.lastPayment || "N/A"}
      </div>
    ),
  },
]

interface UnitsTableProps {
  data: z.infer<typeof unitsSchema>[]
  shouldOpenNewUnit?: boolean
  onNewUnitOpened?: () => void
}

export function UnitsTable({ data, shouldOpenNewUnit, onNewUnitOpened }: UnitsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  
  // Modal/Drawer states
  const [viewDetailsOpen, setViewDetailsOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [configureDialogOpen, setConfigureDialogOpen] = React.useState(false)
  const [manageTenantOpen, setManageTenantOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedUnit, setSelectedUnit] = React.useState<z.infer<typeof unitsSchema> | null>(null)

  // Action handlers
  const handleViewDetails = React.useCallback((unit: z.infer<typeof unitsSchema>) => {
    console.log("View Details clicked for unit:", unit)
    setSelectedUnit(unit)
    setViewDetailsOpen(true)
  }, [])

  const handleEdit = React.useCallback((unit: z.infer<typeof unitsSchema>) => {
    console.log("Edit clicked for unit:", unit)
    setSelectedUnit(unit)
    setEditDialogOpen(true)
  }, [])

  // Effect to handle opening new unit dialog from parent
  React.useEffect(() => {
    if (shouldOpenNewUnit) {
      setSelectedUnit(null)
      setEditDialogOpen(true)
      if (onNewUnitOpened) {
        onNewUnitOpened()
      }
    }
  }, [shouldOpenNewUnit, onNewUnitOpened])

  const handleConfigure = React.useCallback((unit: z.infer<typeof unitsSchema>) => {
    console.log("Configure clicked for unit:", unit)
    setSelectedUnit(unit)
    setConfigureDialogOpen(true)
  }, [])

  const handleManageTenant = React.useCallback((unit: z.infer<typeof unitsSchema>) => {
    console.log("Manage Tenant clicked for unit:", unit)
    setSelectedUnit(unit)
    setManageTenantOpen(true)
  }, [])

  const handleDelete = React.useCallback((unit: z.infer<typeof unitsSchema>) => {
    console.log("Delete clicked for unit:", unit)
    setSelectedUnit(unit)
    setDeleteDialogOpen(true)
  }, [])

  // API handlers
  const handleSaveEdit = async (unitData: any) => {
    try {
      console.log("Saving unit edit:", unitData)
      // TODO: Implement API call
      // Refresh table data after successful save
    } catch (error) {
      console.error("Error saving unit:", error)
      throw error
    }
  }

  const handleSaveConfigure = async (configData: any) => {
    try {
      console.log("Saving unit configuration:", configData)
      // TODO: Implement API call
    } catch (error) {
      console.error("Error saving configuration:", error)
      throw error
    }
  }

  const handleAssignTenant = async (unitId: number, tenantId: string) => {
    try {
      console.log("Assigning tenant:", { unitId, tenantId })
      // TODO: Implement API call
      // Refresh table data after successful assignment
    } catch (error) {
      console.error("Error assigning tenant:", error)
      throw error
    }
  }

  const handleRemoveTenant = async (unitId: number) => {
    try {
      console.log("Removing tenant from unit:", unitId)
      // TODO: Implement API call
      // Refresh table data after successful removal
    } catch (error) {
      console.error("Error removing tenant:", error)
      throw error
    }
  }

  const handleConfirmDelete = async (unitId: number) => {
    try {
      console.log("Deleting unit:", unitId)
      // TODO: Implement API call
      // Refresh table data after successful deletion
    } catch (error) {
      console.error("Error deleting unit:", error)
      throw error
    }
  }

  // Create columns with action handlers
  const columns = React.useMemo((): ColumnDef<z.infer<typeof unitsSchema>>[] => [
    ...getBaseColumns(),
    {
      id: "actions",
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => (
        <ActionsCell
          unit={row.original}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onConfigure={handleConfigure}
          onManageTenant={handleManageTenant}
          onDelete={handleDelete}
        />
      ),
    },
  ], [handleViewDetails, handleEdit, handleConfigure, handleManageTenant, handleDelete])

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
            placeholder="Filtrar unidades..."
            value={(table.getColumn("number")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("number")?.setFilterValue(event.target.value)
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
              <SelectItem value="Ocupada">Ocupada</SelectItem>
              <SelectItem value="Vazia">Vazia</SelectItem>
              <SelectItem value="Manutenção">Manutenção</SelectItem>
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
          
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                    Nenhuma unidade encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {table.getRowModel().rows?.length ? (
          <div className="space-y-4">
          {table.getRowModel().rows.map((row) => {
            const unit = row.original
            const actions = [
              {
                label: "Ver detalhes",
                icon: Eye,
                onClick: () => handleViewDetails(unit),
                variant: "ghost" as const
              },
              {
                label: "Editar",
                icon: Edit, 
                onClick: () => handleEdit(unit),
                variant: "ghost" as const
              },
              {
                label: "Configurar",
                icon: Settings,
                onClick: () => handleConfigure(unit),
                variant: "ghost" as const
              },
              {
                label: "Gerenciar morador",
                icon: Users,
                onClick: () => handleManageTenant(unit),
                variant: "ghost" as const
              },
              {
                label: "Excluir",
                icon: Trash2,
                onClick: () => handleDelete(unit),
                variant: "destructive" as const
              }
            ]
            
            const fields = [
              { label: "Tipo", value: unit.type },
              { label: "Área", value: `${unit.area} m²` },
              { label: "Aluguel", value: `R$ ${unit.rent}` },
              { label: "Morador", value: unit.resident || "Não ocupada" },
              { label: "Último Pagamento", value: unit.lastPayment || "N/A" }
            ]
            
            return (
              <div key={row.id} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Selecionar unidade"
                  />
                </div>
                <ResponsiveCard
                  title={`Unidade ${unit.number}`}
                  subtitle={unit.type}
                  status={{ value: unit.status }}
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
              <p className="text-muted-foreground">Nenhuma unidade encontrada.</p>
            </CardContent>
          </Card>
        )}
      </div>

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

      {/* Action Modals/Drawers */}
      <UnitViewDetailsDrawer
        open={viewDetailsOpen}
        onOpenChange={setViewDetailsOpen}
        unit={selectedUnit}
      />

      <UnitEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        unit={selectedUnit}
        onSave={handleSaveEdit}
      />

      <UnitConfigureDialog
        open={configureDialogOpen}
        onOpenChange={setConfigureDialogOpen}
        unit={selectedUnit}
        onSave={handleSaveConfigure}
      />

      <UnitManageTenantDrawer
        open={manageTenantOpen}
        onOpenChange={setManageTenantOpen}
        unit={selectedUnit}
        onAssignTenant={handleAssignTenant}
        onRemoveTenant={handleRemoveTenant}
      />

      <UnitDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        unit={selectedUnit}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}