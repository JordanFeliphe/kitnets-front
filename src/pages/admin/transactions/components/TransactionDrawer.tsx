import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/app/shared/components/ui/drawer"
import { Button } from "@/app/shared/components/ui/button"
import { Input } from "@/app/shared/components/ui/input"
import { Label } from "@/app/shared/components/ui/label"
import { Textarea } from "@/app/shared/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select"
import { Badge } from "@/app/shared/components/ui/badge"
import { Separator } from "@/app/shared/components/ui/separator"
import { Transaction, TransactionStatus, TransactionType, PaymentMethod } from "@/app/shared/types"
import { Receipt, Calendar, DollarSign, CreditCard, AlertCircle, CheckCircle, Clock } from "lucide-react"

const transactionFormSchema = z.object({
  leaseId: z.string().min(1, "Contrato é obrigatório"),
  type: z.enum(["RENT", "DEPOSIT", "UTILITY", "MAINTENANCE", "FINE", "OTHER"]),
  description: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
  amount: z.number().min(0.01, "Valor deve ser maior que 0"),
  discount: z.number().min(0, "Desconto deve ser maior ou igual a 0"),
  fine: z.number().min(0, "Multa deve ser maior ou igual a 0"),
  interest: z.number().min(0, "Juros devem ser maior ou igual a 0"),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
  paymentDate: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "PIX", "CREDIT_CARD", "DEBIT_CARD"]).optional(),
  status: z.enum(["PENDING", "PAID", "CANCELLED", "OVERDUE"]),
  reference: z.string().optional(),
  receipt: z.string().optional(),
  notes: z.string().optional(),
  metadata: z.object({
    recurringId: z.string().optional(),
    parentTransactionId: z.string().optional(),
    installmentNumber: z.number().optional(),
    totalInstallments: z.number().optional(),
  }),
})

type TransactionFormData = z.infer<typeof transactionFormSchema>

interface TransactionDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | "view"
  transaction?: Transaction
  onSubmit: (data: TransactionFormData) => Promise<void>
  availableLeases?: Array<{ id: string; unitCode: string; tenantName: string }>
}

const typeLabels: Record<TransactionType, string> = {
  RENT: "Aluguel",
  DEPOSIT: "Depósito",
  UTILITY: "Utilidade",
  MAINTENANCE: "Manutenção",
  FINE: "Multa",
  OTHER: "Outros",
}

const statusLabels: Record<TransactionStatus, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELLED: "Cancelado",
  OVERDUE: "Atrasado",
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: "Dinheiro",
  BANK_TRANSFER: "Transferência Bancária",
  PIX: "PIX",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
}

const statusVariants: Record<TransactionStatus, "warning" | "success" | "secondary" | "destructive"> = {
  PENDING: "warning",
  PAID: "success",
  CANCELLED: "secondary",
  OVERDUE: "destructive",
}

const typeColors: Record<TransactionType, string> = {
  RENT: "bg-blue-100 text-blue-800 border-blue-200",
  DEPOSIT: "bg-purple-100 text-purple-800 border-purple-200",
  UTILITY: "bg-custom-orange-100 text-custom-orange-800 border-custom-orange-200",
  MAINTENANCE: "bg-custom-orange-100 text-custom-orange-800 border-custom-orange-200",
  FINE: "bg-red-100 text-red-800 border-red-200",
  OTHER: "bg-gray-100 text-gray-800 border-gray-200",
}

