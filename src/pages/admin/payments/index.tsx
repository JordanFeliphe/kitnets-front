import { useMemo, useState, useCallback } from 'react'
import { Button } from '@/app/shared/components/ui/button'
import { StandardTable } from '@/app/shared/components/ui/standard-table'
import { ColumnDef } from '@tanstack/react-table'
import {
  Download,
  FileText,
  Plus
} from 'lucide-react'
import { Skeleton } from '@/app/shared/components/ui/skeleton'
import { toast } from 'sonner'

interface AdminPayment {
  id: number
  unit: string
  resident: string
  title: string
  dueDate: string
  paymentDate?: string
  amount: number
  status: 'Pago' | 'Pendente' | 'Atrasado'
  paymentMethod?: 'PIX' | 'Transferência' | 'Dinheiro' | 'Boleto'
}

// Dados expandidos para visão admin
const adminPaymentsData: AdminPayment[] = [
  {
    id: 1,
    unit: "10A",
    resident: "João Silva",
    title: "Aluguel Janeiro 2025",
    amount: 800.00,
    dueDate: "05/01/2025",
    paymentDate: "03/01/2025",
    status: "Pago",
    paymentMethod: "PIX"
  },
  {
    id: 2,
    unit: "10B",
    resident: "Maria Santos",
    title: "Aluguel Janeiro 2025",
    amount: 800.00,
    dueDate: "05/01/2025",
    paymentDate: undefined,
    status: "Pendente"
  },
  {
    id: 3,
    unit: "10A",
    resident: "João Silva",
    title: "Aluguel Dezembro 2024",
    amount: 800.00,
    dueDate: "05/12/2024",
    paymentDate: undefined,
    status: "Atrasado"
  },
  {
    id: 4,
    unit: "10C",
    resident: "Pedro Costa",
    title: "Aluguel Janeiro 2025",
    amount: 900.00,
    dueDate: "05/01/2025",
    paymentDate: "04/01/2025",
    status: "Pago",
    paymentMethod: "Transferência"
  },
  {
    id: 5,
    unit: "10D",
    resident: "Ana Oliveira",
    title: "Aluguel Janeiro 2025",
    amount: 850.00,
    dueDate: "05/01/2025",
    paymentDate: undefined,
    status: "Pendente"
  },
  {
    id: 6,
    unit: "10B",
    resident: "Maria Santos",
    title: "Aluguel Dezembro 2024",
    amount: 800.00,
    dueDate: "05/12/2024",
    paymentDate: undefined,
    status: "Atrasado"
  },
  {
    id: 7,
    unit: "10E",
    resident: "Carlos Lima",
    title: "Aluguel Janeiro 2025",
    amount: 800.00,
    dueDate: "05/01/2025",
    paymentDate: "05/01/2025",
    status: "Pago",
    paymentMethod: "Dinheiro"
  },
  {
    id: 8,
    unit: "10F",
    resident: "Fernanda Rocha",
    title: "Aluguel Janeiro 2025",
    amount: 950.00,
    dueDate: "05/01/2025",
    paymentDate: undefined,
    status: "Pendente"
  }
]

