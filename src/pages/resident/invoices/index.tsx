import { useState, useMemo, useCallback } from "react"
import { Input } from "@/app/shared/components/ui/input"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from '@/app/shared/components/ui/breadcrumb'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select"
import { ResidentBoletoTable } from "../payments/components/ResidentBoletoTable"
import { PaymentDrawer } from "@/app/shared/components/ui/payment-drawer"
import { Search } from "lucide-react"
import { toast } from "sonner"

// Dados de exemplo convertidos para o novo formato
const invoicesData = [
  {
    id: "1",
    numero: "BOL-2025-001",
    emissao: "01/01/2025",
    vencimento: "15/01/2025",
    categoria: "Aluguel",
    valorOriginal: 800.00,
    juros: 0,
    multa: 0,
    valorTotal: 800.00,
    status: "Pendente" as const,
    barCode: "34191790010104351004791020150008884290000080000",
    pixKey: "pix@exemplo.com.br",
  },
  {
    id: "2",
    numero: "BOL-2025-002",
    emissao: "01/01/2025",
    vencimento: "10/01/2025",
    categoria: "Taxa",
    valorOriginal: 150.00,
    juros: 2.25,
    multa: 7.50,
    valorTotal: 159.75,
    status: "Atrasado" as const,
    barCode: "34191790010104351004791020150008884290000015975",
    pixKey: "pix@exemplo.com.br",
  },
  {
    id: "3",
    numero: "BOL-2025-003",
    emissao: "01/02/2025",
    vencimento: "15/02/2025",
    categoria: "Aluguel",
    valorOriginal: 800.00,
    juros: 0,
    multa: 0,
    valorTotal: 800.00,
    status: "Pendente" as const,
    barCode: "34191790010104351004791020150008884290000080000",
    pixKey: "pix@exemplo.com.br",
  },
  {
    id: "4",
    numero: "BOL-2024-012",
    emissao: "01/12/2024",
    vencimento: "15/12/2024",
    categoria: "Aluguel",
    valorOriginal: 800.00,
    juros: 0,
    multa: 0,
    valorTotal: 800.00,
    status: "Pago" as const,
    paymentDate: "15/12/2024",
    barCode: "34191790010104351004791020150008884290000080000",
  },
  {
    id: "5",
    numero: "BOL-2025-004",
    emissao: "01/03/2025",
    vencimento: "15/03/2025",
    categoria: "Aluguel",
    valorOriginal: 800.00,
    juros: 0,
    multa: 0,
    valorTotal: 800.00,
    status: "Pendente" as const,
    barCode: "34191790010104351004791020150008884290000080000",
    pixKey: "pix@exemplo.com.br",
  }
]

// Calculate summary data from invoicesData - matching Payments calculations
const getSummaryData = () => {
  const today = new Date()
  const todayStr = today.toLocaleDateString('pt-BR')
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  const totalPending = invoicesData
    .filter(invoice => invoice.status === 'Pendente')
    .reduce((sum, invoice) => sum + invoice.valorTotal, 0)
  
  const totalOverdue = invoicesData
    .filter(invoice => invoice.status === 'Atrasado')
    .reduce((sum, invoice) => sum + invoice.valorTotal, 0)
  
  // Due today
  const dueToday = invoicesData
    .filter(invoice => {
      const dueDate = new Date(invoice.vencimento.split('/').reverse().join('-'))
      return dueDate.toLocaleDateString('pt-BR') === todayStr && (invoice.status === 'Pendente' || invoice.status === 'Atrasado')
    })
    .reduce((sum, invoice) => sum + invoice.valorTotal, 0)
  
  // Due in next 7 days
  const upcomingDue = invoicesData
    .filter(invoice => {
      const dueDate = new Date(invoice.vencimento.split('/').reverse().join('-'))
      return dueDate > today && dueDate <= nextWeek && (invoice.status === 'Pendente' || invoice.status === 'Atrasado')
    })
    .reduce((sum, invoice) => sum + invoice.valorTotal, 0)
  
  // Average value
  const averageValue = invoicesData.length > 0 
    ? invoicesData.reduce((sum, invoice) => sum + invoice.valorTotal, 0) / invoicesData.length 
    : 0
  
  // Next due date
  const pendingInvoices = invoicesData.filter(invoice => invoice.status === 'Pendente')
  const nextDueDate = pendingInvoices.length > 0 ? pendingInvoices[0].vencimento : null

  return {
    totalPending,
    totalOverdue,
    dueToday,
    upcomingDue,
    averageValue,
    nextDueDate
  }
}

