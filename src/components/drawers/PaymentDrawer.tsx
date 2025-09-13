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
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Transaction, PaymentMethod } from "@/types"
import { CreditCard, Calendar, DollarSign, Receipt, CheckCircle, AlertCircle, FileText } from "lucide-react"

const paymentFormSchema = z.object({
  transactionId: z.string().min(1, "Transação é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que 0"),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "PIX", "CREDIT_CARD", "DEBIT_CARD"]),
  paymentDate: z.string().min(1, "Data de pagamento é obrigatória"),
  reference: z.string().optional(),
  receipt: z.string().optional(),
  notes: z.string().optional(),
  fees: z.number().min(0, "Taxa deve ser maior ou igual a 0"),
  installments: z.object({
    enabled: z.boolean(),
    number: z.number().min(1).optional(),
    total: z.number().min(1).optional(),
  }),
  confirmation: z.object({
    confirmed: z.boolean(),
    confirmedBy: z.string().optional(),
    confirmedAt: z.string().optional(),
  }),
})

type PaymentFormData = z.infer<typeof paymentFormSchema>

interface PaymentDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit" | "view"
  payment?: any // Payment entity (extend from Transaction)
  transaction?: Transaction
  onSubmit: (data: PaymentFormData) => Promise<void>
  availableTransactions?: Array<{ id: string; description: string; amount: number; dueDate: Date }>
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: "Dinheiro",
  BANK_TRANSFER: "Transferência Bancária",
  PIX: "PIX",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
}

const paymentMethodIcons: Record<PaymentMethod, React.ComponentType<{ className?: string }>> = {
  CASH: DollarSign,
  BANK_TRANSFER: CreditCard,
  PIX: CheckCircle,
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: CreditCard,
}

