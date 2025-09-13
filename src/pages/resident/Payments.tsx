import React, { useMemo, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Download, Receipt, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

interface ResidentPayment {
  id: number
  title: string
  dueDate: string
  paymentDate?: string
  amount: number
  status: 'Pago' | 'Pendente' | 'Atrasado'
}

// Dados simplificados para o morador
const residentPaymentsData: ResidentPayment[] = [
  {
    id: 1,
    title: "Aluguel Janeiro 2025",
    amount: 800.00,
    dueDate: "05/01/2025",
    paymentDate: "03/01/2025",
    status: "Pago"
  },
  {
    id: 2,
    title: "Aluguel Fevereiro 2025",
    amount: 800.00,
    dueDate: "05/02/2025",
    paymentDate: undefined,
    status: "Pendente"
  },
  {
    id: 3,
    title: "Aluguel Dezembro 2024",
    amount: 800.00,
    dueDate: "05/12/2024",
    paymentDate: undefined,
    status: "Atrasado"
  },
  {
    id: 4,
    title: "Aluguel Novembro 2024",
    amount: 800.00,
    dueDate: "05/11/2024",
    paymentDate: "06/11/2024",
    status: "Pago"
  },
  {
    id: 5,
    title: "Aluguel Outubro 2024",
    amount: 800.00,
    dueDate: "05/10/2024",
    paymentDate: "04/10/2024",
    status: "Pago"
  },
  {
    id: 6,
    title: "Taxa de Limpeza Janeiro 2025",
    amount: 50.00,
    dueDate: "10/01/2025",
    paymentDate: "08/01/2025",
    status: "Pago"
  },
  {
    id: 7,
    title: "Taxa de Limpeza Fevereiro 2025",
    amount: 50.00,
    dueDate: "10/02/2025",
    paymentDate: undefined,
    status: "Pendente"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pago':
      return <Badge variant="statusActive" className="text-xs">{status}</Badge>
    case 'Pendente':
      return <Badge variant="statusPending" className="text-xs">{status}</Badge>
    case 'Atrasado':
      return <Badge variant="statusBlocked" className="text-xs">{status}</Badge>
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>
  }
}

export default function ResidentPayments() {
  const [searchTerm, setSearchTerm] = useState('')

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
    return residentPaymentsData.filter(payment => {
      return !searchTerm || payment.title.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [searchTerm])

  const totals = useMemo(() => {
    const totalPago = residentPaymentsData
      .filter(p => p.status === 'Pago')
      .reduce((sum, p) => sum + p.amount, 0)
    
    const totalPendente = residentPaymentsData
      .filter(p => p.status === 'Pendente')
      .reduce((sum, p) => sum + p.amount, 0)
    
    const totalAtrasado = residentPaymentsData
      .filter(p => p.status === 'Atrasado')
      .reduce((sum, p) => sum + p.amount, 0)

    // Próximo vencimento
    const pendingPayments = residentPaymentsData.filter(p => p.status === 'Pendente')
    const nextDueDate = pendingPayments.length > 0 ? pendingPayments[0].dueDate : null

    return {
      totalPago,
      totalPendente,
      totalAtrasado,
      nextDueDate
    }
  }, [])

  // Action handlers
  const handleDownloadReceipt = useCallback((payment: ResidentPayment) => {
    toast.success(`Baixando comprovante: ${payment.title}`)
    console.log("Download receipt:", payment.id)
  }, [])

  const handleDownloadBoleto = useCallback((payment: ResidentPayment) => {
    toast.success(`Baixando boleto: ${payment.title}`)
    console.log("Download boleto:", payment.id)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Meus Pagamentos</h1>
          <p className="text-muted-foreground">
            Gerencie seus pagamentos de forma simples e rápida
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
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
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Valor Pendente
              {totals.nextDueDate && (
                <span className="ml-2 text-xs">• Vence {formatDate(totals.nextDueDate)}</span>
              )}
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {formatCurrency(totals.totalPendente)}
            </p>
          </div>
        </div>
        
        {totals.totalAtrasado > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <div className="space-y-1">
              <p className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wide">Em Atraso</p>
              <p className="text-2xl font-semibold text-red-700 dark:text-red-400">
                {formatCurrency(totals.totalAtrasado)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Simple Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Simple Payments Table */}
      <div className="space-y-4">
        {/* Desktop Table */}
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Data Pagamento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.title}</TableCell>
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
                    <TableCell className="text-right">
                      {payment.status === 'Pago' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadReceipt(payment)}
                          className="h-8 w-8 p-0"
                          title="Baixar comprovante"
                        >
                          <Receipt className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadBoleto(payment)}
                          className="h-8 w-8 p-0"
                          title="Baixar boleto"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredData.length > 0 ? (
            filteredData.map((payment) => (
              <div key={payment.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{payment.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vence em {formatDate(payment.dueDate)}
                    </p>
                  </div>
                  <div className="ml-2">{getStatusBadge(payment.status)}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <p className="text-muted-foreground">Pagamento</p>
                    <p className="font-medium">
                      {payment.paymentDate ? formatDate(payment.paymentDate) : 'Não pago'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor</p>
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  {payment.status === 'Pago' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReceipt(payment)}
                      className="w-full"
                    >
                      <Receipt className="h-3 w-3 mr-2" />
                      Baixar Comprovante
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadBoleto(payment)}
                      className="w-full"
                    >
                      <Download className="h-3 w-3 mr-2" />
                      Baixar Boleto
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border bg-card p-8">
              <div className="text-center text-muted-foreground">
                <p>Nenhum pagamento encontrado.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}