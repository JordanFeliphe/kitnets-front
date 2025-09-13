import React from "react"
import {
  CalendarIcon,
  CreditCardIcon,
  DownloadIcon,
  ReceiptIcon,
  AlertTriangleIcon,
  CopyIcon,
  MailIcon,
  FileTextIcon,
  BuildingIcon,
  ClockIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export interface PaymentDetailsData {
  id: string
  title: string
  competencia: string
  vencimento: string
  pagamento: string | null
  categoria: string
  subcategoria?: string
  forma: string | null
  valor: number
  status: "Pago" | "Pendente" | "Atrasado" | "Cancelado"
  
  // Códigos e identificadores
  receiptCode?: string
  invoiceId?: string
  ourNumber?: string
  
  // Componentes financeiros
  valorOriginal?: number
  desconto?: number
  multa?: number
  juros?: number
  taxas?: number
  valorPago?: number
  troco?: number
  
  // Informações adicionais
  diasAtraso?: number
  periodoReferencia?: string
  observacoes?: string
  
  // Relações
  contratoId?: string
  contratoNumero?: string
  unidadeNumero?: string
  unidadeTipo?: string
  
  // Para boletos
  linhaDigitavel?: string
}

interface PaymentDrawerProps {
  payment: PaymentDetailsData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownloadReceipt?: (payment: PaymentDetailsData) => void
  onDownloadInvoice?: (payment: PaymentDetailsData) => void
  onEmailReceipt?: (payment: PaymentDetailsData) => void
  onCopyDigitableLine?: (payment: PaymentDetailsData) => void
  onDispute?: (payment: PaymentDetailsData) => void
}

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "pago":
      return "statusActive"
    case "pendente":
      return "statusPending"
    case "atrasado":
      return "statusBlocked"
    case "cancelado":
      return "statusInactive"
    default:
      return "outline"
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

const calculateDaysLate = (dueDate: string, paymentDate?: string) => {
  if (!paymentDate) return 0
  
  const due = new Date(dueDate.split('/').reverse().join('-'))
  const paid = new Date(paymentDate.split('/').reverse().join('-'))
  
  const diffTime = paid.getTime() - due.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays > 0 ? diffDays : 0
}

function PaymentDrawerContent({ payment, onDownloadReceipt, onDownloadInvoice, onEmailReceipt, onCopyDigitableLine, onDispute }: {
  payment: PaymentDetailsData
  onDownloadReceipt?: (payment: PaymentDetailsData) => void
  onDownloadInvoice?: (payment: PaymentDetailsData) => void
  onEmailReceipt?: (payment: PaymentDetailsData) => void
  onCopyDigitableLine?: (payment: PaymentDetailsData) => void
  onDispute?: (payment: PaymentDetailsData) => void
}) {
  const diasAtraso = payment.diasAtraso || calculateDaysLate(payment.vencimento, payment.pagamento)
  
  const handleCopyDigitableLine = () => {
    if (payment.linhaDigitavel) {
      navigator.clipboard.writeText(payment.linhaDigitavel)
      toast.success("Linha digitável copiada!")
    }
  }

  return (
    <>
      <div className="px-4 md:px-6">
        {/* Cabeçalho com título, status e valor */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{payment.title}</h3>
            <div className="flex items-center gap-3">
              <Badge variant={getStatusVariant(payment.status)} className="text-sm">
                {payment.status}
              </Badge>
              <span className="text-2xl font-bold">
                {formatCurrency(payment.valorPago || payment.valor)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Informações Principais */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Informações Principais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Competência
                </Label>
                <p className="text-sm font-medium">{payment.competencia}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Vencimento
                </Label>
                <p className="text-sm font-medium">{payment.vencimento}</p>
              </div>
              {payment.pagamento && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Data de Pagamento
                  </Label>
                  <p className="text-sm font-medium">{payment.pagamento}</p>
                </div>
              )}
              {diasAtraso > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Dias de Atraso
                  </Label>
                  <p className="text-sm font-medium text-destructive">
                    {diasAtraso} {diasAtraso === 1 ? 'dia' : 'dias'}
                  </p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Categoria
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {payment.categoria}
                  </Badge>
                  {payment.subcategoria && (
                    <Badge variant="outline" className="text-xs">
                      {payment.subcategoria}
                    </Badge>
                  )}
                </div>
              </div>
              {payment.forma && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Forma de Pagamento
                  </Label>
                  <p className="text-sm font-medium">{payment.forma}</p>
                </div>
              )}
            </div>

            {/* Identificadores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {payment.receiptCode && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Código do Recibo
                  </Label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {payment.receiptCode}
                  </p>
                </div>
              )}
              {payment.invoiceId && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    ID do Boleto
                  </Label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {payment.invoiceId}
                  </p>
                </div>
              )}
              {payment.ourNumber && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Nosso Número
                  </Label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {payment.ourNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Componentes Financeiros */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCardIcon className="h-4 w-4" />
              Componentes Financeiros
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Valor Original
                </Label>
                <p className="text-base font-semibold">
                  {formatCurrency(payment.valorOriginal || payment.valor)}
                </p>
              </div>
              {payment.desconto && payment.desconto > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Desconto
                  </Label>
                  <p className="text-base font-semibold text-green-600">
                    -{formatCurrency(payment.desconto)}
                  </p>
                </div>
              )}
              {payment.multa && payment.multa > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Multa
                  </Label>
                  <p className="text-base font-semibold text-destructive">
                    +{formatCurrency(payment.multa)}
                  </p>
                </div>
              )}
              {payment.juros && payment.juros > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Juros
                  </Label>
                  <p className="text-base font-semibold text-destructive">
                    +{formatCurrency(payment.juros)}
                  </p>
                </div>
              )}
              {payment.taxas && payment.taxas > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Taxas
                  </Label>
                  <p className="text-base font-semibold text-destructive">
                    +{formatCurrency(payment.taxas)}
                  </p>
                </div>
              )}
              {payment.valorPago && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Valor Pago
                  </Label>
                  <p className="text-base font-semibold">
                    {formatCurrency(payment.valorPago)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Comprovantes */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              Comprovantes
            </h4>
            <div className="space-y-3">
              {payment.status === "Pago" && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onDownloadReceipt?.(payment)}
                >
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Baixar Recibo (PDF)
                </Button>
              )}
              
              {payment.status !== "Pago" && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onDownloadInvoice?.(payment)}
                >
                  <ReceiptIcon className="mr-2 h-4 w-4" />
                  Baixar 2ª Via (PDF)
                </Button>
              )}

              {payment.linhaDigitavel && (
                <div className="p-3 bg-muted rounded-lg">
                  <Label className="text-sm font-medium text-muted-foreground block mb-2">
                    Linha Digitável
                  </Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono flex-1 break-all">
                      {payment.linhaDigitavel}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyDigitableLine}
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Relações */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <BuildingIcon className="h-4 w-4" />
              Relações
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {payment.contratoNumero && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Contrato
                  </Label>
                  <p className="text-sm font-medium">
                    {payment.contratoNumero}
                  </p>
                </div>
              )}
              {payment.unidadeNumero && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Unidade
                  </Label>
                  <p className="text-sm font-medium">
                    {payment.unidadeNumero} {payment.unidadeTipo && `(${payment.unidadeTipo})`}
                  </p>
                </div>
              )}
              {payment.periodoReferencia && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Período de Referência
                  </Label>
                  <p className="text-sm font-medium">{payment.periodoReferencia}</p>
                </div>
              )}
            </div>
            
            {payment.observacoes && (
              <div className="mt-4">
                <Label className="text-sm font-medium text-muted-foreground">
                  Observações
                </Label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                  {payment.observacoes}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Ações */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Ações
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {payment.status === "Pago" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => onDownloadReceipt?.(payment)}
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Reemitir Comprovante
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onEmailReceipt?.(payment)}
                  >
                    <MailIcon className="mr-2 h-4 w-4" />
                    Enviar por E-mail
                  </Button>
                </>
              )}
              
              {payment.linhaDigitavel && (
                <Button
                  variant="outline"
                  onClick={() => onCopyDigitableLine?.(payment)}
                >
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Copiar Linha Digitável
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => onDispute?.(payment)}
              >
                <AlertTriangleIcon className="mr-2 h-4 w-4" />
                Solicitar Revisão
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function PaymentDrawer({
  payment,
  open,
  onOpenChange,
  onDownloadReceipt,
  onDownloadInvoice,
  onEmailReceipt,
  onCopyDigitableLine,
  onDispute,
}: PaymentDrawerProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (!payment) return null

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[95vh]">
          <DrawerHeader>
            <DrawerTitle>Detalhes do Pagamento</DrawerTitle>
            <DrawerDescription>
              Informações completas sobre este pagamento
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto">
            <PaymentDrawerContent
              payment={payment}
              onDownloadReceipt={onDownloadReceipt}
              onDownloadInvoice={onDownloadInvoice}
              onEmailReceipt={onEmailReceipt}
              onCopyDigitableLine={onCopyDigitableLine}
              onDispute={onDispute}
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
          <DialogDescription>
            Informações completas sobre este pagamento
          </DialogDescription>
        </DialogHeader>
        <PaymentDrawerContent
          payment={payment}
          onDownloadReceipt={onDownloadReceipt}
          onDownloadInvoice={onDownloadInvoice}
          onEmailReceipt={onEmailReceipt}
          onCopyDigitableLine={onCopyDigitableLine}
          onDispute={onDispute}
        />
      </DialogContent>
    </Dialog>
  )
}