// Table columns configuration
const columns: ColumnDef<AdminPayment>[] = [
  {
    accessorKey: 'unit',
    header: 'Unidade',
    cell: ({ row }) => (
      <div className="font-medium text-foreground">{row.original.unit}</div>
    ),
  },
  {
    accessorKey: 'resident',
    header: 'Morador',
    cell: ({ row }) => (
      <div className="text-foreground">{row.original.resident}</div>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Título',
    cell: ({ row }) => (
      <div className="text-foreground">{row.original.title}</div>
    ),
  },
  {
    accessorKey: 'dueDate',
    header: 'Vencimento',
    cell: ({ row }) => (
      <div className="text-foreground text-sm">{formatDate(row.original.dueDate)}</div>
    ),
  },
  {
    accessorKey: 'paymentDate',
    header: 'Data Pagamento',
    cell: ({ row }) => (
      <div className="text-foreground text-sm">
        {row.original.paymentDate ? formatDate(row.original.paymentDate) : '—'}
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
    cell: ({ row }) => (
      <div className="text-right font-medium text-foreground">
        {formatCurrency(row.original.amount)}
      </div>
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
    accessorKey: 'paymentMethod',
    header: 'Forma Pgto',
    cell: ({ row }) => (
      <span className="text-foreground text-xs">
        {row.original.paymentMethod || '—'}
      </span>
    ),
  },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString.split('/').reverse().join('-')).toLocaleDateString('pt-BR')
}

export default function AdminPayments() {
  const [loading] = useState(false)


  const totals = useMemo(() => {
    const totalPago = adminPaymentsData
      .filter(p => p.status === 'Pago')
      .reduce((sum, p) => sum + p.amount, 0)
    
    const totalPendente = adminPaymentsData
      .filter(p => p.status === 'Pendente')
      .reduce((sum, p) => sum + p.amount, 0)
    
    const totalAtrasado = adminPaymentsData
      .filter(p => p.status === 'Atrasado')
      .reduce((sum, p) => sum + p.amount, 0)
    
    const qtdAtrasado = adminPaymentsData.filter(p => p.status === 'Atrasado').length

    // Próximos 7 dias
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const proximos7Dias = adminPaymentsData
      .filter(p => {
        const dueDate = new Date(p.dueDate.split('/').reverse().join('-'))
        return dueDate >= today && dueDate <= nextWeek && p.status !== 'Pago'
      })
      .reduce((sum, p) => sum + p.amount, 0)

    return {
      totalPago,
      totalPendente,
      totalAtrasado,
      qtdAtrasado,
      proximos7Dias
    }
  }, [])

  // Action handlers
  const handleViewDetails = useCallback((payment: AdminPayment) => {
    toast.success(`Visualizando detalhes do pagamento ${payment.title} - ${payment.resident}`)
  }, [])

  const handleEdit = useCallback((payment: AdminPayment) => {
    toast.success(`Editando pagamento ${payment.title} - ${payment.resident}`)
  }, [])

  const handleRegisterManualPayment = useCallback((payment: AdminPayment) => {
    toast.success(`Registrando pagamento manual para ${payment.title} - ${payment.resident}`)
  }, [])

  const handleDelete = useCallback((payment: AdminPayment) => {
    toast.success(`Excluindo pagamento ${payment.title} - ${payment.resident}`)
  }, [])

  const handleExportCSV = () => {
    toast.success("Exportando relatório CSV...")
  }

  const handleExportPDF = () => {
    toast.success("Exportando relatório PDF...")
  }

  const handleNewManualPayment = () => {
    toast.success("Abrindo formulário para novo pagamento manual...")
  }

  const handleMonthlyReport = () => {
    toast.success("Gerando relatório mensal...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gestão de Pagamentos</h1>
          <p className="text-muted-foreground">
            Controle completo dos pagamentos de todos os moradores
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleNewManualPayment}>
            <Plus className="h-4 w-4 mr-2" />
            Pagamento Manual
          </Button>
          <Button variant="outline" onClick={handleMonthlyReport}>
            <FileText className="h-4 w-4 mr-2" />
            Relatório Mensal
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-lg border bg-card p-4">
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="rounded-lg border bg-card p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Pago</p>
                <p className="text-2xl font-semibold text-foreground">
                  {formatCurrency(totals.totalPago)}
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Valor Pendente</p>
                <p className="text-2xl font-semibold text-foreground">
                  {formatCurrency(totals.totalPendente)}
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Em Atraso ({totals.qtdAtrasado} boletos)
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {formatCurrency(totals.totalAtrasado)}
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Próximos 7 Dias</p>
                <p className="text-2xl font-semibold text-foreground">
                  {formatCurrency(totals.proximos7Dias)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Export Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          CSV
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" />
          PDF
        </Button>
      </div>

      {/* Payments Table */}
      <StandardTable
        columns={columns}
        data={adminPaymentsData}
        loading={loading}
        searchPlaceholder="Buscar por morador, unidade ou título..."
        searchKey="resident"
        filterOptions={[
          {
            label: 'Filtrar por status',
            value: 'Pago,Pendente,Atrasado',
            key: 'status'
          },
          {
            label: 'Filtrar por unidade',
            value: '10A,10B,10C,10D,10E,10F,10G',
            key: 'unit'
          },
          {
            label: 'Filtrar por forma de pagamento',
            value: 'PIX,Transferência,Dinheiro,Boleto',
            key: 'paymentMethod'
          }
        ]}
        onAdd={handleNewManualPayment}
        addButtonLabel="Pagamento Manual"
        enableSelection={false}
        getCardTitle={(payment) => `${payment.unit} - ${payment.resident}`}
        getCardSubtitle={(payment) => payment.title}
        getCardFields={(payment) => [
          { label: 'Vencimento', value: formatDate(payment.dueDate) },
          { label: 'Data Pagamento', value: payment.paymentDate ? formatDate(payment.paymentDate) : 'Não pago' },
          { label: 'Valor', value: formatCurrency(payment.amount) },
          { label: 'Status', value: payment.status },
          { label: 'Forma de Pagamento', value: payment.paymentMethod || 'Não informado' }
        ]}
        getCardActions={(payment) => [
          {
            label: 'Ver detalhes',
            onClick: () => handleViewDetails(payment)
          },
          {
            label: 'Editar',
            onClick: () => handleEdit(payment)
          },
          ...(payment.status !== 'Pago' ? [{
            label: 'Registrar pagamento',
            onClick: () => handleRegisterManualPayment(payment)
          }] : []),
          {
            label: 'Excluir',
            onClick: () => handleDelete(payment),
            variant: 'destructive' as const
          }
        ]}
        emptyMessage="Nenhum pagamento encontrado."
      />
    </div>
  )
}