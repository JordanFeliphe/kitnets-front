import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { StandardTable } from '@/app/shared/components/ui/standard-table'
import { ActionsMenu, ActionItem } from '@/app/shared/components/ui/actions-menu'
import { Checkbox } from '@/app/shared/components/ui/checkbox'
import { Button } from '@/app/shared/components/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from '@/app/shared/components/ui/breadcrumb'
import { useAdminContracts, useDownloadAdminContract } from './hooks/useContracts'
import { AdminContract, ContractFilters } from './services/contractsService'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Eye,
  Edit,
  FileText,
  Download,
  RefreshCw,
  UserCheck,
  Calendar,
  AlertTriangle
} from 'lucide-react'


export default function ContractsPage() {
  const [filters] = useState<ContractFilters>({
    page: 1,
    limit: 10,
    status: undefined,
    unitId: '',
    userId: '',
    startDate: '',
    endDate: '',
  })

  const { data: contractsData, isLoading, error } = useAdminContracts(filters)
  const downloadMutation = useDownloadAdminContract()

  // Handle different possible response formats
  const contracts = Array.isArray(contractsData)
    ? contractsData
    : contractsData?.data && Array.isArray(contractsData.data)
    ? contractsData.data
    : []

  const columns: ColumnDef<AdminContract>[] = useMemo(() => [
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
      accessorKey: 'tenant',
      header: 'Morador',
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium">{row.original.tenant.name}</div>
          <div className="text-xs text-gray-500">{row.original.tenant.cpf}</div>
        </div>
      ),
    },
    {
      accessorKey: 'unit',
      header: 'Unidade',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.unit.code}</div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Início',
      cell: ({ row }) => (
        <div className="text-sm">
          {format(new Date(row.original.startDate), 'dd/MM/yyyy', { locale: ptBR })}
        </div>
      ),
    },
    {
      accessorKey: 'endDate',
      header: 'Término',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.endDate ?
            format(new Date(row.original.endDate), 'dd/MM/yyyy', { locale: ptBR }) :
            '-'
          }
        </div>
      ),
    },
    {
      accessorKey: 'rentAmount',
      header: 'Aluguel',
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          R$ {row.original.rentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'ENDED': return 'bg-gray-100 text-gray-800';
            case 'SUSPENDED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };

        const getStatusText = (status: string) => {
          switch (status) {
            case 'ACTIVE': return 'Ativo';
            case 'ENDED': return 'Encerrado';
            case 'SUSPENDED': return 'Suspenso';
            default: return status;
          }
        };

        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.original.status)}`}>
            {getStatusText(row.original.status)}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const contract = row.original

        const handleDownload = (contractId: string) => {
          downloadMutation.mutate({ contractId });
        };

        const getActions = (): ActionItem[] => {
          const baseActions: ActionItem[] = [
            {
              label: 'Ver detalhes',
              icon: Eye,
              onClick: () => {},
            },
            {
              label: 'Editar',
              icon: Edit,
              onClick: () => {},
            },
            {
              label: downloadMutation.isPending ? 'Baixando...' : 'Baixar PDF',
              icon: Download,
              onClick: () => handleDownload(contract._id),
              separator: true,
            }
          ]

          // Ações específicas por status
          if (contract.status === 'ACTIVE') {
            baseActions.push({
              label: 'Renovar contrato',
              icon: RefreshCw,
              onClick: () => {},
            })
          } else if (contract.status === 'SUSPENDED') {
            baseActions.push({
              label: 'Ativar contrato',
              icon: UserCheck,
              onClick: () => {},
            })
          } else if (contract.status === 'ENDED') {
            baseActions.push({
              label: 'Reativar contrato',
              icon: RefreshCw,
              onClick: () => {},
            })
          }

          if (contract.status !== 'ENDED') {
            baseActions.push({
              label: 'Encerrar',
              icon: AlertTriangle,
              onClick: () => handleTerminate(contract._id),
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

  const handleTerminate = (_id: string) => {
  }

  const handleAdd = () => {
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Contratos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando contratos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Contratos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar contratos</p>
            <p className="text-gray-600 mt-2">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  const filterOptions = [
    {
      label: 'Filtrar por status',
      value: 'ACTIVE,ENDED,SUSPENDED',
      key: 'status'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Contratos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
        data={contracts}
        loading={isLoading}
        searchPlaceholder="Buscar por contrato, morador ou unidade..."
        searchKey="contractNumber"
        filterOptions={filterOptions}
        onAdd={handleAdd}
        addButtonLabel="Novo Contrato"
        enableSelection={true}
        getCardTitle={(contract) => contract.contractNumber}
        getCardSubtitle={(contract) => `${contract.tenant.name} - Unidade ${contract.unit.code}`}
        getCardFields={(contract) => [
          { label: 'Morador', value: contract.tenant.name },
          { label: 'CPF', value: contract.tenant.cpf },
          { label: 'Email', value: contract.tenant.email },
          { label: 'Unidade', value: contract.unit.code },
          {
            label: 'Início',
            value: format(new Date(contract.startDate), 'dd/MM/yyyy', { locale: ptBR }),
            type: 'date'
          },
          {
            label: 'Término',
            value: contract.endDate ?
              format(new Date(contract.endDate), 'dd/MM/yyyy', { locale: ptBR }) :
              '-',
            type: 'date'
          },
          {
            label: 'Aluguel',
            value: `R$ ${contract.rentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            type: 'currency'
          },
          {
            label: 'Status',
            value: contract.status === 'ACTIVE' ? 'Ativo' :
                   contract.status === 'ENDED' ? 'Encerrado' : 'Suspenso',
            type: 'status'
          }
        ]}
        getCardActions={(contract) => [
          {
            label: 'Ver detalhes',
            icon: Eye,
            onClick: () => {}
          },
          {
            label: 'Editar',
            icon: Edit,
            onClick: () => {}
          },
          {
            label: downloadMutation.isPending ? 'Baixando...' : 'Baixar PDF',
            icon: Download,
            onClick: () => downloadMutation.mutate({ contractId: contract._id })
          }
        ]}
        emptyMessage="Nenhum contrato encontrado."
      />
    </div>
  )
}