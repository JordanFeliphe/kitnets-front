import React, { useMemo, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  Download, 
  FileText, 
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pago':
      return <Badge variant="statusActive" className="text-xs">{status}</Badge>
    case 'Pendente':
      return <Badge variant="warningAlt" className="text-xs">{status}</Badge>
    case 'Atrasado':
      return <Badge variant="dangerAlt" className="text-xs">{status}</Badge>
    default:
      return <Badge variant="statusDraft" className="text-xs">{status}</Badge>
  }
}

const getPaymentMethodBadge = (method?: string) => {
  if (!method) return <span className="text-muted-foreground text-sm">—</span>
  
  const variants = {
    'PIX': 'infoAlt',
    'Transferência': 'statusActive',
    'Dinheiro': 'warningAlt',
    'Boleto': 'premium'
  }
  
  return (
    <Badge variant={variants[method as keyof typeof variants] as any || 'statusDraft'} className="text-xs">
      {method}
    </Badge>
  )
}

export default function AdminPayments() {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('Todos')
  const [unitFilter, setUnitFilter] = useState<string>('Todas')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('Todos')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString.split('/').reverse().join('-')).toLocaleDateString('pt-BR')
  }

  const filteredData = useMemo(() => {
    return adminPaymentsData.filter(payment => {
      const searchMatch = !searchTerm || 
        payment.resident.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.title.toLowerCase().includes(searchTerm.toLowerCase())
      
      const statusMatch = statusFilter === 'Todos' || payment.status === statusFilter
      const unitMatch = unitFilter === 'Todas' || payment.unit === unitFilter
      const methodMatch = paymentMethodFilter === 'Todos' || payment.paymentMethod === paymentMethodFilter
      
      return searchMatch && statusMatch && unitMatch && methodMatch
    })
  }, [searchTerm, statusFilter, unitFilter, paymentMethodFilter])

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
    console.log("View details:", payment.id)
  }, [])

  const handleEdit = useCallback((payment: AdminPayment) => {
    toast.success(`Editando pagamento ${payment.title} - ${payment.resident}`)
    console.log("Edit payment:", payment.id)
  }, [])

  const handleRegisterManualPayment = useCallback((payment: AdminPayment) => {
    toast.success(`Registrando pagamento manual para ${payment.title} - ${payment.resident}`)
    console.log("Manual payment:", payment.id)
  }, [])

  const handleDelete = useCallback((payment: AdminPayment) => {
    toast.success(`Excluindo pagamento ${payment.title} - ${payment.resident}`)
    console.log("Delete payment:", payment.id)
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

      {/* Advanced Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por morador, unidade ou título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Pago">Pago</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Atrasado">Atrasado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={unitFilter} onValueChange={setUnitFilter}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas</SelectItem>
              <SelectItem value="10A">10A</SelectItem>
              <SelectItem value="10B">10B</SelectItem>
              <SelectItem value="10C">10C</SelectItem>
              <SelectItem value="10D">10D</SelectItem>
              <SelectItem value="10E">10E</SelectItem>
              <SelectItem value="10F">10F</SelectItem>
              <SelectItem value="10G">10G</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Forma Pgto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="PIX">PIX</SelectItem>
              <SelectItem value="Transferência">Transferência</SelectItem>
              <SelectItem value="Dinheiro">Dinheiro</SelectItem>
              <SelectItem value="Boleto">Boleto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unidade</TableHead>
              <TableHead>Morador</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Data Pagamento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Forma Pgto</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.unit}</TableCell>
                  <TableCell>{payment.resident}</TableCell>
                  <TableCell>{payment.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(payment.dueDate)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {payment.paymentDate ? formatDate(payment.paymentDate) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewDetails(payment)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(payment)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        {payment.status !== 'Pago' && (
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRegisterManualPayment(payment)
                            }}
                          >
                            <DollarSign className="mr-2 h-4 w-4" />
                            Registrar pagamento
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(payment)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}