export function TransactionDrawer({ 
  open, 
  onOpenChange, 
  mode, 
  transaction, 
  onSubmit,
  availableLeases = []
}: TransactionDrawerProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const isReadOnly = mode === "view"

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: transaction ? {
      leaseId: transaction.leaseId,
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount,
      discount: transaction.discount,
      fine: transaction.fine,
      interest: transaction.interest,
      dueDate: new Date(transaction.dueDate).toISOString().split('T')[0],
      paymentDate: transaction.paymentDate ? new Date(transaction.paymentDate).toISOString().split('T')[0] : "",
      paymentMethod: transaction.paymentMethod,
      status: transaction.status,
      reference: transaction.reference,
      receipt: transaction.receipt,
      notes: transaction.notes,
      metadata: transaction.metadata,
    } : {
      leaseId: "",
      type: "RENT" as TransactionType,
      description: "",
      amount: 0,
      discount: 0,
      fine: 0,
      interest: 0,
      dueDate: "",
      paymentDate: "",
      paymentMethod: undefined,
      status: "PENDING" as TransactionStatus,
      reference: "",
      receipt: "",
      notes: "",
      metadata: {
        recurringId: "",
        parentTransactionId: "",
        installmentNumber: undefined,
        totalInstallments: undefined,
      },
    },
  })

  const handleSubmit = async (data: TransactionFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving transaction:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Nova Transação"
      case "edit":
        return `Editar Transação`
      case "view":
        return `Detalhes da Transação`
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "create":
        return "Registre uma nova transação financeira"
      case "edit":
        return "Atualize as informações da transação"
      case "view":
        return "Visualize todas as informações da transação"
    }
  }

  const calculateTotal = () => {
    const amount = form.watch("amount") || 0
    const discount = form.watch("discount") || 0
    const fine = form.watch("fine") || 0
    const interest = form.watch("interest") || 0
    return amount - discount + fine + interest
  }

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="h-4 w-4" />
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "OVERDUE":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-3xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              {getTitle()}
            </DrawerTitle>
            <DrawerDescription>{getDescription()}</DrawerDescription>
          </DrawerHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-4">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Informações Básicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="leaseId">Contrato*</Label>
                    <Select 
                      value={form.watch("leaseId")} 
                      onValueChange={(value) => form.setValue("leaseId", value)}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um contrato" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLeases.map((lease) => (
                          <SelectItem key={lease.id} value={lease.id}>
                            <div>
                              <div className="font-medium">{lease.unitCode}</div>
                              <div className="text-sm text-muted-foreground">{lease.tenantName}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.leaseId && (
                      <p className="text-sm text-destructive">{form.formState.errors.leaseId.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="type">Tipo*</Label>
                    <Select 
                      value={form.watch("type")} 
                      onValueChange={(value: TransactionType) => form.setValue("type", value)}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(typeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={typeColors[value as TransactionType]}>
                                {label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={form.watch("status")} 
                      onValueChange={(value: TransactionStatus) => form.setValue("status", value)}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(value as TransactionStatus)}
                              <Badge variant={statusVariants[value as TransactionStatus]}>
                                {label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="reference">Referência</Label>
                    <Input
                      id="reference"
                      placeholder="Número de referência..."
                      disabled={isReadOnly}
                      {...form.register("reference")}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Descrição*</Label>
                    <Textarea
                      id="description"
                      placeholder="Descrição da transação..."
                      disabled={isReadOnly}
                      {...form.register("description")}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financial Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Detalhes Financeiros
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="amount">Valor Base (R$)*</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isReadOnly}
                      {...form.register("amount", { valueAsNumber: true })}
                    />
                    {form.formState.errors.amount && (
                      <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="discount">Desconto (R$)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isReadOnly}
                      {...form.register("discount", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fine">Multa (R$)</Label>
                    <Input
                      id="fine"
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isReadOnly}
                      {...form.register("fine", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="interest">Juros (R$)</Label>
                    <Input
                      id="interest"
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isReadOnly}
                      {...form.register("interest", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      R$ {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Datas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Data de Vencimento*</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      disabled={isReadOnly}
                      {...form.register("dueDate")}
                    />
                    {form.formState.errors.dueDate && (
                      <p className="text-sm text-destructive">{form.formState.errors.dueDate.message}</p>
                    )}
                  </div>

                  {form.watch("status") === "PAID" && (
                    <div>
                      <Label htmlFor="paymentDate">Data de Pagamento</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        disabled={isReadOnly}
                        {...form.register("paymentDate")}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              {form.watch("status") === "PAID" && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Informações de Pagamento
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                        <Select 
                          value={form.watch("paymentMethod") || ""} 
                          onValueChange={(value: PaymentMethod) => form.setValue("paymentMethod", value)}
                          disabled={isReadOnly}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o método" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(paymentMethodLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="receipt">Comprovante</Label>
                        <Input
                          id="receipt"
                          placeholder="URL ou caminho do comprovante"
                          disabled={isReadOnly}
                          {...form.register("receipt")}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Installments (if applicable) */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Parcelamento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="installmentNumber">Parcela Número</Label>
                    <Input
                      id="installmentNumber"
                      type="number"
                      min="1"
                      disabled={isReadOnly}
                      {...form.register("metadata.installmentNumber", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="totalInstallments">Total de Parcelas</Label>
                    <Input
                      id="totalInstallments"
                      type="number"
                      min="1"
                      disabled={isReadOnly}
                      {...form.register("metadata.totalInstallments", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Observações</h3>
                
                <div>
                  <Label htmlFor="notes">Notas Adicionais</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observações sobre a transação..."
                    rows={3}
                    disabled={isReadOnly}
                    {...form.register("notes")}
                  />
                </div>
              </div>

              {mode === "view" && transaction && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Criado em</Label>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div>
                      <Label>Atualizado em</Label>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.updatedAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div>
                      <Label>Criado por</Label>
                      <div className="text-sm text-muted-foreground">
                        {transaction.createdBy}
                      </div>
                    </div>
                    {transaction.approvedBy && (
                      <div>
                        <Label>Aprovado por</Label>
                        <div className="text-sm text-muted-foreground">
                          {transaction.approvedBy}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <DrawerFooter>
              <div className="flex gap-2">
                {!isReadOnly && (
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Salvando..." : mode === "create" ? "Criar Transação" : "Salvar Alterações"}
                  </Button>
                )}
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1">
                    {isReadOnly ? "Fechar" : "Cancelar"}
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}