import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  MoreVertical,
  Download, 
  Receipt, 
  Eye,
  Copy,
  FileText
} from "lucide-react"

interface BoletoData {
  id: string
  numero: string
  emissao: string
  vencimento: string
  valorTotal: number
  status: "Pago" | "Pendente" | "Atrasado" | "Cancelado"
  paymentDate?: string
  barCode?: string
}

interface ResidentBoletoTableProps {
  data: BoletoData[]
  loading?: boolean
  onDownloadBoleto?: (boleto: BoletoData) => void
  onDownloadReceipt?: (boleto: BoletoData) => void
  onViewDetails?: (boleto: BoletoData) => void
  onCopyLine?: (boleto: BoletoData) => void
  onView2ndCopy?: (boleto: BoletoData) => void
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString.split('/').reverse().join('-')).toLocaleDateString('pt-BR')
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Pago':
      return <Badge variant="statusActive" className="text-xs">{status}</Badge>
    case 'Pendente':
      return <Badge variant="warningAlt" className="text-xs">{status}</Badge>
    case 'Atrasado':
      return <Badge variant="dangerAlt" className="text-xs">{status}</Badge>
    case 'Cancelado':
      return <Badge variant="statusDraft" className="text-xs">{status}</Badge>
    default:
      return <Badge variant="statusDraft" className="text-xs">{status}</Badge>
  }
}

export function ResidentBoletoTable({
  data,
  loading = false,
  onDownloadBoleto,
  onDownloadReceipt,
  onViewDetails,
  onCopyLine,
  onView2ndCopy,
}: ResidentBoletoTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Emissão</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><div className="h-4 bg-muted animate-pulse rounded w-32" /></TableCell>
                <TableCell><div className="h-4 bg-muted animate-pulse rounded w-20" /></TableCell>
                <TableCell><div className="h-4 bg-muted animate-pulse rounded w-20" /></TableCell>
                <TableCell><div className="h-4 bg-muted animate-pulse rounded w-16 ml-auto" /></TableCell>
                <TableCell><div className="h-4 bg-muted animate-pulse rounded w-16" /></TableCell>
                <TableCell><div className="h-4 bg-muted animate-pulse rounded w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8">
        <div className="text-center text-muted-foreground">
          <p>Nenhum boleto encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Emissão</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((boleto) => (
              <TableRow key={boleto.id}>
                <TableCell className="font-medium">{boleto.numero}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(boleto.emissao)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(boleto.vencimento)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(boleto.valorTotal)}
                </TableCell>
                <TableCell>{getStatusBadge(boleto.status)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        aria-label="Abrir menu de ações"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => onViewDetails?.(boleto)}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      
                      {boleto.status === 'Pago' ? (
                        <>
                          <DropdownMenuItem
                            onClick={() => onDownloadReceipt?.(boleto)}
                            className="cursor-pointer"
                          >
                            <Receipt className="mr-2 h-4 w-4" />
                            Baixar comprovante
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem
                            onClick={() => onDownloadBoleto?.(boleto)}
                            className="cursor-pointer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Baixar boleto (PDF)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onView2ndCopy?.(boleto)}
                            className="cursor-pointer"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Ver 2ª via
                          </DropdownMenuItem>
                          {boleto.barCode && (
                            <DropdownMenuItem
                              onClick={() => onCopyLine?.(boleto)}
                              className="cursor-pointer"
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copiar linha digitável
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((boleto) => (
          <div key={boleto.id} className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{boleto.numero}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Vence em {formatDate(boleto.vencimento)}
                </p>
              </div>
              <div className="ml-2">{getStatusBadge(boleto.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <p className="text-muted-foreground">Emissão</p>
                <p className="font-medium">{formatDate(boleto.emissao)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Valor</p>
                <p className="font-medium">{formatCurrency(boleto.valorTotal)}</p>
              </div>
            </div>

            <div className="pt-3 border-t">
              {boleto.status === 'Pago' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadReceipt?.(boleto)}
                  className="w-full"
                >
                  <Receipt className="h-3 w-3 mr-2" />
                  Baixar Comprovante
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadBoleto?.(boleto)}
                  className="w-full"
                >
                  <Download className="h-3 w-3 mr-2" />
                  Baixar Boleto
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}