export function PaymentDrawer({ 
  open, 
  onOpenChange, 
  mode, 
  payment, 
  transaction,
  onSubmit,
  availableTransactions = []
}: PaymentDrawerProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const isReadOnly = mode === "view"

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: payment ? {
      transactionId: payment.transactionId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentDate: new Date(payment.paymentDate).toISOString().split('T')[0],
      reference: payment.reference,
      receipt: payment.receipt,
      notes: payment.notes,
      fees: payment.fees || 0,
      installments: payment.installments || {
        enabled: false,
        number: 1,
        total: 1,
      },
      confirmation: payment.confirmation || {
        confirmed: false,
        confirmedBy: "",
        confirmedAt: "",
      },
    } : {
      transactionId: transaction?.id || "",
      amount: transaction?.total || 0,
      paymentMethod: "PIX" as PaymentMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      reference: "",
      receipt: "",
      notes: "",
      fees: 0,
      installments: {
        enabled: false,
        number: 1,
        total: 1,
      },
      confirmation: {
        confirmed: false,
        confirmedBy: "",
        confirmedAt: "",
      },
    },
  })

  const handleSubmit = async (data: PaymentFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving payment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Registrar Pagamento"
      case "edit":
        return `Editar Pagamento`
      case "view":
        return `Detalhes do Pagamento`
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "create":
        return "Registre um novo pagamento para uma transação"
      case "edit":
        return "Atualize as informações do pagamento"
      case "view":
        return "Visualize todas as informações do pagamento"
    }
  }

  const calculateTotalWithFees = () => {
    const amount = form.watch("amount") || 0
    const fees = form.watch("fees") || 0
    return amount + fees
  }

  const selectedTransaction = availableTransactions.find(t => t.id === form.watch("transactionId"))

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {getTitle()}
            </DrawerTitle>
            <DrawerDescription>{getDescription()}</DrawerDescription>
          </DrawerHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-4">
            <div className="space-y-6">
              {/* Transaction Selection */}
              {mode === "create" && !transaction && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Transação
                  </h3>
                  
                  <div>
                    <Label htmlFor="transactionId">Selecionar Transação*</Label>
                    <Select 
                      value={form.watch("transactionId")} 
                      onValueChange={(value) => {
                        form.setValue("transactionId", value)
                        const selectedTx = availableTransactions.find(t => t.id === value)
                        if (selectedTx) {
                          form.setValue("amount", selectedTx.amount)
                        }
                      }}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma transação pendente" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTransactions.map((tx) => (
                          <SelectItem key={tx.id} value={tx.id}>
                            <div>
                              <div className="font-medium">{tx.description}</div>
                              <div className="text-sm text-muted-foreground">
                                R$ {tx.amount.toFixed(2)} - Venc: {new Date(tx.dueDate).toLocaleDateString("pt-BR")}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.transactionId && (
                      <p className="text-sm text-destructive">{form.formState.errors.transactionId.message}</p>
                    )}
                  </div>

                  {selectedTransaction && (
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Descrição:</span>
                          <span className="font-medium">{selectedTransaction.description}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Valor:</span>
                          <span className="font-medium">R$ {selectedTransaction.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vencimento:</span>
                          <span className="font-medium">
                            {new Date(selectedTransaction.dueDate).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(transaction || selectedTransaction || payment) && (
                <>
                  <Separator />

                  {/* Payment Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Informações do Pagamento
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Valor Pago (R$)*</Label>
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
                        <Label htmlFor="fees">Taxas (R$)</Label>
                        <Input
                          id="fees"
                          type="number"
                          min="0"
                          step="0.01"
                          disabled={isReadOnly}
                          {...form.register("fees", { valueAsNumber: true })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="paymentMethod">Método de Pagamento*</Label>
                        <Select 
                          value={form.watch("paymentMethod")} 
                          onValueChange={(value: PaymentMethod) => form.setValue("paymentMethod", value)}
                          disabled={isReadOnly}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(paymentMethodLabels).map(([value, label]) => {
                              const Icon = paymentMethodIcons[value as PaymentMethod]
                              return (
                                <SelectItem key={value} value={value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {label}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="paymentDate">Data do Pagamento*</Label>
                        <Input
                          id="paymentDate"
                          type="date"
                          disabled={isReadOnly}
                          {...form.register("paymentDate")}
                        />
                        {form.formState.errors.paymentDate && (
                          <p className="text-sm text-destructive">{form.formState.errors.paymentDate.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="reference">Referência/ID Transação</Label>
                        <Input
                          id="reference"
                          placeholder="Número da transação, PIX, etc."
                          disabled={isReadOnly}
                          {...form.register("reference")}
                        />
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

                    {calculateTotalWithFees() !== form.watch("amount") && (
                      <div className="border rounded-lg p-4 bg-muted/50">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium">Total com Taxas:</span>
                          <span className="text-2xl font-bold text-primary">
                            R$ {calculateTotalWithFees().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Installments */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Parcelamento</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="installmentsEnabled"
                          checked={form.watch("installments.enabled")}
                          onCheckedChange={(checked) => form.setValue("installments.enabled", !!checked)}
                          disabled={isReadOnly}
                        />
                        <Label htmlFor="installmentsEnabled">Pagamento parcelado</Label>
                      </div>

                      {form.watch("installments.enabled") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="installmentNumber">Parcela Número</Label>
                            <Input
                              id="installmentNumber"
                              type="number"
                              min="1"
                              disabled={isReadOnly}
                              {...form.register("installments.number", { valueAsNumber: true })}
                            />
                          </div>

                          <div>
                            <Label htmlFor="totalInstallments">Total de Parcelas</Label>
                            <Input
                              id="totalInstallments"
                              type="number"
                              min="1"
                              disabled={isReadOnly}
                              {...form.register("installments.total", { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Confirmation */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Confirmação
                    </h3>
                    
                    <div className="space-y-4">
                      {!isReadOnly && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="confirmed"
                            checked={form.watch("confirmation.confirmed")}
                            onCheckedChange={(checked) => {
                              form.setValue("confirmation.confirmed", !!checked)
                              if (checked) {
                                form.setValue("confirmation.confirmedAt", new Date().toISOString())
                              }
                            }}
                            disabled={isReadOnly}
                          />
                          <Label htmlFor="confirmed">Confirmar pagamento</Label>
                        </div>
                      )}

                      {form.watch("confirmation.confirmed") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="confirmedBy">Confirmado por</Label>
                            <Input
                              id="confirmedBy"
                              placeholder="Nome do responsável"
                              disabled={isReadOnly}
                              {...form.register("confirmation.confirmedBy")}
                            />
                          </div>

                          {mode === "view" && payment?.confirmation?.confirmedAt && (
                            <div>
                              <Label>Data de Confirmação</Label>
                              <div className="text-sm text-muted-foreground">
                                {new Date(payment.confirmation.confirmedAt).toLocaleDateString("pt-BR")}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Observações</h3>
                    
                    <div>
                      <Label htmlFor="notes">Observações sobre o pagamento</Label>
                      <Textarea
                        id="notes"
                        placeholder="Informações adicionais sobre o pagamento..."
                        rows={3}
                        disabled={isReadOnly}
                        {...form.register("notes")}
                      />
                    </div>
                  </div>

                  {mode === "view" && payment && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Registrado em</Label>
                          <div className="text-sm text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        <div>
                          <Label>Atualizado em</Label>
                          <div className="text-sm text-muted-foreground">
                            {new Date(payment.updatedAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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
                    {isLoading ? "Processando..." : mode === "create" ? "Registrar Pagamento" : "Salvar Alterações"}
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