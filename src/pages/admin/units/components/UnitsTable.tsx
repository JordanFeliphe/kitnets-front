import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"

import { StandardTable } from "@/app/shared/components/ui/standard-table"
import { UnitViewDetailsDrawer } from "./UnitViewDetailsDrawer"
import { UnitEditDialog } from "./UnitEditDialog"
import { UnitConfigureDialog } from "./UnitConfigureDialog"
import { UnitManageTenantDrawer } from "./UnitManageTenantDrawer"
import { UnitDeleteDialog } from "./UnitDeleteDialog"

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

type Unit = z.infer<typeof unitsSchema>

// Define table columns
const columns: ColumnDef<Unit>[] = [
  {
    accessorKey: 'number',
    header: 'Número',
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.original.number}</div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => (
      <div className="text-foreground">{row.original.type}</div>
    ),
  },
  {
    accessorKey: 'area',
    header: 'Área (m²)',
    cell: ({ row }) => (
      <div className="text-foreground">{row.original.area}</div>
    ),
  },
  {
    accessorKey: 'rent',
    header: 'Aluguel',
    cell: ({ row }) => (
      <div className="text-foreground font-medium">R$ {row.original.rent}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span className="text-foreground text-xs">{row.original.status}</span>
    ),
  },
  {
    accessorKey: 'resident',
    header: 'Morador',
    cell: ({ row }) => (
      <div className="text-foreground">{row.original.resident || '—'}</div>
    ),
  },
  {
    accessorKey: 'lastPayment',
    header: 'Último Pagamento',
    cell: ({ row }) => (
      <div className="text-foreground text-sm">{row.original.lastPayment || '—'}</div>
    ),
  },
]

interface UnitsTableProps {
  data: Unit[]
  loading?: boolean
  onAdd?: () => void
  onViewDetails?: (unit: Unit) => void
  onEdit?: (unit: Unit) => void
  onConfigure?: (unit: Unit) => void
  onManageTenant?: (unit: Unit) => void
  onDelete?: (unit: Unit) => void
}

export function UnitsTable({
  data,
  loading = false,
  onAdd: _onAdd,
  onViewDetails,
  onEdit,
  onConfigure,
  onManageTenant,
  onDelete,
}: UnitsTableProps) {
  const [viewDetailsUnit, setViewDetailsUnit] = React.useState<Unit | null>(null)
  const [editUnit, setEditUnit] = React.useState<Unit | null>(null)
  const [configureUnit, setConfigureUnit] = React.useState<Unit | null>(null)
  const [manageTenantUnit, setManageTenantUnit] = React.useState<Unit | null>(null)
  const [deleteUnit, setDeleteUnit] = React.useState<Unit | null>(null)

  const handleViewDetails = (unit: Unit) => {
    if (onViewDetails) {
      onViewDetails(unit)
    } else {
      setViewDetailsUnit(unit)
    }
  }

  const handleEdit = (unit: Unit) => {
    if (onEdit) {
      onEdit(unit)
    } else {
      setEditUnit(unit)
    }
  }

  const handleConfigure = (unit: Unit) => {
    if (onConfigure) {
      onConfigure(unit)
    } else {
      setConfigureUnit(unit)
    }
  }

  const handleManageTenant = (unit: Unit) => {
    if (onManageTenant) {
      onManageTenant(unit)
    } else {
      setManageTenantUnit(unit)
    }
  }

  const handleDelete = (unit: Unit) => {
    if (onDelete) {
      onDelete(unit)
    } else {
      setDeleteUnit(unit)
    }
  }

  const filterOptions = [
    {
      label: 'Filtrar por status',
      value: 'Ocupada,Vazia,Manutenção',
      key: 'status'
    },
    {
      label: 'Filtrar por tipo',
      value: 'Kitnet,Apartamento,Casa',
      key: 'type'
    }
  ]

  return (
    <>
      <StandardTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="Buscar por número, tipo ou morador..."
        searchKey="number"
        filterOptions={filterOptions}
        enableSelection={false}
        getCardTitle={(unit) => `Unidade ${unit.number}`}
        getCardSubtitle={(unit) => `${unit.type} - ${unit.area}m²`}
        getCardFields={(unit) => [
          { label: 'Aluguel', value: `R$ ${unit.rent}` },
          { label: 'Status', value: unit.status },
          { label: 'Morador', value: unit.resident || 'Vazia' },
          { label: 'Último Pagamento', value: unit.lastPayment || 'Não informado' }
        ]}
        getCardActions={(unit) => [
          {
            label: 'Ver detalhes',
            onClick: () => handleViewDetails(unit)
          },
          {
            label: 'Editar',
            onClick: () => handleEdit(unit)
          },
          {
            label: 'Configurar',
            onClick: () => handleConfigure(unit)
          },
          {
            label: 'Gerenciar morador',
            onClick: () => handleManageTenant(unit)
          },
          {
            label: 'Excluir',
            onClick: () => handleDelete(unit),
            variant: 'destructive'
          }
        ]}
        emptyMessage="Nenhuma unidade encontrada."
      />

      {/* Modals and Drawers */}
      {viewDetailsUnit && (
        <UnitViewDetailsDrawer
          open={!!viewDetailsUnit}
          onOpenChange={(open) => !open && setViewDetailsUnit(null)}
          unit={viewDetailsUnit}
        />
      )}

      {editUnit && (
        <UnitEditDialog
          open={!!editUnit}
          onOpenChange={(open) => !open && setEditUnit(null)}
          unit={editUnit}
          onSave={async (_data) => {
            setEditUnit(null)
          }}
        />
      )}

      {configureUnit && (
        <UnitConfigureDialog
          open={!!configureUnit}
          onOpenChange={(open) => !open && setConfigureUnit(null)}
          unit={configureUnit}
          onSave={async (_data) => {
            setConfigureUnit(null)
          }}
        />
      )}

      {manageTenantUnit && (
        <UnitManageTenantDrawer
          open={!!manageTenantUnit}
          onOpenChange={(open) => !open && setManageTenantUnit(null)}
          unit={manageTenantUnit}
          onAssignTenant={async (_unitId, _tenantId) => {
            setManageTenantUnit(null)
          }}
          onRemoveTenant={async (_unitId) => {
            setManageTenantUnit(null)
          }}
        />
      )}

      {deleteUnit && (
        <UnitDeleteDialog
          open={!!deleteUnit}
          onOpenChange={(open) => !open && setDeleteUnit(null)}
          unit={deleteUnit}
          onConfirm={async () => {
            setDeleteUnit(null)
          }}
        />
      )}
    </>
  )
}