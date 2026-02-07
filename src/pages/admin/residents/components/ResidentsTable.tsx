import { ColumnDef } from "@tanstack/react-table"
import { MoreVerticalIcon } from "lucide-react"
import { z } from "zod"

import { Button } from "@/app/shared/components/ui/button"
import { Checkbox } from "@/app/shared/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/shared/components/ui/dropdown-menu"
import { StandardTable } from "@/app/shared/components/ui/standard-table"

export const residentsSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string(),
  email: z.string(),
  phone: z.string(),
  unit: z.string(),
  status: z.string(),
  entryDate: z.string(),
  rentAmount: z.string(),
  pendingPayments: z.number(),
  originalUser: z.any().optional(),
})


const columns: ColumnDef<z.infer<typeof residentsSchema>>[] = [
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
          aria-label="Selecionar todos"
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
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ row }) => (
      <div className="text-sm text-foreground">{row.original.cpf}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">{row.original.email}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => (
      <div className="text-sm text-foreground">{row.original.phone}</div>
    ),
  },
  {
    accessorKey: "unit",
    header: "Unidade",
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.original.unit}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="text-foreground">{row.original.status}</span>
    ),
  },
  {
    accessorKey: "entryDate",
    header: "Data de Entrada",
    cell: ({ row }) => (
      <div className="text-sm text-foreground">{row.original.entryDate}</div>
    ),
  },
  {
    accessorKey: "rentAmount",
    header: "Aluguel",
    cell: ({ row }) => (
      <div className="font-medium text-foreground">R$ {row.original.rentAmount}</div>
    ),
  },
  {
    accessorKey: "pendingPayments",
    header: "Pagamentos Pendentes",
    cell: ({ row }) => (
      <div className="text-center text-foreground">
        {row.original.pendingPayments > 0 ? (
          <span>{row.original.pendingPayments}</span>
        ) : (
          <span>Em dia</span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row, table }) => {
      const onEdit = (table.options.meta as any)?.onEdit;
      const onDelete = (table.options.meta as any)?.onDelete;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit && onEdit(row.original)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete && onDelete(row.original)}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
]

interface ResidentsTableProps {
  data: z.infer<typeof residentsSchema>[]
  loading?: boolean
  onAdd?: () => void
  onEdit?: (resident: any) => void
  onDelete?: (resident: any) => void
}

export function ResidentsTable({
  data,
  loading = false,
  onAdd,
  onEdit,
  onDelete
}: ResidentsTableProps) {
  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    }
  }

  const filterOptions = [
    {
      label: 'Filtrar por status',
      value: 'Ativo,Inativo,Pendente',
      key: 'status'
    }
  ]

  return (
    <StandardTable
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder="Filtrar moradores..."
      searchKey="name"
      filterOptions={filterOptions}
      onAdd={handleAdd}
      addButtonLabel="Novo Morador"
      enableSelection={true}
      getCardTitle={(resident) => resident.name}
      getCardSubtitle={(resident) => `Unidade ${resident.unit} • ${resident.email}`}
      getCardFields={(resident) => [
        { label: 'CPF', value: resident.cpf },
        { label: 'Telefone', value: resident.phone },
        { label: 'Status', value: resident.status },
        { label: 'Data de Entrada', value: resident.entryDate },
        { label: 'Aluguel', value: `R$ ${resident.rentAmount}` },
        { label: 'Pagamentos Pendentes', value: resident.pendingPayments > 0 ? `${resident.pendingPayments}` : 'Em dia' }
      ]}
      getCardActions={(resident) => [
        {
          label: 'Editar',
          onClick: () => onEdit && onEdit(resident)
        },
        {
          label: 'Excluir',
          onClick: () => onDelete && onDelete(resident),
          variant: 'destructive'
        }
      ]}
      emptyMessage="Nenhum morador encontrado."
    />
  )
}