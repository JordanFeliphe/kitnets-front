import React, { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { StandardTable } from '@/components/ui/standard-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { MoneyCell } from '@/components/ui/money-cell'
import { DateCell } from '@/components/ui/date-cell'
import { ActionsMenu, ActionItem } from '@/components/ui/actions-menu'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  Download, 
  RefreshCw, 
  UserCheck,
  Calendar,
  AlertTriangle
} from 'lucide-react'

interface Contract {
  id: number
  contractNumber: string
  resident: string
  unit: string
  startDate: string
  endDate: string
  rentAmount: string
  deposit: string
  status: 'Ativo' | 'Vencido' | 'Renovação' | 'Encerrado'
  guarantor: string
}

const contractsData: Contract[] = [
  { id: 1, contractNumber: "CT-2024-001", resident: "João da Silva", unit: "101", startDate: "01/01/2024", endDate: "31/12/2024", rentAmount: "800,00", deposit: "800,00", status: "Ativo", guarantor: "Maria da Silva" },
  { id: 2, contractNumber: "CT-2024-002", resident: "Maria Santos", unit: "103", startDate: "15/03/2024", endDate: "14/03/2025", rentAmount: "900,00", deposit: "900,00", status: "Ativo", guarantor: "João Santos" },
  { id: 3, contractNumber: "CT-2024-003", resident: "Pedro Costa", unit: "201", startDate: "22/02/2024", endDate: "21/02/2025", rentAmount: "1200,00", deposit: "1200,00", status: "Ativo", guarantor: "Ana Costa" },
  { id: 4, contractNumber: "CT-2023-015", resident: "Carlos Lima", unit: "204", startDate: "12/05/2023", endDate: "11/05/2024", rentAmount: "850,00", deposit: "850,00", status: "Vencido", guarantor: "Fernanda Lima" },
  { id: 5, contractNumber: "CT-2024-004", resident: "Ana Oliveira", unit: "203", startDate: "08/04/2024", endDate: "07/04/2025", rentAmount: "1300,00", deposit: "1300,00", status: "Ativo", guarantor: "Roberto Oliveira" },
  { id: 6, contractNumber: "CT-2024-005", resident: "Fernanda Rocha", unit: "302", startDate: "30/01/2024", endDate: "29/01/2025", rentAmount: "1400,00", deposit: "1400,00", status: "Renovação", guarantor: "Paulo Rocha" },
  { id: 7, contractNumber: "CT-2023-010", resident: "Roberto Dias", unit: "303", startDate: "18/06/2023", endDate: "17/06/2024", rentAmount: "900,00", deposit: "900,00", status: "Encerrado", guarantor: "Juliana Dias" },
  { id: 8, contractNumber: "CT-2024-006", resident: "Juliana Ferreira", unit: "304", startDate: "02/07/2024", endDate: "01/07/2025", rentAmount: "850,00", deposit: "850,00", status: "Ativo", guarantor: "Carlos Ferreira" }
]

export default function ContractsPage() {
  const [loading, setLoading] = useState(false)

  const columns: ColumnDef<Contract>[] = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
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
      accessorKey: 'contractNumber',
      header: 'Nº Contrato',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.contractNumber}</div>
      ),
    },
    {
      accessorKey: 'resident',
      header: 'Morador',
      cell: ({ row }) => (
        <div className="text-sm">{row.original.resident}</div>
      ),
    },
    {
      accessorKey: 'unit',
      header: 'Unidade',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.unit}</div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Início',
      cell: ({ row }) => (
        <DateCell value={row.original.startDate} />
      ),
    },
    {
      accessorKey: 'endDate',
      header: 'Término',
      cell: ({ row }) => (
        <DateCell value={row.original.endDate} />
      ),
    },
    {
      accessorKey: 'rentAmount',
      header: 'Aluguel',
      cell: ({ row }) => (
        <MoneyCell value={row.original.rentAmount.replace(',', '.')} />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const contract = row.original
        
        const getActions = (): ActionItem[] => {
          const baseActions: ActionItem[] = [
            {
              label: 'Ver detalhes',
              icon: Eye,
              onClick: () => console.log('Ver detalhes do contrato:', contract.id),
            },
            {
              label: 'Editar',
              icon: Edit,
              onClick: () => console.log('Editar contrato:', contract.id),
            },
            {
              label: 'Baixar PDF',
              icon: Download,
              onClick: () => console.log('Baixar PDF do contrato:', contract.id),
              separator: true,
            }
          ]

          // Ações específicas por status
          if (contract.status === 'Ativo') {
            baseActions.push({
              label: 'Renovar contrato',
              icon: RefreshCw,
              onClick: () => console.log('Renovar contrato:', contract.id),
            })
          } else if (contract.status === 'Renovação') {
            baseActions.push({
              label: 'Aprovar renovação',
              icon: UserCheck,
              onClick: () => console.log('Aprovar renovação:', contract.id),
            })
          } else if (contract.status === 'Vencido') {
            baseActions.push({
              label: 'Encerrar contrato',
              icon: AlertTriangle,
              onClick: () => handleTerminate(contract.id),
              variant: 'destructive',
            })
          }

          if (contract.status !== 'Encerrado') {
            baseActions.push({
              label: 'Excluir',
              icon: Trash2,
              onClick: () => handleDelete(contract.id),
              variant: 'destructive',
            })
          }

          return baseActions
        }

        return (
          <div className="flex justify-end">
            <ActionsMenu actions={getActions()} />
          </div>
        )
      },
    },
  ], [])

  const handleDelete = (id: number) => {
    console.log('Excluir contrato:', id)
    // Implementar lógica de exclusão
  }

  const handleTerminate = (id: number) => {
    console.log('Encerrar contrato:', id)
    // Implementar lógica de encerramento
  }

  const handleAdd = () => {
    console.log('Adicionar novo contrato')
    // Implementar lógica de adição
  }

  const filterOptions = [
    {
      label: 'Filtrar por status',
      value: 'Ativo,Vencido,Renovação,Encerrado',
      key: 'status'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os contratos de locação
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Modelo contrato
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Vencimentos
          </Button>
        </div>
      </div>

      <StandardTable
        columns={columns}
        data={contractsData}
        loading={loading}
        searchPlaceholder="Buscar por contrato, morador ou unidade..."
        searchKey="contractNumber"
        filterOptions={filterOptions}
        onAdd={handleAdd}
        addButtonLabel="Novo Contrato"
        enableSelection={true}
        getCardTitle={(contract) => contract.contractNumber}
        getCardSubtitle={(contract) => `${contract.resident} - Unidade ${contract.unit}`}
        getCardFields={(contract) => [
          { label: 'Morador', value: contract.resident },
          { label: 'Unidade', value: contract.unit },
          { label: 'Início', value: contract.startDate, type: 'date' },
          { label: 'Término', value: contract.endDate, type: 'date' },
          { label: 'Aluguel', value: `R$ ${contract.rentAmount}`, type: 'currency' },
          { label: 'Status', value: contract.status, type: 'status' },
          { label: 'Fiador', value: contract.guarantor }
        ]}
        getCardActions={(contract) => [
          {
            label: 'Ver detalhes',
            icon: Eye,
            onClick: () => console.log('Ver detalhes:', contract.id)
          },
          {
            label: 'Editar',
            icon: Edit,
            onClick: () => console.log('Editar:', contract.id)
          },
          {
            label: 'Baixar PDF',
            icon: Download,
            onClick: () => console.log('Baixar PDF:', contract.id)
          }
        ]}
        emptyMessage="Nenhum contrato encontrado."
      />
    </div>
  )
}