export default function ResidentInvoices() {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [loading] = useState(false)
  
  // Estados dos filtros - matching Payments
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [categoryFilter, setCategoryFilter] = useState("Todas")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString.split('/').reverse().join('-')).toLocaleDateString('pt-BR')
  }

  // Filtrar boletos - matching Payments logic
  const filteredInvoices = useMemo(() => {
    return invoicesData.filter(invoice => {
      const statusMatch = statusFilter === "Todos" || invoice.status === statusFilter
      const categoryMatch = categoryFilter === "Todas" || invoice.categoria === categoryFilter
      const searchMatch = !searchTerm || 
        invoice.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      
      return statusMatch && categoryMatch && searchMatch
    })
  }, [searchTerm, statusFilter, categoryFilter])

  // Handlers
  const handleViewDetails = useCallback((invoice: any) => {
    setSelectedInvoice({
      ...invoice,
      // Converter para o formato do PaymentDetailsData
      id: invoice.id,
      title: `Boleto ${invoice.numero}`,
      competencia: invoice.emissao.substring(3), // Pega MM/YYYY
      vencimento: invoice.vencimento,
      pagamento: invoice.paymentDate || null,
      categoria: invoice.categoria,
      forma: invoice.paymentDate ? "Boleto" : null,
      valor: invoice.valorTotal,
      status: invoice.status,
      valorOriginal: invoice.valorOriginal,
      juros: invoice.juros,
      multa: invoice.multa,
      valorPago: invoice.status === "Pago" ? invoice.valorTotal : undefined,
      invoiceId: invoice.numero,
      linhaDigitavel: invoice.barCode,
      contratoNumero: "CT-2024-001",
      unidadeNumero: "101",
    })
    setIsDrawerOpen(true)
  }, [])

  const handleCopyBarCode = useCallback((invoice: any) => {
    if (invoice.barCode) {
      navigator.clipboard.writeText(invoice.barCode)
      toast.success("Código de barras copiado!")
    }
  }, [])

  const handleDownloadBoleto = useCallback((boleto: any) => {
    toast.success(`Baixando boleto ${boleto.numero}...`)
  }, [])

  const handleDownloadReceipt = useCallback((boleto: any) => {
    toast.success(`Baixando comprovante ${boleto.numero}...`)
  }, [])

  const handleCopyLine = useCallback((boleto: any) => {
    if (boleto.barCode) {
      navigator.clipboard.writeText(boleto.barCode)
      toast.success("Linha digitável copiada!")
    }
  }, [])

  const handleView2ndCopy = useCallback((boleto: any) => {
    toast.success(`Visualizando 2ª via do boleto ${boleto.numero}...`)
  }, [])

  // Calculate summary data
  const summaryData = useMemo(() => getSummaryData(), [])

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/resident">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Boletos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Boletos</h1>
          <p className="text-muted-foreground">
            Visualize e faça download dos seus boletos de pagamento
          </p>
        </div>
      </div>

      {/* Summary Cards - Exactly Matching Payments Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total Pendente
              {summaryData.nextDueDate && (
                <span className="ml-2 text-xs">• Vence {formatDate(summaryData.nextDueDate)}</span>
              )}
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {formatCurrency(summaryData.totalPending)}
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Vence Hoje</p>
            <p className="text-2xl font-semibold text-foreground">
              {formatCurrency(summaryData.dueToday)}
            </p>
          </div>
        </div>
        
        {summaryData.totalOverdue > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <div className="space-y-1">
              <p className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wide">Em Atraso</p>
              <p className="text-2xl font-semibold text-red-700 dark:text-red-400">
                {formatCurrency(summaryData.totalOverdue)}
              </p>
            </div>
          </div>
        )}
        
        {summaryData.totalOverdue === 0 && (
          <div className="rounded-lg border bg-card p-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Próximos 7 Dias</p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(summaryData.upcomingDue)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Cards Row (when needed) */}
      {summaryData.totalOverdue > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Próximos 7 Dias</p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(summaryData.upcomingDue)}
              </p>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Valor Médio</p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(summaryData.averageValue)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters - Exactly Matching Payments Style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar boletos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Pago">Pago</SelectItem>
            <SelectItem value="Atrasado">Atrasado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas</SelectItem>
            <SelectItem value="Aluguel">Aluguel</SelectItem>
            <SelectItem value="Taxa">Taxa</SelectItem>
            <SelectItem value="Multa">Multa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Boletos Table */}
      <ResidentBoletoTable
        data={filteredInvoices}
        loading={loading}
        currentPage={1}
        totalPages={Math.ceil(filteredInvoices.length / 10)}
        onPageChange={() => {}}
        onDownloadBoleto={handleDownloadBoleto}
        onDownloadReceipt={handleDownloadReceipt}
        onViewDetails={handleViewDetails}
        onCopyLine={handleCopyLine}
        onView2ndCopy={handleView2ndCopy}
      />

      {/* Invoice Details Drawer */}
      <PaymentDrawer
        payment={selectedInvoice}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onDownloadReceipt={handleDownloadReceipt}
        onDownloadInvoice={handleDownloadBoleto}
        onEmailReceipt={(payment) => toast.success(`Boleto ${payment.title} será enviado para seu e-mail.`)}
        onCopyDigitableLine={(payment) => payment.linhaDigitavel && handleCopyBarCode({barCode: payment.linhaDigitavel})}
        onDispute={(payment) => toast.success(`Solicitação de revisão enviada para ${payment.title}`)}
      />
    </div>
  )
}