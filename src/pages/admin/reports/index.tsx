import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/shared/components/ui/card'
import { Button } from '@/app/shared/components/ui/button'
import { StatusBadge } from '@/app/shared/components/ui/status-badge'
import { DataTable } from '@/app/shared/components/ui/data-table'
import { ResponsiveCard } from '@/app/shared/components/ui/responsive-card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from '@/app/shared/components/ui/breadcrumb'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/shared/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/shared/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/shared/components/ui/dropdown-menu'
import {
  MoreVertical,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Home,
  Calendar,
} from 'lucide-react'
import { Badge } from '@/app/shared/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'

// Interfaces
interface FinancialReport {
  id: string
  period: string
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  occupancyRate: number
  status: 'Finalizado' | 'Pendente' | 'Em Análise'
  generatedDate: string
  generatedBy: string
}

interface OccupancyReport {
  id: string
  unitNumber: string
  resident: string
  status: 'Ocupado' | 'Vago' | 'Manutenção'
  rentAmount: number
  lastPayment: string
  contractEnd: string
  daysVacant?: number
}

interface PaymentReport {
  id: string
  resident: string
  unit: string
  amount: number
  dueDate: string
  paidDate?: string
  status: 'Pago' | 'Pendente' | 'Atrasado' | 'Cancelado'
  paymentMethod?: string
  lateDays?: number
}

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('thisMonth')
  const [isMobile, setIsMobile] = useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mock data
  const financialReports: FinancialReport[] = useMemo(() => [
    {
      id: '1',
      period: 'Janeiro 2024',
      totalRevenue: 45000,
      totalExpenses: 15000,
      netIncome: 30000,
      occupancyRate: 95,
      status: 'Finalizado',
      generatedDate: '01/02/2024',
      generatedBy: 'Admin Sistema'
    },
    {
      id: '2',
      period: 'Fevereiro 2024',
      totalRevenue: 42000,
      totalExpenses: 18000,
      netIncome: 24000,
      occupancyRate: 90,
      status: 'Finalizado',
      generatedDate: '01/03/2024',
      generatedBy: 'Admin Sistema'
    },
    {
      id: '3',
      period: 'Março 2024',
      totalRevenue: 48000,
      totalExpenses: 16000,
      netIncome: 32000,
      occupancyRate: 98,
      status: 'Em Análise',
      generatedDate: '28/03/2024',
      generatedBy: 'João Silva'
    }
  ], [])

  const occupancyReports: OccupancyReport[] = useMemo(() => [
    {
      id: '1',
      unitNumber: '101',
      resident: 'Ana Costa',
      status: 'Ocupado',
      rentAmount: 1500,
      lastPayment: '05/03/2024',
      contractEnd: '15/12/2024'
    },
    {
      id: '2',
      unitNumber: '102',
      resident: '-',
      status: 'Vago',
      rentAmount: 1600,
      lastPayment: '-',
      contractEnd: '-',
      daysVacant: 15
    },
    {
      id: '3',
      unitNumber: '103',
      resident: 'Pedro Santos',
      status: 'Ocupado',
      rentAmount: 1400,
      lastPayment: '01/03/2024',
      contractEnd: '30/09/2024'
    }
  ], [])

  const paymentReports: PaymentReport[] = useMemo(() => [
    {
      id: '1',
      resident: 'Ana Costa',
      unit: '101',
      amount: 1500,
      dueDate: '05/03/2024',
      paidDate: '05/03/2024',
      status: 'Pago',
      paymentMethod: 'PIX'
    },
    {
      id: '2',
      resident: 'Carlos Lima',
      unit: '204',
      amount: 1700,
      dueDate: '05/03/2024',
      status: 'Atrasado',
      lateDays: 12
    },
    {
      id: '3',
      resident: 'Maria Silva',
      unit: '305',
      amount: 1550,
      dueDate: '10/03/2024',
      status: 'Pendente'
    }
  ], [])

  // Column definitions for tables
  const financialColumns: ColumnDef<FinancialReport>[] = [
    {
      accessorKey: 'period',
      header: 'Período',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.period}</div>
      ),
    },
    {
      accessorKey: 'totalRevenue',
      header: 'Receita Total',
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          R$ {row.original.totalRevenue.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'totalExpenses',
      header: 'Despesas',
      cell: ({ row }) => (
        <div className="text-foreground">
          R$ {row.original.totalExpenses.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'netIncome',
      header: 'Lucro Líquido',
      cell: ({ row }) => (
        <div className="font-medium">
          R$ {row.original.netIncome.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'occupancyRate',
      header: 'Taxa Ocupação',
      cell: ({ row }) => (
        <Badge variant="info">
          {row.original.occupancyRate}%
        </Badge>
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
      header: 'Ações',
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              Baixar PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              Compartilhar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const occupancyColumns: ColumnDef<OccupancyReport>[] = [
    {
      accessorKey: 'unitNumber',
      header: 'Unidade',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.unitNumber}</div>
      ),
    },
    {
      accessorKey: 'resident',
      header: 'Morador',
      cell: ({ row }) => (
        <div>{row.original.resident}</div>
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
      accessorKey: 'rentAmount',
      header: 'Valor Aluguel',
      cell: ({ row }) => (
        <div className="font-medium">R$ {row.original.rentAmount.toLocaleString()}</div>
      ),
    },
    {
      accessorKey: 'contractEnd',
      header: 'Fim Contrato',
      cell: ({ row }) => (
        <div>{row.original.contractEnd}</div>
      ),
    }
  ]

  const paymentColumns: ColumnDef<PaymentReport>[] = [
    {
      accessorKey: 'resident',
      header: 'Morador',
    },
    {
      accessorKey: 'unit',
      header: 'Unidade',
    },
    {
      accessorKey: 'amount',
      header: 'Valor',
      cell: ({ row }) => (
        <div className="font-medium">R$ {row.original.amount.toLocaleString()}</div>
      ),
    },
    {
      accessorKey: 'dueDate',
      header: 'Vencimento',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      ),
    }
  ]

  // Card render functions for mobile
  const renderFinancialCard = (report: FinancialReport) => (
    <ResponsiveCard
      key={report.id}
      title={report.period}
      subtitle={`Gerado em ${report.generatedDate}`}
      fields={[
        { label: 'Receita Total', value: `R$ ${report.totalRevenue.toLocaleString()}`, type: 'currency' },
        { label: 'Despesas', value: `R$ ${report.totalExpenses.toLocaleString()}`, type: 'currency' },
        { label: 'Lucro Líquido', value: `R$ ${report.netIncome.toLocaleString()}`, type: 'currency' },
        { label: 'Taxa Ocupação', value: `${report.occupancyRate}%` },
        { label: 'Status', value: report.status, type: 'status' }
      ]}
      actions={[
        {
          label: 'Ver Detalhes',
          onClick: () => {}
        },
        {
          label: 'Baixar PDF',
          onClick: () => {}
        }
      ]}
    />
  )

  const renderOccupancyCard = (report: OccupancyReport) => (
    <ResponsiveCard
      key={report.id}
      title={`Unidade ${report.unitNumber}`}
      subtitle={report.resident !== '-' ? report.resident : 'Unidade vaga'}
      fields={[
        { label: 'Status', value: report.status, type: 'status' },
        { label: 'Valor Aluguel', value: `R$ ${report.rentAmount.toLocaleString()}`, type: 'currency' },
        { label: 'Último Pagamento', value: report.lastPayment },
        { label: 'Fim do Contrato', value: report.contractEnd },
        ...(report.daysVacant ? [{ label: 'Dias Vago', value: report.daysVacant }] : [])
      ]}
      actions={[
        {
          label: 'Ver Detalhes',
          onClick: () => {}
        }
      ]}
    />
  )

  const renderPaymentCard = (report: PaymentReport) => (
    <ResponsiveCard
      key={report.id}
      title={report.resident}
      subtitle={`Unidade ${report.unit}`}
      fields={[
        { label: 'Valor', value: `R$ ${report.amount.toLocaleString()}`, type: 'currency' },
        { label: 'Vencimento', value: report.dueDate },
        { label: 'Status', value: report.status, type: 'status' },
        ...(report.paidDate ? [{ label: 'Data Pagamento', value: report.paidDate }] : []),
        ...(report.paymentMethod ? [{ label: 'Método', value: report.paymentMethod }] : []),
        ...(report.lateDays ? [{ label: 'Dias Atraso', value: report.lateDays }] : [])
      ]}
      actions={[
        {
          label: 'Ver Detalhes',
          onClick: () => {}
        }
      ]}
    />
  )

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
            <BreadcrumbPage>Relatórios</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize e analise dados financeiros e de ocupação
          </p>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">Este Mês</SelectItem>
              <SelectItem value="lastMonth">Mês Passado</SelectItem>
              <SelectItem value="thisQuarter">Este Trimestre</SelectItem>
              <SelectItem value="thisYear">Este Ano</SelectItem>
            </SelectContent>
          </Select>

          <Button>
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 135.000</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -2% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moradores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +3 novos moradores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              2 em atraso há mais de 15 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="occupancy">Ocupação</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>
                Análise de receitas, despesas e lucros por período
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                <div className="space-y-4">
                  {financialReports.map(renderFinancialCard)}
                </div>
              ) : (
                <DataTable
                  columns={financialColumns}
                  data={financialReports}
                  searchable
                  searchPlaceholder="Buscar por período..."
                  exportable
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Ocupação</CardTitle>
              <CardDescription>
                Status das unidades e informações dos contratos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                <div className="space-y-4">
                  {occupancyReports.map(renderOccupancyCard)}
                </div>
              ) : (
                <DataTable
                  columns={occupancyColumns}
                  data={occupancyReports}
                  searchable
                  searchPlaceholder="Buscar por unidade ou morador..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Pagamentos</CardTitle>
              <CardDescription>
                Histórico e status dos pagamentos dos moradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                <div className="space-y-4">
                  {paymentReports.map(renderPaymentCard)}
                </div>
              ) : (
                <DataTable
                  columns={paymentColumns}
                  data={paymentReports}
                  searchable
                  searchPlaceholder="Buscar por morador..."
                  exportable
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportsPage